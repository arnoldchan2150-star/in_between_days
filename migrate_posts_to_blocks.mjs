import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { posts, postMedia, postBlocks } from "./drizzle/schema.ts";

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const db = drizzle(connectionString);
  console.log("Connected to database for posts -> blocks migration...");

  const allPosts = await db.select().from(posts);
  console.log(`Found ${allPosts.length} posts total.`);

  for (const post of allPosts) {
    const existingBlocks = await db.select().from(postBlocks).where(eq(postBlocks.postId, post.id));
    if (existingBlocks.length > 0) {
      console.log(`Post [${post.id}] "${post.title}" already has ${existingBlocks.length} blocks. Skipping.`);
      continue;
    }

    const media = await db.select().from(postMedia).where(eq(postMedia.postId, post.id));
    const images = media.filter((m) => m.mediaType !== "video").sort((a, b) => a.sortOrder - b.sortOrder);

    if (images.length === 0) {
      console.log(`Post [${post.id}] "${post.title}" has no media images. Skipping block transformation.`);
      continue;
    }

    const rawContent = post.content || "";
    const paragraphs = rawContent
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paragraphs.length === 0) {
      console.log(`Post [${post.id}] "${post.title}" has empty content. Skipping.`);
      continue;
    }

    console.log(`Converting post [${post.id}] "${post.title}": ${paragraphs.length} paragraphs, ${images.length} images.`);

    const newBlocks = [];
    let pIndex = 0;
    let imgIndex = 0;
    let sortOrder = 0;

    while (pIndex < paragraphs.length || imgIndex < images.length) {
      if (pIndex < paragraphs.length) {
        newBlocks.push({
          postId: post.id,
          blockType: "paragraph",
          content: paragraphs[pIndex],
          caption: null,
          sortOrder: sortOrder++,
        });
        pIndex++;
      }

      if (imgIndex < images.length) {
        const img = images[imgIndex];
        newBlocks.push({
          postId: post.id,
          blockType: "image",
          content: img.url,
          caption: img.caption || null,
          sortOrder: sortOrder++,
        });
        imgIndex++;
      }
    }

    for (const block of newBlocks) {
      await db.insert(postBlocks).values(block);
    }
    console.log(`Successfully created ${newBlocks.length} interleaved blocks for post [${post.id}] "${post.title}".`);
  }

  console.log("Migration finished successfully.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
