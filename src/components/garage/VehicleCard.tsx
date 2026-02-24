"use client";

import { HealthRing } from "./HealthRing";
import type { GarageVehicle } from "@/data/vehicles";
import { calcHealth } from "./utils";

export function VehicleCard({ v, onClick }: { v: GarageVehicle; onClick: () => void }) {
  const health = calcHealth(v);
  const borderColor =
    v.status === "ok" ? "border-[#2a2a2f]" :
    v.status === "warning" ? "border-amber-500/25" : "border-red-500/25";

  return (
    <div
      onClick={onClick}
      className={`bg-[#16181c] border ${borderColor} rounded-2xl p-5 cursor-pointer transition-all hover:bg-[#1c1e22] hover:-translate-y-0.5`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] text-base">
          🚗
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-white truncate">
            {v.brand.toUpperCase()} {v.model.split(" ")[0].toUpperCase()}
          </div>
          <div className="text-sm text-gray-400">{v.year} • {v.color}</div>
        </div>
        <HealthRing score={health} size={48} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-2">
        {[
          ["Plate", v.reg],
          ["Mileage", v.mi + " mi"],
          ["Insurance", v.ins?.co || "—"],
          ["Value", v.valP ? "$" + v.valP.toLocaleString("en-US") : "—"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-semibold text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* Status */}
      {v.status !== "ok" && (
        <div className={`mt-3 p-2 rounded-lg text-xs font-medium ${
          v.status === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
        }`}>
          {v.statusT}
        </div>
      )}
    </div>
  );
}
