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
	`attachment_id` int,
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
