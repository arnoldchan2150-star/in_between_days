ALTER TABLE `posts` MODIFY COLUMN `type` enum('travel','culture','snow') NOT NULL DEFAULT 'travel';--> statement-breakpoint
ALTER TABLE `booklets` ADD `embedUrl` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `embedUrl` text;