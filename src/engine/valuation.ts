// ═══════════════════════════════════════════════════════════════
// AIMAXAUTO VALUATION ENGINE v2.0 — Core Calculations
// Principle: Market Price → 12-step adjustment → Vehicle Market Value
// ═══════════════════════════════════════════════════════════════

import type { Vehicle, ValuationResult, Listing, MileageAnalysis, ModelBaseline } from "./types";
import {
  AGE_CURVE, MIL_CURVE, CONDITION_ADJ, MILEAGE_ADJ_PER_MIL,
  AVG_MIL_PER_YEAR, MONTHLY_DEPRECIATION, MODEL_BASELINES,
  BRAND_PRESTIGE, SEGMENT_COMPARABLES, EQUIP_VALUES,
  EQUIP_RESIDUAL_CURVE, SEARCH_SOURCES, REGIONS_US,
} from "./data";
import { nearestKey, parseMileage, fuelKey } from "./utils";

// ═══════════════════════════════════════════════════════════════
// SEARCH HIERARCHY — Tier 1/2/3 (simulated, production-ready architecture)
// ═══════════════════════════════════════════════════════════════

export function findComparableBaseline(brand: string, model: string, body?: string, hp?: number): ModelBaseline | null {
  const ownPrestige = BRAND_PRESTIGE[brand] || 1.0;
  let bestSeg: { label: string; models: { brand: string; model: string }[] } | null = null;
  let bestModels: { brand: string; model: string }[] = [];

  for (const [, seg] of Object.entries(SEGMENT_COMPARABLES)) {
    if (seg.models.some((m) => m.brand === brand && model.includes(m.model))) {
      bestSeg = seg;
      bestModels = seg.models.filter((m) => m.brand !== brand || !model.includes(m.model));
      break;
    }
  }

  if (!bestSeg) {
    for (const [, seg] of Object.entries(SEGMENT_COMPARABLES)) {
      if (seg.models.length > 5) { bestSeg = seg; bestModels = seg.models; break; }
    }
  }
  if (!bestSeg) return null;

  const comparables = bestModels.slice(0, 5).map((m) => {
    const key = m.brand + " " + m.model;
    const bl = MODEL_BASELINES[key];
    return { brand: m.brand, model: m.model, baseNewPrice: bl ? bl.baseNewPrice : 420000, prestige: BRAND_PRESTIGE[m.brand] || 1.0 };
  });

  const avgNewPrice = Math.round(comparables.reduce((s, c) => s + c.baseNewPrice, 0) / Math.max(comparables.length, 1));
  const avgPrestige = comparables.reduce((s, c) => s + c.prestige, 0) / Math.max(comparables.length, 1);
  const prestigeRatio = ownPrestige / avgPrestige;
  const adjustedNewPrice = Math.round(avgNewPrice * prestigeRatio);

  return {
    baseNewPrice: adjustedNewPrice,
    motors: {}, fuels: {}, drives: { FWD: 0, AWD: 22000 }, trans: { manuell: 0, auto: 18000 },
    trims: {}, paintMod: { solid: 0, metallic: 10000 }, avgMil: 1300,
    method: "segment_comparable", segLabel: bestSeg.label, comparables, avgNewPrice,
    ownPrestige, avgPrestige, prestigeRatio, adjustedNewPrice,
  };
}

// ── Simulated Search — Tier 1 ──
function searchTier1(v: Vehicle, market: string): Listing[] {
  const region = REGIONS_US[v.regRegion || "westcoast"] || REGIONS_US.westcoast;
  const fk = fuelKey(v.fuel);
  const fuelCoeff = region.coeff?.[fk] || 1.0;
  const age = 2026 - v.year;
  const ageFactor = AGE_CURVE[Math.min(age, 10)] || 0.3;
  const miNum = parseMileage(v.mi) / 10;
  const miKey = nearestKey(MIL_CURVE, miNum);
  const miFactor = MIL_CURVE[miKey] || 0.52;

  const modelKey = Object.keys(MODEL_BASELINES).find(
    (k) => v.brand + " " + v.model.split(" ")[0] === k || (v.brand + " " + v.model).includes(k)
  );
  const bl = MODEL_BASELINES[modelKey || ""] || { baseNewPrice: 420000, avgMil: 1300 };
  const basePrice = Math.round(bl.baseNewPrice * Math.sqrt(ageFactor * miFactor) * fuelCoeff);

  const sources = SEARCH_SOURCES[market] || SEARCH_SOURCES.US;
  const listings: Listing[] = [];
  const variance = 0.12;

  for (const src of sources) {
    const count = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < count; i++) {
      const priceMod = 1 + (Math.random() * 2 - 1) * variance;
      const mileageMod = 1 + (Math.random() * 0.4 - 0.2);
      listings.push({
        source: src, tier: 1, matchScore: 0.85 + Math.random() * 0.15,
        price: Math.round((basePrice * priceMod) / 1000) * 1000,
        mileage: Math.round(miNum * 10 * mileageMod),
        year: v.year, brand: v.brand, model: v.model,
        isDealer: Math.random() > 0.4, region: region.name,
        daysListed: Math.floor(Math.random() * 45) + 1,
        url: `https://${src.url}/listings/${10000000 + Math.floor(Math.random() * 89999999)}`,
      });
    }
  }
  listings.sort((a, b) => a.price - b.price);
  return listings;
}

