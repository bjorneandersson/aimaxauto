"use client";

import { useState } from "react";
import type { GarageVehicle } from "@/data/vehicles";
import { VehicleCard } from "@/components/garage/VehicleCard";
import { VehicleDashboard } from "@/components/garage/VehicleDashboard";
import { FinancesTab } from "@/components/garage/FinancesTab";

export function GarageClient({ vehicles }: { vehicles: GarageVehicle[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [view, setView] = useState<"dashboard" | "grid">("dashboard");
  const [detailView, setDetailView] = useState(false);
  const [detailTab, setDetailTab] = useState("overview");

  const v = vehicles[activeTab] || vehicles[0];

  if (!v) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚗</div>
          <div className="text-lg font-bold">No vehicles yet</div>
          <div className="text-sm text-gray-400 mt-2">Add your first vehicle to get started</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-[#2a2a2f]">
        <div className="px-5 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">My Garage</h1>
            <p className="text-sm text-gray-400 mt-1">
              {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} · Total value ${vehicles.reduce((s, vh) => s + (vh.valP || 0), 0).toLocaleString("en-US")}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#FF6B00] text-white rounded-full text-sm font-semibold hover:bg-[#FF8533] transition-colors">
              + Add Vehicle
            </button>
            <div className="flex border border-[#2a2a2f] rounded-lg overflow-hidden">
              {(["dashboard", "grid"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setView(m)}
                  className={`px-2.5 py-1.5 text-xs cursor-pointer ${
                    view === m ? "bg-[#1e2024] text-white" : "text-gray-500"
                  }`}
                >
                  {m === "dashboard" ? "◉" : "⊞"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle Tabs */}
        <div className="flex px-5 overflow-x-auto">
          {vehicles.map((vh, i) => (
            <button
              key={vh.id}
              onClick={() => { setActiveTab(i); setDetailView(false); }}
              className={`px-4 py-2.5 text-sm flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === i
                  ? "font-semibold text-[#FF6B00] border-[#FF6B00]"
                  : "font-normal text-gray-400 border-transparent hover:text-gray-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                vh.status === "ok" ? "bg-emerald-500" : vh.status === "warning" ? "bg-amber-500" : "bg-red-500"
              }`} />
              {vh.reg} — {vh.brand}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Grid View */}
        {!detailView && view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vehicles.map((vh, idx) => (
              <VehicleCard
                key={vh.id}
                v={vh}
                onClick={() => { setActiveTab(idx); setDetailView(true); }}
              />
            ))}
          </div>
        )}

        {/* Dashboard View */}
        {!detailView && view === "dashboard" && (
          <div>
            <div className="flex border-b border-[#2a2a2f] mb-4 overflow-x-auto">
              {[["overview","Overview"],["tech","Specs"],["economy","Finances"],["service","Service"],["sell","Sell Your Car"],["docs","Documents"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setDetailTab(id)}
                  className={`px-3.5 py-2.5 text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    detailTab === id ? "font-semibold text-[#FF6B00] border-[#FF6B00]" : "font-normal text-gray-400 border-transparent hover:text-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {detailTab === "overview" && <VehicleDashboard v={v} />}
            {detailTab === "tech" && <TechSpecs v={v} />}
            {detailTab === "economy" && <FinancesTab v={v} />}
            {["service","sell","docs"].includes(detailTab) && (
              <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-8 text-center">
                <div className="text-4xl mb-3 opacity-40">{detailTab === "service" ? "🔧" : detailTab === "sell" ? "🏷" : "📄"}</div>
                <div className="text-sm text-gray-400">Coming soon</div>
              </div>
            )}
          </div>
        )}

        {/* Detail View */}
        {detailView && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => { setDetailView(false); setDetailTab("overview"); }}
                className="text-lg text-white cursor-pointer bg-transparent border-none px-2 py-1 hover:bg-[#1e2024] rounded-lg">←</button>
              <div>
                <div className="text-lg font-bold">{v.brand} {v.model}</div>
                <div className="text-sm text-gray-400">{v.year} · {v.reg}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#16181c] to-[#1e2024] border border-[#2a2a2f] rounded-2xl overflow-hidden mb-5">
              <div className="p-7 text-center">
                <div className="text-2xl font-bold">{v.brand} {v.model}</div>
                <div className="text-base text-gray-400 mt-1.5">{v.year} · {v.fuel} · {v.hp} hp · {v.drive}</div>
                <div className="text-2xl font-bold text-[#FF6B00] font-mono mt-3">
                  ${(v.valP || 0).toLocaleString("en-US")} <span className="text-sm text-gray-400 font-normal">USD</span>
                </div>
              </div>
              <div className="grid grid-cols-4 border-t border-[#2a2a2f]">
                {[["Mileage", v.mi + " mi"],["Trans", v.trans],["Drive", v.drive],["0-60", v.accel || "—"]].map(([l,val]) => (
                  <div key={l} className="p-3 text-center border-r border-[#2a2a2f]/40 last:border-r-0">
                    <div className="text-[10px] text-gray-500">{l}</div>
                    <div className="text-sm font-semibold">{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <VehicleDashboard v={v} />
          </div>
        )}
      </div>
    </div>
  );
}

function TechSpecs({ v }: { v: GarageVehicle }) {
  const sections: [string, [string, string | undefined][]][] = [
    ["Engine & Drivetrain", [["Fuel",v.fuel],["Power",v.hp+" hp"],["Transmission",v.trans],["Drivetrain",v.drive],["0-60",v.accel]]],
    ["Fuel Economy", [["Fuel Economy",v.cons],["CO₂",v.co2],["Battery",v.batt || "—"]]],
    ["Dimensions", [["Length",v.len||"—"],["Width",v.wid||"—"],["Weight",v.weight||"—"],["Tow",v.tow||"—"],["Seats",String(v.seats)]]],
  ];
  return (
    <div className="space-y-4">
      {sections.map(([title, fields]) => (
        <div key={title} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
          <div className="text-sm font-bold mb-3">{title}</div>
          {fields.map(([l, val]) => (
            <div key={l} className="flex justify-between py-2.5 border-b border-[#2a2a2f]/15">
              <span className="text-sm text-gray-400">{l}</span>
              <span className="text-sm font-semibold">{val || "—"}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
