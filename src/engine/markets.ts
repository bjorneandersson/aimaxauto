// ═══════════════════════════════════════════════════════════════
// AIMAXAUTO VALUATION ENGINE — Regional & Export/Import
// ═══════════════════════════════════════════════════════════════

import type { Vehicle, RegionalResult, ExportResult } from "./types";
import { REGIONS_US, VAT_RATES } from "./data";
import { fuelKey } from "./utils";
import { calcMarketValue } from "./valuation";

// ── Model-specific market factors per country ──
const MODEL_MARKET_FACTORS: Record<string, Record<string, number>> = {
  "Tesla Model Y": { US: 1.0, NO: 1.14, DE: 0.97, DK: 0.89, FI: 0.96, FR: 0.95, NL: 1.04, AT: 0.96, IT: 0.91, ES: 0.89, PL: 0.79, BE: 0.97 },
  "Tesla Model 3": { US: 1.0, NO: 1.12, DE: 0.96, DK: 0.88, FI: 0.95, FR: 0.94, NL: 1.02, AT: 0.95, IT: 0.9, ES: 0.88, PL: 0.78, BE: 0.96 },
  "BMW X3": { US: 1.0, NO: 0.94, DE: 0.88, DK: 0.8, FI: 0.93, FR: 0.9, NL: 0.92, AT: 0.91, IT: 0.93, ES: 0.89, PL: 0.76, BE: 0.91 },
  "Mercedes GLC": { US: 1.0, NO: 0.95, DE: 0.87, DK: 0.79, FI: 0.92, FR: 0.91, NL: 0.93, AT: 0.9, IT: 0.94, ES: 0.9, PL: 0.77, BE: 0.92 },
  "Toyota RAV4": { US: 1.0, NO: 1.04, DE: 0.92, DK: 0.86, FI: 1.01, FR: 0.88, NL: 0.9, AT: 0.91, IT: 0.85, ES: 0.84, PL: 0.74, BE: 0.89 },
  "Honda CR-V": { US: 1.0, NO: 1.02, DE: 0.94, DK: 0.85, FI: 0.97, FR: 0.88, NL: 0.91, AT: 0.92, IT: 0.86, ES: 0.84, PL: 0.78, BE: 0.9 },
  "Kia EV6": { US: 1.0, NO: 1.14, DE: 0.94, DK: 0.86, FI: 0.93, FR: 0.91, NL: 1.04, AT: 0.93, IT: 0.87, ES: 0.85, PL: 0.75, BE: 0.95 },
  "Hyundai Tucson": { US: 1.0, NO: 1.01, DE: 0.93, DK: 0.84, FI: 0.96, FR: 0.87, NL: 0.9, AT: 0.91, IT: 0.85, ES: 0.83, PL: 0.77, BE: 0.89 },
  "Ford F-150": { US: 1.0, NO: 0.7, DE: 0.65, DK: 0.6, FI: 0.72, FR: 0.6, NL: 0.62, AT: 0.63, IT: 0.58, ES: 0.6, PL: 0.55, BE: 0.62 },
  "Chevrolet Silverado": { US: 1.0, NO: 0.65, DE: 0.6, DK: 0.55, FI: 0.68, FR: 0.55, NL: 0.58, AT: 0.58, IT: 0.55, ES: 0.55, PL: 0.5, BE: 0.58 },
};

// ── EXPORT COSTS per country ──
const EXPORT_FEES: Record<string, { deReg: number; exportCert: number; plates: number; admin: number; desc: string }> = {
  US: { deReg: 50, exportCert: 200, plates: 50, admin: 300, desc: "Title transfer + export documentation" },
  SE: { deReg: 350, exportCert: 400, plates: 150, admin: 800, desc: "Avregistrering + exportcertifikat" },
  NO: { deReg: 500, exportCert: 450, plates: 200, admin: 900, desc: "Avregistrering + export documents" },
  DE: { deReg: 15, exportCert: 50, plates: 30, admin: 200, desc: "Abmeldung + Ausfuhrkennzeichen" },
  DK: { deReg: 300, exportCert: 350, plates: 200, admin: 700, desc: "Afregistrering + export docs" },
  FI: { deReg: 300, exportCert: 350, plates: 150, admin: 600, desc: "De-registration + export docs" },
  FR: { deReg: 200, exportCert: 300, plates: 100, admin: 500, desc: "Radiation + certificat de cession" },
  NL: { deReg: 100, exportCert: 150, plates: 50, admin: 400, desc: "Uitschrijving RDW" },
  AT: { deReg: 200, exportCert: 250, plates: 100, admin: 500, desc: "Abmeldung + Ausfuhrpapiere" },
  IT: { deReg: 300, exportCert: 400, plates: 150, admin: 700, desc: "Radiazione PRA" },
  ES: { deReg: 200, exportCert: 350, plates: 100, admin: 600, desc: "Baja definitiva" },
  PL: { deReg: 150, exportCert: 200, plates: 80, admin: 400, desc: "Wyrejestrowanie" },
  BE: { deReg: 150, exportCert: 200, plates: 80, admin: 400, desc: "Radiation DIV" },
};

