// ═══════════════════════════════════════════════════════════════
// AIMAXAUTO VALUATION ENGINE — TypeScript Types
// ═══════════════════════════════════════════════════════════════

export interface Vehicle {
  id?: number | string;
  brand: string;
  model: string;
  year: number;
  fuel: string; // "Electric" | "PHEV" | "Hybrid" | "Diesel" | "Gas"
  hp?: number;
  mi?: string; // e.g. "18,200"
  drive?: string;
  body?: string;
  trans?: string;
  color?: string;

  // Valuation spec
  motorVariant?: string;
  baseMotor?: string;
  fuelType?: string;
  baseFuel?: string;
  driveVariant?: string;
  transVariant?: string;
  baseTrans?: string;
  trimLevel?: string;
  baseTrim?: string;
  paintType?: string; // "solid" | "metallic" | "pearl"

  // Equipment
  extraEquip?: string[];
  missingEquip?: string[];

  // Condition
  devs?: Deviation[];

  // Registration
  regRegion?: string;
  regCountry?: string;

  // Cached values
  valP?: number;
  valC?: number;
  tax?: number;
  ins?: { cost: number; [key: string]: any };
  fuelActual?: number;
}

export interface Deviation {
  desc?: string;
  sev: "critical" | "moderate" | "minor";
}

export interface ModelBaseline {
  baseNewPrice: number;
  segment?: string;
  motors: Record<string, number>;
  fuels: Record<string, number>;
  drives: Record<string, number>;
  trans: Record<string, number>;
  trims: Record<string, number>;
  paintMod: Record<string, number>;
  avgMil: number;
  // Fallback fields
  method?: string;
  segLabel?: string;
  comparables?: any[];
  avgNewPrice?: number;
  ownPrestige?: number;
  avgPrestige?: number;
  prestigeRatio?: number;
  adjustedNewPrice?: number;
}

export interface Listing {
  source: SearchSource;
  tier: 1 | 2 | 3;
  matchScore: number;
  price: number;
  mileage: number;
  year: number;
  brand: string;
  model: string;
  isDealer: boolean;
  region: string;
  daysListed: number;
  url: string;
  prestigeAdj?: number;
}

export interface SearchSource {
  id: string;
  name: string;
  icon: string;
  url: string;
  type: string;
  weight: number;
  listingCount: number;
}

export interface ValuationStep {
  nr: number;
  label: string;
  desc: string | null;
  value: number;
  type: "base" | "adjust" | "result";
}

export interface ValuationResult {
  marketAnchor: number;
  tier1Count: number;
  tier2Count: number;
  tier3Count: number;
  totalListings: number;
  avgMarketMileage: number;
  spread: number;
  equipAnalysis: any;
  empAnalysis: MileageAnalysis;
  steps: ValuationStep[];
  totalValue: number;
  usedFallback: boolean;
  fallbackData: any;
  confidence: number;
  baseNewPrice: number;
  survivalFactor: number;
  tierBreakdown: {
    tier1: { count: number; avgPrice: number };
    tier2: { count: number; avgPrice: number };
    tier3: { count: number; avgPrice: number };
  };
  listings: {
    tier1: Listing[];
    tier2: Listing[];
    tier3: Listing[];
    all: Listing[];
  };
}

export interface MileageAnalysis {
  method: "empirical" | "hybrid" | "theoretical";
  factor: number | null;
  referencePrice?: number;
  vehicleRatio?: number;
  buckets?: any[];
  regression?: { slope: number; krPer10Mil: number; rSquared: number };
  confidence: number;
  totalListings?: number;
  normalListings?: number;
}

export interface TimelineMonth {
  month: number;
  label: string;
  value: number;
  change: number;
  changePercent: number;
  isProjection: boolean;
  isCurrent: boolean;
}

export interface TimelineResult {
  months: TimelineMonth[];
  currentValue: number;
  threeMonthsAgo: number;
  trend: number;
  trendPercent: number;
  depreciationPerMonth: number;
  depreciationPerYear: number;
  monthlyDepRate: number;
  fuelAdj: number;
  projection3m: number;
}

export interface TCOResult {
  monthly: Record<string, number>;
  annual: Record<string, number>;
  fuelCostPerMil: number;
  annualMil: number;
}

export interface DepreciationResult {
  curve: { year: number; value: number; factor: number; totalLoss: number; lossPercent: number }[];
  currentAge: number;
  currentValue: number;
  newPrice: number;
  totalLoss: number;
  totalLossPercent: number;
  depPerYear: number;
  depPerMonth: number;
  yearlyRates: { year: number; loss: number; lossPerMonth: number }[];
}

export interface RegionalResult {
  homeRegion: string;
  homeValue: number;
  regions: Record<string, RegionValue>;
}

export interface RegionValue {
  name: string;
  short: string;
  lat: number;
  lng: number;
  color: string;
  country: string;
  value: number;
  coeff: number;
  isHome: boolean;
  diff: number;
  diffPercent: number;
  isInternational?: boolean;
}

export interface ExportResult {
  homeValue: number;
  homeMarket: string;
  results: MarketOpportunity[];
  bestMarket: MarketOpportunity;
  opportunities: MarketOpportunity[];
  disclaimer: string;
}

export interface MarketOpportunity {
  country: string;
  speculativeValue?: number;
  foreignPrice?: number;
  exportFees: number;
  importFees: number;
  totalFees?: number;
  totalCost?: number;
  netVsHome?: number;
  netVsHomePercent?: number;
  savings?: number;
  savingsPercent?: number;
  isOpportunity: boolean;
  isPreliminary: boolean;
}
