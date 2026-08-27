ALTER TABLE `shop_products`
  ADD COLUMN IF NOT EXISTS `reservedQuantity` int NOT NULL DEFAULT 0 AFTER `inventoryQuantity`;
