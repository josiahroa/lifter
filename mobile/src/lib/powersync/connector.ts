// https://github.com/powersync-ja/powersync-js/blob/main/demos/react-native-supabase-todolist/library/supabase/SupabaseConnector.ts
import {
  AbstractPowerSyncDatabase,
  CrudEntry,
  PowerSyncBackendConnector,
  UpdateType,
  type PowerSyncCredentials,
} from "@powersync/react-native";

import { SupabaseClient } from "@supabase/supabase-js";
import { client } from "../supabase/client";
import { AuthClient, auth as authClient } from "../auth";

/// Postgres Response codes that we cannot recover from by retrying.
const FATAL_RESPONSE_CODES = [
  // Class 22 — Data Exception
  // Examples include data type mismatch.
  new RegExp("^22...$"),
  // Class 23 — Integrity Constraint Violation.
  // Examples include NOT NULL, FOREIGN KEY and UNIQUE violations.
  new RegExp("^23...$"),
  // INSUFFICIENT PRIVILEGE - typically a row-level security violation
  new RegExp("^42501$"),
];

export class SupabaseConnector implements PowerSyncBackendConnector {
  client: SupabaseClient;

  constructor(private readonly auth: AuthClient = authClient) {
    this.client = client;
  }

  async fetchCredentials() {
    console.log("powersync fetching credentials");
    const session = await this.auth.getSession();

    if (!session) {
      throw new Error("No session found");
    }

    const powerSyncUrl = process.env.EXPO_PUBLIC_POWERSYNC_URL;

    if (!powerSyncUrl) {
      throw new Error("POWERSYNC_URL is not set");
    }

    return {
      endpoint: powerSyncUrl,
      token: session.accessToken,
    } satisfies PowerSyncCredentials;
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    let lastOp: CrudEntry | null = null;
    try {
      // Note: If transactional consistency is important, use database functions
      // or edge functions to process the entire transaction in a single call.
      for (const op of transaction.crud) {
        lastOp = op;
        const table = this.client.from(op.table);
        let result: unknown = null;
        switch (op.op) {
          case UpdateType.PUT:
            // eslint-disable-next-line no-case-declarations
            const record = { ...op.opData, id: op.id };
            result = await table.upsert(record);
            break;
          case UpdateType.PATCH:
            result = await table.update(op.opData).eq("id", op.id);
            break;
          case UpdateType.DELETE:
            result = await table.delete().eq("id", op.id);
            break;
        }

        if (
          result &&
          typeof result === "object" &&
          "error" in result &&
          result.error
        ) {
          console.error(result.error);
          (result as { error: Error }).error.message = `Could not ${
            op.op
          } data to Supabase error: ${JSON.stringify(result)}`;
          throw (result as { error: Error }).error;
        }
      }

      await transaction.complete();
    } catch (ex: unknown) {
      console.debug(ex);
      const isFatalError =
        typeof ex === "object" &&
        ex !== null &&
        "code" in ex &&
        typeof ex.code === "string" &&
        FATAL_RESPONSE_CODES.some((regex) =>
          regex.test((ex as { code: string }).code)
        );
      if (isFatalError) {
        /**
         * Instead of blocking the queue with these errors,
         * discard the (rest of the) transaction.
         *
         * Note that these errors typically indicate a bug in the application.
         * If protecting against data loss is important, save the failing records
         * elsewhere instead of discarding, and/or notify the user.
         */
        console.error("Data upload error - discarding:", lastOp, ex);
        await transaction.complete();
      } else {
        // Error may be retryable - e.g. network error or temporary server error.
        // Throwing an error here causes this call to be retried after a delay.
        throw ex;
      }
    }
  }
}
