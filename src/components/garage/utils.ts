import type { GarageVehicle } from "@/data/vehicles";
import { MONTHLY_DEPRECIATION } from "@/engine/data";
import { nearestKey } from "@/engine/utils";

export function calcHealth(v: GarageVehicle): number {
  let s = 100;
  if (v.inspSt === "failed") s -= 40;
  else if (v.inspSt === "warning") s -= 20;
  if (v.servNext === "Overdue") s -= 25;
  else if (v.servNext?.includes("2,000")) s -= 10;
  if (v.devs?.length > 0) {
    s -= v.devs.filter((d) => d.sev === "critical").length * 15;
    s -= v.devs.filter((d) => d.sev === "moderate").length * 8;
    s -= v.devs.filter((d) => d.sev === "minor").length * 3;
  }
  return Math.max(0, Math.min(100, s));
}

export function calcMonthlyCost(v: GarageVehicle) {
  const ins = v.ins?.cost || 0;
  const tax = Math.round((v.tax || 0) / 12);
  const serv = v.fuel === "Electric" ? 50 : v.fuel === "Hybrid" ? 65 : 85;
  const age = 2026 - v.year;
  const ageMonths = age * 12;
  const depKey = nearestKey(MONTHLY_DEPRECIATION, ageMonths);
  const baseRate = MONTHLY_DEPRECIATION[depKey] || 0.004;
  const fuelAdj = v.fuel === "Electric" ? -0.001 : v.fuel === "Hybrid" ? -0.0005 : 0;
  const depRate = Math.max(0.002, baseRate + fuelAdj);
  const dep = Math.round((v.valP || 30000) * depRate);
  const fuel = v.fuelActual || 0;
  return { ins, tax, serv, dep, fuel, total: ins + tax + serv + dep + fuel };
}
