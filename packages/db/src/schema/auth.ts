import * as pg from "drizzle-orm/pg-core";
import { sql, SQL } from "drizzle-orm";

export function lower(col: pg.AnyPgColumn): SQL {
  return sql`lower(${col})`;
}

export const authSchema = pg.pgSchema("auth");

export const users = authSchema.table(
  "users",
  {
    id: pg.uuid("id").primaryKey().defaultRandom(),
    email: pg.text("email"),
    emailVerified: pg.boolean("email_verified").notNull().default(false),
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
    lastLoginAt: pg.timestamp("last_login_at"),
  },
  (t) => [
    pg
      .uniqueIndex("users_email_unique_non_null")
      .on(lower(t.email))
      .where(sql`${t.email} IS NOT NULL`),
  ]
);

export const userProfiles = authSchema.table(
  "user_profiles",
  {
    id: pg.uuid("id").primaryKey().defaultRandom(),
    userId: pg
      .uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [pg.uniqueIndex("user_profiles_user_id_unique").on(t.userId)]
);

export const authProvider = authSchema.enum("auth_provider", [
  "google",
  "apple",
  "email_otp",
]);

export const authIdentities = authSchema.table(
  "auth_identities",
  {
    id: pg.uuid("id").primaryKey().defaultRandom(),
    userId: pg
      .uuid("user_id")
      .notNull()
      .references(() => users.id),
    provider: authProvider("provider").notNull(),
    providerUserId: pg.text("provider_user_id").notNull(),
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    lastUsedAt: pg.timestamp("last_used_at"),
  },
  (t) => [
    pg
      .uniqueIndex("auth_identities_provider_provider_user_id_unique")
      .on(t.provider, t.providerUserId),
  ]
);

export const sessions = authSchema.table(
  "sessions",
  {
    id: pg.uuid("id").primaryKey().defaultRandom(),
    userId: pg
      .uuid("user_id")
      .notNull()
      .references(() => users.id),
    revokedAt: pg.timestamp("revoked_at"),

    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [pg.index("sessions_user_id_index").on(t.userId)]
);

export const refreshTokens = authSchema.table(
  "refresh_tokens",
  {
    id: pg.uuid("id").primaryKey().defaultRandom(),
    sessionId: pg
      .uuid("session_id")
      .notNull()
      .references(() => sessions.id),

    tokenHash: pg.text("token_hash").notNull(),
    expiresAt: pg.timestamp("expires_at").notNull(),

    revokedAt: pg.timestamp("revoked_at"),
    rotatedAt: pg.timestamp("rotated_at"),
    replacedBy: pg.text("replaced_by"),

    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    pg.uniqueIndex("refresh_tokens_token_hash_unique").on(t.tokenHash),
    pg.index("refresh_tokens_session_id_index").on(t.sessionId),
  ]
);
