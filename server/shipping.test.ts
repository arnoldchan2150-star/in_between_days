import { describe, expect, it } from "vitest";
import { quoteHongKongShipping } from "../shared/shipping";

describe("quoteHongKongShipping", () => {
  it("applies the G-class rate at each weight boundary", () => {
    expect(quoteHongKongShipping({ subtotalMinor: 29900, weightGrams: 30, shippingClass: "G" })).toMatchObject({ status: "rate", feeMinor: 430 });
    expect(quoteHongKongShipping({ subtotalMinor: 29900, weightGrams: 100, shippingClass: "G" })).toMatchObject({ status: "rate", feeMinor: 560 });
    expect(quoteHongKongShipping({ subtotalMinor: 29900, weightGrams: 250, shippingClass: "G" })).toMatchObject({ status: "rate", feeMinor: 820 });
    expect(quoteHongKongShipping({ subtotalMinor: 29900, weightGrams: 500, shippingClass: "G" })).toMatchObject({ status: "rate", feeMinor: 1490 });
  });

  it("makes orders at or above HK$300 free and rejects missing or unsupported rates", () => {
    expect(quoteHongKongShipping({ subtotalMinor: 30000, weightGrams: 0, shippingClass: "G" })).toMatchObject({ status: "free", feeMinor: 0 });
    expect(quoteHongKongShipping({ subtotalMinor: 29900, weightGrams: 0, shippingClass: "G" }).status).toBe("unavailable");
    expect(quoteHongKongShipping({ subtotalMinor: 29900, weightGrams: 100, shippingClass: "E" }).status).toBe("unavailable");
    expect(quoteHongKongShipping({ subtotalMinor: 29900, weightGrams: 501, shippingClass: "G" }).status).toBe("unavailable");
  });
});
