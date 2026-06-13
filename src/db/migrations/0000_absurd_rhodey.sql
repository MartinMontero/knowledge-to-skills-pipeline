CREATE TABLE `skill_invocations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`skill_slug` text NOT NULL,
	`suite_slug` text,
	`mode` text NOT NULL,
	`model` text,
	`input_chars` integer NOT NULL,
	`output_chars` integer NOT NULL,
	`input_tokens` integer,
	`output_tokens` integer,
	`duration_ms` integer,
	`created_at` integer NOT NULL
);
