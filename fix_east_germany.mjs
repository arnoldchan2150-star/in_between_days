import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { posts, postMedia, postBlocks } from "./drizzle/schema.ts";

async function run() {
  const db = drizzle(process.env.DATABASE_URL);
  const postId = 240001;

  const post = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  if (!post[0]) {
    console.error("Post not found");
    process.exit(1);
  }

  const media = await db.select().from(postMedia).where(eq(postMedia.postId, postId));
  const images = media.filter((m) => m.mediaType !== "video").sort((a, b) => a.sortOrder - b.sortOrder);

  const rawContent = post[0].content || "";
  const paragraphs = rawContent
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  console.log(`Rebuilding blocks for post "${post[0].title}": ${paragraphs.length} paragraphs, ${images.length} images.`);

  const newBlocks = [];
  let pIndex = 0;
  let imgIndex = 0;
  let sortOrder = 0;

  while (pIndex < paragraphs.length || imgIndex < images.length) {
    if (pIndex < paragraphs.length) {
      newBlocks.push({
        postId,
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
        postId,
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

  console.log(`Successfully recreated ${newBlocks.length} blocks for East Germany post.`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Fix failed:", err);
  process.exit(1);
});