// ── IMPORT COSTS per country ──
const IMPORT_FEES: Record<string, any> = {
  US: { inspection: 500, regCert: 200, plates: 50, admin: 300, regTaxRate: 0, evExempt: true, evBonus: 0, importVATRate: 0, desc: "State registration + inspection" },
  SE: { inspection: 4500, regCert: 1200, plates: 300, admin: 2500, regTaxRate: 0, evExempt: true, evBonus: 0, importVATRate: 0.25, desc: "State registration" },
  NO: { inspection: 3000, regCert: 1500, plates: 400, admin: 2200, regTaxRate: 0, evExempt: true, evBonus: 0, importVATRate: 0.25, desc: "EU-kontroll + registration" },
  DE: { inspection: 120, regCert: 30, plates: 60, admin: 200, regTaxRate: 0, evExempt: true, evBonus: 50400, importVATRate: 0.19, desc: "TÜV + Zulassung" },
  DK: { inspection: 600, regCert: 400, plates: 200, admin: 1500, regTaxRate: 0.85, evExempt: false, evBonusRate: 0.4, importVATRate: 0.25, desc: "Syn + registreringsafgift (85%)" },
  FI: { inspection: 500, regCert: 400, plates: 200, admin: 1200, regTaxRate: 0.05, evExempt: true, evBonus: 0, importVATRate: 0.24, desc: "Inspection + autovero" },
  FR: { inspection: 120, regCert: 200, plates: 50, admin: 500, regTaxRate: 0, evExempt: true, evBonus: 56000, importVATRate: 0.2, desc: "Contrôle technique + carte grise" },
  NL: { inspection: 100, regCert: 120, plates: 50, admin: 350, regTaxRate: 0.42, evExempt: true, evBonus: 0, importVATRate: 0.21, desc: "APK + RDW + BPM" },
  AT: { inspection: 120, regCert: 200, plates: 80, admin: 400, regTaxRate: 0.02, evExempt: true, evBonus: 33600, importVATRate: 0.2, desc: "§57a + NoVA + Zulassung" },
  IT: { inspection: 200, regCert: 350, plates: 150, admin: 600, regTaxRate: 0, evExempt: true, evBonus: 33600, importVATRate: 0.22, desc: "Revisione + PRA" },
  ES: { inspection: 150, regCert: 200, plates: 100, admin: 500, regTaxRate: 0, evExempt: true, evBonus: 50400, importVATRate: 0.21, desc: "ITV + matriculación" },
  PL: { inspection: 100, regCert: 150, plates: 80, admin: 300, regTaxRate: 0, evExempt: true, evBonus: 0, importVATRate: 0.23, desc: "Przegląd + rejestracja" },
  BE: { inspection: 100, regCert: 150, plates: 80, admin: 400, regTaxRate: 0.03, evExempt: true, evBonus: 0, importVATRate: 0.21, desc: "Contrôle technique + DIV" },
};

// ═══════════════════════════════════════════════════════════════
// REGIONAL VALUES
// ═══════════════════════════════════════════════════════════════

