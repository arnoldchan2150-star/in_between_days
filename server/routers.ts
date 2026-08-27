import { TRPCError } from "@trpc/server";
import { randomBytes } from "node:crypto";
import { SignJWT } from "jose";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { storagePut } from "./storage";
import { getStripeClient } from "./stripeShop";
import { quoteHongKongShipping } from "../shared/shipping";
import {
  addPostMedia,
  addSubscriber,
  createBooklet,
  createPost,
  deleteBooklet,
  deletePost,
  deletePostMedia,
  updatePostMedia,
  getAllBooklets,
  getAllPosts,
  getAllSubscribers,
  getAboutPage,
  getBookletById,
  getBookletBySlug,
  getPostById,
  getPostByPreviewToken,
  getPostBySlug,
  getPostMedia,
  getPostTags,
  getPostBlocks,
  savePostBlocks,
  replacePostTags,
  batchUpdatePostTags,
  getPublicBooklets,
  getPublishedPosts,
  markSubscriberSent,
  updateBooklet,
  updatePost,
  upsertAboutPage,
  insertSiteSubscriber,
  confirmSiteSubscriber,
  unsubscribeSiteSubscriber,
  getSiteSubscribers,
  getConfirmedSiteSubscribers,
  getSiteSetting,
  setSiteSetting,
  createNewsletter,
  getNewsletters,
  updateNewsletterSent,
  getAllShopProducts,
  getPublicShopProducts,
  getShopProductById,
  getShopProductBySlug,
  createShopProduct,
  updateShopProduct,
  deleteShopProduct,
  listShopProductMedia,
  addShopProductMedia,
  deleteShopProductMedia,
  reserveShopOrder,
  completeShopOrder,
  cancelShopOrder,
  updateShopOrderByCheckoutSession,
  getAllShopOrders,
  updateShopOrderStatus,
} from "./db";
import {
  adminLogin,
  changeAdminPassword,
  isAdminPasswordSet,
  setupAdminPassword,
} from "./auth";
import {
  notifyOwnerNewSubscriber,
  sendBookletToSubscriber,
  sendSiteSubscriptionConfirmation,
  sendNewsletterBroadcast,
} from "./email";

// ── Admin guard ────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.openId !== ENV.ownerOpenId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "需要管理員權限" });
  }
  return next({ ctx });
});

