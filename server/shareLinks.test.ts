import { describe, expect, it } from "vitest";
import { createArticleShareLinks } from "@shared/shareLinks";

describe("article share links", () => {
  it("encodes the article URL and title for Facebook and LINE", () => {
    const links = createArticleShareLinks(
      "熊野古道：中邊路朝聖之旅",
      "https://inbetweenday.com/destinations/kumano-kodo-nakahechi?from=article"
    );

    expect(links.article).toContain("kumano-kodo-nakahechi");
    expect(links.facebook).toContain("facebook.com/sharer/sharer.php?u=");
    expect(links.facebook).toContain(encodeURIComponent(links.article));
    expect(links.line).toContain("social-plugins.line.me/lineit/share");
    expect(links.line).toContain(encodeURIComponent("熊野古道：中邊路朝聖之旅"));
  });
});
