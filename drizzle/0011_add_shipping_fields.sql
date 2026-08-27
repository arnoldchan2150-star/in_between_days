ALTER TABLE `shop_products`
  ADD COLUMN `shippingClass` enum('P','G','E') NOT NULL DEFAULT 'G' AFTER `category`,
  ADD COLUMN `weightGrams` int NOT NULL DEFAULT 0 AFTER `shippingClass`;
