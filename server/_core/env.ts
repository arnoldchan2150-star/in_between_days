export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // S3-compatible file storage (Cloudflare R2, AWS S3, Backblaze B2...)
  s3Endpoint: process.env.S3_ENDPOINT ?? "",
  s3Region: process.env.S3_REGION ?? "auto",
  s3Bucket: process.env.S3_BUCKET ?? "",
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  /** Optional public base URL of the bucket, e.g. https://media.inbetweenday.com */
  s3PublicUrl: process.env.S3_PUBLIC_URL ?? "",
};

/**
 * Secret used to sign the admin session cookie. Must be set in production:
 * without it anyone could forge an admin session.
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || process.env.COOKIE_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set in production");
    }
    return new TextEncoder().encode("dev-only-insecure-secret");
  }
  return new TextEncoder().encode(secret);
}
