import { describe, expect, it } from "vitest";
import {
  formatHkdFromMinorUnits,
  isValidInventoryQuantity,
  parseHkdToMinorUnits,
} from "../shared/shopPricing";

describe("shop pricing helpers", () => {
  it("converts HKD values to minor units without floating point drift", () => {
    expect(parseHkdToMinorUnits("180")).toBe(18000);
    expect(parseHkdToMinorUnits("12.345")).toBe(1235);
    expect(parseHkdToMinorUnits("-1")).toBeNull();
    expect(parseHkdToMinorUnits("not-a-price")).toBeNull();
  });

  it("formats minor units and validates non-negative integer inventory", () => {
    expect(formatHkdFromMinorUnits(18000)).toBe("180.00");
    expect(isValidInventoryQuantity("0")).toBe(true);
    expect(isValidInventoryQuantity("12")).toBe(true);
    expect(isValidInventoryQuantity("1.5")).toBe(false);
    expect(isValidInventoryQuantity("-1")).toBe(false);
  });
});
