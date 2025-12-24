import { beforeAll, afterAll, test, expect } from "vitest";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let sql: postgres.Sql;
let db: ReturnType<typeof drizzle>;

beforeAll(() => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  if (!url.includes("lifter_test")) {
    throw new Error("DATABASE_URL is not a test database");
  }

  sql = postgres(url, { max: 1 });
  db = drizzle(sql);

  return db;
});

afterAll(async () => {
  await sql.end({ timeout: 5_000 });
});

test("all app tables exist", async () => {
  const expectedTables = [
    "workouts",
    "exercises",
    "workout_exercises",
    "workout_logs",
    "exercise_logs",
    "exercise_set_logs",
  ];

  const rows = await sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'app'
  `;

  const existing = rows
    .map((r) => r.tablename)
    .filter((name) => expectedTables.includes(name))
    .sort();

  expect(existing).toEqual(expectedTables.slice().sort());
});

test("all auth tables exist", async () => {
  const expectedTables = ["users", "user_profiles", "auth_identities"];

  const rows = await sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'auth'
  `;

  const existing = rows
    .map((r) => r.tablename)
    .filter((name) => expectedTables.includes(name))
    .sort();

  expect(existing).toEqual(expectedTables.slice().sort());
});

test("all app enums exist", async () => {
  const expectedEnums = ["equipment", "muscle_group", "muscle_group_target"];

  const rows = await sql`
    SELECT t.typname
    FROM pg_catalog.pg_type t
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'app' AND t.typtype = 'e'
  `;

  const existing = rows
    .map((r) => r.typname)
    .filter((name) => expectedEnums.includes(name))
    .sort();

  expect(existing).toEqual(expectedEnums.slice().sort());
});

test("all auth enums exist", async () => {
  const expectedEnums = ["auth_provider"];

  const rows = await sql`
    SELECT t.typname
    FROM pg_catalog.pg_type t
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'auth' AND t.typtype = 'e'
  `;

  const existing = rows
    .map((r) => r.typname)
    .filter((name) => expectedEnums.includes(name))
    .sort();

  expect(existing).toEqual(expectedEnums.slice().sort());
});
