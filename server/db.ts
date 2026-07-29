import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  AboutPage,
  Booklet,
  BookletSubscriber,
  InsertAboutPage,
  InsertBooklet,
  InsertBookletSubscriber,
  InsertPost,
  InsertPostMedia,
  InsertUser,
  Post,
  PostMedia,
  aboutPage,
  adminCredentials,
  bookletSubscribers,
  booklets,
  postMedia,
  posts,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ── Users ──────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const isOwner = user.openId === ENV.ownerOpenId;
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    for (const field of textFields) {
      const value = user[field];
      if (value === undefined) continue;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    const role = isOwner ? "admin" : (user.role ?? "user");
    values.role = role;
    updateSet.role = role;
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

// ── Posts ──────────────────────────────────────────────────────────────────
export async function getAllPosts(): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPublishedPosts(category?: string, type?: string): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(posts.published, true)];
  if (category) conditions.push(eq(posts.category, category as Post["category"]));
  if (type) conditions.push(eq(posts.type, type as Post["type"]));
  return db
    .select()
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result[0];
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0];
}

export async function createPost(data: InsertPost): Promise<Post> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(posts).values(data);
  const result = await db.select().from(posts).where(eq(posts.slug, data.slug)).limit(1);
  return result[0]!;
}

export async function updatePost(id: number, data: Partial<InsertPost>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(postMedia).where(eq(postMedia.postId, id));
  await db.delete(posts).where(eq(posts.id, id));
}

// ── Post Media ─────────────────────────────────────────────────────────────
export async function getPostMedia(postId: number): Promise<PostMedia[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(postMedia)
    .where(eq(postMedia.postId, postId))
    .orderBy(postMedia.sortOrder);
}

export async function addPostMedia(data: InsertPostMedia): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(postMedia).values(data);
}

export async function deletePostMedia(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(postMedia).where(eq(postMedia.id, id));
}

// ── Booklets ───────────────────────────────────────────────────────────────
export async function getAllBooklets(): Promise<Booklet[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(booklets).orderBy(asc(booklets.sortOrder), desc(booklets.createdAt));
}

export async function getPublicBooklets(): Promise<Booklet[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(booklets)
    .where(eq(booklets.active, true))
    .orderBy(asc(booklets.sortOrder), desc(booklets.createdAt));
}

export async function getBookletBySlug(slug: string): Promise<Booklet | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(booklets).where(eq(booklets.slug, slug)).limit(1);
  return result[0];
}

export async function getBookletById(id: number): Promise<Booklet | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(booklets).where(eq(booklets.id, id)).limit(1);
  return result[0];
}

export async function createBooklet(data: InsertBooklet): Promise<Booklet> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(booklets).values(data);
  const result = await db.select().from(booklets).where(eq(booklets.slug, data.slug)).limit(1);
  return result[0]!;
}

export async function updateBooklet(id: number, data: Partial<InsertBooklet>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(booklets).set(data).where(eq(booklets.id, id));
}

export async function deleteBooklet(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(booklets).where(eq(booklets.id, id));
}

// ── Booklet Subscribers ────────────────────────────────────────────────────
export async function addSubscriber(data: InsertBookletSubscriber): Promise<BookletSubscriber> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(bookletSubscribers).values(data);
  const result = await db
    .select()
    .from(bookletSubscribers)
    .where(and(eq(bookletSubscribers.email, data.email), eq(bookletSubscribers.name, data.name)))
    .orderBy(desc(bookletSubscribers.createdAt))
    .limit(1);
  return result[0]!;
}

export async function markSubscriberSent(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(bookletSubscribers).set({ sentAt: new Date() }).where(eq(bookletSubscribers.id, id));
}

export async function getAllSubscribers() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      id: bookletSubscribers.id,
      name: bookletSubscribers.name,
      email: bookletSubscribers.email,
      bookletId: bookletSubscribers.bookletId,
      sentAt: bookletSubscribers.sentAt,
      createdAt: bookletSubscribers.createdAt,
      bookletTitle: booklets.title,
    })
    .from(bookletSubscribers)
    .leftJoin(booklets, eq(booklets.id, bookletSubscribers.bookletId))
    .orderBy(desc(bookletSubscribers.createdAt));
  return rows;
}

// ── About Page ─────────────────────────────────────────────────────────────
export async function getAboutPage(): Promise<AboutPage | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aboutPage).limit(1);
  return result[0];
}

export async function upsertAboutPage(data: Partial<InsertAboutPage>): Promise<AboutPage | undefined> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const existing = await getAboutPage();
  if (existing) {
    await db.update(aboutPage).set(data).where(eq(aboutPage.id, existing.id));
  } else {
    await db.insert(aboutPage).values(data as InsertAboutPage);
  }
  return getAboutPage();
}

// ── Admin Credentials ──────────────────────────────────────────────────────
export async function getAdminCredential(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(adminCredentials)
    .where(eq(adminCredentials.email, email))
    .limit(1);
  return result[0];
}

export async function hasAdminCredential(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select({ id: adminCredentials.id }).from(adminCredentials).limit(1);
  return result.length > 0;
}

export async function createAdminCredential(email: string, passwordHash: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(adminCredentials).values({ email, passwordHash });
}

export async function updateAdminCredential(email: string, passwordHash: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(adminCredentials)
    .set({ passwordHash })
    .where(eq(adminCredentials.email, email));
}