// ── Simulated Search — Tier 2 ──
function searchTier2(v: Vehicle, market: string, tier1Count: number) {
  if (tier1Count >= 8) return { listings: [] as Listing[], equipAnalysis: null };

  const age = 2026 - v.year;
  const modelKey = Object.keys(MODEL_BASELINES).find(
    (k) => v.brand + " " + v.model.split(" ")[0] === k || (v.brand + " " + v.model).includes(k)
  );
  const bl = MODEL_BASELINES[modelKey || ""] || { baseNewPrice: 420000, avgMil: 1300 };
  const sources = SEARCH_SOURCES[market] || SEARCH_SOURCES.US;
  const listings: Listing[] = [];

  for (let yearDiff = -2; yearDiff <= 2; yearDiff++) {
    if (yearDiff === 0) continue;
    const adjYear = v.year + yearDiff;
    const adjAge = 2026 - adjYear;
    const adjAgeFactor = AGE_CURVE[Math.min(adjAge, 10)] || 0.3;
    const adjPrice = Math.round(bl.baseNewPrice * adjAgeFactor * 0.92);

    for (const src of sources.slice(0, 2)) {
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        listings.push({
          source: src, tier: 2, matchScore: 0.65 + Math.random() * 0.1,
          price: Math.round((adjPrice * (1 + (Math.random() * 0.2 - 0.1))) / 1000) * 1000,
          mileage: Math.round((bl.avgMil || 1300) * adjAge * (0.8 + Math.random() * 0.4)),
          year: adjYear, brand: v.brand, model: v.model,
          isDealer: Math.random() > 0.5, region: "National",
          daysListed: Math.floor(Math.random() * 60) + 5,
          url: `https://${src.url}/listings/${10000000 + Math.floor(Math.random() * 89999999)}`,
        });
      }
    }
  }

  const equipAnalysis = {
    packageEffect: { "AWD vs FWD": "+5-8% in asking price" },
    commonEquip: ["Navigation", "Parking Sensors", "Leather Upholstery", "LED Headlights"],
    equipPremium: 0.06,
  };

  return { listings, equipAnalysis };
}

// ── Simulated Search — Tier 3 ──
function searchTier3(v: Vehicle, market: string, combinedCount: number): Listing[] {
  if (combinedCount >= 12) return [];
  const ownPrestige = BRAND_PRESTIGE[v.brand] || 1.0;

  let segment: { label: string; models: { brand: string; model: string }[] } | null = null;
  for (const [, seg] of Object.entries(SEGMENT_COMPARABLES)) {
    if (seg.models.some((m) => m.brand === v.brand && v.model.includes(m.model))) { segment = seg; break; }
  }
  if (!segment) return [];

  const comparables = segment.models.filter((m) => m.brand !== v.brand).slice(0, 3);
  const sources = SEARCH_SOURCES[market] || SEARCH_SOURCES.US;
  const listings: Listing[] = [];

  for (const comp of comparables) {
    const compPrestige = BRAND_PRESTIGE[comp.brand] || 1.0;
    const compKey = comp.brand + " " + comp.model;
    const compBl = MODEL_BASELINES[compKey] || { baseNewPrice: 420000 };
    const age = 2026 - v.year;
    const ageFactor = AGE_CURVE[Math.min(age, 10)] || 0.3;
    const compPrice = Math.round(compBl.baseNewPrice * ageFactor * 0.9 * (ownPrestige / compPrestige));
    const src = sources[0];

    for (let i = 0; i < 2; i++) {
      listings.push({
        source: src, tier: 3, matchScore: 0.45 + Math.random() * 0.1,
        price: Math.round((compPrice * (1 + (Math.random() * 0.15 - 0.075))) / 1000) * 1000,
        mileage: Math.round(1300 * age * (0.8 + Math.random() * 0.4)),
        year: v.year, brand: comp.brand, model: comp.model,
        isDealer: Math.random() > 0.5, region: "National",
        daysListed: Math.floor(Math.random() * 45) + 3,
        url: `https://${src.url}/listings/${10000000 + Math.floor(Math.random() * 89999999)}`,
        prestigeAdj: ownPrestige / compPrestige,
      });
    }
  }
  return listings;
}