export function calcRegionalValues(v: Vehicle): RegionalResult {
  const val = calcMarketValue(v);
  const baseValue = val.totalValue;
  const fk = fuelKey(v.fuel);
  const regions: Record<string, any> = {};

  for (const [key, reg] of Object.entries(REGIONS_US)) {
    const coeff = reg.coeff?.[fk] || 1.0;
    const regValue = Math.round((baseValue * coeff) / 1000) * 1000;
    const isHome = key === (v.regRegion || "westcoast");
    regions[key] = { ...reg, value: regValue, coeff, isHome, diff: regValue - baseValue, diffPercent: Math.round((coeff - 1) * 100) };
  }

  return { homeRegion: v.regRegion || "westcoast", homeValue: baseValue, regions };
}

// ═══════════════════════════════════════════════════════════════
// NVV — Net Vehicle Value (ex. VAT)
// ═══════════════════════════════════════════════════════════════

export function calcNVV(v: Vehicle) {
  const val = calcMarketValue(v);
  const vatRate = VAT_RATES[v.regCountry || "US"] || 0;
  const nvv = Math.round(val.totalValue / (1 + vatRate));
  return { nvv, grossValue: val.totalValue, vatRate, vatAmount: val.totalValue - nvv };
}

// ═══════════════════════════════════════════════════════════════
// EXPORT & IMPORT FEES
// ═══════════════════════════════════════════════════════════════

export function calcExportFees(fromCountry: string) {
  const fees = EXPORT_FEES[fromCountry] || EXPORT_FEES.US;
  const total = fees.deReg + fees.exportCert + fees.plates + fees.admin;
  return { ...fees, total, isPreliminary: true, label: "Preliminary export costs" };
}

export function calcImportFees(toCountry: string, vehicleNVV: number, isEV: boolean) {
  const fees = IMPORT_FEES[toCountry] || IMPORT_FEES.US;
  const baseFees = fees.inspection + fees.regCert + fees.plates + fees.admin;
  let regTax = 0;
  if (fees.regTaxRate > 0) {
    if (isEV && fees.evExempt) regTax = 0;
    else if (isEV && fees.evBonusRate) regTax = Math.round(vehicleNVV * fees.regTaxRate * fees.evBonusRate);
    else regTax = Math.round(vehicleNVV * fees.regTaxRate);
  }
  const importVAT = Math.round(vehicleNVV * fees.importVATRate);
  const evBonus = isEV ? fees.evBonus || 0 : 0;
  const total = baseFees + regTax + importVAT - evBonus;
  return { baseFees, regTax, importVAT, evBonus, total, ...fees, isPreliminary: true };
}

// ═══════════════════════════════════════════════════════════════
// SPECULATIVE VALUE — Vehicle value on another market
// ═══════════════════════════════════════════════════════════════

export function calcSpeculativeValue(v: Vehicle, targetMarket: string) {
  const homeVal = calcMarketValue(v);
  const homeNVV = Math.round(homeVal.totalValue / (1 + (VAT_RATES[v.regCountry || "US"] || 0)));
  const modelKey = Object.keys(MODEL_MARKET_FACTORS).find(
    (k) => (v.brand + " " + v.model).includes(k) || v.brand + " " + v.model.split(" ")[0] === k
  );
  const mf = MODEL_MARKET_FACTORS[modelKey || ""] || null;
  const homeFactor = mf ? mf[v.regCountry || "US"] || 1.0 : 1.0;
  const targetFactor = mf ? mf[targetMarket] || 0.9 : 0.9;
  const relativeFactor = targetFactor / homeFactor;
  const targetVAT = VAT_RATES[targetMarket] || 0.2;
  const speculativeGross = Math.round((homeNVV * (1 + targetVAT) * relativeFactor) / 1000) * 1000;
  const isEV = v.fuel === "Electric" || v.fuel === "BEV";
  const exportFees = calcExportFees(v.regCountry || "US");
  const importFeesResult = calcImportFees(targetMarket, homeNVV, isEV);

  return {
    homeValue: homeVal.totalValue, homeNVV, targetMarket,
    modelFactor: relativeFactor, targetVAT, speculativeGross,
    diff: speculativeGross - homeVal.totalValue,
    diffPercent: Math.round(((speculativeGross - homeVal.totalValue) / homeVal.totalValue) * 100),
    exportFees, importFees: importFeesResult,
    totalFees: exportFees.total + importFeesResult.total,
    netDiff: speculativeGross - homeVal.totalValue - exportFees.total - importFeesResult.total,
    isModelSpecific: !!mf, confidence: mf ? 65 : 40, isPreliminary: true,
  };
}

