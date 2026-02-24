import { prisma } from "@/lib/prisma";
import { LeftNav } from "@/components/layout/LeftNav";
import { RightBar } from "@/components/layout/RightBar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let vehicles: any[] = [];
  try {
    vehicles = await prisma.vehicle.findMany({
      select: { brand: true, model: true, mileage: true, year: true, marketValue: true, status: true },
      orderBy: { createdAt: "asc" },
    });
  } catch (e) {
    // DB error — show without right bar data
  }

  return (
    <div className="flex justify-center max-w-[1060px] mx-auto">
      <LeftNav />
      <main className="flex-1 max-w-[640px] min-h-screen border-x border-[#2a2a2f]">
        {children}
      </main>
      <RightBar vehicles={vehicles} />
    </div>
  );
}
