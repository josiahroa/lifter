import * as pg from "drizzle-orm/pg-core";
import { timestamps } from "../helpers";
import { authUsers } from "./auth";

export const appSchema = pg.pgSchema("app");

export const workouts = appSchema.table("workouts", {
  id: pg.serial("id").primaryKey(),
  userId: pg
    .uuid("user_id")
    .notNull()
    .references(() => authUsers.id),
  name: pg.text("name").notNull(),
  ...timestamps,
});

export const muscleGroupEnum = appSchema.enum("muscle_group", [
  "chest",
  "back",
  "shoulders",
  "legs",
  "arms",
  "core",
]);

export const muscleGroupTargetEnum = appSchema.enum("muscle_group_target", [
  "arms_biceps",
  "arms_triceps",
  "arms_forearms",
  "shoulders_front_delts",
  "shoulders_side_delts",
  "shoulders_rear_delts",
  "back_lats",
  "back_traps",
  "back_rhomboids",
  "legs_glutes",
  "legs_hamstrings",
  "legs_quads",
  "legs_calves",
  "chest_upper",
  "chest_lower",
  "chest_middle",
  "core_abs",
  "core_obliques",
  "core_lower_back",
]);

export const equipmentEnum = appSchema.enum("equipment", [
  "barbell",
  "dumbbell",
  "machine",
  "bodyweight",
  "cable",
  "other",
]);

export const exercises = appSchema.table("exercises", {
  id: pg.serial("id").primaryKey(),
  userId: pg
    .uuid("user_id")
    .notNull()
    .references(() => authUsers.id),
  name: pg.text("name").notNull(),
  muscleGroup: muscleGroupEnum("muscle_group").notNull(),
  muscleGroupTarget: muscleGroupTargetEnum("muscle_group_target").notNull(),
  equipment: equipmentEnum("equipment").notNull(),
  equipmentDescription: pg.text("equipment_description"),
  ...timestamps,
});

export const workoutExercises = appSchema.table(
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
  (t) => [pg.unique().on(t.workoutId, t.exerciseId)]
);

export const workoutLogs = appSchema.table(
  "workout_logs",
  {
    id: pg.serial("id").primaryKey(),
    userId: pg
      .uuid("user_id")
      .notNull()
      .references(() => authUsers.id),
    workoutDate: pg.date("workout_date").notNull(),
    ...timestamps,
  },
  (t) => [pg.unique().on(t.userId, t.workoutDate)]
);

export const exerciseLogs = appSchema.table("exercise_logs", {
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

export const exerciseSetLogs = appSchema.table("exercise_set_logs", {
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
