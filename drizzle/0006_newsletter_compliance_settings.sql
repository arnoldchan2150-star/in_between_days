-- Add compliance and newsletter tables
ALTER TABLE `site_subscribers` ADD COLUMN `confirmed` BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE `site_subscribers` ADD COLUMN `confirmationToken` VARCHAR(128);
ALTER TABLE `site_subscribers` ADD COLUMN `unsubscribeToken` VARCHAR(128);

CREATE TABLE IF NOT EXISTS `site_newsletters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `subject` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `sentAt` TIMESTAMP NULL,
  `recipientCount` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `settingKey` VARCHAR(128) NOT NULL UNIQUE,
  `settingValue` TEXT NOT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
