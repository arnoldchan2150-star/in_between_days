ALTER TABLE `posts` ADD `previewToken` varchar(128);
--> statement-breakpoint
CREATE TABLE `post_tags` (
  `id` int AUTO_INCREMENT NOT NULL,
  `postId` int NOT NULL,
  `tag` varchar(64) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `post_tags_id` PRIMARY KEY(`id`),
  CONSTRAINT `post_tags_post_id_tag_unique` UNIQUE(`postId`, `tag`)
);
--> statement-breakpoint
CREATE INDEX `post_tags_post_id_idx` ON `post_tags` (`postId`);
