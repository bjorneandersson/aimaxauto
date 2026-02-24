// ═══════════════════════════════════════════════════════════════
// AIMAXAUTO VALUATION ENGINE — Utility Helpers
// ═══════════════════════════════════════════════════════════════

/** Find the nearest lower key in a numeric record */
export function nearestKey(record: Record<number, number>, target: number): number {
  return Object.keys(record)
    .map(Number)
    .sort((a, b) => a - b)
    .reduce((prev, k) => (k <= target ? k : prev), 0);
}

/** Parse mileage string like "18,200" or "18 200" to number */
export function parseMileage(mi: string | undefined): number {
  if (!mi) return 0;
  return parseInt(mi.replace(/[\s,]/g, ""), 10) || 0;
}

/** Get fuel key for valuation lookups */
export function fuelKey(fuel: string): string {
  if (fuel === "Electric") return "BEV";
  if (fuel === "PHEV") return "PHEV";
  if (fuel === "Hybrid") return "hybrid";
  if (fuel === "Diesel") return "diesel";
  return "gas";
}
