export const FREE_SHIPPING_THRESHOLD_MINOR = 30_000;

export type ShippingClass = "P" | "G" | "E";

export const G_LARGE_PACKET_RATES = [
  { maxGrams: 30, feeMinor: 430 },
  { maxGrams: 100, feeMinor: 560 },
  { maxGrams: 250, feeMinor: 820 },
  { maxGrams: 500, feeMinor: 1490 },
] as const;

export type ShippingQuote =
  | { status: "free"; feeMinor: 0; label: "免運" }
  | { status: "rate"; feeMinor: number; label: string }
  | { status: "unavailable"; feeMinor: null; label: string };

export function quoteHongKongShipping(params: {
  subtotalMinor: number;
  weightGrams: number;
  shippingClass: ShippingClass;
}): ShippingQuote {
  if (params.subtotalMinor >= FREE_SHIPPING_THRESHOLD_MINOR) {
    return { status: "free", feeMinor: 0, label: "免運" };
  }

  if (!Number.isInteger(params.weightGrams) || params.weightGrams <= 0) {
    return { status: "unavailable", feeMinor: null, label: "請先補充商品包裝重量" };
  }

  if (params.shippingClass !== "G") {
    return { status: "unavailable", feeMinor: null, label: "此寄件類別的費率尚未設定" };
  }

  const rate = G_LARGE_PACKET_RATES.find((candidate) => params.weightGrams <= candidate.maxGrams);
  if (!rate) {
    return { status: "unavailable", feeMinor: null, label: "重量超過 G 類目前設定範圍，請另行確認運費" };
  }

  return {
    status: "rate",
    feeMinor: rate.feeMinor,
    label: `香港運費 HK$${(rate.feeMinor / 100).toFixed(2)}`,
  };
}
