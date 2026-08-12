CREATE TABLE `post_blocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `blockType` varchar(32) NOT NULL,
  `content` text,
  `caption` varchar(255),
  `sortOrder` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
