import { describe, expect, it, vi, beforeEach } from "vitest";
import { hashPassword, verifyPassword, getCredentialByEmail, hasAnyCredential, upsertCredential } from "./auth";

// ── Unit tests for password utilities ─────────────────────────────────────
describe("password utilities", () => {
  it("hashes and verifies a password correctly", async () => {
    const plain = "MySecurePass123";
    const hash = await hashPassword(plain);
    expect(hash).not.toBe(plain);
    expect(await verifyPassword(plain, hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("correct-horse");
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("produces different hashes for the same password (salt)", async () => {
    const h1 = await hashPassword("same");
    const h2 = await hashPassword("same");
    expect(h1).not.toBe(h2);
  });
});

// ── Integration-style tests for DB helpers (mocked) ───────────────────────
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

describe("auth DB helpers (no DB)", () => {
  it("getCredentialByEmail returns undefined when DB is unavailable", async () => {
    const result = await getCredentialByEmail("any@example.com");
    expect(result).toBeUndefined();
  });

  it("hasAnyCredential returns false when DB is unavailable", async () => {
    const result = await hasAnyCredential();
    expect(result).toBe(false);
  });
});
