// ═══════════════════════════════════════════════════════════════
// SAMPLE VEHICLES — Demo data (Phase 4 will load from DB)
// ═══════════════════════════════════════════════════════════════

import type { Vehicle } from "@/engine/types";

export interface GarageVehicle extends Vehicle {
  id: number;
  reg: string;
  brandColor?: string;
  color: string;
  seats: number;
  doors: number;
  vin: string;
  owners: number;
  accel?: string;
  top?: string;
  batt?: string;
  range?: string;
  cons?: string;
  co2?: string;
  weight?: string;
  tow?: string;
  len?: string;
  wid?: string;
  hei?: string;
  inspSt: string;
  insp?: string;
  nextInsp?: string;
  servLast?: string;
  servNext?: string;
  ins?: any;
  estMil?: number;
  gar?: any[];
  fin?: any;
  tax: number;
  valP: number;
  valC?: number;
  pay?: any;
  fuelActual?: number;
  img?: string;
  status: string;
  statusT: string;
  equip: string[];
  devs: any[];
  servBook?: any[];
  tyres?: any;
}

export const VEHICLES: GarageVehicle[] = [
  {
    id: 1, reg: "7ABC123", brand: "Tesla", brandColor: "#cc0000", model: "Model Y Long Range",
    year: 2023, fuel: "Electric", hp: 384, mi: "18,200", drive: "AWD", body: "SUV",
    color: "Pearl White", seats: 5, doors: 5, vin: "5YJYGDEE5PF000001", owners: 1,
    trans: "Automatic 1-speed", accel: "4.8s", top: "135 mph", batt: "75 kWh",
    range: "330 mi", cons: "28 kWh/100mi", co2: "0 g/mi",
    weight: "4,398 lbs", tow: "3,500 lbs", len: "187.0 in", wid: "75.6 in", hei: "63.9 in",
    inspSt: "approved", insp: "2025-06-15", nextInsp: "2027-06-15",
    servLast: "2025-10-01", servNext: "In 5,000 mi",
    ins: { co: "State Farm", ty: "Full Coverage", cost: 210, valid: "2026-08-01", deductible: 500, pnr: "SF-2023-44891" },
    estMil: 12000,
    gar: [
      { ty: "Bumper-to-bumper", from: "2023-03", to: "2027-03", note: "4 yr / 50,000 mi" },
      { ty: "Drivetrain", from: "2023-03", to: "2031-03", note: "8 yr / 100,000 mi" },
      { ty: "Battery", from: "2023-03", to: "2031-03", note: "8 yr / 120,000 mi — 70% retention" },
    ],
    fin: { co: "Tesla Finance", ty: "Auto Loan", monthly: 689, rate: "4.99%", start: "2023-03", end: "2028-03", rest: 18500, orig: 48000, term: "60 mo", apr: "5.12%" },
    tax: 0, valP: 39800, valC: 41500,
    pay: { parking: 80, wash: 35, toll: 20, total: 135 },
    fuelActual: 85, status: "ok", statusT: "All Good",
    equip: ["Autopilot", "Premium Audio", "Heated Seats", "Panoramic Glass Roof", "19in Gemini Wheels", "Wireless Charging", "Sentry Mode", "Apple CarPlay", "Android Auto", "Keyless Entry", "OTA Updates", "Backup Camera", "Blind Spot Monitor", "LED Matrix"],
    devs: [],
    servBook: [
      { date: "2024-03-15", mi: "8,500", workshop: "Tesla Service Burbank", type: "Annual checkup", items: ["Cabin air filter", "Tire rotation", "Brake fluid check", "Software update"], cost: 389 },
      { date: "2025-10-01", mi: "16,800", workshop: "Tesla Service Burbank", type: "2-year service", items: ["Cabin air filter", "Wiper blades", "Brake inspection", "Battery health check"], cost: 495 },
    ],
  },
  {
    id: 2, reg: "8DEF456", brand: "Ford", brandColor: "#003478", model: "F-150 XLT EcoBoost",
    year: 2022, fuel: "Gas", hp: 400, mi: "32,500", drive: "4WD", body: "Truck",
    color: "Oxford White", seats: 6, doors: 4, vin: "1FTEW1EP5NFA00002", owners: 2,
    trans: "10-speed Automatic", accel: "5.6s", top: "107 mph",
    cons: "23 mpg", co2: "386 g/mi",
    weight: "4,705 lbs", tow: "13,000 lbs", len: "231.7 in", wid: "79.9 in", hei: "75.5 in",
    inspSt: "warning", insp: "2025-02-20", nextInsp: "2026-02-24",
    servLast: "2025-08-15", servNext: "In 2,000 mi",
    ins: { co: "GEICO", ty: "Full Coverage", cost: 185, valid: "2026-04-15", deductible: 750, pnr: "GE-2022-88321" },
    estMil: 16000,
    gar: [{ ty: "Bumper-to-bumper", from: "2022-06", to: "2025-06", note: "3 yr / 36,000 mi — Expired" }],
    fin: { co: "Ford Credit", ty: "Auto Loan", monthly: 545, rate: "5.49%", start: "2022-06", end: "2027-06", rest: 12800, orig: 38000, term: "60 mo", apr: "5.65%" },
    tax: 0, valP: 35200, valC: 36000,
    pay: { parking: 60, wash: 40, toll: 30, total: 130 },
    fuelActual: 220, status: "warning", statusT: "Inspection Due Today",
    equip: ["360 Camera", "Pro Power Onboard", "FordPass Connect", "Sync 4", "Heated Seats", "Tow Package", "LED Headlights", "Backup Camera", "Blind Spot Monitor"],
    devs: [{ area: "Windshield", desc: "Small stone chip on hood", sev: "minor" }],
  },
  {
    id: 3, reg: "9GHI789", brand: "Honda", brandColor: "#cc0000", model: "CR-V Hybrid EX-L",
    year: 2021, fuel: "Hybrid", hp: 204, mi: "41,200", drive: "AWD", body: "SUV",
    color: "Crystal Black", seats: 5, doors: 5, vin: "7FARS6H77ME000003", owners: 1,
    trans: "CVT", accel: "7.8s", top: "118 mph",
    cons: "38 mpg", co2: "234 g/mi",
    weight: "3,649 lbs", tow: "1,500 lbs", len: "182.1 in", wid: "73.0 in", hei: "66.5 in",
    inspSt: "failed", insp: "2025-01-10", nextInsp: "2026-03-10",
    servLast: "2025-06-20", servNext: "Overdue",
    ins: { co: "Progressive", ty: "Full Coverage", cost: 165, valid: "2026-06-01", deductible: 500, pnr: "PR-2021-56712" },
    estMil: 10000,
    gar: [{ ty: "Powertrain", from: "2021-09", to: "2026-09", note: "5 yr / 60,000 mi" }],
    tax: 0, valP: 25800, valC: 26500,
    pay: { parking: 60, wash: 30, toll: 15, total: 105 },
    fuelActual: 120, status: "critical", statusT: "Brake Issue — Action Required",
    equip: ["Honda Sensing", "Wireless CarPlay", "Leather Seats", "Power Liftgate", "Heated Seats", "LED Headlights", "Backup Camera"],
    devs: [
      { area: "Brakes", desc: "Front brake rotors worn — replacement needed within 1,000 mi", sev: "critical" },
      { area: "Body", desc: "Minor rust on rear wheel arches", sev: "moderate" },
    ],
  },
  {
    id: 4, reg: "0JKL012", brand: "BMW", brandColor: "#0066B1", model: "X3 xDrive30i M Sport",
    year: 2020, fuel: "Gas", hp: 248, mi: "52,800", drive: "AWD", body: "SUV",
    color: "Alpine White", seats: 5, doors: 5, vin: "5UXTY5C0XL9B00004", owners: 3,
    trans: "8-speed Automatic", accel: "6.0s", top: "130 mph",
    cons: "27 mpg", co2: "327 g/mi",
    weight: "4,034 lbs", tow: "4,400 lbs", len: "185.4 in", wid: "74.4 in", hei: "66.0 in",
    inspSt: "approved", insp: "2025-09-01", nextInsp: "2027-09-01",
    servLast: "2025-11-15", servNext: "In 8,000 mi",
    ins: { co: "Allstate", ty: "Full Coverage", cost: 245, valid: "2026-11-01", deductible: 1000, pnr: "AS-2020-34102" },
    estMil: 10500,
    gar: [],
    fin: { co: "BMW Financial", ty: "Auto Loan", monthly: 425, rate: "3.99%", start: "2020-05", end: "2025-05", rest: 0, orig: 52000, term: "60 mo", apr: "4.15%" },
    tax: 0, valP: 28500, valC: 29200,
    pay: { parking: 80, wash: 45, toll: 25, total: 150 },
    fuelActual: 195, status: "ok", statusT: "All Good",
    equip: ["M Sport Suspension", "Harman Kardon", "Head-Up Display", "Panoramic Sunroof", "Heated Seats", "Navigation", "LED Matrix", "Parking Assist", "Backup Camera"],
    devs: [],
  },
];
