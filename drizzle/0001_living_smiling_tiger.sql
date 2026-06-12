CREATE TABLE `about_page` (
	`id` int AUTO_INCREMENT NOT NULL,
	`philosophy` text,
	`blogOrigin` text,
	`countriesVisited` text,
	`photoUrl` text,
	`photoKey` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `about_page_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booklet_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`bookletId` int,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `booklet_subscribers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booklets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`fileUrl` text NOT NULL,
	`fileKey` text NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booklets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`url` text NOT NULL,
	`storageKey` text NOT NULL,
	`caption` text,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`coverImageUrl` text,
	`coverImageKey` text,
	`category` enum('南美','中東','亞洲','歐洲','中亞','東南亞') NOT NULL,
	`type` enum('travel','culture') NOT NULL DEFAULT 'travel',
	`published` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
