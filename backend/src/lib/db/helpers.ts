/**
 * This file contains helper functions for database schemas.
 */
import { timestamp } from "drizzle-orm/pg-core";

/**
 * The timestamps object contains timestamp metadata columns that are helpful for debugging,
 * auditing, or observing the lifecycle of a record.
 *
 * Usage:
 * ```ts
 * const table = pgTable("table_name", {
 *   id: pg.uuid("id").defaultRandom().primaryKey(),
 *   ...timestamps,
 * });
 * ```
 */
export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
};
