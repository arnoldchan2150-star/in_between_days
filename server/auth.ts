import bcrypt from "bcryptjs";
import {
  createAdminCredential,
  getAdminCredential,
  hasAdminCredential,
  updateAdminCredential,
} from "./db";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const cred = await getAdminCredential(email);
  if (!cred) return { success: false, error: "帳號或密碼錯誤" };
  const valid = await verifyPassword(password, cred.passwordHash);
  if (!valid) return { success: false, error: "帳號或密碼錯誤" };
  return { success: true };
}

export async function setupAdminPassword(
  email: string,
  password: string
): Promise<void> {
  const hash = await hashPassword(password);
  const existing = await getAdminCredential(email);
  if (existing) {
    await updateAdminCredential(email, hash);
  } else {
    await createAdminCredential(email, hash);
  }
}

export async function isAdminPasswordSet(): Promise<boolean> {
  return hasAdminCredential();
}

// ── Aliases for test compatibility ───────────────────────────────────────
export async function getCredentialByEmail(email: string) {
  return getAdminCredential(email);
}

export async function hasAnyCredential(): Promise<boolean> {
  return hasAdminCredential();
}

export async function upsertCredential(email: string, password: string): Promise<void> {
  return setupAdminPassword(email, password);
}

export async function changeAdminPassword(
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cred = await getAdminCredential(email);
  if (!cred) return { success: false, error: "帳號不存在" };
  const valid = await verifyPassword(oldPassword, cred.passwordHash);
  if (!valid) return { success: false, error: "舊密碼錯誤" };
  const hash = await hashPassword(newPassword);
  await updateAdminCredential(email, hash);
  return { success: true };
}
