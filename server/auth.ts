import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { adminCredentials } from "../drizzle/schema";
import { getDb } from "./db";

const SALT_ROUNDS = 12;

/** Hash a plain-text password */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** Compare a plain-text password against a stored hash */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Return the stored credential row for an email, or undefined */
export async function getCredentialByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(adminCredentials)
    .where(eq(adminCredentials.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0];
}

/** Check whether any admin credential exists (used for first-time setup) */
export async function hasAnyCredential(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db.select({ id: adminCredentials.id }).from(adminCredentials).limit(1);
  return rows.length > 0;
}

/** Upsert (create or update) admin credentials for an email */
export async function upsertCredential(email: string, plain: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const hash = await hashPassword(plain);
  const normalizedEmail = email.toLowerCase().trim();
  await db
    .insert(adminCredentials)
    .values({ email: normalizedEmail, passwordHash: hash })
    .onDuplicateKeyUpdate({ set: { passwordHash: hash } });
}
