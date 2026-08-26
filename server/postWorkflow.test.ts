import { describe, expect, it } from "vitest";
import { getPostPublishMode, parseTagInput } from "@shared/postWorkflow";

describe("post workflow helpers", () => {
  const now = new Date("2026-08-26T00:00:00.000Z").getTime();

  it("keeps unpublished posts as drafts even when a date is present", () => {
    expect(getPostPublishMode(false, "2026-09-01", now)).toBe("draft");
  });

  it("recognizes future published posts as scheduled", () => {
    expect(getPostPublishMode(true, "2026-09-01", now)).toBe("scheduled");
  });

  it("recognizes due and undated published posts as published", () => {
    expect(getPostPublishMode(true, "2026-08-26", now)).toBe("published");
    expect(getPostPublishMode(true, null, now)).toBe("published");
  });

  it("trims, deduplicates, and ignores empty tag values", () => {
    expect(parseTagInput("旅遊, 隨筆, 旅遊, , 電影")).toEqual(["旅遊", "隨筆", "電影"]);
  });
});
