// ═══════════════════════════════════════════════════════════════
// AIMAXAUTO VALUATION ENGINE — Timeline, Depreciation & TCO
// ═══════════════════════════════════════════════════════════════

import type { Vehicle, TimelineResult, DepreciationResult, TCOResult } from "./types";
import { MONTHLY_DEPRECIATION } from "./data";
import { parseMileage, nearestKey } from "./utils";
import { calcMarketValue } from "./valuation";

// ═══════════════════════════════════════════════════════════════
// VALUE TIMELINE — 3 months back + 3 months forward
// ═══════════════════════════════════════════════════════════════

export function calcValueTimeline(v: Vehicle): TimelineResult {
  const val = calcMarketValue(v);
  const currentValue = v.valP || val.totalValue;
  const age = 2026 - v.year;

  // Monthly depreciation rate varies by age
  const ageMonths = age * 12;
  const depKey = nearestKey(MONTHLY_DEPRECIATION, ageMonths);
  const baseDepRate = MONTHLY_DEPRECIATION[depKey] || 0.004;

  // Per-vehicle variation: fuel type affects rate
  const fuelAdj = v.fuel === "Electric" ? -0.001 : v.fuel === "Hybrid" ? -0.0005 : v.fuel === "Diesel" ? 0.001 : 0;
  const monthlyDepRate = Math.max(0.002, baseDepRate + fuelAdj);

  // Small seasonal noise for realism
  const seasonNoise = 0.0003;

  // Build 7-month timeline: -3 to +3 relative to today
  const months = [];
  for (let i = -3; i <= 3; i++) {
    let monthValue: number;
    if (i < 0) {
      const pastFactor = 1 + monthlyDepRate * Math.abs(i) + seasonNoise * Math.abs(i);
      monthValue = Math.round((currentValue * pastFactor) / 100) * 100;
    } else if (i === 0) {
      monthValue = currentValue;
    } else {
      const futureFactor = 1 - monthlyDepRate * i - seasonNoise * i;
      monthValue = Math.round((currentValue * futureFactor) / 100) * 100;
    }
    months.push({
      month: i,
      label: i < 0 ? `${Math.abs(i)} mo ago` : i === 0 ? "Today" : `+${i} mo`,
      value: monthValue,
      change: monthValue - currentValue,
      changePercent: Math.round(((monthValue - currentValue) / currentValue) * 1000) / 10,
      isProjection: i > 0,
      isCurrent: i === 0,
    });
  }

  const depreciationPerMonth = Math.round(currentValue * monthlyDepRate);
  const threeMonthsAgo = months.find((m) => m.month === -3)?.value || currentValue;
  const trend = currentValue - threeMonthsAgo;
  const trendPercent = Math.round((trend / threeMonthsAgo) * 1000) / 10;

  return {
    months,
    currentValue,
    threeMonthsAgo,
    trend,
    trendPercent,
    depreciationPerMonth,
    depreciationPerYear: depreciationPerMonth * 12,
    monthlyDepRate,
    fuelAdj,
    projection3m: months.find((m) => m.month === 3)?.value || currentValue,
  };
}

// ═══════════════════════════════════════════════════════════════
// DEPRECIATION — Non-linear depreciation curve
// ═══════════════════════════════════════════════════════════════

export function calcDepreciation(v: Vehicle): DepreciationResult {
  const val = calcMarketValue(v);
  const age = 2026 - v.year;

  // Calculate value at each age point
  const depCurve: { year: number; value: number; factor: number; totalLoss: number; lossPercent: number }[] = [];
  for (let yr = 0; yr <= 10; yr++) {
    const yrMonths = yr * 12;
    const depKeyVal = nearestKey(MONTHLY_DEPRECIATION, yrMonths);
    const rate = MONTHLY_DEPRECIATION[depKeyVal] || 0.002;
    const factor = Math.pow(1 - rate, yrMonths);
    const value = Math.round((val.baseNewPrice * factor) / 1000) * 1000;
    depCurve.push({
      year: yr,
      value,
      factor: Math.round(factor * 100),
      totalLoss: val.baseNewPrice - value,
      lossPercent: Math.round((1 - factor) * 100),
    });
  }

  const currentIdx = Math.min(age, 10);
  const prevYearValue = depCurve[Math.max(currentIdx - 1, 0)]?.value || val.baseNewPrice;
  const currentYearValue = depCurve[currentIdx]?.value || val.totalValue;
  const depPerYear = prevYearValue - currentYearValue;
  const depPerMonth = Math.round(depPerYear / 12);

  return {
    curve: depCurve,
    currentAge: age,
    currentValue: val.totalValue,
    newPrice: val.baseNewPrice,
    totalLoss: val.baseNewPrice - val.totalValue,
    totalLossPercent: Math.round((1 - val.totalValue / val.baseNewPrice) * 100),
    depPerYear,
    depPerMonth,
    yearlyRates: depCurve.map((d, i) => ({
      year: d.year,
      loss: i > 0 ? depCurve[i - 1].value - d.value : 0,
      lossPerMonth: i > 0 ? Math.round((depCurve[i - 1].value - d.value) / 12) : 0,
    })),
  };
}

