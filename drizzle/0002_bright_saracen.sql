ALTER TABLE `booklets` MODIFY COLUMN `fileUrl` text NOT NULL DEFAULT ('');--> statement-breakpoint
ALTER TABLE `booklets` MODIFY COLUMN `fileKey` text NOT NULL DEFAULT ('');--> statement-breakpoint
ALTER TABLE `booklets` ADD `slug` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `booklets` ADD `coverUrl` text;--> statement-breakpoint
ALTER TABLE `booklets` ADD `sortOrder` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `booklets` ADD CONSTRAINT `booklets_slug_unique` UNIQUE(`slug`);