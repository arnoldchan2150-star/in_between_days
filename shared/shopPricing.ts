export function parseHkdToMinorUnits(value: string): number | null {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

export function formatHkdFromMinorUnits(value: number): string {
  return (value / 100).toFixed(2);
}

export function isValidInventoryQuantity(value: string): boolean {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity >= 0;
}
