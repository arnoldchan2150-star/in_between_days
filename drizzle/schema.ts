import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
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
  type: mysqlEnum("type", ["travel", "culture"]).default("travel").notNull(),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
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
  caption: text("caption"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PostMedia = typeof postMedia.$inferSelect;
export type InsertPostMedia = typeof postMedia.$inferInsert;

// ── Booklets ───────────────────────────────────────────────────────────────
export const booklets = mysqlTable("booklets", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  coverUrl: text("coverUrl"),
  fileUrl: text("fileUrl").notNull().default(""),
  fileKey: text("fileKey").notNull().default(""),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booklet = typeof booklets.$inferSelect;
export type InsertBooklet = typeof booklets.$inferInsert;

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
