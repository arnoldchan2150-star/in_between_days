CREATE TABLE `site_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`unsubscribedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_subscribers_email_unique` UNIQUE(`email`)
);
