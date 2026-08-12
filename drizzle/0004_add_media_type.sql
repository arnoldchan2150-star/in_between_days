ALTER TABLE `post_media` ADD COLUMN `mediaType` enum('image','video') NOT NULL DEFAULT 'image';