// ═══════════════════════════════════════════════════════════════
// TCO — Total Cost of Ownership
// ═══════════════════════════════════════════════════════════════

function getFuelCostPerMil(v: Vehicle): number {
  if (v.fuel === "Electric") return 0.04;
  if (v.fuel === "PHEV") return 0.06;
  if (v.fuel === "Hybrid") return 0.08;
  if (v.fuel === "Diesel") return 0.12;
  return 0.14; // gas
}

export function calcTCO(v: Vehicle): TCOResult {
  const val = calcMarketValue(v);
  const fuelCost = getFuelCostPerMil(v);
  const miNum = parseMileage(v.mi);
  const annualMil = miNum / Math.max(2026 - v.year, 1);
  const insurance = v.ins?.cost || 180;
  const tax = Math.round(v.tax || 0);
  const service = v.fuel === "Electric" ? 50 : v.fuel === "Hybrid" ? 65 : 85;
  const tires = 35;
  const fuel = v.fuelActual || Math.round((fuelCost * annualMil) / 12);
  const age = 2026 - v.year;
  const ageMonths = age * 12;
  const depKey = nearestKey(MONTHLY_DEPRECIATION, ageMonths);
  const baseRate = MONTHLY_DEPRECIATION[depKey] || 0.004;
  const fuelAdj = v.fuel === "Electric" ? -0.001 : v.fuel === "Hybrid" ? -0.0005 : 0;
  const depRate = Math.max(0.002, baseRate + fuelAdj);
  const depreciation = Math.round((v.valP || 30000) * depRate);

  const monthly: Record<string, number> = {
    depreciation,
    insurance,
    tax: Math.round(tax / 12),
    service,
    tires,
    fuel,
    total: depreciation + insurance + Math.round(tax / 12) + service + tires + fuel,
  };

  const annual: Record<string, number> = {};
  Object.keys(monthly).forEach((k) => {
    annual[k] = monthly[k] * 12;
  });

  return { monthly, annual, fuelCostPerMil: fuelCost, annualMil: Math.round(annualMil) };
}

// ═══════════════════════════════════════════════════════════════
// SWAP ANALYSIS — Compare against alternatives
// ═══════════════════════════════════════════════════════════════

export function calcSwapAnalysis(v: Vehicle) {
  const currentTCO = calcTCO(v);
  const alternatives: Vehicle[] = [
    {
      brand: "Tesla", model: "Model Y", year: 2024, fuel: "Electric", body: "SUV", hp: 299,
      mi: "800", regRegion: v.regRegion || "westcoast", regCountry: "US",
      motorVariant: "Long Range", baseMotor: "Standard", fuelType: "BEV", baseFuel: "BEV",
      driveVariant: "AWD", transVariant: "auto", baseTrans: "auto",
      trimLevel: "Long Range", baseTrim: "Standard", paintType: "metallic",
      extraEquip: ["Autopilot"], missingEquip: [], devs: [],
    },
    {
      brand: "Volvo", model: "XC40 Recharge", year: 2024, fuel: "Electric", body: "SUV", hp: 231,
      mi: "600", regRegion: v.regRegion || "westcoast", regCountry: "US",
      motorVariant: "Recharge", baseMotor: "B4", fuelType: "BEV", baseFuel: "gas",
      driveVariant: "FWD", transVariant: "auto", baseTrans: "auto",
      trimLevel: "Plus", baseTrim: "Core", paintType: "metallic",
      extraEquip: [], missingEquip: [], devs: [],
    },
    {
      brand: "Kia", model: "EV6", year: 2024, fuel: "Electric", body: "SUV", hp: 325,
      mi: "500", regRegion: v.regRegion || "westcoast", regCountry: "US",
      motorVariant: "Long Range", baseMotor: "Standard", fuelType: "BEV", baseFuel: "BEV",
      driveVariant: "RWD", transVariant: "auto", baseTrans: "auto",
      trimLevel: "GT-Line", baseTrim: "Standard", paintType: "metallic",
      extraEquip: [], missingEquip: [], devs: [],
    },
  ];

  return alternatives.map((alt) => {
    const altVal = calcMarketValue(alt);
    const altTCO = calcTCO(alt);
    const currentVal = calcMarketValue(v);
    const priceDiff = altVal.totalValue - currentVal.totalValue;
    const monthlyDiff = altTCO.monthly.total - currentTCO.monthly.total;
    return {
      brand: alt.brand, model: alt.model, year: alt.year, fuel: alt.fuel,
      value: altVal.totalValue,
      currentValue: currentVal.totalValue,
      priceDiff,
      monthlyTCO: altTCO.monthly.total,
      currentMonthlyTCO: currentTCO.monthly.total,
      monthlyDiff,
      savingsPerYear: monthlyDiff < 0 ? Math.abs(monthlyDiff) * 12 : 0,
      breakEvenMonths: priceDiff > 0 && monthlyDiff < 0 ? Math.ceil(priceDiff / Math.abs(monthlyDiff)) : null,
    };
  });
}
