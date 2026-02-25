import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════
// VEHICLE LOOKUP — Biluppgifter API Proxy
// Uses POST https://data.biluppgifter.se/api/v1/vehicle/regnos
// ═══════════════════════════════════════════════════════════════

// Map fuel type
function mapFuel(drive: Array<{ fuel: string }> | undefined, emissionClass: string | undefined): string {
  if (emissionClass) {
    const ec = emissionClass.toLowerCase();
    if (ec === "el") return "El";
    if (ec === "elhybrid") return "Hybrid";
    if (ec === "laddhybrid") return "PHEV";
  }
  if (!drive || drive.length === 0) return "Bensin";
  const fuel = drive[0].fuel?.toLowerCase() || "";
  if (fuel.includes("diesel")) return "Diesel";
  if (fuel.includes("el")) return "El";
  if (fuel.includes("etanol") || fuel.includes("e85")) return "Etanol/E85";
  if (fuel.includes("gas")) return "Gas";
  return drive[0].fuel || "Bensin";
}

// Map body type from chassi array
function mapBody(chassi: string[] | undefined, type: string | undefined): string | null {
  if (chassi && chassi.length > 0) {
    const c = chassi[0].toLowerCase();
    if (c.includes("flerändamål") || c.includes("suv")) return "SUV";
    if (c.includes("kombi") || c.includes("stationsvagn")) return "Kombi";
    if (c.includes("sedan")) return "Sedan";
    if (c.includes("halvkombi") || c.includes("hatchback")) return "Hatchback";
    if (c.includes("cab") || c.includes("cabriolet")) return "Cabriolet";
    if (c.includes("coupé") || c.includes("coupe")) return "Coupé";
    if (c.includes("flak") || c.includes("pickup")) return "Pickup";
    if (c.includes("buss") || c.includes("minibuss")) return "Minibuss";
  }
  if (type === "Personbil") return "Personbil";
  if (type === "Lastbil") return "Lastbil";
  return null;
}

// Map transmission
function mapTransmission(trans: string | undefined): string | null {
  if (!trans) return null;
  const t = trans.toLowerCase();
  if (t.includes("automat")) return "Automat";
  if (t.includes("manuell") || t.includes("manual")) return "Manuell";
  if (t.includes("variomatic") || t.includes("cvt")) return "Automat";
  return trans;
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
    const response = await fetch(
      "https://data.biluppgifter.se/api/v1/vehicle/regnos",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Aimaxauto/1.0",
        },
        body: JSON.stringify([regno]),
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

    const results = await response.json();

    if (!results || !Array.isArray(results) || results.length === 0 || !results[0].vehicle) {
      return NextResponse.json(
        { error: `Inget fordon hittades med regnr ${regno}` },
        { status: 404 }
      );
    }

    const v = results[0].vehicle;
    const tech = v.technical || {};
    const driveArr = tech.drive || [];
    const wltp = (tech.driving_cycle || []).find((d: { standard: string }) => d.standard === "wltp");
    const nedc = (tech.driving_cycle || []).find((d: { standard: string }) => d.standard === "nedc");
    const cycle = wltp || nedc;
    const primaryDrive = driveArr[0] || {};

    const vehicleData = {
      // Core
      brand: v.make || "Okänt",
      model: v.model || "Okänd",
      fullModel: v.name || `${v.make} ${v.model}`,
      marketName: v.market_name || null,
      year: v.vehicle_year || v.model_year || new Date().getFullYear(),
      body: mapBody(tech.chassi, v.type),
      fuel: mapFuel(driveArr, tech.emission_class),
      hp: primaryDrive.power_hp || null,
      color: v.color || null,
      exteriorColor: v.exterior_color || null,

      // Registration
      licensePlate: v.regnr || regno,
      vin: v.vin || null,
      regCountry: "SE",
      mileage: v.meter || 0,
      owners: v.no_users || 1,
      status: v.status || null,

      // Drivetrain
      drive: tech.four_wheel_drive ? "AWD" : null,
      trans: mapTransmission(v.transmission),
      topSpeed: tech.top_speed ? `${tech.top_speed} km/h` : null,
      cylinderVolume: tech.cylinder_volume || null,

      // Fuel economy
      consumption: cycle?.consumption_mixed
        ? `${cycle.consumption_mixed} l/100km`
        : null,
      co2: cycle?.co2_mixed
        ? `${cycle.co2_mixed} g/km`
        : primaryDrive.co2
        ? `${primaryDrive.co2} g/km`
        : null,
      battery: null, // Not in response for non-EV
      rangemi: null,
      emissionClass: tech.emission_class || null,
      euroClass: tech.eco_class_eu || null,
      evConfig: tech.electric_vehicle_configuration || null,

      // Dimensions
      weight: tech.kerb_weight ? `${tech.kerb_weight} kg` : null,
      grossWeight: tech.gross_weight || null,
      loadWeight: tech.load_weight || null,
      towCapacity: tech.trailer_weight ? `${tech.trailer_weight} kg` : null,
      unbreakedTrailer: tech.unbreaked_trailer_weight || null,
      length: tech.length ? `${tech.length} mm` : null,
      width: tech.width ? `${tech.width} mm` : null,
      height: tech.height ? `${tech.height} mm` : null,
      seats: tech.number_of_passengers ? tech.number_of_passengers + 1 : null, // +1 for driver
      axles: tech.number_of_axles || null,

      // Inspection
      inspectionStatus: v.inspection_valid_until
        ? (v.inspection_valid_until && new Date(v.inspection_valid_until) > new Date()
          ? "approved"
          : "failed")
        : v.status === "Avregistrerad" ? "deregistered" : null,
      lastInspection: v.inspection || null,
      nextInspection: v.inspection_valid_until || null,

      // Tax
      annualTax: v.tax || 0,
      malusTax: v.malus_tax || null,
      taxMonths: v.tax_month || null,

      // Dates
      manufactured: v.manufactured || null,
      manufactureCountry: v.manufactured_country || null,
      preRegistered: v.preregistered || null,
      firstRegistered: v.registered || null,

      // Flags
      imported: v.imported || false,
      leasing: v.leasing || false,
      boughtOnCredit: v.credit_purchase || false,
      stolen: false, // Not in this response

      // Tires
      tires: v.tyre_dimension_front
        ? {
            front: v.tyre_dimension_front,
            rear: v.tyre_dimension_rear || v.tyre_dimension_front,
            rimFront: v.rim_dimension_front || null,
            rimRear: v.rim_dimension_rear || null,
          }
        : null,

      // Owner history
      ownerHistory: (results[0].historical_owners || []).map(
        (h: { date: string; type: string; owner: { name: string; city: string } }) => ({
          date: h.date,
          type: h.type,
          name: h.owner?.name || "Okänd",
          city: h.owner?.city || null,
        })
      ),

      // EEG type approval
      eeg: v.eeg || null,
      categoryEU: v.category_eu || null,
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
