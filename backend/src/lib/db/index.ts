import { is } from "drizzle-orm/entity";
import { PgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// Automatically extract only table definitions from the schema
function extractTables<T extends Record<string, unknown>>(schemaExports: T) {
  const tables: Record<string, PgTable> = {};

  for (const [key, value] of Object.entries(schemaExports)) {
    if (is(value, PgTable)) {
      tables[key] = value;
    }
  }

  return tables;
}

const schemaObj = extractTables(schema);

export function createDbConnection(connectionString: string) {
  const client = postgres(connectionString, { prepare: false });
  return drizzle({
    client,
    schema: schemaObj,
  });
}

export * from "./schema";
export * from "./types";
