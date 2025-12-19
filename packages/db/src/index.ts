import { drizzle } from "drizzle-orm/postgres-js";
import * as postgres from "postgres";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle({ client });

  return db;
}

main();

export * from "./schema/tables";
export * from "./schema/enums";
