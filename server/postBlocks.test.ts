import { describe, expect, it } from "vitest";
import { normalizePostBlocks, serializePostBlocks } from "@shared/postBlocks";

describe("post block save helpers", () => {
  it("normalizes block order and nullable editor values", () => {
    const result = normalizePostBlocks([
      { blockType: "paragraph" as const, content: null, caption: null, sortOrder: 2 },
      { blockType: "image" as const, content: " /photo.jpg ", caption: " caption ", sortOrder: 1 },
    ]);

    expect(result).toEqual([
      { blockType: "image", content: " /photo.jpg ", caption: " caption ", sortOrder: 0 },
      { blockType: "paragraph", content: "", caption: "", sortOrder: 1 },
    ]);
  });

  it("serializes empty values as null and trims saved text", () => {
    const result = serializePostBlocks([
      { blockType: "heading", content: "  A title  ", caption: "  note  ", sortOrder: 0 },
      { blockType: "paragraph", content: "   ", caption: null, sortOrder: 1 },
    ]);

    expect(result).toEqual([
      { blockType: "heading", content: "A title", caption: "note", sortOrder: 0 },
      { blockType: "paragraph", content: null, caption: null, sortOrder: 1 },
    ]);
  });
});
