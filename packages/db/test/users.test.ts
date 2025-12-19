import { beforeAll, afterAll, beforeEach, expect, describe, it } from "vitest";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { ZodError } from "zod";

import { users } from "../src/schema/tables";
import {
  UsersInsertSchema,
  UsersUpdateSchema,
} from "../src/schema/tables.validators";
import { v4 as uuidv4 } from "uuid";

let sql: postgres.Sql;
let db: ReturnType<typeof drizzle>;

beforeAll(() => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  if (!url.includes("lifter_test")) {
    throw new Error("DATABASE_URL is not a test database");
  }

  sql = postgres(url, { max: 1, onnotice: () => undefined });
  db = drizzle(sql);
});

beforeEach(async () => {
  await sql`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await sql.end({ timeout: 5_000 });
});

describe("users", () => {
  beforeEach(async () => {
    await sql`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE`;
  });

  it("can parse an insert user payload", async () => {
    const parsedUser = UsersInsertSchema.parse({
      name: "Alice",
      email: "alice@example.com",
    });
    expect(parsedUser).toEqual({
      name: "Alice",
      email: "alice@example.com",
    });
  });

  it("can throw a zod error if the insert user payload is invalid", async () => {
    expect(() =>
      UsersInsertSchema.parse({
        email: "alice@example.com",
      })
    ).toThrow(ZodError);
  });

  it("can insert a user", async () => {
    const parsedUser = UsersInsertSchema.parse({
      name: "Alice",
      email: "alice@example.com",
    });
    const [inserted] = await db.insert(users).values(parsedUser).returning();

    const rows = await sql`
    SELECT id, name, email
    FROM users
  `;

    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(inserted.id);
    expect(rows[0].name).toBe("Alice");
    expect(rows[0].email).toBe("alice@example.com");
  });

  it("can parse an update user payload", async () => {
    const updatedAt = new Date();
    const parsedUser = UsersUpdateSchema.parse({
      name: "Bob",
      updatedAt,
    });
    expect(parsedUser).toEqual({
      name: "Bob",
      updatedAt,
    });
  });

  it("can throw a zod error if the update user payload is invalid", async () => {
    expect(() =>
      UsersUpdateSchema.parse({
        id: uuidv4(),
        name: "Bob",
        updatedAt: new Date(),
      })
    ).toThrow(ZodError);
  });

  it("can throw a zod error if attempting to update createdAt", async () => {
    expect(() =>
      UsersUpdateSchema.parse({
        name: "Bob",
        updatedAt: new Date(),
        createdAt: new Date(),
      })
    ).toThrow(ZodError);
  });

  it("can update a user", async () => {
    const updatedAt = new Date();
    const parsedUser = UsersInsertSchema.parse({
      name: "Alice",
      email: "alice@example.com",
    });
    const [inserted] = await db.insert(users).values(parsedUser).returning();

    const updatedUser = UsersUpdateSchema.parse({
      name: "Bob",
      email: "bob@example.com",
      updatedAt,
    });
    const [updated] = await db
      .update(users)
      .set(updatedUser)
      .where(eq(users.id, inserted.id))
      .returning();

    const rows = await sql`
    SELECT id, name, email, updated_at
    FROM users
    WHERE id = ${updated.id}
  `;

    const dbIso = new Date(rows[0].updated_at + "Z").toISOString();
    const expectedIso = updatedAt.toISOString();

    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(updated.id);
    expect(rows[0].name).toBe("Bob");
    expect(rows[0].email).toBe("bob@example.com");
    expect(dbIso).toBe(expectedIso);
  });
});
