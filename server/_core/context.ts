import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse as parseCookieHeader } from "cookie";
import { jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { COOKIE_NAME } from "@shared/const";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/** Try to authenticate via our custom admin JWT (email/password login) */
async function tryAdminJwt(cookieHeader: string | undefined): Promise<User | null> {
  if (!cookieHeader) return null;
  const cookies = parseCookieHeader(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || process.env.COOKIE_SECRET || "fallback-secret"
    );
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

    // Admin JWT has { sub: email, role: "admin" } — Manus OAuth JWT has { openId, appId, name }
    if (payload.role !== "admin" || !payload.sub) return null;

    // Build a synthetic User object so adminProcedure can recognise this session
    const now = new Date();
    return {
      id: -999,
      openId: `admin:${payload.sub}`,
      name: "Admin",
      email: payload.sub as string,
      loginMethod: "email",
      role: "admin",
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    } satisfies User;
  } catch {
    return null;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // 1. Try Manus OAuth session first
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch {
    user = null;
  }

  // 2. If Manus OAuth failed, try custom admin JWT
  if (!user) {
    user = await tryAdminJwt(opts.req.headers.cookie);
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