// ═══════════════════════════════════════════════════════════════
// EMPIRICAL MILEAGE ANALYSIS
// ═══════════════════════════════════════════════════════════════

export function analyzeMileageFromAds(listings: Listing[], vehicleMil: number, expectedMil: number): MileageAnalysis {
  if (!listings || listings.length < 12 || expectedMil <= 0) return { method: "theoretical", factor: null, confidence: 0 };

  const BKTS = [
    { min: 0, max: 0.5 }, { min: 0.5, max: 0.7 }, { min: 0.7, max: 0.85 },
    { min: 0.85, max: 1.0 }, { min: 1.0, max: 1.15 }, { min: 1.15, max: 1.3 },
    { min: 1.3, max: 1.6 }, { min: 1.6, max: 2.0 }, { min: 2.0, max: 99 },
  ];

  const filled = BKTS.map((d) => {
    const inB = listings.filter((l) => { const r = (l.mileage || 0) / expectedMil; return r >= d.min && r < d.max; });
    if (inB.length === 0) return { ...d, count: 0, avgPrice: null as number | null, avgMil: 0 };
    const ps = inB.map((l) => l.price).sort((a, b) => a - b);
    const tr = ps.length >= 5 ? ps.slice(1, -1) : ps;
    return { ...d, count: inB.length, avgPrice: Math.round(tr.reduce((s, p) => s + p, 0) / tr.length), avgMil: Math.round(inB.reduce((s, l) => s + (l.mileage || 0), 0) / inB.length) };
  });

  const normLst = listings.filter((l) => { const r = (l.mileage || 0) / expectedMil; return r >= 0.85 && r < 1.15; });
  let refPrice: number;
  if (normLst.length >= 3) {
    const np = normLst.map((l) => l.price).sort((a, b) => a - b);
    const tr = np.length >= 5 ? np.slice(1, -1) : np;
    refPrice = Math.round(tr.reduce((s, p) => s + p, 0) / tr.length);
  } else {
    refPrice = Math.round(listings.reduce((s, l) => s + l.price, 0) / listings.length);
  }

  const effects = filled
    .filter((b) => b.count > 0 && b.avgPrice !== null)
    .map((b) => ({
      ...b,
      effect: b.avgPrice! - refPrice,
      effectPct: Math.round(((b.avgPrice! - refPrice) / refPrice) * 1000) / 10,
      factor: Math.round((b.avgPrice! / refPrice) * 1000) / 1000,
    }));

  const vRatio = vehicleMil / expectedMil;
  let vBucket = effects.find((b) => vRatio >= b.min && vRatio < b.max);
  let empFactor = vBucket ? vBucket.factor : vRatio < 0.5 && effects[0] ? effects[0].factor : effects.length > 0 ? effects[effects.length - 1].factor : 1.0;

  // Interpolation
  const sorted = effects.sort((a, b) => a.min - b.min);
  for (let i = 0; i < sorted.length - 1; i++) {
    const c = sorted[i], nx = sorted[i + 1];
    if (vRatio >= (c.min + c.max) / 2 && vRatio < (nx.min + nx.max) / 2 && c.avgMil && nx.avgMil) {
      const t = (vRatio - (c.min + c.max) / 2) / ((nx.min + nx.max) / 2 - (c.min + c.max) / 2);
      empFactor = Math.round((c.factor + t * (nx.factor - c.factor)) * 1000) / 1000;
    }
  }

  // R²
  const n = listings.length;
  const mis = listings.map((l) => l.mileage || 0);
  const prices = listings.map((l) => l.price);
  const sX = mis.reduce((s, x) => s + x, 0), sY = prices.reduce((s, y) => s + y, 0);
  const sXY = mis.reduce((s, x, i) => s + x * prices[i], 0), sX2 = mis.reduce((s, x) => s + x * x, 0);
  const slope = (n * sXY - sX * sY) / (n * sX2 - sX * sX);
  const yM = sY / n;
  const ssT = prices.reduce((s, y) => s + Math.pow(y - yM, 2), 0);
  const ssR = mis.reduce((s, x, i) => s + Math.pow(prices[i] - (sY / n - (slope * sX) / n + slope * x), 2), 0);
  const r2 = ssT > 0 ? Math.round((1 - ssR / ssT) * 1000) / 1000 : 0;

  const empConf = Math.round(
    Math.min(normLst.length / 5, 1) * 30 +
    Math.min(n / 30, 1) * 30 +
    (effects.filter((b) => b.count >= 2).length / 9) * 20 +
    Math.min(r2 / 0.3, 1) * 20
  );

  return {
    method: empConf >= 40 ? "empirical" : "hybrid",
    factor: empFactor, referencePrice: refPrice,
    vehicleRatio: Math.round(vRatio * 100) / 100,
    buckets: effects,
    regression: { slope: Math.round(slope), krPer10Mil: Math.round(slope * 10), rSquared: r2 },
    confidence: empConf, totalListings: n, normalListings: normLst.length,
  };
}

