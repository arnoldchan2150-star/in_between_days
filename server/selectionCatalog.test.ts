import { describe, expect, it } from "vitest";
import {
  filterSelectionItems,
  matchesSelectionSearch,
  SelectionItem,
} from "../shared/selectionCatalog";

const items: SelectionItem[] = [
  {
    id: "handmade-note",
    title: "手作旅行筆記本",
    category: "自製物件",
    description: "為下一段旅程留下空白頁面。",
    status: "coming_soon",
  },
  {
    id: "lisbon-tile",
    title: "Lisbon 藍磚小物",
    category: "旅途小物",
    description: "在城市散步時遇見的色彩。",
    status: "sold_out",
  },
];

describe("selection catalog helpers", () => {
  it("matches searchable item fields case-insensitively", () => {
    expect(matchesSelectionSearch(items[0], "筆記")).toBe(true);
    expect(matchesSelectionSearch(items[1], "LISBON")).toBe(true);
    expect(matchesSelectionSearch(items[0], "雪山")).toBe(false);
  });

  it("filters by category and query together", () => {
    expect(filterSelectionItems(items, "自製物件", "旅行")).toHaveLength(1);
    expect(filterSelectionItems(items, "旅途小物", "筆記")).toHaveLength(0);
    expect(filterSelectionItems(items, "全部", "")).toHaveLength(2);
  });
});
