import { drizzle } from "drizzle-orm/mysql2";
import { and, asc, desc, eq, inArray, isNull, lte, or, sql } from "drizzle-orm";
import {
  AboutPage,
  Booklet,
  BookletSubscriber,
  InsertAboutPage,
  InsertBooklet,
  InsertBookletSubscriber,
  InsertPost,
  InsertPostMedia,
  InsertPostBlock,
  PostBlock,
  PostTag,
  InsertSiteSubscriber,
  InsertUser,
  Post,
  PostMedia,
  ShopProduct,
  InsertShopProduct,
  ShopProductMedia,
  InsertShopProductMedia,
  ShopOrder,
  InsertShopOrder,
  ShopOrderItem,
  InsertShopOrderItem,
  aboutPage,
  adminCredentials,
  bookletSubscribers,
  booklets,
  postMedia,
  postBlocks,
  postTags,
  posts,
  siteSubscribers,
  siteNewsletters,
  siteSettings,
  users,
  shopProducts,
  shopProductMedia,
  shopOrders,
  shopOrderItems,
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
export async function getAllPosts() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(posts).orderBy(desc(posts.publishedAt), desc(posts.createdAt));
  if (rows.length === 0) return rows.map((post) => ({ ...post, tags: [] as string[] }));
  const tagRows = await db
    .select({ postId: postTags.postId, tag: postTags.tag })
    .from(postTags)
    .where(inArray(postTags.postId, rows.map((post) => post.id)));
  const tagsByPost = new Map<number, string[]>();
  for (const row of tagRows) {
    const tags = tagsByPost.get(row.postId) ?? [];
    tags.push(row.tag);
    tagsByPost.set(row.postId, tags);
  }
  return rows.map((post) => ({ ...post, tags: tagsByPost.get(post.id) ?? [] }));
}

export async function getPublishedPosts(category?: string, type?: string): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  const conditions = [
    eq(posts.published, true),
    or(isNull(posts.publishedAt), lte(posts.publishedAt, new Date())),
  ];
  if (category) conditions.push(eq(posts.category, category as Post["category"]));
  if (type) conditions.push(eq(posts.type, type as Post["type"]));
  return db
    .select()
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));
}

export async function getRelatedPosts(postId: number, category?: string, type?: string, limit: number = 3): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  // 取得所有已發布但非當前文章
  const allPublished = await db
    .select()
    .from(posts)
    .where(and(
      eq(posts.published, true),
      or(isNull(posts.publishedAt), lte(posts.publishedAt, new Date())),
      sql`${posts.id} <> ${postId}`
    ))
    .orderBy(desc(posts.publishedAt));

  // 優先挑選同分類或同類型的文章
  const sameCategory = allPublished.filter(p => p.category === category || p.type === type);
  const others = allPublished.filter(p => p.category !== category && p.type !== type);
  
  const combined = [...sameCategory, ...others];
  return combined.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(posts)
    .where(and(
      eq(posts.slug, slug),
      eq(posts.published, true),
      or(isNull(posts.publishedAt), lte(posts.publishedAt, new Date()))
    ))
    .limit(1);
  return result[0];
}

export async function getPostByPreviewToken(token: string): Promise<Post | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.previewToken, token)).limit(1);
  return result[0];
}

export async function getPostTags(postId: number): Promise<PostTag[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(postTags).where(eq(postTags.postId, postId)).orderBy(asc(postTags.tag));
}

function normalizeTags(tags: string[]) {
  return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))).slice(0, 20);
}

export async function replacePostTags(postId: number, tags: string[]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const normalized = normalizeTags(tags);
  await db.transaction(async (tx) => {
    await tx.delete(postTags).where(eq(postTags.postId, postId));
    if (normalized.length > 0) {
      await tx.insert(postTags).values(normalized.map((tag) => ({ postId, tag })));
    }
  });
}

export async function batchUpdatePostTags(postIds: number[], addTags: string[], removeTags: string[]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const ids = Array.from(new Set(postIds));
  const adds = normalizeTags(addTags);
  const removes = normalizeTags(removeTags);
  if (ids.length === 0) return;
  await db.transaction(async (tx) => {
    if (removes.length > 0) {
      await tx.delete(postTags).where(and(inArray(postTags.postId, ids), inArray(postTags.tag, removes)));
    }
    if (adds.length > 0) {
      const existing = await tx
        .select({ postId: postTags.postId, tag: postTags.tag })
        .from(postTags)
        .where(inArray(postTags.postId, ids));
      const existingKeys = new Set(existing.map((row) => `${row.postId}:${row.tag}`));
      const values = ids.flatMap((postId) =>
        adds
          .filter((tag) => !existingKeys.has(`${postId}:${tag}`))
          .map((tag) => ({ postId, tag }))
      );
      if (values.length > 0) await tx.insert(postTags).values(values);
    }
  });
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
  await db.delete(postBlocks).where(eq(postBlocks.postId, id));
  await db.delete(posts).where(eq(posts.id, id));
}

