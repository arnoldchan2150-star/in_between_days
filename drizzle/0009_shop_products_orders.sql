CREATE TABLE IF NOT EXISTS `shop_products` (
  `id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `description` text NOT NULL,
  `category` enum('自製物件','旅途小物') NOT NULL,
  `priceMinor` int NOT NULL DEFAULT 0,
  `currency` varchar(3) NOT NULL DEFAULT 'HKD',
  `inventoryQuantity` int NOT NULL DEFAULT 0,
  `coverUrl` text,
  `coverKey` text,
  `stripeProductId` varchar(128),
  `stripePriceId` varchar(128),
  `active` boolean NOT NULL DEFAULT false,
  `sortOrder` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `shop_products_id` PRIMARY KEY(`id`),
  CONSTRAINT `shop_products_slug_unique` UNIQUE(`slug`)
);

CREATE TABLE IF NOT EXISTS `shop_product_media` (
  `id` int AUTO_INCREMENT NOT NULL,
  `productId` int NOT NULL,
  `url` text NOT NULL,
  `storageKey` text NOT NULL,
  `caption` text,
  `sortOrder` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `shop_product_media_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `shop_orders` (
  `id` int AUTO_INCREMENT NOT NULL,
  `customerName` varchar(128),
  `customerEmail` varchar(320) NOT NULL,
  `stripeCheckoutSessionId` varchar(128) NOT NULL,
  `stripePaymentIntentId` varchar(128),
  `fulfillmentStatus` enum('pending','processing','shipped','fulfilled','cancelled') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `shop_orders_id` PRIMARY KEY(`id`),
  CONSTRAINT `shop_orders_checkout_session_unique` UNIQUE(`stripeCheckoutSessionId`)
);

CREATE TABLE IF NOT EXISTS `shop_order_items` (
  `id` int AUTO_INCREMENT NOT NULL,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `productTitle` varchar(255) NOT NULL,
  `stripePriceId` varchar(128),
  `quantity` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `shop_order_items_id` PRIMARY KEY(`id`)
);
