import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════
// VEHICLE LOOKUP — Biluppgifter API Proxy
// Looks up Swedish vehicles by registration number
// ═══════════════════════════════════════════════════════════════

interface BiluppgifterResponse {
  data: {
    type: string;
    attributes: {
      regno: string;
      vin: string;
    };
    links?: { rel: string; uri: string }[];
    basic?: {
      data: {
        make: string;
        model: string;
        status: number | null;
        color: string;
        type: string;
        type_class: string;
        vehicle_year: number;
        model_year: number;
        reused_regno: boolean;
      };
    };
    technical?: {
      data: {
        power_hp_1: number;
        power_kw_1: number;
        cylinder_volume: number;
        top_speed: number;
        fuel_1: string;
        fuel_2: string | null;
        transmission: string;
        four_wheel_drive: boolean;
        co2_mixed: number;
        fuel_consumption_mixed: number;
        fuel_consumption_city: number;
        fuel_consumption_country: number;
        curb_weight: number;
        total_weight: number;
        load_weight: number;
        unbraked_trailer_weight: number;
        braked_trailer_weight: number;
        axle_count: number;
        length: number;
        width: number;
        height: number;
        body_code: string;
        tire_front: string;
        tire_rear: string;
        rim_front: string;
        rim_rear: string;
        passenger_count: number;
        coupling: boolean;
        eeg: string;
        noise_stationary: number;
        noise_drive_by: number;
        category: string;
        euro_class: string;
        electric_range: number | null;
        battery_capacity: number | null;
        electric_consumption: number | null;
      };
    };
    status?: {
      data: {
        status: number;
        imported: boolean;
        origin_code: number;
        manufacture_month: string;
        manufacture_country: string;
        leasing: boolean;
        bought_on_credit: boolean;
        pre_registered: string;
        first_registered: string;
        first_on_swedish_roads: string;
        number_of_owners: number;
        latest_owner_change: string;
      };
    };
    inspection?: {
      data: {
        latest_inspection: string | null;
        inspection_valid_until: string | null;
        meter: number | null;
        next_inspection_range: string[] | null;
      };
    };
    tax?: {
      data: {
        annual_tax: number;
      };
    };
    theft?: {
      data: {
        stolen: boolean;
      };
    };
    environment?: {
      data: {
        fuel_type: string;
        euro_class: string;
        co2: number;
        nox: number;
        thc_nox: number;
        particles: number;
        noise_stationary: number;
        noise_drive_by: number;
      };
    };
  };
}

// Map Biluppgifter fuel names to our fuel types
function mapFuel(fuel: string | undefined): string {
  if (!fuel) return "Bensin";
  const f = fuel.toLowerCase();
  if (f.includes("diesel")) return "Diesel";
  if (f.includes("el") && f.includes("bensin")) return "PHEV";
  if (f.includes("el")) return "El";
  if (f.includes("hybrid")) return "Hybrid";
  if (f.includes("etanol") || f.includes("e85")) return "Etanol/E85";
  if (f.includes("gas")) return "Gas";
  return fuel; // Return as-is if unknown
}

// Map body code to readable type
function mapBody(bodyCode: string | undefined, typeStr: string | undefined): string | null {
  if (!bodyCode && !typeStr) return null;
  const code = (bodyCode || "").toUpperCase();
  if (code.includes("AB") || code.includes("SEDAN")) return "Sedan";
  if (code.includes("AC") || code.includes("KOMBI")) return "Kombi";
  if (code.includes("AF") || code.includes("HALV")) return "SUV";
  if (code.includes("AD")) return "Coupé";
  if (code.includes("AE") || code.includes("CAB")) return "Cabriolet";
  if (code.includes("AH") || code.includes("FLAK")) return "Pickup";
  if (code.includes("AA")) return "Hatchback";
  // Fallback to type
  if (typeStr === "PB") return "Personbil";
  if (typeStr === "LB") return "Lastbil";
  if (typeStr === "MC") return "Motorcykel";
  return bodyCode || null;
}

