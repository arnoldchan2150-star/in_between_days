import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("posts router", () => {
  it("public user cannot access adminList", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.posts.adminList()).rejects.toThrow();
  });

  it("non-admin user cannot access adminList", async () => {
    const ctx = createPublicContext();
    ctx.user = {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.posts.adminList()).rejects.toThrow();
  });
});

describe("booklets router", () => {
  it("public user cannot access booklets.all", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.booklets.all()).rejects.toThrow();
  });

  it("subscribe validates email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.booklets.subscribe({ name: "Test", email: "not-an-email" })
    ).rejects.toThrow();
  });
});

describe("auth router", () => {
  it("me returns null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});


describe("post media upload", () => {
  it("validates image and video media types", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.posts.uploadMedia({
        postId: 1,
        filename: "clip.mp4",
        contentType: "video/mp4",
        dataBase64: "AA==",
        mediaType: "audio" as never,
      })
    ).rejects.toThrow();
  });
});


describe("site subscribers router", () => {
  it("validates email format", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.subscribers.siteSubscribe({ name: "Test", email: "not-an-email" })
    ).rejects.toThrow();
  });

  it("rejects an empty subscriber name", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.subscribers.siteSubscribe({ name: "   ", email: "reader@example.com" })
    ).rejects.toThrow();
  });
});


describe("post workflow router", () => {
  it("does not allow unauthenticated users to create preview tokens", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.posts.createPreviewToken({ id: 1 })).rejects.toThrow();
  });

  it("does not allow unauthenticated users to batch update tags", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.posts.batchUpdateTags({ postIds: [1], addTags: ["旅遊"], removeTags: [] })
    ).rejects.toThrow();
  });
});

describe("post blocks router", () => {
  it("rejects unsupported block types before touching the database", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.posts.saveBlocks({
        postId: 1,
        blocks: [
          {
            blockType: "gallery" as never,
            content: "https://example.com/photo.jpg",
            caption: null,
            sortOrder: 0,
          },
        ],
      })
    ).rejects.toThrow();
  });

  it("does not allow unauthenticated users to save blocks", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.posts.saveBlocks({
        postId: 1,
        blocks: [],
      })
    ).rejects.toThrow();
  });
});