// ── Post Media ─────────────────────────────────────────────────────────────
export async function getPostMedia(postId: number): Promise<PostMedia[]> {
  const db = await getDb();
  if (!db) return [];
  return db
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

export async function updatePostMedia(id: number, data: Partial<InsertPostMedia>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(postMedia).set(data).where(eq(postMedia.id, id));
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

// ── Site Update Subscribers & Newsletters ──────────────────────────────────
export async function insertSiteSubscriber(data: { name: string; email: string }) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");

  const [existing] = await db.select().from(siteSubscribers).where(eq(siteSubscribers.email, data.email)).limit(1);
  const confirmationToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const unsubscribeToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  if (existing) {
    if (existing.unsubscribedAt || !existing.confirmed) {
      await db.update(siteSubscribers)
        .set({
          unsubscribedAt: null,
          name: data.name,
          confirmed: false,
          confirmationToken,
          unsubscribeToken,
        })
        .where(eq(siteSubscribers.id, existing.id));
      return { id: existing.id, confirmationToken, reactivated: true };
    }
    throw new Error("此 Email 已經訂閱過網站更新通知。");
  }

  const [result] = await db.insert(siteSubscribers).values({
    name: data.name,
    email: data.email,
    confirmed: false,
    confirmationToken,
    unsubscribeToken,
  });
  return { id: result.insertId, confirmationToken, reactivated: false };
}

export async function confirmSiteSubscriber(token: string) {
  const db = await getDb();
  if (!db) return false;
  const [sub] = await db.select().from(siteSubscribers).where(eq(siteSubscribers.confirmationToken, token)).limit(1);
  if (!sub) return false;
  await db.update(siteSubscribers)
    .set({ confirmed: true, confirmationToken: null })
    .where(eq(siteSubscribers.id, sub.id));
  return true;
}

export async function unsubscribeSiteSubscriber(token: string) {
  const db = await getDb();
  if (!db) return false;
  const [sub] = await db.select().from(siteSubscribers).where(eq(siteSubscribers.unsubscribeToken, token)).limit(1);
  if (!sub) return false;
  await db.update(siteSubscribers)
    .set({ unsubscribedAt: new Date() })
    .where(eq(siteSubscribers.id, sub.id));
  return true;
}

export async function getSiteSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSubscribers).orderBy(desc(siteSubscribers.createdAt));
}

export async function getConfirmedSiteSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSubscribers)
    .where(and(eq(siteSubscribers.confirmed, true), isNull(siteSubscribers.unsubscribedAt)));
}

export async function getSiteSetting(key: string, defaultValue: string) {
  const db = await getDb();
  if (!db) return defaultValue;
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key)).limit(1);
  return row ? row.settingValue : defaultValue;
}

export async function setSiteSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key)).limit(1);
  if (row) {
    await db.update(siteSettings).set({ settingValue: value }).where(eq(siteSettings.settingKey, key));
  } else {
    await db.insert(siteSettings).values({ settingKey: key, settingValue: value });
  }
}

export async function createNewsletter(data: { subject: string; content: string }) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const [result] = await db.insert(siteNewsletters).values(data);
  return result.insertId;
}

export async function getNewsletters() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteNewsletters).orderBy(desc(siteNewsletters.createdAt));
}

export async function updateNewsletterSent(id: number, recipientCount: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(siteNewsletters)
    .set({ sentAt: new Date(), recipientCount })
    .where(eq(siteNewsletters.id, id));
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


// ── Post Blocks (Medium-style editor) ────────────────────────────────────────
export async function getPostBlocks(postId: number): Promise<PostBlock[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(postBlocks).where(eq(postBlocks.postId, postId)).orderBy(asc(postBlocks.sortOrder));
}

export async function savePostBlocks(postId: number, blocks: Array<{ blockType: string; content?: string | null; caption?: string | null; sortOrder: number }>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");

  await db.transaction(async (tx) => {
    await tx.delete(postBlocks).where(eq(postBlocks.postId, postId));
    if (!blocks || blocks.length === 0) return;

    for (const block of blocks) {
      await tx.insert(postBlocks).values({
        postId,
        blockType: block.blockType,
        content: block.content || null,
        caption: block.caption || null,
        sortOrder: block.sortOrder,
      });
    }
  });
}

// ── Shop Products ───────────────────────────────────────────────────────────
export async function getAllShopProducts(): Promise<ShopProduct[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shopProducts).orderBy(asc(shopProducts.sortOrder), desc(shopProducts.createdAt));
}

