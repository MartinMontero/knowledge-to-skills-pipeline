CREATE TABLE `knowledge_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`author` text,
	`publisher` text,
	`url` text,
	`ip_owner_id` integer,
	`created_at` integer,
	FOREIGN KEY (`ip_owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from_user_id` integer,
	`to_user_id` integer,
	`skill_id` integer,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`zap_request_id` text,
	`created_at` integer,
	FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skill_invocations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`skill_id` integer,
	`user_id` integer,
	`input` text,
	`output` text,
	`tokens_used` integer,
	`duration` integer,
	`created_at` integer,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skill_suites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`source_id` integer,
	`created_at` integer,
	FOREIGN KEY (`source_id`) REFERENCES `knowledge_sources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_suites_slug_unique` ON `skill_suites` (`slug`);--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`suite_id` integer,
	`name` text NOT NULL,
	`description` text,
	`content` text,
	`ip_owner_id` integer,
	`author_id` integer,
	`price_per_use` integer,
	`subscription_price` integer,
	`created_at` integer,
	FOREIGN KEY (`suite_id`) REFERENCES `skill_suites`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ip_owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`nostr_pubkey` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);