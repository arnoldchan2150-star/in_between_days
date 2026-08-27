import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  uniqueIndex,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ── Users ──────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Posts ──────────────────────────────────────────────────────────────────
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImageUrl: text("coverImageUrl"),
  coverImageKey: text("coverImageKey"),
  category: mysqlEnum("category", [
    "南美",
    "中東",
    "亞洲",
    "歐洲",
    "中亞",
    "東南亞",
  ]).notNull(),
  type: mysqlEnum("type", ["travel", "culture", "snow"]).default("travel").notNull(),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  previewToken: varchar("previewToken", { length: 128 }),
  embedUrl: text("embedUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// ── Post Media ─────────────────────────────────────────────────────────────
export const postMedia = mysqlTable("post_media", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  url: text("url").notNull(),
  storageKey: text("storageKey").notNull(),
  mediaType: mysqlEnum("mediaType", ["image", "video"]).default("image").notNull(),
  caption: text("caption"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PostMedia = typeof postMedia.$inferSelect;
export type InsertPostMedia = typeof postMedia.$inferInsert;

// ── Post Tags ───────────────────────────────────────────────────────────────
export const postTags = mysqlTable(
  "post_tags",
  {
    id: int("id").autoincrement().primaryKey(),
    postId: int("postId").notNull(),
    tag: varchar("tag", { length: 64 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    postTagUnique: uniqueIndex("post_tags_post_id_tag_unique").on(table.postId, table.tag),
  })
);

export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = typeof postTags.$inferInsert;

export const postBlocks = mysqlTable('post_blocks', {
  id: int('id').autoincrement().primaryKey(),
  postId: int('postId').notNull(),
  blockType: varchar('blockType', { length: 32 }).notNull(), // paragraph, image, heading, quote, video
  content: text('content'), // text, image url, heading text, quote text, or video embed url
  caption: varchar('caption', { length: 255 }), // image caption or video title
  sortOrder: int('sortOrder').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type PostBlock = typeof postBlocks.$inferSelect;
export type InsertPostBlock = typeof postBlocks.$inferInsert;

// ── Booklets ───────────────────────────────────────────────────────────────
export const booklets = mysqlTable("booklets", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  coverUrl: text("coverUrl"),
  fileUrl: text("fileUrl").notNull().default(""),
  fileKey: text("fileKey").notNull().default(""),
  embedUrl: text("embedUrl"),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booklet = typeof booklets.$inferSelect;
export type InsertBooklet = typeof booklets.$inferInsert;

// ── Shop Products ───────────────────────────────────────────────────────────
export const shopProducts = mysqlTable("shop_products", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["自製物件", "旅途小物"]).notNull(),
  shippingClass: mysqlEnum("shippingClass", ["P", "G", "E"]).notNull().default("G"),
  weightGrams: int("weightGrams").notNull().default(0),
  priceMinor: int("priceMinor").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("HKD"),
  inventoryQuantity: int("inventoryQuantity").notNull().default(0),
  reservedQuantity: int("reservedQuantity").notNull().default(0),
  coverUrl: text("coverUrl"),
  coverKey: text("coverKey"),
  stripeProductId: varchar("stripeProductId", { length: 128 }),
  stripePriceId: varchar("stripePriceId", { length: 128 }),
  active: boolean("active").notNull().default(false),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShopProduct = typeof shopProducts.$inferSelect;
export type InsertShopProduct = typeof shopProducts.$inferInsert;

export const shopProductMedia = mysqlTable("shop_product_media", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  url: text("url").notNull(),
  storageKey: text("storageKey").notNull(),
  caption: text("caption"),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ShopProductMedia = typeof shopProductMedia.$inferSelect;
export type InsertShopProductMedia = typeof shopProductMedia.$inferInsert;

export const shopOrders = mysqlTable("shop_orders", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 128 }),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 128 }).notNull().unique(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  fulfillmentStatus: mysqlEnum("fulfillmentStatus", ["pending", "processing", "shipped", "fulfilled", "cancelled"]).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShopOrder = typeof shopOrders.$inferSelect;
export type InsertShopOrder = typeof shopOrders.$inferInsert;

export const shopOrderItems = mysqlTable("shop_order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productTitle: varchar("productTitle", { length: 255 }).notNull(),
  stripePriceId: varchar("stripePriceId", { length: 128 }),
  quantity: int("quantity").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ShopOrderItem = typeof shopOrderItems.$inferSelect;
export type InsertShopOrderItem = typeof shopOrderItems.$inferInsert;

// ── Booklet Subscribers ────────────────────────────────────────────────────
export const bookletSubscribers = mysqlTable("booklet_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  bookletId: int("bookletId"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookletSubscriber = typeof bookletSubscribers.$inferSelect;
export type InsertBookletSubscriber = typeof bookletSubscribers.$inferInsert;

// ── Site Update Subscribers & Newsletters ──────────────────────────────────
export const siteSubscribers = mysqlTable("site_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  confirmed: boolean("confirmed").default(false).notNull(),
  confirmationToken: varchar("confirmationToken", { length: 128 }),
  unsubscribeToken: varchar("unsubscribeToken", { length: 128 }),
  unsubscribedAt: timestamp("unsubscribedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSubscriber = typeof siteSubscribers.$inferSelect;
export type InsertSiteSubscriber = typeof siteSubscribers.$inferInsert;

export const siteNewsletters = mysqlTable("site_newsletters", {
  id: int("id").autoincrement().primaryKey(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sentAt"),
  recipientCount: int("recipientCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SiteNewsletter = typeof siteNewsletters.$inferSelect;
export type InsertSiteNewsletter = typeof siteNewsletters.$inferInsert;

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 128 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// ── About Page ─────────────────────────────────────────────────────────────
export const aboutPage = mysqlTable("about_page", {
  id: int("id").autoincrement().primaryKey(),
  philosophy: text("philosophy"),
  blogOrigin: text("blogOrigin"),
  countriesVisited: text("countriesVisited"),
  photoUrl: text("photoUrl"),
  photoKey: text("photoKey"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AboutPage = typeof aboutPage.$inferSelect;
export type InsertAboutPage = typeof aboutPage.$inferInsert;

// ── Admin Credentials ──────────────────────────────────────────────────────
export const adminCredentials = mysqlTable("admin_credentials", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = typeof adminCredentials.$inferInsert;
