ALTER TABLE "exercise_logs" ALTER COLUMN "workout_log_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise_logs" ALTER COLUMN "exercise_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise_set_logs" ALTER COLUMN "exercise_log_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "workout_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "exercise_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workouts" ALTER COLUMN "user_id" SET NOT NULL;