import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse as parseCookieHeader } from "cookie";
import { jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import { ADMIN_COOKIE_NAME } from "@shared/const";
import { getJwtSecret } from "./env";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/** Try to authenticate via our custom admin JWT (email/password login) */
async function tryAdminJwt(cookieHeader: string | undefined): Promise<User | null> {
  if (!cookieHeader) return null;
  const cookies = parseCookieHeader(cookieHeader);
  const token = cookies[ADMIN_COOKIE_NAME];
  if (!token) return null;

  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

    // Admin JWT has { sub: email, role: "admin" }
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
  // Only the site's own email/password admin session is supported.
  const user: User | null = await tryAdminJwt(opts.req.headers.cookie);

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
