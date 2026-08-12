import { TRPCError } from "@trpc/server";
import { SignJWT } from "jose";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { storagePut } from "./storage";
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
  getPostBySlug,
  getPostMedia,
  getPostBlocks,
  savePostBlocks,
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
  if (ctx.user.role !== "admin") {
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
  ctx.res.cookie(COOKIE_NAME, token, { ...opts, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

// ── Categories ─────────────────────────────────────────────────────────────
const CATEGORIES = ["南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"] as const;

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
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
        const media = await getPostMedia(post.id);
        const blocks = await getPostBlocks(post.id);
        return { ...post, media, blocks };
      }),
    byId: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const post = await getPostById(input.id);
        if (!post) throw new TRPCError({ code: "NOT_FOUND" });
        const media = await getPostMedia(post.id);
        const blocks = await getPostBlocks(post.id);
        return { ...post, media, blocks };
      }),
    blocks: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return getPostBlocks(input.postId);
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
          embedUrl: z.string().optional().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        return createPost({
          ...input,
          publishedAt: input.published ? new Date() : null,
        });
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
          embedUrl: z.string().optional().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updates: Record<string, unknown> = { ...data };
        if (data.published !== undefined) {
          updates.publishedAt = data.published ? new Date() : null;
        }
        await updatePost(id, updates as any);
        return { success: true };
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