// ── Session cookie helper ──────────────────────────────────────────────────
async function setAdminSessionCookie(ctx: { req: any; res: any }, email: string) {
  const secret = new TextEncoder().encode(ENV.cookieSecret || process.env.JWT_SECRET || "fallback-secret");
  const token = await new SignJWT({ sub: email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
  const opts = getSessionCookieOptions(ctx.req);
  ctx.res.cookie(ADMIN_COOKIE_NAME, token, { ...opts, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

// ── Categories ─────────────────────────────────────────────────────────────
const CATEGORIES = ["南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"] as const;

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => {
      const user = opts.ctx.user;
      if (user && user.openId === ENV.ownerOpenId && user.role !== "admin") {
        return { ...user, role: "admin" as const };
      }
      return user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    // Email/password admin login
    emailLogin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const result = await adminLogin(input.email, input.password);
        if (!result.success) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: result.error });
        }
        await setAdminSessionCookie(ctx, input.email);
        return { success: true };
      }),
    isAdminPasswordSet: publicProcedure.query(() => isAdminPasswordSet()),
    setupAdminPassword: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
      .mutation(async ({ input }) => {
        const alreadySet = await isAdminPasswordSet();
        if (alreadySet) {
          throw new TRPCError({ code: "FORBIDDEN", message: "管理員密碼已設定" });
        }
        await setupAdminPassword(input.email, input.password);
        return { success: true };
      }),
    changePassword: adminProcedure
      .input(
        z.object({
          email: z.string().email(),
          oldPassword: z.string().min(1),
          newPassword: z.string().min(8),
        })
      )
      .mutation(async ({ input }) => {
        const result = await changeAdminPassword(
          input.email,
          input.oldPassword,
          input.newPassword
        );
        if (!result.success) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
        }
        return { success: true };
      }),
  }),

  // ── Categories ───────────────────────────────────────────────────────────
  categories: router({
    list: publicProcedure.query(() => CATEGORIES),
  }),

  // ── Posts ─────────────────────────────────────────────────────────────────
  posts: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional(), type: z.string().optional() }).optional())
      .query(({ input }) => getPublishedPosts(input?.category, input?.type)),
    adminList: adminProcedure.query(() => getAllPosts()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getPostBySlug(input.slug);
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        const [media, blocks, tags] = await Promise.all([
          getPostMedia(post.id),
          getPostBlocks(post.id),
          getPostTags(post.id),
        ]);
        return { ...post, media, blocks, tags: tags.map((tag) => tag.tag) };
      }),
    byPreview: publicProcedure
      .input(z.object({ token: z.string().min(32).max(128) }))
      .query(async ({ input }) => {
        const post = await getPostByPreviewToken(input.token);
        if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "預覽連結無效或已失效" });
        const [media, blocks, tags] = await Promise.all([
          getPostMedia(post.id),
          getPostBlocks(post.id),
          getPostTags(post.id),
        ]);
        const { previewToken: _previewToken, ...safePost } = post;
        return { ...safePost, media, blocks, tags: tags.map((tag) => tag.tag), isPreview: true as const };
      }),
    byId: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const post = await getPostById(input.id);
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        const [media, blocks, tags] = await Promise.all([
          getPostMedia(post.id),
          getPostBlocks(post.id),
          getPostTags(post.id),
        ]);
        return { ...post, media, blocks, tags: tags.map((tag) => tag.tag) };
      }),
    blocks: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return getPostBlocks(input.postId);
      }),
    related: publicProcedure
      .input(
        z.object({
          postId: z.number(),
          category: z.string().optional(),
          type: z.string().optional(),
          limit: z.number().optional().default(3),
        })
      )
      .query(async ({ input }) => {
        const { getRelatedPosts } = await import("./db");
        return getRelatedPosts(input.postId, input.category, input.type, input.limit);
      }),
    saveBlocks: adminProcedure
      .input(
        z.object({
          postId: z.number(),
          blocks: z.array(
            z.object({
              blockType: z.enum(["paragraph", "image", "heading", "quote", "video"]),
              content: z.string().optional().nullable(),
              caption: z.string().optional().nullable(),
              sortOrder: z.number(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        await savePostBlocks(input.postId, input.blocks);
        return { success: true };
      }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().optional(),
          content: z.string(),
          coverImageUrl: z.string().optional(),
          coverImageKey: z.string().optional(),
          category: z.enum(["南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"]),
          type: z.enum(["travel", "culture", "snow"]).default("travel"),
          published: z.boolean().default(false),
          publishedAt: z.string().optional().nullable(),
          embedUrl: z.string().optional().nullable(),
          tags: z.array(z.string().trim().min(1).max(64)).max(20).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { publishedAt, tags, ...rest } = input;
        let finalPublishedAt: Date | null = null;
        if (rest.published) {
          finalPublishedAt = publishedAt ? new Date(publishedAt) : new Date();
          if (Number.isNaN(finalPublishedAt.getTime())) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "發布日期格式無效" });
          }
        }
        const post = await createPost({
          ...rest,
          publishedAt: finalPublishedAt,
        });
        if (tags) await replacePostTags(post.id, tags);
        return { ...post, tags: tags ?? [] };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          coverImageUrl: z.string().optional().nullable(),
          coverImageKey: z.string().optional().nullable(),
          category: z.enum(["南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"]).optional(),
          type: z.enum(["travel", "culture", "snow"]).optional(),
          published: z.boolean().optional(),
          publishedAt: z.string().optional().nullable(),
          embedUrl: z.string().optional().nullable(),
          tags: z.array(z.string().trim().min(1).max(64)).max(20).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, publishedAt, tags, ...data } = input;
        const updates: Record<string, unknown> = { ...data };
        if (data.published !== undefined) {
          if (data.published) {
            if (publishedAt !== undefined) {
              updates.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
            } else {
              // keep existing or default to now if not set
              updates.publishedAt = new Date();
            }
          } else {
            updates.publishedAt = null;
          }
        } else if (publishedAt !== undefined) {
          updates.publishedAt = publishedAt ? new Date(publishedAt) : null;
        }
        await updatePost(id, updates as any);
        if (tags !== undefined) await replacePostTags(id, tags);
        return { success: true };
      }),
    createPreviewToken: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const post = await getPostById(input.id);
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        const token = randomBytes(32).toString("hex");
        await updatePost(input.id, { previewToken: token });
        return { token, slug: post.slug };
      }),
    batchUpdateTags: adminProcedure
      .input(z.object({
        postIds: z.array(z.number()).min(1).max(200),
        addTags: z.array(z.string().trim().min(1).max(64)).max(20).default([]),
        removeTags: z.array(z.string().trim().min(1).max(64)).max(20).default([]),
      }))
      .mutation(async ({ input }) => {
        await batchUpdatePostTags(input.postIds, input.addTags, input.removeTags);
        return { success: true, updatedCount: input.postIds.length };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePost(input.id);
        return { success: true };
      }),
    uploadMedia: adminProcedure
      .input(
        z.object({
          postId: z.number(),
          filename: z.string(),
          contentType: z.string(),
          dataBase64: z.string(),
          caption: z.string().optional(),
          sortOrder: z.number().optional(),
          mediaType: z.enum(["image", "video"]).default("image"),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        const key = `posts/${input.postId}/${Date.now()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        await addPostMedia({
          postId: input.postId,
          url,
          storageKey: key,
          caption: input.caption,
          sortOrder: input.sortOrder ?? 0,
          mediaType: input.mediaType,
        });
        return { url, key };
      }),
    deleteMedia: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePostMedia(input.id);
        return { success: true };
      }),
    updateMedia: adminProcedure
      .input(
        z.object({
          id: z.number(),
          caption: z.string().optional().nullable(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updatePostMedia(id, data as any);
        return { success: true };
      }),
    uploadCover: adminProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          dataBase64: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        const key = `covers/${Date.now()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url, key };
      }),
  }),

  // ── Booklets ──────────────────────────────────────────────────────────────
  booklets: router({
    publicList: publicProcedure.query(() => getPublicBooklets()),
    adminList: adminProcedure.query(() => getAllBooklets()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const b = await getBookletBySlug(input.slug);
        if (!b) throw new TRPCError({ code: "NOT_FOUND" });
        return b;
      }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().optional(),
          coverUrl: z.string().optional(),
          fileUrl: z.string(),
          fileKey: z.string(),
          embedUrl: z.string().optional().nullable(),
          active: z.boolean().default(true),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => createBooklet(input)),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional().nullable(),
          coverUrl: z.string().optional().nullable(),
          fileUrl: z.string().optional(),
          fileKey: z.string().optional(),
          active: z.boolean().optional(),
          sortOrder: z.number().optional(),
          embedUrl: z.string().optional().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateBooklet(id, data as any);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBooklet(input.id);
        return { success: true };
      }),
    uploadFile: adminProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          dataBase64: z.string(),
          type: z.enum(["pdf", "cover"]),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        const key = `booklets/${input.type}/${Date.now()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url, key };
      }),
    subscribe: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          bookletSlug: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        let bookletId: number | undefined;
        let booklet = null;
        if (input.bookletSlug) {
          booklet = await getBookletBySlug(input.bookletSlug);
          bookletId = booklet?.id;
        } else {
          const list = await getPublicBooklets();
          booklet = list[0];
          bookletId = booklet?.id;
        }
        const subscriber = await addSubscriber({
          name: input.name,
          email: input.email,
          bookletId: bookletId ?? null,
        });
        // Send booklet PDF to subscriber
        if (booklet?.fileUrl) {
          await sendBookletToSubscriber({
            subscriberName: input.name,
            subscriberEmail: input.email,
            bookletTitle: booklet.title,
            bookletFileUrl: booklet.fileUrl,
          });
          await markSubscriberSent(subscriber.id);
        }
        // Notify owner
        if (booklet) {
          await notifyOwnerNewSubscriber({
            subscriberName: input.name,
            subscriberEmail: input.email,
            bookletTitle: booklet.title,
            ownerEmail: "hello@inbetweendays.com",
          });
        }
        return { success: true };
      }),
  }),

  // ── Shop Products ─────────────────────────────────────────────────────────
  shop: router({
    publicList: publicProcedure.query(async () => {
      const products = await getPublicShopProducts();
      return Promise.all(products.map(async (product) => ({
        ...product,
        media: await listShopProductMedia(product.id),
      })));
    }),
    createCheckout: publicProcedure
      .input(z.object({
        customerName: z.string().trim().min(1).max(128),
        customerEmail: z.string().trim().email().max(320),
        items: z.array(z.object({
          productId: z.number().int().positive(),
          quantity: z.number().int().positive().max(10),
        })).min(1).max(20),
      }))
      .mutation(async ({ input, ctx }) => {
        const normalizedEmail = input.customerEmail.trim().toLowerCase();
        const pendingSessionId = `pending_${randomBytes(24).toString("hex")}`;
        let reserved = false;
        try {
          const order = await reserveShopOrder({
            customerName: input.customerName.trim(),
            customerEmail: normalizedEmail,
            stripeCheckoutSessionId: pendingSessionId,
            items: input.items,
          });
          reserved = true;
          const products = await Promise.all(input.items.map((item) => getShopProductById(item.productId)));
          if (products.some((product) => !product || !product.active)) throw new Error("商品資料已更新，請重新整理後再試");
          const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get("host")}`;
          const subtotalMinor = input.items.reduce((sum, item, index) => sum + (products[index]?.priceMinor ?? 0) * item.quantity, 0);
          const shippingWeightGrams = input.items.reduce((sum, item, index) => sum + (products[index]?.weightGrams ?? 0) * item.quantity, 0);
          const shippingClass = products[0]?.shippingClass ?? "G";
          if (products.some((product) => product && product.shippingClass !== shippingClass)) {
            throw new Error("目前同一張訂單需要使用相同的香港寄件類別");
          }
          const shippingQuote = quoteHongKongShipping({ subtotalMinor, weightGrams: shippingWeightGrams, shippingClass });
          if (shippingQuote.status === "unavailable") throw new Error(shippingQuote.label);
          const stripe = getStripeClient();
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
              ...input.items.map((item, index) => {
              const product = products[index]!;
              return {
                quantity: item.quantity,
                price_data: {
                  currency: "hkd",
                  unit_amount: product.priceMinor,
                  product_data: {
                    name: product.title,
                    description: product.description.slice(0, 500),
                  },
                },
              };
            }),
              ...(shippingQuote.feeMinor > 0 ? [{
                quantity: 1,
                price_data: {
                  currency: "hkd" as const,
                  unit_amount: shippingQuote.feeMinor,
                  product_data: {
                    name: "香港配送費（G 大型信件／包裹）",
                    description: `按包裹總重量 ${shippingWeightGrams}g 計算`,
                  },
                },
              }] : []),
            ],
            shipping_address_collection: { allowed_countries: ["HK"] },
            customer_email: normalizedEmail,
            client_reference_id: `order-${order.id}`,
            metadata: {
              order_id: String(order.id),
              customer_email: normalizedEmail,
              customer_name: input.customerName.trim(),
              shipping_region: "HK",
              shipping_fee_minor: String(shippingQuote.feeMinor),
              shipping_weight_grams: String(shippingWeightGrams),
            },
            allow_promotion_codes: true,
            success_url: `${origin}/selection?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/selection?payment=cancelled`,
          });
          await updateShopOrderByCheckoutSession(pendingSessionId, { stripeCheckoutSessionId: session.id });
          return { url: session.url };
        } catch (error) {
          if (reserved) {
            await cancelShopOrder(pendingSessionId).catch(() => undefined);
          }
          const message = error instanceof Error ? error.message : "付款頁暫時無法建立，請稍後再試";
          throw new TRPCError({ code: "BAD_REQUEST", message });
        }
      }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => {
        const product = await getShopProductBySlug(input.slug);
        if (!product || !product.active) throw new TRPCError({ code: "NOT_FOUND" });
        return { ...product, media: await listShopProductMedia(product.id) };
      }),
    adminOrders: adminProcedure.query(() => getAllShopOrders()),
    updateOrderStatus: adminProcedure
      .input(z.object({
        id: z.number().int().positive(),
        fulfillmentStatus: z.enum(["pending", "processing", "shipped", "fulfilled", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await updateShopOrderStatus(input.id, input.fulfillmentStatus);
        return { success: true };
      }),
    adminList: adminProcedure.query(async () => {
      const products = await getAllShopProducts();
      return Promise.all(products.map(async (product) => ({
        ...product,
        media: await listShopProductMedia(product.id),
      })));
    }),
    byId: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const product = await getShopProductById(input.id);
        if (!product) throw new TRPCError({ code: "NOT_FOUND" });
        return { ...product, media: await listShopProductMedia(product.id) };
      }),
    create: adminProcedure
      .input(z.object({
        title: z.string().trim().min(1).max(255),
        slug: z.string().trim().min(1).max(160),
        description: z.string().trim().min(1),
        category: z.enum(["自製物件", "旅途小物"]),
        shippingClass: z.enum(["P", "G", "E"]).default("G"),
        weightGrams: z.number().int().nonnegative().default(0),
        priceMinor: z.number().int().nonnegative(),
        currency: z.literal("HKD").default("HKD"),
        inventoryQuantity: z.number().int().nonnegative().default(0),
        coverUrl: z.string().url().optional().nullable(),
        coverKey: z.string().optional().nullable(),
        active: z.boolean().default(false),
        sortOrder: z.number().int().default(0),
      }))
      .mutation(async ({ input }) => createShopProduct(input)),
    update: adminProcedure
      .input(z.object({
        id: z.number().int().positive(),
        title: z.string().trim().min(1).max(255).optional(),
        slug: z.string().trim().min(1).max(160).optional(),
        description: z.string().trim().min(1).optional(),
        category: z.enum(["自製物件", "旅途小物"]).optional(),
        shippingClass: z.enum(["P", "G", "E"]).optional(),
        weightGrams: z.number().int().nonnegative().optional(),
        priceMinor: z.number().int().nonnegative().optional(),
        currency: z.literal("HKD").optional(),
        inventoryQuantity: z.number().int().nonnegative().optional(),
        coverUrl: z.string().url().optional().nullable(),
        coverKey: z.string().optional().nullable(),
        active: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateShopProduct(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await deleteShopProduct(input.id);
        return { success: true };
      }),
    uploadCover: adminProcedure
      .input(z.object({ filename: z.string(), contentType: z.string(), dataBase64: z.string() }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        const key = `shop/products/${Date.now()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url, key };
      }),
    addMedia: adminProcedure
      .input(z.object({ productId: z.number().int().positive(), url: z.string().url(), storageKey: z.string(), caption: z.string().optional().nullable(), sortOrder: z.number().int().default(0) }))
      .mutation(async ({ input }) => {
        await addShopProductMedia(input);
        return { success: true };
      }),
    deleteMedia: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await deleteShopProductMedia(input.id);
        return { success: true };
      }),
  }),

  // ── Subscribers & Newsletters ─────────────────────────────────────────────
  subscribers: router({
    list: adminProcedure.query(() => getAllSubscribers()),
    siteList: adminProcedure.query(() => getSiteSubscribers()),
    siteSubscribe: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(1).max(128),
          email: z.string().trim().email().max(320),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const email = input.email.trim().toLowerCase();
        const origin = ctx.req.headers.origin || "https://" + ctx.req.headers.host;
        try {
          const res = await insertSiteSubscriber({ name: input.name.trim(), email });
          if (res.confirmationToken) {
            const confirmUrl = `${origin}/api/newsletter/confirm?token=${res.confirmationToken}`;
            await sendSiteSubscriptionConfirmation({
              subscriberName: input.name.trim(),
              subscriberEmail: email,
              confirmUrl,
            });
          }
          return { success: true, reactivated: res.reactivated };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          throw new TRPCError({ code: "BAD_REQUEST", message });
        }
      }),
    confirm: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const ok = await confirmSiteSubscriber(input.token);
        return { success: ok };
      }),
    unsubscribe: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const ok = await unsubscribeSiteSubscriber(input.token);
        return { success: ok };
      }),
    getSettings: adminProcedure.query(async () => {
      const frequency = await getSiteSetting("newsletter_frequency", "monthly");
      return { frequency };
    }),
    updateSettings: adminProcedure
      .input(z.object({ frequency: z.enum(["monthly", "per_post"]) }))
      .mutation(async ({ input }) => {
        await setSiteSetting("newsletter_frequency", input.frequency);
        return { success: true };
      }),
    listNewsletters: adminProcedure.query(() => getNewsletters()),
    createAndSendNewsletter: adminProcedure
      .input(z.object({ subject: z.string().min(1), content: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const newsletterId = await createNewsletter({ subject: input.subject, content: input.content });
        const confirmedSubs = await getConfirmedSiteSubscribers();
        const origin = ctx.req.headers.origin || "https://" + ctx.req.headers.host;
        let count = 0;
        for (const sub of confirmedSubs) {
          const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken}`;
          const sent = await sendNewsletterBroadcast({
            subscriberEmail: sub.email,
            subscriberName: sub.name,
            subject: input.subject,
            contentHtml: input.content,
            unsubscribeUrl,
          });
          if (sent) count++;
        }
        await updateNewsletterSent(newsletterId, count);
        return { success: true, recipientCount: count };
      }),
  }),

  // ── About ─────────────────────────────────────────────────────────────────
  about: router({
    get: publicProcedure.query(() => getAboutPage()),
    update: adminProcedure
      .input(
        z.object({
          philosophy: z.string().optional(),
          blogOrigin: z.string().optional(),
          countriesVisited: z.string().optional(),
          photoUrl: z.string().optional().nullable(),
          photoKey: z.string().optional().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertAboutPage(input);
        return { success: true };
      }),
    uploadPhoto: adminProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          dataBase64: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        const key = `about/${Date.now()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url, key };
      }),
  }),
});

export type AppRouter = typeof appRouter;
