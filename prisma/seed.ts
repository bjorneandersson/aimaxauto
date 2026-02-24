import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding valuation parameters...");

  const params = [
    // ── Curves ──
    {
      key: "AGE_CURVE",
      value: { 0: 1.0, 1: 0.82, 2: 0.72, 3: 0.65, 4: 0.58, 5: 0.52, 6: 0.46, 7: 0.41, 8: 0.37, 9: 0.33, 10: 0.3 },
      label: "Age depreciation curve (factor by year)",
      category: "curve",
    },
    {
      key: "MILEAGE_CURVE",
      value: { 0: 1.0, 1: 0.97, 2: 0.94, 3: 0.91, 4: 0.88, 5: 0.85, 6: 0.82, 7: 0.79, 8: 0.76, 9: 0.74, 10: 0.72, 12: 0.68, 15: 0.62, 20: 0.52 },
      label: "Mileage depreciation curve (factor by 10k miles)",
      category: "curve",
    },
    {
      key: "MONTHLY_DEPRECIATION",
      value: { 0: 0.018, 6: 0.015, 12: 0.012, 18: 0.01, 24: 0.009, 30: 0.008, 36: 0.007, 48: 0.006, 60: 0.005, 72: 0.004, 84: 0.003, 96: 0.003, 108: 0.002, 120: 0.002 },
      label: "Monthly depreciation rate by vehicle age (months)",
      category: "curve",
    },
    {
      key: "EQUIP_RESIDUAL_CURVE",
      value: { 0: 0.75, 1: 0.6, 2: 0.5, 3: 0.42, 4: 0.35, 5: 0.3, 6: 0.25, 7: 0.22, 8: 0.18, 9: 0.15, 10: 0.12 },
      label: "Equipment residual value by age",
      category: "curve",
    },

    // ── Mileage ──
    {
      key: "MILEAGE_ADJ_PER_MI",
      value: { 0: 120, 1: 110, 2: 100, 3: 90, 4: 75, 5: 65, 6: 55, 7: 50, 8: 40, 9: 35, 10: 25 },
      label: "$ adjustment per 1,000 mi deviation, by age",
      category: "mileage",
    },
    {
      key: "AVG_MI_PER_YEAR",
      value: { gas: 12000, diesel: 15000, hybrid: 13000, PHEV: 11000, BEV: 10000 },
      label: "Average annual mileage by fuel type",
      category: "mileage",
    },

    // ── Brand Prestige ──
    {
      key: "BRAND_PRESTIGE",
      value: {
        Porsche: 1.35, Mercedes: 1.18, BMW: 1.15, Audi: 1.12, Lexus: 1.1,
        Volvo: 1.08, Tesla: 1.06, Polestar: 1.05, Jaguar: 1.04, "Land Rover": 1.06,
        Volkswagen: 1.02, Toyota: 1.02, Mazda: 1.01, Subaru: 1.0, Hyundai: 0.98,
        Kia: 0.96, Ford: 0.95, Jeep: 0.98, Chevrolet: 0.95, GMC: 1.02,
        Ram: 0.98, Cadillac: 1.1, Lincoln: 1.05, Honda: 1.0, Nissan: 0.95,
        Genesis: 1.05, Rivian: 1.08, Lucid: 1.08
      },
      label: "Brand prestige multipliers",
      category: "prestige",
    },

    // ── Equipment Values ──
    {
      key: "EQUIP_VALUES",
      value: {
        "Bowers & Wilkins": 1800, "Harman Kardon": 1200, "Premium Audio": 1000,
        Autopilot: 2500, "Super Cruise": 2000, "Adaptive Cruise": 1200, "360 Camera": 800,
        "Head-Up Display": 1000, "Panoramic Sunroof": 1500, "Ventilated Seats": 800,
        "Nappa Leather": 2000, "Leather Seats": 1200, "Tow Hitch": 800,
        "Metallic Paint": 1000, "Pearl Paint": 1600, "Air Suspension": 2000,
        "Heated Seats": 500, "Blind Spot Monitor": 400, "Power Liftgate": 600,
        "LED Matrix": 800, "Sentry Mode": 600, "OTA Updates": 400
      },
      label: "Individual equipment new-price values ($)",
      category: "equipment",
    },

    // ── Regional Coefficients ──
    {
      key: "REGION_COEFF_US",
      value: {
        northeast: { gas: 0.98, diesel: 0.97, hybrid: 1.04, PHEV: 1.06, BEV: 1.08 },
        southeast: { gas: 1.02, diesel: 1.0, hybrid: 0.99, PHEV: 0.98, BEV: 0.96 },
        midwest: { gas: 1.01, diesel: 1.03, hybrid: 0.98, PHEV: 0.96, BEV: 0.94 },
        southwest: { gas: 1.03, diesel: 1.04, hybrid: 0.97, PHEV: 0.95, BEV: 0.93 },
        westcoast: { gas: 0.96, diesel: 0.94, hybrid: 1.06, PHEV: 1.08, BEV: 1.12 },
      },
      label: "US regional price coefficients by fuel type",
      category: "region",
    },

    // ── Condition Adjustments ──
    {
      key: "CONDITION_ADJ",
      value: { critical: -0.08, moderate: -0.04, minor: -0.02 },
      label: "Condition deviation penalties (% of value)",
      category: "curve",
    },
  ];

  for (const param of params) {
    await prisma.valuationParam.upsert({
      where: { key: param.key },
      update: { value: param.value, label: param.label, category: param.category },
      create: param,
    });
    console.log(`  ✓ ${param.key}`);
  }

  console.log(`\n✅ Seeded ${params.length} valuation parameters`);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
