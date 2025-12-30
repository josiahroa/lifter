import {
  AbstractPowerSyncDatabase,
  PowerSyncBackendConnector,
  type PowerSyncCredentials,
} from "@powersync/react-native";

import type { AuthClient } from "@lifter/auth";

import { auth as authClient } from "../auth-client";

// /// Postgres Response codes that we cannot recover from by retrying.
// const FATAL_RESPONSE_CODES = [
//   // Class 22 — Data Exception
//   // Examples include data type mismatch.
//   new RegExp("^22...$"),
//   // Class 23 — Integrity Constraint Violation.
//   // Examples include NOT NULL, FOREIGN KEY and UNIQUE violations.
//   new RegExp("^23...$"),
//   // INSUFFICIENT PRIVILEGE - typically a row-level security violation
//   new RegExp("^42501$"),
// ];

export class Connector implements PowerSyncBackendConnector {
  constructor(private readonly auth: AuthClient = authClient) {}

  async fetchCredentials(): Promise<PowerSyncCredentials | null> {
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

  async uploadData(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    database: AbstractPowerSyncDatabase
  ): Promise<void> {
    console.log("powersync uploading data");
  }
}
