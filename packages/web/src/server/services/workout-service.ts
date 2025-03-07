import db from "@/lib/db";
import { workouts } from "@lifter/db/schema";
import { eq } from "drizzle-orm";

export const workoutService = {
  async getUserWorkouts(userId: number) {
    const userWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, Number(userId)));

    return userWorkouts;
  },
};
