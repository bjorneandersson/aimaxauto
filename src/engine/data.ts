// ═══════════════════════════════════════════════════════════════
// AIMAXAUTO VALUATION ENGINE — Data Constants
// ═══════════════════════════════════════════════════════════════

import type { ModelBaseline, SearchSource } from "./types";

// ── AGE & MILEAGE CURVES (non-linear) ──
export const AGE_CURVE: Record<number, number> = {
  0: 1.0, 1: 0.82, 2: 0.72, 3: 0.65, 4: 0.58,
  5: 0.52, 6: 0.46, 7: 0.41, 8: 0.37, 9: 0.33, 10: 0.3,
};

export const MIL_CURVE: Record<number, number> = {
  0: 1.0, 1: 0.97, 2: 0.94, 3: 0.91, 4: 0.88,
  5: 0.85, 6: 0.82, 7: 0.79, 8: 0.76, 9: 0.74,
  10: 0.72, 12: 0.68, 15: 0.62, 20: 0.52,
};

export const CONDITION_ADJ: Record<string, number> = {
  critical: -0.08, moderate: -0.04, minor: -0.02,
};

// ── MILEAGE ADJUSTMENT — $ per mi deviation, per age group ──
export const MILEAGE_ADJ_PER_MIL: Record<number, number> = {
  0: 120, 1: 110, 2: 100, 3: 90, 4: 75,
  5: 65, 6: 55, 7: 50, 8: 40, 9: 35, 10: 25,
};

// ── AVERAGE ANNUAL MILEAGE per fuel type ──
export const AVG_MIL_PER_YEAR: Record<string, number> = {
  gas: 12000, diesel: 15000, hybrid: 13000, PHEV: 11000, BEV: 10000,
};

// ── DEPRECIATION CURVE — monthly factors ──
export const MONTHLY_DEPRECIATION: Record<number, number> = {
  0: 0.018, 6: 0.015, 12: 0.012, 18: 0.01, 24: 0.009, 30: 0.008,
  36: 0.007, 48: 0.006, 60: 0.005, 72: 0.004, 84: 0.003, 96: 0.003,
  108: 0.002, 120: 0.002,
};

// ── EQUIPMENT VALUES — 30+ individually valued ──
export const EQUIP_VALUES: Record<string, number> = {
  "Bowers & Wilkins": 1800, "Harman Kardon": 1200, "Premium Audio": 1000, "Bang & Olufsen": 1500,
  "Autopilot": 2500, "Super Cruise": 2000, "Adaptive Cruise": 1200, "360 Camera": 800,
  "Head-Up Display": 1000, "Panoramic Sunroof": 1500, "Moonroof": 1000,
  "Ventilated Seats": 800, "Massage Seats": 1000, "Nappa Leather": 2000, "Leather Seats": 1200,
  "Tow Hitch": 800, "Roof Rails": 400, "Metallic Paint": 1000, "Pearl Paint": 1600,
  "Parking Assist": 600, "Wireless Charging": 200, "Apple CarPlay": 300, "Navigation": 800,
  "Air Suspension": 2000, "Remote Start": 400, "Heated Steering": 300, "Heated Seats": 500,
  "Backup Camera": 400, "Blind Spot Monitor": 400, "Power Liftgate": 600, "Keyless Entry": 500,
  "LED Matrix": 800, "Android Auto": 300, "Sentry Mode": 600, "OTA Updates": 400,
  "Pro Power Onboard": 800,
};

// ── EQUIPMENT RESIDUAL VALUE — non-linear curve ──
export const EQUIP_RESIDUAL_CURVE: Record<number, number> = {
  0: 0.75, 1: 0.6, 2: 0.5, 3: 0.42, 4: 0.35,
  5: 0.3, 6: 0.25, 7: 0.22, 8: 0.18, 9: 0.15, 10: 0.12,
};

