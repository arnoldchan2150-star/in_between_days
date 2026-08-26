export const SELECTION_CATEGORIES = ["全部", "自製物件", "旅途小物"] as const;

export type SelectionCategory = (typeof SELECTION_CATEGORIES)[number];

export interface SelectionItem {
  id: string;
  title: string;
  category: Exclude<SelectionCategory, "全部">;
  description: string;
  status: "available" | "coming_soon" | "sold_out";
  imageUrl?: string;
  priceLabel?: string;
}

/**
 * Product records will be added here only when real item details and images are available.
 * Keeping the initial catalog empty avoids presenting invented products or availability.
 */
export const SELECTION_ITEMS: readonly SelectionItem[] = [];

export function matchesSelectionSearch(item: SelectionItem, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;

  return [item.title, item.description, item.category, item.status].some((value) =>
    value.toLocaleLowerCase().includes(normalizedQuery),
  );
}

export function filterSelectionItems(
  items: readonly SelectionItem[],
  category: SelectionCategory,
  query: string,
) {
  return items.filter((item) => {
    const matchesCategory = category === "全部" || item.category === category;
    return matchesCategory && matchesSelectionSearch(item, query);
  });
}
