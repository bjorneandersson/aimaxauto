"use client";

import type { GarageVehicle } from "@/data/vehicles";

export function ServiceTab({ v }: { v: GarageVehicle }) {
  return (
    <div className="space-y-4">
      {/* Service & Inspection Overview */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
        <div className="text-base font-bold mb-3">Service & Inspection</div>
        {[
          ["Last Service", v.servLast],
          ["Next Service", v.servNext],
          ["Last Inspection", v.insp],
          ["Next Inspection", v.nextInsp],
          ["Insurance Provider", v.ins?.co || "—"],
          ["Insurance Valid", v.ins?.valid || "—"],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between py-2.5 border-b border-[#2a2a2f]/15">
            <span className="text-sm text-gray-400">{label}</span>
            <span className={`text-sm font-semibold ${
              val === "Overdue" ? "text-red-500" :
              val?.toString().includes("2,000") ? "text-amber-500" : "text-white"
            }`}>
              {val || "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Issues */}
      {v.devs && v.devs.length > 0 && (
        <div className="bg-[#16181c] border border-red-500/10 rounded-xl p-5">
          <div className="text-base font-bold mb-3 text-red-500">Issues</div>
          {v.devs.map((d, i) => (
            <div key={i} className={`flex gap-2.5 py-2.5 ${i > 0 ? "border-t border-[#2a2a2f]" : ""}`}>
              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                d.sev === "critical" ? "bg-red-500" : d.sev === "moderate" ? "bg-amber-500" : "bg-blue-500"
              }`} />
              <div className="flex-1">
                <div className="text-sm font-semibold">{d.area}</div>
                <div className="text-xs text-gray-400">{d.desc}</div>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded self-start ${
                d.sev === "critical" ? "bg-red-500/10 text-red-500" :
                d.sev === "moderate" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
              }`}>
                {d.sev}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="py-3.5 bg-[#FF6B00] text-white rounded-xl text-sm font-semibold hover:bg-[#FF8533] transition-colors">
          Book Service
        </button>
        <button className="py-3.5 border border-[#FF6B00] text-[#FF6B00] rounded-xl text-sm font-semibold hover:bg-[#FF6B00]/10 transition-colors">
          Book Inspection
        </button>
      </div>

      {/* Digital Service Log */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
        <div className="text-base font-bold mb-3">Digital Service Log</div>

        {v.servBook && v.servBook.length > 0 ? (
          <div className="space-y-0">
            {v.servBook.map((s: any, i: number) => (
              <div key={i} className={`py-3 ${i < v.servBook!.length - 1 ? "border-b border-[#2a2a2f]/20" : ""}`}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs font-semibold">{s.type}</div>
                  <div className="text-xs font-semibold font-mono text-[#FF6B00]">
                    ${s.cost?.toLocaleString("en-US")}
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 mb-2">
                  {s.date} · {s.mi} mi · {s.workshop}
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.items?.map((item: string, j: number) => (
                    <span key={j} className="text-[9px] px-1.5 py-0.5 bg-[#1e2024] rounded text-gray-400">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            No service history recorded
          </div>
        )}

        {/* Import buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2.5 border border-[#FF6B00] text-[#FF6B00] rounded-lg text-xs font-semibold hover:bg-[#FF6B00]/10 transition-colors text-center">
            📷 Scan Service Book
          </button>
          <button className="flex-1 py-2.5 bg-[#FF6B00] text-white rounded-lg text-xs font-semibold hover:bg-[#FF8533] transition-colors text-center">
            🔗 Import from Manufacturer
          </button>
        </div>
      </div>

      {/* Tires */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
        <div className="text-base font-bold mb-3">Tires</div>

        {v.tyres ? (
          <>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Summer */}
              <TireCard
                season="summer"
                icon="☀️"
                label="Summer tires"
                tire={v.tyres.summer}
              />
              {/* Winter */}
              <TireCard
                season="winter"
                icon="❄️"
                label="Winter tires"
                tire={v.tyres.winter}
              />
            </div>

            {/* Tire schedule */}
            <div className="p-2 bg-[#0a0a0c] rounded-lg grid grid-cols-3 gap-2">
              {[
                ["Last Change", v.tyres.lastSwap, "text-white"],
                ["Next Change", v.tyres.nextSwap, "text-[#FF6B00]"],
                ["Storage", v.tyres.storage, "text-white"],
              ].map(([label, val, color]) => (
                <div key={label as string} className="text-center">
                  <div className="text-[9px] text-gray-500">{label as string}</div>
                  <div className={`text-xs font-semibold ${color}`}>{(val as string) || "—"}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            No tire information recorded
          </div>
        )}
      </div>

      {/* Warranty */}
      {v.gar && v.gar.length > 0 && (
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
          <div className="text-base font-bold mb-3">Warranties</div>
          {v.gar.map((g: any, i: number) => {
            const expired = g.note?.toLowerCase().includes("expired");
            return (
              <div key={i} className={`flex justify-between items-center py-2.5 ${
                i < v.gar!.length - 1 ? "border-b border-[#2a2a2f]/20" : ""
              }`}>
                <div>
                  <div className={`text-sm font-semibold ${expired ? "text-gray-500" : "text-white"}`}>
                    {g.ty}
                  </div>
                  <div className="text-[10px] text-gray-500">{g.note}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  expired ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                }`}>
                  {expired ? "Expired" : "Active"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TireCard({ season, icon, label, tire }: {
  season: string; icon: string; label: string; tire?: any;
}) {
  if (!tire) return null;

  const depthNum = parseFloat(tire.depth);
  const depthColor =
    season === "summer"
      ? (depthNum < 4 ? "text-red-500" : depthNum < 5 ? "text-amber-500" : "text-emerald-500")
      : (depthNum < 5 ? "text-red-500" : depthNum < 6 ? "text-amber-500" : "text-emerald-500");

  const statusOk = tire.status === "OK" || tire.status === "Good" || tire.status === "Bra";

  return (
    <div className={`p-3 bg-[#0a0a0c] rounded-lg ${
      !statusOk ? "border border-amber-500/30" : "border border-transparent"
    }`}>
      <div className="text-xs font-bold mb-1.5">{icon} {label}</div>
      <div className="text-xs font-semibold">{tire.brand} {tire.model}</div>
      <div className="text-[10px] text-gray-500 mb-2">{tire.dim}</div>
      <div className="grid grid-cols-2 gap-1">
        <div>
          <div className="text-[8px] text-gray-500">Tread</div>
          <div className={`text-xs font-semibold ${depthColor}`}>{tire.depth}</div>
        </div>
        <div>
          <div className="text-[8px] text-gray-500">Year</div>
          <div className="text-xs font-semibold">{tire.age}</div>
        </div>
      </div>
      <div className="flex gap-1 mt-2">
        {tire.tpms && (
          <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded">TPMS</span>
        )}
        <span className={`text-[8px] px-1.5 py-0.5 rounded ${
          statusOk ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
        }`}>
          {tire.status}
        </span>
      </div>
    </div>
  );
}
