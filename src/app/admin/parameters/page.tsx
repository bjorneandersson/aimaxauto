import { prisma } from "@/lib/prisma";
import ParamEditor from "@/components/admin/ParamEditor";

async function getParams() {
  return prisma.valuationParam.findMany({
    orderBy: [{ category: "asc" }, { key: "asc" }],
  });
}

export default async function ParametersPage() {
  const params = await getParams();

  // Group by category
  const grouped: Record<string, typeof params> = {};
  params.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Valuation Parameters</h1>
        <p className="text-text-secondary text-sm mt-1">
          Edit pricing curves, brand prestige, equipment values, and regional coefficients.
          Changes take effect immediately.
        </p>
      </div>

      <ParamEditor grouped={JSON.parse(JSON.stringify(grouped))} />
    </div>
  );
}
