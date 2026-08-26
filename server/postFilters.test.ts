import { describe, expect, it } from "vitest";
import { getCultureTopic, matchesPostSearch } from "@shared/postFilters";

const post = {
  title: "隨筆｜城市裡的一杯咖啡",
  excerpt: "一段關於旅行與閱讀的記錄。",
  category: "歐洲",
  content: "走過街角之後，我在維也納找到一間安靜的咖啡店。",
};

describe("post filters", () => {
  it("classifies culture topics from article title prefixes", () => {
    expect(getCultureTopic("旅遊｜一座城市")).toBe("旅遊");
    expect(getCultureTopic("隨筆｜午後片段")).toBe("隨筆");
    expect(getCultureTopic("影評｜一部電影")).toBe("影評");
    expect(getCultureTopic("書評｜一本書")).toBe("書評");
    expect(getCultureTopic("沒有前綴的文章")).toBe("其他");
  });

  it("matches title, excerpt, location, and full article content", () => {
    expect(matchesPostSearch(post, "咖啡")).toBe(true);
    expect(matchesPostSearch(post, "歐洲")).toBe(true);
    expect(matchesPostSearch(post, "維也納")).toBe(true);
    expect(matchesPostSearch(post, "不存在的關鍵字")).toBe(false);
    expect(matchesPostSearch(post, "   ")).toBe(true);
  });
});
