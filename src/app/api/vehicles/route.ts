import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/vehicles — list all vehicles (demo: no auth filter yet)
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

// POST /api/vehicles — create a new vehicle
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // For demo: use a default userId. In production, get from session.
    const defaultUser = await prisma.user.findFirst();
    const userId = data.userId || defaultUser?.id;

    if (!userId) {
      return NextResponse.json({ error: "No user found. Please log in first via /admin." }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        brand: data.brand,
        model: data.model,
        year: data.year,
        body: data.body || null,
        fuel: data.fuel,
        hp: data.hp || null,
        color: data.color || null,
        mileage: data.mileage || 0,
        regRegion: data.regRegion || "westcoast",
        regCountry: data.regCountry || "US",
        vin: data.vin || null,
        licensePlate: data.licensePlate || null,
        owners: data.owners || 1,
        drive: data.drive || null,
        trans: data.trans || null,
        accel: data.accel || null,
        topSpeed: data.topSpeed || null,
        consumption: data.consumption || null,
        co2: data.co2 || null,
        battery: data.battery || null,
        rangemi: data.rangemi || null,
        weight: data.weight || null,
        towCapacity: data.towCapacity || null,
        length: data.length || null,
        width: data.width || null,
        height: data.height || null,
        seats: data.seats || null,
        doors: data.doors || null,
        equipment: data.equipment || [],
        deviations: data.deviations || [],
        inspectionStatus: data.inspectionStatus || "approved",
        lastInspection: data.lastInspection || null,
        nextInspection: data.nextInspection || null,
        lastService: data.lastService || null,
        nextService: data.nextService || null,
        estimatedAnnualMi: data.estimatedAnnualMi || null,
        serviceBook: data.serviceBook || [],
        insurance: data.insurance || null,
        warranties: data.warranties || [],
        financing: data.financing || null,
        tires: data.tires || null,
        annualTax: data.annualTax || 0,
        monthlyFuelCost: data.monthlyFuelCost || null,
        parkingCost: data.parkingCost || null,
        washCost: data.washCost || null,
        tollCost: data.tollCost || null,
        marketValue: data.marketValue || null,
        imageUrl: data.imageUrl || null,
        status: data.status || "ok",
        statusText: data.statusText || "All Good",
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
