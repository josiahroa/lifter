import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { workoutService } from "@/server/services/workout-service";

export const workoutRouter = router({
  getUserWorkouts: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const userWorkouts = await workoutService.getUserWorkouts(input.userId);
      return userWorkouts;
    }),
});