export async function getPublicShopProducts(): Promise<ShopProduct[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(shopProducts)
    .where(and(eq(shopProducts.active, true), sql`${shopProducts.inventoryQuantity} - ${shopProducts.reservedQuantity} > 0`))
    .orderBy(asc(shopProducts.sortOrder), desc(shopProducts.createdAt));
}

export async function getShopProductById(id: number): Promise<ShopProduct | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shopProducts).where(eq(shopProducts.id, id)).limit(1);
  return result[0];
}

export async function getShopProductBySlug(slug: string): Promise<ShopProduct | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shopProducts).where(eq(shopProducts.slug, slug)).limit(1);
  return result[0];
}

export async function createShopProduct(data: InsertShopProduct): Promise<ShopProduct> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(shopProducts).values(data);
  const result = await db.select().from(shopProducts).where(eq(shopProducts.slug, data.slug)).limit(1);
  return result[0]!;
}

export async function updateShopProduct(id: number, data: Partial<InsertShopProduct>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(shopProducts).set(data).where(eq(shopProducts.id, id));
}

export async function deleteShopProduct(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(shopProductMedia).where(eq(shopProductMedia.productId, id));
  await db.delete(shopProducts).where(eq(shopProducts.id, id));
}

export async function listShopProductMedia(productId: number): Promise<ShopProductMedia[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shopProductMedia).where(eq(shopProductMedia.productId, productId)).orderBy(asc(shopProductMedia.sortOrder));
}

export async function addShopProductMedia(data: InsertShopProductMedia): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(shopProductMedia).values(data);
}

export async function deleteShopProductMedia(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(shopProductMedia).where(eq(shopProductMedia.id, id));
}

export async function createShopOrder(data: InsertShopOrder, items: InsertShopOrderItem[]): Promise<ShopOrder> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.transaction(async (tx) => {
    await tx.insert(shopOrders).values(data);
    const [order] = await tx.select().from(shopOrders).where(eq(shopOrders.stripeCheckoutSessionId, data.stripeCheckoutSessionId)).limit(1);
    if (!order) throw new Error("Order creation failed");
    if (items.length > 0) await tx.insert(shopOrderItems).values(items.map((item) => ({ ...item, orderId: order.id })));
    return order;
  });
}

export async function updateShopOrderByCheckoutSession(
  stripeCheckoutSessionId: string,
  data: Partial<InsertShopOrder>,
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(shopOrders).set(data).where(eq(shopOrders.stripeCheckoutSessionId, stripeCheckoutSessionId));
}

export type ShopOrderLineInput = {
  productId: number;
  quantity: number;
};

export async function reserveShopOrder(data: {
  customerName?: string | null;
  customerEmail: string;
  stripeCheckoutSessionId: string;
  items: ShopOrderLineInput[];
}): Promise<ShopOrder> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.transaction(async (tx) => {
    const productIds = Array.from(new Set(data.items.map((item) => item.productId)));
    const products = await tx.select().from(shopProducts).where(inArray(shopProducts.id, productIds));
    const productById = new Map(products.map((product) => [product.id, product]));
    const orderItems: InsertShopOrderItem[] = [];

    for (const item of data.items) {
      const product = productById.get(item.productId);
      if (!product || !product.active) throw new Error("商品目前未能購買");
      if (product.inventoryQuantity - product.reservedQuantity < item.quantity) {
        throw new Error(`「${product.title}」庫存不足`);
      }

      await tx
        .update(shopProducts)
        .set({ reservedQuantity: sql`${shopProducts.reservedQuantity} + ${item.quantity}` })
        .where(and(
          eq(shopProducts.id, item.productId),
          eq(shopProducts.active, true),
          sql`${shopProducts.inventoryQuantity} - ${shopProducts.reservedQuantity} >= ${item.quantity}`,
        ));
      const [updated] = await tx.select().from(shopProducts).where(eq(shopProducts.id, item.productId)).limit(1);
      if (!updated || updated.reservedQuantity < product.reservedQuantity + item.quantity) {
        throw new Error(`「${product.title}」庫存剛被其他訂單預留，請重新整理後再試`);
      }
      productById.set(product.id, updated);
      orderItems.push({
        orderId: 0,
        productId: product.id,
        productTitle: product.title,
        stripePriceId: product.stripePriceId ?? null,
        quantity: item.quantity,
      });
    }

    await tx.insert(shopOrders).values({
      customerName: data.customerName ?? null,
      customerEmail: data.customerEmail,
      stripeCheckoutSessionId: data.stripeCheckoutSessionId,
      fulfillmentStatus: "pending",
    });
    const [order] = await tx.select().from(shopOrders).where(eq(shopOrders.stripeCheckoutSessionId, data.stripeCheckoutSessionId)).limit(1);
    if (!order) throw new Error("訂單建立失敗");
    if (orderItems.length > 0) {
      await tx.insert(shopOrderItems).values(orderItems.map((item) => ({ ...item, orderId: order.id })));
    }
    return order;
  });
}

