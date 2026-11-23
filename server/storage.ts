// File storage on any S3-compatible bucket (Cloudflare R2, AWS S3, Backblaze B2...).
//
// Public URLs keep the historical "/manus-storage/{key}" form so that every image
// link already saved in the database and in the code keeps working after the move
// off Manus. The Express route in _core/storageProxy.ts serves those paths.

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

export const STORAGE_URL_PREFIX = "/manus-storage/";

let _client: S3Client | null = null;

function getStorageConfig() {
  const { s3Endpoint, s3Region, s3Bucket, s3AccessKeyId, s3SecretAccessKey } = ENV;
  if (!s3Bucket || !s3AccessKeyId || !s3SecretAccessKey) {
    throw new Error(
      "Storage config missing: set S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY (and S3_ENDPOINT for R2)",
    );
  }
  return { s3Endpoint, s3Region, s3Bucket, s3AccessKeyId, s3SecretAccessKey };
}

export function getStorageClient(): { client: S3Client; bucket: string } {
  const cfg = getStorageConfig();
  if (!_client) {
    _client = new S3Client({
      region: cfg.s3Region || "auto",
      endpoint: cfg.s3Endpoint || undefined,
      forcePathStyle: Boolean(cfg.s3Endpoint),
      credentials: {
        accessKeyId: cfg.s3AccessKeyId,
        secretAccessKey: cfg.s3SecretAccessKey,
      },
    });
  }
  return { client: _client, bucket: cfg.s3Bucket };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const { client, bucket } = getStorageClient();
  const key = appendHashSuffix(normalizeKey(relKey));

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: typeof data === "string" ? Buffer.from(data) : data,
      ContentType: contentType,
    }),
  );

  return { key, url: `${STORAGE_URL_PREFIX}${key}` };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `${STORAGE_URL_PREFIX}${key}` };
}

/** Short-lived direct download URL for a stored object. */
export async function storageGetSignedUrl(relKey: string, expiresInSeconds = 3600): Promise<string> {
  const { client, bucket } = getStorageClient();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: normalizeKey(relKey) }),
    { expiresIn: expiresInSeconds },
  );
}
