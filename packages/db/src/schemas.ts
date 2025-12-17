import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
});

export const muscleGroupEnum = pgEnum("muscle_group", [
  "chest",
  "back",
  "shoulders",
  "legs",
  "arms",
  "core",
]);

export const muscleGroupTargetEnum = pgEnum("muscle_group_target", [
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

export const equipmentEnum = pgEnum("equipment", [
  "barbell",
  "dumbbell",
  "machine",
  "bodyweight",
  "cable",
  "other",
]);

// Each exercise can be used in multiple workouts
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  muscleGroup: muscleGroupEnum("muscle_group").notNull(),
  muscleGroupTarget: muscleGroupTargetEnum("muscle_group_target").notNull(),
  equipment: equipmentEnum("equipment").notNull(),
  equipmentDescription: text("equipment_description"),
});

// Each workout can have multiple exercises
export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  workoutId: integer("workout_id").references(() => workouts.id),
  exerciseId: integer("exercise_id").references(() => exercises.id),
});

// A logged workout is unique to a user and a date
export const workoutLogs = pgTable(
  "workout_logs",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    workoutDate: date("workout_date").notNull(),
  },
  (table) => [unique().on(table.userId, table.workoutDate)]
);

// Each logged workout can have multiple logged exercises
export const exerciseLogs = pgTable("exercise_logs", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  workoutLogId: integer("workout_log_id").references(() => workoutLogs.id, {
    onDelete: "cascade",
  }),
  exerciseId: integer("exercise_id").references(() => exercises.id),
});

// Each logged exercise can have multiple sets
export const exerciseSetLogs = pgTable("exercise_set_logs", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  exerciseLogId: integer("exercise_log_id").references(() => exerciseLogs.id, {
    onDelete: "cascade",
  }),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps").notNull(),
  weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
});