export async function completeShopOrder(stripeCheckoutSessionId: string, stripePaymentIntentId?: string | null): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(shopOrders).where(eq(shopOrders.stripeCheckoutSessionId, stripeCheckoutSessionId)).limit(1);
    if (!order || order.fulfillmentStatus === "cancelled" || order.fulfillmentStatus === "fulfilled" || order.fulfillmentStatus === "processing") return;
    const items = await tx.select().from(shopOrderItems).where(eq(shopOrderItems.orderId, order.id));
    for (const item of items) {
      await tx
        .update(shopProducts)
        .set({
          inventoryQuantity: sql`${shopProducts.inventoryQuantity} - ${item.quantity}`,
          reservedQuantity: sql`${shopProducts.reservedQuantity} - ${item.quantity}`,
        })
        .where(and(
          eq(shopProducts.id, item.productId),
          sql`${shopProducts.inventoryQuantity} >= ${item.quantity}`,
          sql`${shopProducts.reservedQuantity} >= ${item.quantity}`,
        ));
      const [product] = await tx.select().from(shopProducts).where(eq(shopProducts.id, item.productId)).limit(1);
      if (!product || product.inventoryQuantity < 0 || product.reservedQuantity < 0) {
        throw new Error("庫存同步失敗");
      }
    }
    await tx.update(shopOrders).set({
      stripePaymentIntentId: stripePaymentIntentId ?? order.stripePaymentIntentId,
      fulfillmentStatus: "processing",
    }).where(eq(shopOrders.id, order.id));
  });
}

export async function cancelShopOrder(stripeCheckoutSessionId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(shopOrders).where(eq(shopOrders.stripeCheckoutSessionId, stripeCheckoutSessionId)).limit(1);
    if (!order || order.fulfillmentStatus !== "pending") return;
    const items = await tx.select().from(shopOrderItems).where(eq(shopOrderItems.orderId, order.id));
    for (const item of items) {
      await tx.update(shopProducts).set({ reservedQuantity: sql`GREATEST(${shopProducts.reservedQuantity} - ${item.quantity}, 0)` }).where(eq(shopProducts.id, item.productId));
    }
    await tx.update(shopOrders).set({ fulfillmentStatus: "cancelled" }).where(eq(shopOrders.id, order.id));
  });
}

export async function getAllShopOrders() {
  const db = await getDb();
  if (!db) return [];
  const orders = await db.select().from(shopOrders).orderBy(desc(shopOrders.createdAt));
  return Promise.all(orders.map(async (order) => ({
    ...order,
    items: await db.select().from(shopOrderItems).where(eq(shopOrderItems.orderId, order.id)).orderBy(asc(shopOrderItems.id)),
  })));
}

export async function updateShopOrderStatus(
  id: number,
  fulfillmentStatus: "pending" | "processing" | "shipped" | "fulfilled" | "cancelled",
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(shopOrders).where(eq(shopOrders.id, id)).limit(1);
    if (!order) throw new Error("找不到訂單");
    if (fulfillmentStatus === "cancelled" && order.fulfillmentStatus === "pending") {
      const items = await tx.select().from(shopOrderItems).where(eq(shopOrderItems.orderId, id));
      for (const item of items) {
        await tx.update(shopProducts).set({ reservedQuantity: sql`GREATEST(${shopProducts.reservedQuantity} - ${item.quantity}, 0)` }).where(eq(shopProducts.id, item.productId));
      }
    }
    await tx.update(shopOrders).set({ fulfillmentStatus }).where(eq(shopOrders.id, id));
  });
}
