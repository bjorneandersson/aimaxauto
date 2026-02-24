// ═══════════════════════════════════════════════════════════════
// AIMAXAUTO VALUATION ENGINE v2.0 — Barrel Export
// Import everything from here: import { calcMarketValue, ... } from "@/engine"
// ═══════════════════════════════════════════════════════════════

// Types
export type * from "./types";

// Core valuation
export { calcMarketValue, analyzeMileageFromAds, calcRealtimeConfidence, findComparableBaseline } from "./valuation";

// Analysis (timeline, depreciation, TCO, swap)
export { calcValueTimeline, calcDepreciation, calcTCO, calcSwapAnalysis } from "./analysis";

// Markets (regional, export/import, arbitrage)
export {
  calcRegionalValues, calcNVV,
  calcExportFees, calcImportFees, calcSpeculativeValue,
  findBestSellMarket, findBestBuyMarket, compareAnyMarkets,
} from "./markets";

// Data constants (for admin panel parameter editing)
export {
  AGE_CURVE, MIL_CURVE, CONDITION_ADJ, MILEAGE_ADJ_PER_MIL,
  AVG_MIL_PER_YEAR, MONTHLY_DEPRECIATION, MODEL_BASELINES,
  BRAND_PRESTIGE, SEGMENT_COMPARABLES, EQUIP_VALUES,
  EQUIP_RESIDUAL_CURVE, SEARCH_SOURCES, REGIONS_US, VAT_RATES,
} from "./data";

// Utils
export { parseMileage, fuelKey, nearestKey } from "./utils";