// ── MODEL BASELINES — 20 most popular US models ──
export const MODEL_BASELINES: Record<string, ModelBaseline> = {
  "Toyota RAV4": { baseNewPrice: 35000, segment: "compact_suv", motors: { "2.5L": 0, "2.5L Hybrid": 3000, "2.5L PHEV": 8000 }, fuels: { gas: 0, hybrid: 3000, PHEV: 8000 }, drives: { FWD: 0, AWD: 1500 }, trans: { auto: 0 }, trims: { LE: 0, XLE: 2500, Limited: 7000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "Tesla Model Y": { baseNewPrice: 44990, segment: "compact_suv_ev", motors: { Standard: 0, "Long Range": 5000, Performance: 10000 }, fuels: { BEV: 0 }, drives: { RWD: 0, AWD: 3000 }, trans: { auto: 0 }, trims: { Standard: 0, "Long Range": 5000, Performance: 10000 }, paintMod: { solid: 0, metallic: 1000 }, avgMil: 10000 },
  "Tesla Model 3": { baseNewPrice: 38990, segment: "compact_sedan_ev", motors: { Standard: 0, "Long Range": 5000, Performance: 12000 }, fuels: { BEV: 0 }, drives: { RWD: 0, AWD: 3000 }, trans: { auto: 0 }, trims: { Standard: 0, "Long Range": 5000, Performance: 12000 }, paintMod: { solid: 0, metallic: 1000 }, avgMil: 10000 },
  "Ford F-150": { baseNewPrice: 36000, segment: "full_size_truck", motors: { "2.7L V6": 0, "3.5L EcoBoost": 3000, "5.0L V8": 4000 }, fuels: { gas: 0, hybrid: 6000 }, drives: { RWD: 0, "4WD": 4000 }, trans: { auto: 0 }, trims: { XL: 0, XLT: 5000, Lariat: 12000, Platinum: 22000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 14000 },
  "Honda CR-V": { baseNewPrice: 32000, segment: "compact_suv", motors: { "1.5T": 0, "2.0L Hybrid": 3500 }, fuels: { gas: 0, hybrid: 3500 }, drives: { FWD: 0, AWD: 1500 }, trans: { CVT: 0 }, trims: { EX: 0, "EX-L": 3000, "Sport Touring": 5000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "Toyota Camry": { baseNewPrice: 29000, segment: "midsize_sedan", motors: { "2.5L": 0, "2.5L Hybrid": 3000 }, fuels: { gas: 0, hybrid: 3000 }, drives: { FWD: 0, AWD: 1500 }, trans: { auto: 0 }, trims: { LE: 0, SE: 1500, XSE: 4000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "Honda Civic": { baseNewPrice: 25000, segment: "compact_sedan", motors: { "2.0L": 0, "1.5T": 2000 }, fuels: { gas: 0 }, drives: { FWD: 0 }, trans: { CVT: 0 }, trims: { LX: 0, Sport: 2000, Touring: 5000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "Hyundai Tucson": { baseNewPrice: 30000, segment: "compact_suv", motors: { "2.5L": 0, "1.6T Hybrid": 3000 }, fuels: { gas: 0, hybrid: 3000, PHEV: 7000 }, drives: { FWD: 0, AWD: 1500 }, trans: { auto: 0 }, trims: { SE: 0, SEL: 2500, Limited: 5000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "BMW X3": { baseNewPrice: 48000, segment: "midsize_suv", motors: { sDrive30i: 0, xDrive30i: 2000, M40i: 10000 }, fuels: { gas: 0, PHEV: 6000 }, drives: { RWD: 0, AWD: 2000 }, trans: { auto: 0 }, trims: { "": 0, "M Sport": 4000 }, paintMod: { solid: 0, metallic: 1000 }, avgMil: 11000 },
  "Mercedes GLC": { baseNewPrice: 47000, segment: "midsize_suv", motors: { "GLC 300": 0, "GLC 300e": 6000 }, fuels: { gas: 0, PHEV: 6000 }, drives: { RWD: 0, "4MATIC": 2500 }, trans: { auto: 0 }, trims: { "": 0, "AMG Line": 3000 }, paintMod: { solid: 0, metallic: 1000 }, avgMil: 11000 },
  "Ford Mustang Mach-E": { baseNewPrice: 43000, segment: "compact_suv_ev", motors: { Standard: 0, "Extended Range": 5000, GT: 15000 }, fuels: { BEV: 0 }, drives: { RWD: 0, AWD: 3000 }, trans: { auto: 0 }, trims: { Select: 0, Premium: 4000, GT: 15000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 10000 },
  "Chevrolet Silverado": { baseNewPrice: 37000, segment: "full_size_truck", motors: { "2.7L Turbo": 0, "5.3L V8": 2000, "3.0L Duramax": 4000 }, fuels: { gas: 0, diesel: 4000 }, drives: { RWD: 0, "4WD": 4000 }, trans: { auto: 0 }, trims: { WT: 0, LT: 5000, LTZ: 12000, "High Country": 18000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 14000 },
  "Jeep Grand Cherokee": { baseNewPrice: 42000, segment: "midsize_suv", motors: { "3.6L V6": 0, "2.0T 4xe": 6000 }, fuels: { gas: 0, PHEV: 6000 }, drives: { RWD: 0, "4WD": 3000 }, trans: { auto: 0 }, trims: { Laredo: 0, Limited: 6000, Summit: 14000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "Subaru Outback": { baseNewPrice: 33000, segment: "midsize_wagon", motors: { "2.5L": 0, "2.4T": 5000 }, fuels: { gas: 0 }, drives: { AWD: 0 }, trans: { CVT: 0 }, trims: { Base: 0, Premium: 2500, Limited: 5000, Wilderness: 4500 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "Hyundai Ioniq 5": { baseNewPrice: 42000, segment: "compact_suv_ev", motors: { Standard: 0, "Long Range": 4000 }, fuels: { BEV: 0 }, drives: { RWD: 0, AWD: 3000 }, trans: { auto: 0 }, trims: { SE: 0, SEL: 3000, Limited: 6000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 10000 },
  "Kia EV6": { baseNewPrice: 43500, segment: "compact_suv_ev", motors: { Standard: 0, "Long Range": 4000, GT: 20000 }, fuels: { BEV: 0 }, drives: { RWD: 0, AWD: 3000 }, trans: { auto: 0 }, trims: { Wind: 0, "GT-Line": 4000, GT: 20000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 10000 },
  "Toyota Corolla": { baseNewPrice: 23000, segment: "compact_hatchback", motors: { "2.0L": 0, "1.8L HEV": 2000 }, fuels: { gas: 0, hybrid: 2000 }, drives: { FWD: 0, AWD: 1500 }, trans: { CVT: 0 }, trims: { LE: 0, SE: 1500, XSE: 3000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "Chevrolet Equinox": { baseNewPrice: 28000, segment: "compact_suv", motors: { "1.5T": 0 }, fuels: { gas: 0 }, drives: { FWD: 0, AWD: 1500 }, trans: { auto: 0 }, trims: { LS: 0, LT: 2500, RS: 4000, Premier: 6000 }, paintMod: { solid: 0, metallic: 500 }, avgMil: 12000 },
  "Rivian R1S": { baseNewPrice: 78000, segment: "large_suv_ev", motors: { "Dual Motor": 0, "Quad Motor": 12000 }, fuels: { BEV: 0 }, drives: { AWD: 0 }, trans: { auto: 0 }, trims: { Adventure: 0, "Launch Edition": 8000 }, paintMod: { solid: 0, metallic: 1500 }, avgMil: 10000 },
};

// ── BRAND PRESTIGE — 34+ brands ──
export const BRAND_PRESTIGE: Record<string, number> = {
  Porsche: 1.35, Mercedes: 1.18, BMW: 1.15, Audi: 1.12, Lexus: 1.1,
  Volvo: 1.08, Tesla: 1.06, Polestar: 1.05, Jaguar: 1.04, "Land Rover": 1.06,
  Volkswagen: 1.02, Toyota: 1.02, Mazda: 1.01, Subaru: 1.0, Hyundai: 0.98,
  Kia: 0.96, Skoda: 0.97, Ford: 0.95, Peugeot: 0.94,
  Renault: 0.93, Opel: 0.92, Jeep: 0.98, Chevrolet: 0.95, GMC: 1.02,
  Ram: 0.98, Cadillac: 1.1, Lincoln: 1.05, Fiat: 0.9,
  Nissan: 0.95, Honda: 1.0, Suzuki: 0.92, MG: 0.88, Genesis: 1.05, Rivian: 1.08,
  BYD: 0.9, Lucid: 1.08,
  Ferrari: 1.6, Lamborghini: 1.55, Maserati: 1.15, Bentley: 1.45, "Rolls-Royce": 1.5,
};

// ── SEGMENT COMPARABLES — Tier 3 fallback ──
export const SEGMENT_COMPARABLES: Record<string, { label: string; models: { brand: string; model: string }[] }> = {
  compact_suv: { label: "Compact SUV", models: [{ brand: "Toyota", model: "RAV4" }, { brand: "Honda", model: "CR-V" }, { brand: "Hyundai", model: "Tucson" }, { brand: "Kia", model: "Sportage" }, { brand: "Chevrolet", model: "Equinox" }] },
  midsize_suv: { label: "Midsize SUV", models: [{ brand: "BMW", model: "X3" }, { brand: "Mercedes", model: "GLC" }, { brand: "Jeep", model: "Grand Cherokee" }, { brand: "Subaru", model: "Outback" }] },
  large_suv: { label: "Full-Size SUV", models: [{ brand: "Chevrolet", model: "Tahoe" }, { brand: "Ford", model: "Expedition" }, { brand: "Cadillac", model: "Escalade" }] },
  compact_sedan: { label: "Compact Sedan", models: [{ brand: "Honda", model: "Civic" }, { brand: "Toyota", model: "Corolla" }, { brand: "Hyundai", model: "Elantra" }] },
  compact_suv_ev: { label: "Compact SUV EV", models: [{ brand: "Tesla", model: "Model Y" }, { brand: "Ford", model: "Mustang Mach-E" }, { brand: "Hyundai", model: "Ioniq 5" }, { brand: "Kia", model: "EV6" }] },
  full_size_truck: { label: "Full-Size Pickup", models: [{ brand: "Ford", model: "F-150" }, { brand: "Chevrolet", model: "Silverado" }, { brand: "Ram", model: "1500" }, { brand: "Toyota", model: "Tundra" }] },
  compact_hatchback: { label: "Compact Hatchback", models: [{ brand: "Toyota", model: "Corolla" }, { brand: "Honda", model: "Civic" }] },
  small_car: { label: "Subcompact", models: [{ brand: "Hyundai", model: "Venue" }, { brand: "Kia", model: "Soul" }, { brand: "Nissan", model: "Kicks" }] },
};

// ── SEARCH SOURCES per market ──
export const SEARCH_SOURCES: Record<string, SearchSource[]> = {
  US: [
    { id: "autotrader", name: "Autotrader", icon: "🔵", url: "autotrader.com", type: "B2C", weight: 1.0, listingCount: 3500000 },
    { id: "cargurus", name: "CarGurus", icon: "🟢", url: "cargurus.com", type: "C2C+B2C", weight: 0.95, listingCount: 5000000 },
    { id: "carsdotcom", name: "Cars.com", icon: "🔴", url: "cars.com", type: "B2C", weight: 0.9, listingCount: 4500000 },
    { id: "carmax", name: "CarMax", icon: "🟡", url: "carmax.com", type: "B2C", weight: 0.85, listingCount: 85000 },
    { id: "carvana", name: "Carvana", icon: "🟠", url: "carvana.com", type: "B2C", weight: 0.8, listingCount: 75000 },
  ],
};

// ── US REGIONS — coefficients per fuel type ──
export const REGIONS_US: Record<string, { name: string; short: string; lat: number; lng: number; color: string; country: string; coeff: Record<string, number> }> = {
  northeast: { name: "Northeast", short: "NE", lat: 40.71, lng: -74.01, color: "#FF6B00", country: "US", coeff: { gas: 0.98, diesel: 0.97, hybrid: 1.04, PHEV: 1.06, BEV: 1.08 } },
  southeast: { name: "Southeast", short: "SE", lat: 33.75, lng: -84.39, color: "#3b82f6", country: "US", coeff: { gas: 1.02, diesel: 1.0, hybrid: 0.99, PHEV: 0.98, BEV: 0.96 } },
  midwest: { name: "Midwest", short: "MW", lat: 41.88, lng: -87.63, color: "#10b981", country: "US", coeff: { gas: 1.01, diesel: 1.03, hybrid: 0.98, PHEV: 0.96, BEV: 0.94 } },
  southwest: { name: "Southwest", short: "SW", lat: 30.27, lng: -97.74, color: "#f59e0b", country: "US", coeff: { gas: 1.03, diesel: 1.04, hybrid: 0.97, PHEV: 0.95, BEV: 0.93 } },
  westcoast: { name: "West Coast", short: "West", lat: 34.05, lng: -118.24, color: "#8b5cf6", country: "US", coeff: { gas: 0.96, diesel: 0.94, hybrid: 1.06, PHEV: 1.08, BEV: 1.12 } },
};

// ── VAT RATES ──
export const VAT_RATES: Record<string, number> = {
  SE: 0.25, NO: 0.25, DE: 0.19, DK: 0.25, FR: 0.2,
  NL: 0.21, FI: 0.24, AT: 0.2, IT: 0.22, ES: 0.21, PL: 0.23, BE: 0.21,
};
