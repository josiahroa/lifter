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
});

afterAll(async () => {
  await sql.end({ timeout: 5_000 });
});

test("all tables exist", async () => {
  const expectedTables = [
    "users",
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
    WHERE schemaname = 'public'
  `;

  const existing = rows
    .map((r: any) => r.tablename as string)
    .filter((name) => expectedTables.includes(name))
    .sort();

  expect(existing).toEqual(expectedTables.slice().sort());
});
