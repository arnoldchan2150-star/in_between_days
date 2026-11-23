import type { Express } from "express";
import { ENV } from "./env";
import { storageGetSignedUrl } from "../storage";

/**
 * Serves "/manus-storage/{key}" (the URL form already saved in the database)
 * from the site's own S3-compatible bucket.
 *
 * - If S3_PUBLIC_URL is set (e.g. an R2 public bucket / custom domain such as
 *   https://media.inbetweenday.com), redirect there; the browser and CDN can cache it.
 * - Otherwise redirect to a short-lived signed URL (bucket stays private).
 */
export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    try {
      if (ENV.s3PublicUrl) {
        const base = ENV.s3PublicUrl.replace(/\/+$/, "");
        const encodedKey = key.split("/").map(encodeURIComponent).join("/");
        res.set("Cache-Control", "public, max-age=86400");
        res.redirect(301, `${base}/${encodedKey}`);
        return;
      }

      const url = await storageGetSignedUrl(key, 3600);
      res.set("Cache-Control", "private, max-age=3000");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