// ═══════════════════════════════════════════════════════════════
// CONFIDENCE CALCULATION
// ═══════════════════════════════════════════════════════════════

export function calcRealtimeConfidence(t1: number, t2: number, t3: number, sources: number, spread: number, regions: number, isActive: boolean): number {
  let score = 0;
  score += Math.min((t1 / 12) * 30, 30);
  score += Math.min((t2 / 8) * 15, 15);
  score += Math.min((t3 / 6) * 15, 15);
  score += Math.min((sources / 3) * 15, 15);
  score += spread <= 10 ? 20 : spread <= 15 ? 15 : spread <= 20 ? 10 : spread <= 30 ? 5 : 2;
  score += Math.min(regions * 5, 10);
  if (isActive) score = Math.min(score + 5, 100);
  return Math.round(Math.min(score, 100));
}

// ═══════════════════════════════════════════════════════════════
// MAIN: calcMarketValue() — Market Anchor + 12-step adjustment
// ═══════════════════════════════════════════════════════════════

export function calcMarketValue(v: Vehicle): ValuationResult {
  const market = v.regCountry || "US";
  const region = v.regRegion || "westcoast";

  // ══ STEP A: Get market price ══
  const tier1 = searchTier1(v, market);
  const t2Result = searchTier2(v, market, tier1.length);
  const tier2 = t2Result.listings;
  const equipAnalysis = t2Result.equipAnalysis;
  const tier3 = searchTier3(v, market, tier1.length + tier2.length);
  const allListings = [...tier1, ...tier2, ...tier3];

  // Weighted median — market anchor
  const weighted = allListings.map((l) => ({
    price: l.price,
    weight: l.matchScore * (l.source?.weight || 1) * (l.isDealer ? 0.92 : 1.0),
  }));
  weighted.sort((a, b) => a.price - b.price);
  const totalWeight = weighted.reduce((s, w) => s + w.weight, 0);
  let cumWeight = 0;
  let marketAnchor = weighted[Math.floor(weighted.length / 2)]?.price || 0;
  for (const w of weighted) {
    cumWeight += w.weight;
    if (cumWeight >= totalWeight / 2) { marketAnchor = w.price; break; }
  }

  // Price spread
  const prices = allListings.filter((l) => l.tier === 1).map((l) => l.price).sort((a, b) => a - b);
  const p25 = prices[Math.floor(prices.length * 0.25)] || marketAnchor;
  const p75 = prices[Math.floor(prices.length * 0.75)] || marketAnchor;
  const spread = marketAnchor > 0 ? Math.round(((p75 - p25) / marketAnchor) * 100) : 0;

  // Average market mileage
  const t1Mileages = tier1.map((l) => l.mileage).filter((m) => m > 0);
  const avgMarketMileage = t1Mileages.length > 0 ? Math.round(t1Mileages.reduce((s, m) => s + m, 0) / t1Mileages.length) : 0;

  // ══ STEP B: 12-step adjustment ══
  const age = 2026 - v.year;
  const modelKey = Object.keys(MODEL_BASELINES).find(
    (k) => v.brand + " " + v.model.split(" ")[0] === k || (v.brand + " " + v.model).includes(k)
  );
  let baseline: ModelBaseline | null = MODEL_BASELINES[modelKey || ""] || null;
  let usedFallback = false;
  let fallbackData = null;

  if (!baseline) {
    fallbackData = findComparableBaseline(v.brand, v.model, v.body, v.hp);
    if (fallbackData) { baseline = fallbackData; usedFallback = true; }
    else {
      baseline = {
        baseNewPrice: 400000, motors: {}, fuels: {},
        drives: { FWD: 0, AWD: 22000 }, trans: { manuell: 0, auto: 18000 },
        trims: {}, paintMod: { solid: 0, metallic: 10000 }, avgMil: 1300,
      };
      usedFallback = true;
    }
  }

  const survivalFactor = Math.max(0.3, Math.sqrt(AGE_CURVE[Math.min(age, 10)] || 0.3));

  // Step 1: Market Anchor
  const step1_anchor = marketAnchor;

  // Step 2: Mileage adjustment
  const miNum = parseMileage(v.mi) / 10;
  const fk = fuelKey(v.fuel);
  const expectedMil = age * (AVG_MIL_PER_YEAR[fk] || 1300);
  const empAnalysis = analyzeMileageFromAds(tier1, miNum * 10, expectedMil);

  let step2_miAdj: number;
  if (empAnalysis.method === "empirical" && empAnalysis.factor !== null) {
    step2_miAdj = Math.round(step1_anchor * (empAnalysis.factor - 1));
  } else if (empAnalysis.method === "hybrid" && empAnalysis.factor !== null) {
    const empAdj = Math.round(step1_anchor * (empAnalysis.factor - 1));
    const miDiff = miNum * 10 - avgMarketMileage;
    const miAdjPerMil = MILEAGE_ADJ_PER_MIL[Math.min(age, 10)] || 20;
    const theoAdj = -Math.round((miDiff / 10) * miAdjPerMil);
    step2_miAdj = Math.round(empAdj * 0.7 + theoAdj * 0.3);
  } else {
    const miDiff = miNum * 10 - avgMarketMileage;
    const miAdjPerMil = MILEAGE_ADJ_PER_MIL[Math.min(age, 10)] || 20;
    step2_miAdj = -Math.round((miDiff / 10) * miAdjPerMil);
  }

  // Steps 3-10
  const step3_motorAdj = Math.round(((baseline.motors?.[v.motorVariant || ""] || 0) - (baseline.motors?.[v.baseMotor || ""] || 0)) * survivalFactor);
  const step4_fuelAdj = Math.round(((baseline.fuels?.[v.fuelType || ""] || 0) - (baseline.fuels?.[v.baseFuel || ""] || 0)) * survivalFactor);
  const step5_driveAdj = Math.round((baseline.drives?.[v.driveVariant || ""] || 0) * survivalFactor);
  const step6_transAdj = Math.round(((baseline.trans?.[v.transVariant || ""] || 0) - (baseline.trans?.[v.baseTrans || ""] || 0)) * survivalFactor);
  const step7_trimAdj = Math.round(((baseline.trims?.[v.trimLevel || ""] || 0) - (baseline.trims?.[v.baseTrim || ""] || 0)) * survivalFactor);
  const step8_paintAdj = baseline.paintMod?.[v.paintType || ""] || 0;

  // Step 9: Extra equipment
  const equipResKey = nearestKey(EQUIP_RESIDUAL_CURVE, age);
  const equipRes = EQUIP_RESIDUAL_CURVE[equipResKey] || 0.12;
  const extraTotal = (v.extraEquip || []).reduce((sum, e) => sum + (EQUIP_VALUES[e] ?? 4000), 0);
  const step9_extraAdj = Math.round(extraTotal * equipRes);

  // Step 10: Missing equipment
  const missingTotal = (v.missingEquip || []).reduce((sum, e) => sum + (EQUIP_VALUES[e] ?? 3000), 0);
  const step10_missingAdj = -Math.round(missingTotal * equipRes);

  // Step 11: Condition
  let condPenalty = 0;
  (v.devs || []).forEach((d) => { condPenalty += CONDITION_ADJ[d.sev] || 0; });
  const step11_condAdj = Math.round(step1_anchor * condPenalty);

  // Step 12: Total
  const totalAdj = step2_miAdj + step3_motorAdj + step4_fuelAdj + step5_driveAdj + step6_transAdj + step7_trimAdj + step8_paintAdj + step9_extraAdj + step10_missingAdj + step11_condAdj;
  const step12_total = Math.round((step1_anchor + totalAdj) / 1000) * 1000;

  // Confidence
  const confidence = calcRealtimeConfidence(
    tier1.length, tier2.length, tier3.length,
    Object.keys(SEARCH_SOURCES[market] || {}).length || 3,
    spread, 1, true
  );

  return {
    marketAnchor: step1_anchor,
    tier1Count: tier1.length, tier2Count: tier2.length, tier3Count: tier3.length,
    totalListings: allListings.length, avgMarketMileage, spread,
    equipAnalysis, empAnalysis,
    steps: [
      { nr: 1, label: "Market Anchor", desc: `Average ${tier1.length} active listings, ${v.brand} ${v.model.split(" ")[0]} ${v.year}, ${REGIONS_US[region]?.name || region}`, value: step1_anchor, type: "base" },
      { nr: 2, label: "Mileage", desc: empAnalysis.method === "empirical" ? `Empirical: ${empAnalysis.totalListings} listings, ratio ${empAnalysis.vehicleRatio}` : `Mileage ${miNum * 10} vs expected ${Math.round(expectedMil)} mi`, value: step2_miAdj, type: "adjust" },
      { nr: 3, label: "Engine Variant", desc: v.motorVariant && v.motorVariant !== v.baseMotor ? `${v.motorVariant} vs ${v.baseMotor}` : null, value: step3_motorAdj, type: "adjust" },
      { nr: 4, label: "Fuel", desc: v.fuelType && v.fuelType !== v.baseFuel ? `${v.fuelType} vs ${v.baseFuel}` : null, value: step4_fuelAdj, type: "adjust" },
      { nr: 5, label: "Drivetrain", desc: v.driveVariant && v.driveVariant !== "FWD" ? v.driveVariant : null, value: step5_driveAdj, type: "adjust" },
      { nr: 6, label: "Transmission", desc: v.transVariant !== v.baseTrans ? `${v.transVariant} vs ${v.baseTrans}` : null, value: step6_transAdj, type: "adjust" },
      { nr: 7, label: "Trim Level", desc: v.trimLevel && v.trimLevel !== v.baseTrim ? `${v.trimLevel} vs ${v.baseTrim}` : null, value: step7_trimAdj, type: "adjust" },
      { nr: 8, label: "Paint", desc: v.paintType && v.paintType !== "solid" ? v.paintType : null, value: step8_paintAdj, type: "adjust" },
      { nr: 9, label: "Extra Equipment", desc: (v.extraEquip || []).length > 0 ? `${(v.extraEquip || []).length} extras (${Math.round(equipRes * 100)}% residual)` : null, value: step9_extraAdj, type: "adjust" },
      { nr: 10, label: "Missing Equipment", desc: (v.missingEquip || []).length > 0 ? `${(v.missingEquip || []).length} missing` : null, value: step10_missingAdj, type: "adjust" },
      { nr: 11, label: "Condition Assessment", desc: "No condition test performed", value: 0, type: "adjust" },
      { nr: 12, label: "Market Value", desc: "Market Anchor + all adjustments", value: step12_total, type: "result" },
    ],
    totalValue: step12_total, usedFallback, fallbackData, confidence,
    baseNewPrice: baseline.baseNewPrice, survivalFactor,
    tierBreakdown: {
      tier1: { count: tier1.length, avgPrice: tier1.length > 0 ? Math.round(tier1.reduce((s, l) => s + l.price, 0) / tier1.length) : 0 },
      tier2: { count: tier2.length, avgPrice: tier2.length > 0 ? Math.round(tier2.reduce((s, l) => s + l.price, 0) / tier2.length) : 0 },
      tier3: { count: tier3.length, avgPrice: tier3.length > 0 ? Math.round(tier3.reduce((s, l) => s + l.price, 0) / tier3.length) : 0 },
    },
    listings: { tier1, tier2, tier3, all: allListings },
  };
}
