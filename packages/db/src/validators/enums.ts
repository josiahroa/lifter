import * as enums from "../schema/app";
import { createSelectSchema } from "drizzle-zod";

/**
 * The MuscleGroupEnumSelectSchema can be used to validate the payload for selecting a muscle group.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedMuscleGroup = MuscleGroupEnumSelectSchema.parse(muscleGroup);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#select-schema
 */
export const MuscleGroupEnumSelectSchema = createSelectSchema(
  enums.muscleGroupEnum
);

/**
 * The MuscleGroupTargetEnumSelectSchema can be used to validate the payload for selecting a muscle group target.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedMuscleGroupTarget = MuscleGroupTargetEnumSelectSchema.parse(muscleGroupTarget);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#select-schema
 */
export const MuscleGroupTargetEnumSelectSchema = createSelectSchema(
  enums.muscleGroupTargetEnum
);

/**
 * The EquipmentEnumSelectSchema can be used to validate the payload for selecting an equipment.
 *
 * Usage:
 * ```ts
 * try {
 *   const parsedEquipment = EquipmentEnumSelectSchema.parse(equipment);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     console.error(error.issues);
 *   }
 * }
 * ```
 * @see https://orm.drizzle.team/docs/zod#select-schema
 */
export const EquipmentEnumSelectSchema = createSelectSchema(
  enums.equipmentEnum
);
