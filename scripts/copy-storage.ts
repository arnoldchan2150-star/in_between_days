/**
 * Copy every file the site uses from Manus storage into your own S3/R2 bucket,
 * keeping the same keys, so the "/manus-storage/<key>" links already saved in the
 * database keep working unchanged after the move.
 *
 * How it finds the files:
 *   1. Scans every text column of every table in DATABASE_URL for "/manus-storage/<key>"
 *   2. Scans client/ and server/ source files for the same pattern
 *
 * How it downloads them: through the LIVE site (SOURCE_BASE_URL, default
 * https://inbetweenday.com), which still serves /manus-storage/* from Manus.
 * So run this BEFORE the domain is pointed at the new host, and before Manus is cancelled.
 *
 * It also lists any other Manus-hosted links it finds (manus.space, manuscdn.com)
 * that need to be moved by hand.
 *
 * Usage (env vars from .env or the shell):
 *   DATABASE_URL=...  S3_ENDPOINT=... S3_BUCKET=... S3_ACCESS_KEY_ID=... S3_SECRET_ACCESS_KEY=...
 *   pnpm tsx scripts/copy-storage.ts            # copy
 *   pnpm tsx scripts/copy-storage.ts --dry-run  # only list what would be copied
 *
 * Safe to re-run: files already in the bucket are skipped.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getStorageClient } from "../server/storage";

const DRY_RUN = process.argv.includes("--dry-run");
const SOURCE_BASE_URL = (process.env.SOURCE_BASE_URL || "https://inbetweenday.com").replace(/\/+$/, "");
const KEY_RE = /\/manus-storage\/([^"'\s)<>?#\\]+)/g;
const OTHER_MANUS_RE = /https?:\/\/[a-zA-Z0-9.-]*(?:manus\.space|manuscdn\.com|manus\.computer|manus\.im)[^"'\s)<>\\]*/g;

const keys = new Set<string>();
const otherManusLinks = new Map<string, string>(); // url -> where found

function collect(text: string, where: string) {
  for (const m of Array.from(text.matchAll(KEY_RE))) keys.add(decodeURIComponent(m[1]));
  for (const m of Array.from(text.matchAll(OTHER_MANUS_RE))) {
    if (!otherManusLinks.has(m[0])) otherManusLinks.set(m[0], where);
  }
}

async function scanDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const conn = await mysql.createConnection(url);
  try {
    const [cols] = await conn.query<any[]>(
      `SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND DATA_TYPE IN ('char','varchar','text','tinytext','mediumtext','longtext','json')`,
    );
    for (const { TABLE_NAME, COLUMN_NAME } of cols) {
      const [rows] = await conn.query<any[]>(
        `SELECT \`${COLUMN_NAME}\` AS v FROM \`${TABLE_NAME}\`
         WHERE \`${COLUMN_NAME}\` LIKE '%manus%'`,
      );
      for (const r of rows) {
        const v = typeof r.v === "string" ? r.v : JSON.stringify(r.v);
        if (v) collect(v, `database ${TABLE_NAME}.${COLUMN_NAME}`);
      }
    }
  } finally {
    await conn.end();
  }
}

function scanSource(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      scanSource(p);
    } else if (/\.(tsx?|jsx?|css|html|json|md)$/.test(entry.name)) {
      collect(fs.readFileSync(p, "utf8"), p);
    }
  }
}

async function existsInBucket(key: string): Promise<boolean> {
  const { client, bucket } = getStorageClient();
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (err: any) {
    if (err?.$metadata?.httpStatusCode === 404 || err?.name === "NotFound") return false;
    throw err;
  }
}

async function copyOne(key: string): Promise<"copied" | "skipped" | "failed"> {
  if (await existsInBucket(key)) return "skipped";
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${SOURCE_BASE_URL}/manus-storage/${encodedKey}`, { redirect: "follow" });
  if (!res.ok) {
    console.error(`  ✗ ${key}: download failed (${res.status})`);
    return "failed";
  }
  const body = Buffer.from(await res.arrayBuffer());
  const { client, bucket } = getStorageClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: res.headers.get("content-type") || "application/octet-stream",
    }),
  );
  return "copied";
}

async function main() {
  console.log("Scanning database…");
  await scanDatabase();
  console.log("Scanning source files…");
  scanSource(path.resolve("client"));
  scanSource(path.resolve("server"));

  const list = Array.from(keys).sort();
  console.log(`\nFound ${list.length} stored files.`);

  if (otherManusLinks.size) {
    console.log(`\n⚠ ${otherManusLinks.size} other Manus-hosted link(s) found — these are NOT copied automatically:`);
    for (const [url, where] of Array.from(otherManusLinks)) console.log(`  ${url}\n      (in ${where})`);
  }

  if (DRY_RUN) {
    console.log("\n--dry-run: files that would be copied:");
    list.forEach(k => console.log("  " + k));
    return;
  }

  const counts = { copied: 0, skipped: 0, failed: 0 };
  const failed: string[] = [];
  let i = 0;
  const queue = [...list];
  async function worker() {
    while (queue.length) {
      const key = queue.shift()!;
      try {
        const r = await copyOne(key);
        counts[r]++;
        if (r === "failed") failed.push(key);
      } catch (err) {
        counts.failed++;
        failed.push(key);
        console.error(`  ✗ ${key}:`, err);
      }
      i++;
      if (i % 20 === 0) console.log(`  …${i}/${list.length}`);
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));

  console.log(`\nDone. Copied ${counts.copied}, already there ${counts.skipped}, failed ${counts.failed}.`);
  if (failed.length) {
    console.log("Failed keys (re-run the script to retry):");
    failed.forEach(k => console.log("  " + k));
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
