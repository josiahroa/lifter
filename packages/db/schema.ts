import {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
} from "drizzle-orm/mysql-core";

// Tables
export const lifts = mysqlTable("lifts", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
});

export const liftVariations = mysqlTable("lift_variations", {
  id: int("id").primaryKey().autoincrement(),
  liftId: int("lift_id"),
  variationName: varchar("variation_name", { length: 255 }),
  variationDescription: text("variation_description"),
});

export const attachments = mysqlTable("attachments", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
});

export const workouts = mysqlTable("workouts", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id"), // clerk user id
  workoutDate: datetime("workout_date").notNull(),
  workoutName: varchar("workout_name", { length: 255 }).notNull(),
});

export const workoutLifts = mysqlTable("workout_lifts", {
  id: int("id").primaryKey().autoincrement(),
  workoutId: int("workout_id").notNull(),
  liftVariationId: int("lift_variation_id").notNull(),
  attachmentId: int("attachment_id"),
});

export const workoutSets = mysqlTable("workout_sets", {
  id: int("id").primaryKey().autoincrement(),
  workoutLiftId: int("workout_lift_id").notNull(),
  weight: int("weight").notNull(),
  reps: int("reps").notNull(),
});

/**
 * TOOD: Define the relations for the application level since Planetscale doesn't support foreign keys
 */

// Type Exports
export type Workout = typeof workouts.$inferSelect;
export type WorkoutLift = typeof workoutLifts.$inferSelect;
export type WorkoutSet = typeof workoutSets.$inferSelect;
export type Lift = typeof lifts.$inferSelect;
export type LiftVariation = typeof liftVariations.$inferSelect;
export type Attachment = typeof attachments.$inferSelect;
