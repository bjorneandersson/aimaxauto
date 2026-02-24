import { prisma } from "@/lib/prisma";
import VehicleTable from "@/components/admin/VehicleTable";

async function getVehicles() {
  return prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
    take: 100,
  });
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Vehicles</h1>
          <p className="text-text-secondary text-sm mt-1">
            {vehicles.length} vehicles registered on the platform
          </p>
        </div>
      </div>

      <VehicleTable vehicles={JSON.parse(JSON.stringify(vehicles))} />
    </div>
  );
}
