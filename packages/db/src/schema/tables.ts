import { pgTable as table } from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";

import { muscleGroupEnum, muscleGroupTargetEnum, equipmentEnum } from "./enums";
import { timestamps } from "./columns.helpers";

export const users = table("users", {
  id: pg.uuid("id").defaultRandom().primaryKey(),
  name: pg.text("name").notNull(),
  email: pg.text("email").notNull().unique(),
  ...timestamps,
});

export const workouts = table("workouts", {
  id: pg.serial("id").primaryKey(),
  userId: pg
    .uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: pg.text("name").notNull(),
  ...timestamps,
});

export const exercises = table("exercises", {
  id: pg.serial("id").primaryKey(),
  userId: pg
    .uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: pg.text("name").notNull(),
  muscleGroup: muscleGroupEnum("muscle_group").notNull(),
  muscleGroupTarget: muscleGroupTargetEnum("muscle_group_target").notNull(),
  equipment: equipmentEnum("equipment").notNull(),
  equipmentDescription: pg.text("equipment_description"),
  ...timestamps,
});

export const workoutExercises = table(
  "workout_exercises",
  {
    id: pg.serial("id").primaryKey(),
    workoutId: pg
      .integer("workout_id")
      .references(() => workouts.id)
      .notNull(),
    exerciseId: pg
      .integer("exercise_id")
      .references(() => exercises.id)
      .notNull(),
    ...timestamps,
  },
  (table) => [pg.unique().on(table.workoutId, table.exerciseId)]
);

export const workoutLogs = table(
  "workout_logs",
  {
    id: pg.serial("id").primaryKey(),
    userId: pg
      .uuid("user_id")
      .references(() => users.id)
      .notNull(),
    workoutDate: pg.date("workout_date").notNull(),
    ...timestamps,
  },
  (table) => [pg.unique().on(table.userId, table.workoutDate)]
);

export const exerciseLogs = table("exercise_logs", {
  id: pg.serial("id").primaryKey(),
  workoutLogId: pg
    .integer("workout_log_id")
    .references(() => workoutLogs.id, {
      onDelete: "cascade",
    })
    .notNull(),
  exerciseId: pg
    .integer("exercise_id")
    .references(() => exercises.id)
    .notNull(),
  ...timestamps,
});

export const exerciseSetLogs = table("exercise_set_logs", {
  id: pg.serial("id").primaryKey(),
  workoutLogId: pg
    .integer("workout_log_id")
    .references(() => workoutLogs.id, {
      onDelete: "cascade",
    })
    .notNull(),
  exerciseLogId: pg
    .integer("exercise_log_id")
    .references(() => exerciseLogs.id, {
      onDelete: "cascade",
    })
    .notNull(),
  setNumber: pg.integer("set_number").notNull(),
  reps: pg.integer("reps").notNull(),
  weight: pg.numeric("weight", { precision: 5, scale: 2 }).notNull(),
  ...timestamps,
});