// Map transmission
function mapTransmission(trans: string | undefined, fourWD: boolean | undefined): { trans: string | null; drive: string | null } {
  let transResult: string | null = null;
  let drive: string | null = null;

  if (trans) {
    const t = trans.toLowerCase();
    if (t.includes("automat")) transResult = "Automat";
    else if (t.includes("manuell") || t.includes("manual")) transResult = "Manuell";
    else transResult = trans;
  }

  if (fourWD) drive = "4WD";

  return { trans: transResult, drive };
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.BILUPPGIFTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "BILUPPGIFTER_API_KEY not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const regno = searchParams.get("regno")?.toUpperCase().replace(/\s/g, "");

  if (!regno) {
    return NextResponse.json(
      { error: "Missing 'regno' query parameter" },
      { status: 400 }
    );
  }

  // Validate Swedish registration number format (ABC123 or ABC12D)
  const regnoPattern = /^[A-Z]{3}\d{2}[A-Z0-9]$/;
  if (!regnoPattern.test(regno)) {
    return NextResponse.json(
      { error: "Ogiltigt registreringsnummer. Använd formatet ABC123." },
      { status: 400 }
    );
  }

  try {
    // Request all available data packages
    const response = await fetch(
      `https://api.biluppgifter.se/api/v1/vehicle/regno/${regno}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Aimaxauto/1.0",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: `Inget fordon hittades med regnr ${regno}` },
          { status: 404 }
        );
      }
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: "Biluppgifter API-nyckel ogiltig eller saknar behörighet" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `Biluppgifter API error: ${response.status}` },
        { status: response.status }
      );
    }

    const result: BiluppgifterResponse = await response.json();
    const d = result.data;

    // Also try to get valuation
    let valuationPrice: number | null = null;
    const mileage = d.inspection?.data?.meter || null;
    try {
      const valUrl = mileage
        ? `https://api.biluppgifter.se/api/v1/valuation/current/regno/${regno}?meter=${mileage}`
        : `https://api.biluppgifter.se/api/v1/valuation/current/regno/${regno}`;
      const valResponse = await fetch(valUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Aimaxauto/1.0",
        },
      });
      if (valResponse.ok) {
        const valResult = await valResponse.json();
        valuationPrice = valResult?.data?.valuation?.data?.price || null;
      }
    } catch {
      // Valuation is optional, ignore errors
    }

    const basic = d.basic?.data;
    const tech = d.technical?.data;
    const status = d.status?.data;
    const inspection = d.inspection?.data;
    const tax = d.tax?.data;
    const theft = d.theft?.data;
    const env = d.environment?.data;

    const { trans, drive } = mapTransmission(tech?.transmission, tech?.four_wheel_drive);

    // Map to our Vehicle model format
    const vehicleData = {
      // Core
      brand: basic?.make || "Okänt",
      model: basic?.model || "Okänd modell",
      year: basic?.vehicle_year || basic?.model_year || new Date().getFullYear(),
      body: mapBody(tech?.body_code, basic?.type),
      fuel: mapFuel(tech?.fuel_1),
      hp: tech?.power_hp_1 || null,
      color: basic?.color || null,

      // Registration
      licensePlate: regno,
      vin: d.attributes?.vin || null,
      regCountry: "SE",
      mileage: mileage || 0,
      owners: status?.number_of_owners || 1,

      // Drivetrain
      drive,
      trans,
      topSpeed: tech?.top_speed ? `${tech.top_speed} km/h` : null,

      // Fuel economy
      consumption: tech?.fuel_consumption_mixed
        ? `${tech.fuel_consumption_mixed} l/100km`
        : tech?.electric_consumption
        ? `${tech.electric_consumption} kWh/100km`
        : null,
      co2: env?.co2 ? `${env.co2} g/km` : tech?.co2_mixed ? `${tech.co2_mixed} g/km` : null,
      battery: tech?.battery_capacity ? `${tech.battery_capacity} kWh` : null,
      rangemi: tech?.electric_range ? `${tech.electric_range} km` : null,

      // Dimensions
      weight: tech?.curb_weight ? `${tech.curb_weight} kg` : null,
      towCapacity: tech?.braked_trailer_weight ? `${tech.braked_trailer_weight} kg` : null,
      length: tech?.length ? `${tech.length} mm` : null,
      width: tech?.width ? `${tech.width} mm` : null,
      height: tech?.height ? `${tech.height} mm` : null,
      seats: tech?.passenger_count || null,

      // Inspection
      inspectionStatus: inspection?.inspection_valid_until
        ? new Date(inspection.inspection_valid_until) > new Date()
          ? "approved"
          : "failed"
        : null,
      lastInspection: inspection?.latest_inspection
        ? inspection.latest_inspection.split("T")[0]
        : null,
      nextInspection: inspection?.inspection_valid_until
        ? inspection.inspection_valid_until.split("T")[0]
        : null,

      // Tax
      annualTax: tax?.annual_tax || 0,

      // Valuation
      marketValue: valuationPrice || null,

      // Status flags
      stolen: theft?.stolen || false,
      imported: status?.imported || false,
      leasing: status?.leasing || false,
      boughtOnCredit: status?.bought_on_credit || false,
      firstRegistered: status?.first_registered
        ? status.first_registered.split("T")[0]
        : null,
      manufactureCountry: status?.manufacture_country || null,
      euroClass: tech?.euro_class || env?.euro_class || null,

      // Tires
      tires: tech?.tire_front
        ? {
            front: tech.tire_front,
            rear: tech.tire_rear || tech.tire_front,
            rimFront: tech.rim_front || null,
            rimRear: tech.rim_rear || null,
          }
        : null,

      // Raw data for reference
      _raw: {
        basic: basic || null,
        technical: tech || null,
        status: status || null,
        inspection: inspection || null,
        tax: tax || null,
        theft: theft || null,
        environment: env || null,
      },
    };

    return NextResponse.json(vehicleData);
  } catch (error) {
    console.error("Vehicle lookup error:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta fordonsdata. Försök igen." },
      { status: 500 }
    );
  }
}