// ═══════════════════════════════════════════════════════════════
// FIND BEST SELL MARKET
// ═══════════════════════════════════════════════════════════════

export function findBestSellMarket(v: Vehicle): ExportResult {
  const markets = ["NO", "DE", "DK", "FI", "FR", "NL", "AT", "IT", "ES", "PL", "BE"];
  const results = markets.map((m) => {
    const spec = calcSpeculativeValue(v, m);
    return {
      country: m, speculativeValue: spec.speculativeGross,
      exportFees: spec.exportFees.total, importFees: spec.importFees.total,
      totalFees: spec.totalFees,
      netVsHome: spec.netDiff,
      netVsHomePercent: Math.round((spec.netDiff / spec.homeValue) * 100),
      isOpportunity: spec.netDiff > 0, isPreliminary: true,
    };
  });
  results.sort((a, b) => (b.netVsHome || 0) - (a.netVsHome || 0));
  return {
    homeValue: calcMarketValue(v).totalValue, homeMarket: v.regCountry || "US",
    results, bestMarket: results[0], opportunities: results.filter((r) => r.isOpportunity),
    disclaimer: "All costs are preliminary and subject to changes",
  };
}

// ═══════════════════════════════════════════════════════════════
// FIND BEST BUY MARKET
// ═══════════════════════════════════════════════════════════════

export function findBestBuyMarket(v: Vehicle) {
  const markets = ["NO", "DE", "DK", "FI", "FR", "NL", "AT", "IT", "ES", "PL", "BE"];
  const homeVal = calcMarketValue(v);
  const homeCountry = v.regCountry || "US";
  const isEV = v.fuel === "Electric" || v.fuel === "BEV";
  const results = markets.map((m) => {
    const spec = calcSpeculativeValue(v, m);
    const foreignPrice = spec.speculativeGross;
    const foreignVAT = VAT_RATES[m] || 0.2;
    const foreignNVV = Math.round(foreignPrice / (1 + foreignVAT));
    const expFees = calcExportFees(m);
    const impFees = calcImportFees(homeCountry, foreignNVV, isEV);
    const totalCost = foreignNVV + expFees.total + impFees.total;
    return {
      country: m, foreignPrice, foreignNVV,
      exportFees: expFees.total, importFees: impFees.total,
      totalCost, savings: homeVal.totalValue - totalCost,
      savingsPercent: Math.round(((homeVal.totalValue - totalCost) / homeVal.totalValue) * 100),
      isOpportunity: homeVal.totalValue - totalCost > 0, isPreliminary: true,
    };
  });
  results.sort((a, b) => (b.savings || 0) - (a.savings || 0));
  return {
    homeValue: homeVal.totalValue, results,
    bestBuy: results[0], opportunities: results.filter((r) => r.isOpportunity),
    disclaimer: "All costs are preliminary and subject to changes",
  };
}

// ═══════════════════════════════════════════════════════════════
// COMPARE ANY TWO MARKETS
// ═══════════════════════════════════════════════════════════════

export function compareAnyMarkets(v: Vehicle, fromMarket: string, toMarket: string) {
  const fromSpec = calcSpeculativeValue(v, fromMarket);
  const toSpec = calcSpeculativeValue(v, toMarket);
  const fromVAT = VAT_RATES[fromMarket] || 0.2;
  const fromNVV = Math.round(fromSpec.speculativeGross / (1 + fromVAT));
  const isEV = v.fuel === "Electric" || v.fuel === "BEV";
  const exportFeesResult = calcExportFees(fromMarket);
  const importFeesResult = calcImportFees(toMarket, fromNVV, isEV);
  return {
    from: { market: fromMarket, value: fromSpec.speculativeGross, nvv: fromNVV },
    to: { market: toMarket, value: toSpec.speculativeGross },
    exportFees: exportFeesResult, importFees: importFeesResult,
    totalFees: exportFeesResult.total + importFeesResult.total,
    netDiff: toSpec.speculativeGross - fromSpec.speculativeGross - exportFeesResult.total - importFeesResult.total,
    isPreliminary: true,
    disclaimer: "All costs are preliminary and subject to changes",
  };
}
