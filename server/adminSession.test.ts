import { SignJWT } from "jose";
import { describe, expect, it, beforeEach } from "vitest";
import { ADMIN_COOKIE_NAME } from "../shared/const";
import { createContext } from "./_core/context";

const TEST_SECRET = "admin-session-test-secret";

describe("admin session precedence", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  it("recognizes the separate admin cookie even when an OAuth cookie is also present", async () => {
    const token = await new SignJWT({ sub: "admin@example.com", role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(TEST_SECRET));

    const context = await createContext({
      req: {
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${token}; app_session_id=oauth-session-placeholder`,
        },
      },
      res: {},
    } as Parameters<typeof createContext>[0]);

    expect(context.user?.role).toBe("admin");
    expect(context.user?.email).toBe("admin@example.com");
  });
});
