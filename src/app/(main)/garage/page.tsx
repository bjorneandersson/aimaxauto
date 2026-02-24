import { prisma } from "@/lib/prisma";
import { dbToGarageVehicle } from "@/lib/vehicle-mapper";
import { GarageClient } from "./GarageClient";
import { VEHICLES as DEMO_VEHICLES } from "@/data/vehicles";

export const dynamic = "force-dynamic";

export default async function GaragePage() {
  let vehicles;

  try {
    const dbVehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "asc" } });
    if (dbVehicles.length > 0) {
      vehicles = dbVehicles.map(dbToGarageVehicle);
    } else {
      // Fallback to demo data if DB is empty
      vehicles = DEMO_VEHICLES;
    }
  } catch (error) {
    console.error("DB error, using demo data:", error);
    vehicles = DEMO_VEHICLES;
  }

  return <GarageClient vehicles={vehicles} />;
}
