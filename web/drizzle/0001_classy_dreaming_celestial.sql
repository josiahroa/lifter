ALTER TABLE `lift_variations` DROP FOREIGN KEY `lift_variations_lift_id_lifts_id_fk`;
--> statement-breakpoint
ALTER TABLE `workout_lifts` DROP FOREIGN KEY `workout_lifts_workout_id_workouts_id_fk`;
--> statement-breakpoint
ALTER TABLE `workout_lifts` DROP FOREIGN KEY `workout_lifts_lift_variation_id_lift_variations_id_fk`;
--> statement-breakpoint
ALTER TABLE `workout_lifts` DROP FOREIGN KEY `workout_lifts_attachment_id_attachments_id_fk`;
--> statement-breakpoint
ALTER TABLE `workout_sets` DROP FOREIGN KEY `workout_sets_workout_lift_id_workout_lifts_id_fk`;
