/**
 * This file contains zod schemas for the tables in the database.
 */
import * as tables from "../schema/app";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

/**
 * The ExercisesSelectSchema can be used to validate the payload for selecting an exercise.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExercise = ExercisesSelectSchema.parse(exercise);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#select-schema
 */
export const ExercisesSelectSchema = createSelectSchema(tables.exercises);

/**
 * The ExercisesInsertSchema can be used to validate the payload for inserting an exercise.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExercise = ExercisesInsertSchema.parse(exercise);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#insert-schema
 */
export const ExercisesInsertSchema = createInsertSchema(tables.exercises);

/**
 * The ExercisesUpdateSchema can be used to validate the payload for updating an exercise.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExercise = ExercisesUpdateSchema.parse(exercise);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#update-schema
 */
export const ExercisesUpdateSchema = createUpdateSchema(tables.exercises);

/**
 * The WorkoutExercisesSelectSchema can be used to validate the payload for selecting a workout exercise.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedWorkoutExercise = WorkoutExercisesSelectSchema.parse(workoutExercise);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#select-schema
 */
export const WorkoutExercisesSelectSchema = createSelectSchema(
  tables.workoutExercises
);

/**
 * The WorkoutExercisesInsertSchema can be used to validate the payload for inserting a workout exercise.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedWorkoutExercise = WorkoutExercisesInsertSchema.parse(workoutExercise);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#insert-schema
 */
export const WorkoutExercisesInsertSchema = createInsertSchema(
  tables.workoutExercises
);

/**
 * The WorkoutExercisesUpdateSchema can be used to validate the payload for updating a workout exercise.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedWorkoutExercise = WorkoutExercisesUpdateSchema.parse(workoutExercise);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#update-schema
 */
export const WorkoutExercisesUpdateSchema = createUpdateSchema(
  tables.workoutExercises
);

/**
 * The WorkoutLogsSelectSchema can be used to validate the payload for selecting a workout log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedWorkoutLog = WorkoutLogsSelectSchema.parse(workoutLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#select-schema
 */
export const WorkoutLogsSelectSchema = createSelectSchema(tables.workoutLogs);

/**
 * The WorkoutLogsInsertSchema can be used to validate the payload for inserting a workout log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedWorkoutLog = WorkoutLogsInsertSchema.parse(workoutLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#insert-schema
 */
export const WorkoutLogsInsertSchema = createInsertSchema(tables.workoutLogs);

/**
 * The WorkoutLogsUpdateSchema can be used to validate the payload for updating a workout log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedWorkoutLog = WorkoutLogsUpdateSchema.parse(workoutLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#update-schema
 */
export const WorkoutLogsUpdateSchema = createUpdateSchema(tables.workoutLogs);

/**
 * The ExerciseLogsSelectSchema can be used to validate the payload for selecting an exercise log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExerciseLog = ExerciseLogsSelectSchema.parse(exerciseLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#select-schema
 */
export const ExerciseLogsSelectSchema = createSelectSchema(tables.exerciseLogs);

/**
 * The ExerciseLogsInsertSchema can be used to validate the payload for inserting an exercise log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExerciseLog = ExerciseLogsInsertSchema.parse(exerciseLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#insert-schema
 */
export const ExerciseLogsInsertSchema = createInsertSchema(tables.exerciseLogs);

/**
 * The ExerciseLogsUpdateSchema can be used to validate the payload for updating an exercise log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExerciseLog = ExerciseLogsUpdateSchema.parse(exerciseLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#update-schema
 */
export const ExerciseLogsUpdateSchema = createUpdateSchema(tables.exerciseLogs);

/**
 * The ExerciseSetLogsSelectSchema can be used to validate the payload for selecting an exercise set log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExerciseSetLog = ExerciseSetLogsSelectSchema.parse(exerciseSetLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#select-schema
 */
export const ExerciseSetLogsSelectSchema = createSelectSchema(
  tables.exerciseSetLogs
);

/**
 * The ExerciseSetLogsInsertSchema can be used to validate the payload for inserting an exercise set log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExerciseSetLog = ExerciseSetLogsInsertSchema.parse(exerciseSetLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#insert-schema
 */
export const ExerciseSetLogsInsertSchema = createInsertSchema(
  tables.exerciseSetLogs
);

/**
 * The ExerciseSetLogsUpdateSchema can be used to validate the payload for updating an exercise set log.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedExerciseSetLog = ExerciseSetLogsUpdateSchema.parse(exerciseSetLog);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#update-schema
 */
export const ExerciseSetLogsUpdateSchema = createUpdateSchema(
  tables.exerciseSetLogs
);
