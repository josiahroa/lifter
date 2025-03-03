CREATE TABLE `attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lift_variations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lift_id` int,
	`variation_name` varchar(255),
	`variation_description` text,
	CONSTRAINT `lift_variations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lifts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	CONSTRAINT `lifts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workout_lifts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workout_id` int NOT NULL,
	`lift_variation_id` int NOT NULL,
	`attachment_id` int NOT NULL,
	CONSTRAINT `workout_lifts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workout_sets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workout_lift_id` int NOT NULL,
	`weight` int NOT NULL,
	`reps` int NOT NULL,
	CONSTRAINT `workout_sets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`workout_date` datetime NOT NULL,
	`workout_name` varchar(255) NOT NULL,
	CONSTRAINT `workouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `lift_variations` ADD CONSTRAINT `lift_variations_lift_id_lifts_id_fk` FOREIGN KEY (`lift_id`) REFERENCES `lifts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workout_lifts` ADD CONSTRAINT `workout_lifts_workout_id_workouts_id_fk` FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workout_lifts` ADD CONSTRAINT `workout_lifts_lift_variation_id_lift_variations_id_fk` FOREIGN KEY (`lift_variation_id`) REFERENCES `lift_variations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workout_lifts` ADD CONSTRAINT `workout_lifts_attachment_id_attachments_id_fk` FOREIGN KEY (`attachment_id`) REFERENCES `attachments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD CONSTRAINT `workout_sets_workout_lift_id_workout_lifts_id_fk` FOREIGN KEY (`workout_lift_id`) REFERENCES `workout_lifts`(`id`) ON DELETE no action ON UPDATE no action;