import { pgEnum } from "drizzle-orm/pg-core";

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
