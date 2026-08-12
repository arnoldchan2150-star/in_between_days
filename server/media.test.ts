import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    url: "/manus-storage/posts/1/clip.mp4",
    key: "posts/1/clip.mp4",
  }),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    addPostMedia: vi.fn().mockResolvedValue(undefined),
  };
});

import { appRouter } from "./routers";
import { addPostMedia } from "./db";
import { storagePut } from "./storage";

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

describe("video media upload", () => {
  it("stores a video media item with mediaType=video", async () => {
    const caller = appRouter.createCaller(createAdminContext());

    const result = await caller.posts.uploadMedia({
      postId: 1,
      filename: "clip.mp4",
      contentType: "video/mp4",
      dataBase64: "AA==",
      mediaType: "video",
    });

    expect(result.url).toBe("/manus-storage/posts/1/clip.mp4");
    expect(storagePut).toHaveBeenCalledWith(
      expect.stringContaining("clip.mp4"),
      Buffer.from("AA==", "base64"),
      "video/mp4"
    );
    expect(addPostMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        postId: 1,
        mediaType: "video",
        url: "/manus-storage/posts/1/clip.mp4",
      })
    );
  });
});
