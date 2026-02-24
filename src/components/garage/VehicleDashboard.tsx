"use client";

import { HealthRing } from "./HealthRing";
import { calcHealth, calcMonthlyCost } from "./utils";
import type { GarageVehicle } from "@/data/vehicles";

export function VehicleDashboard({ v }: { v: GarageVehicle }) {
  const health = calcHealth(v);
  const cost = calcMonthlyCost(v);
  const totalMonthly = cost.ins + cost.tax + cost.serv + cost.fuel + (v.fin?.monthly || 0) + cost.dep + (v.pay?.total || 0);

  const timeline = [
    { date: v.servLast || "—", label: "Last Service", icon: "🔧", done: true },
    { date: v.insp || "—", label: "Last Inspection", icon: "📋", done: true },
    { date: v.ins?.valid || "—", label: "Insurance Valid Until", icon: "🛡", done: false },
    { date: v.nextInsp || "—", label: "Next Inspection", icon: "📋", done: false },
    { date: v.servNext || "—", label: "Next Service", icon: "🔧", done: false },
  ];

  const urgentAlerts: { icon: string; text: string; color: string }[] = [];
  if (v.inspSt === "failed") urgentAlerts.push({ icon: "🔴", text: `Inspection failed — retest by ${v.nextInsp}`, color: "text-red-500" });
  if (v.inspSt === "warning") urgentAlerts.push({ icon: "🟡", text: `Inspection ${v.nextInsp} — book appointment!`, color: "text-amber-500" });
  if (v.servNext === "Overdue") urgentAlerts.push({ icon: "🔴", text: "Service overdue — book immediately!", color: "text-red-500" });
  v.devs?.forEach((d) => {
    if (d.sev === "critical") urgentAlerts.push({ icon: "🔴", text: `${d.area}: ${d.desc}`, color: "text-red-500" });
  });

  return (
    <div className="space-y-5">
      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
        <div className="space-y-2">
          {urgentAlerts.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
              <span>{a.icon}</span>
              <span className={`text-sm font-medium ${a.color}`}>{a.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Top 3 Cards: Health, Monthly Cost, Quick Info */}
      <div className="grid grid-cols-3 gap-4">
        {/* Health */}
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5 text-center">
          <div className="text-sm text-gray-400 mb-3 font-medium">Vehicle Health</div>
          <div className="flex justify-center">
            <HealthRing score={health} size={100} />
          </div>
          <div className={`text-xs mt-2 font-medium ${
            health >= 80 ? "text-emerald-500" : health >= 50 ? "text-amber-500" : "text-red-500"
          }`}>
            {health >= 80 ? "Excellent" : health >= 50 ? "Needs Attention" : "Action Required"}
          </div>
        </div>

        {/* Monthly Cost */}
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-3 font-medium">Monthly Cost</div>
          <div className="text-2xl font-bold text-[#FF6B00] font-mono">
            ${totalMonthly.toLocaleString("en-US")}
            <span className="text-xs font-normal text-gray-400">/mo</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              ["Depreciation", cost.dep, "#ef4444"],
              ["Fuel", cost.fuel, "#ef4444"],
              ["Insurance", cost.ins, "#3b82f6"],
              ["Financing", v.fin?.monthly || 0, "#8b5cf6"],
              ["Tax", cost.tax, "#f59e0b"],
              ["Service", cost.serv, "#10b981"],
              ["Extras", v.pay?.total || 0, "#71767b"],
            ]
              .filter(([, val]) => (val as number) > 0)
              .map(([label, val, color]) => (
                <div key={label as string} className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ background: color as string }} />
                    <span className="text-xs text-gray-400">{label as string}</span>
                  </div>
                  <span className="text-xs font-semibold">${val as number}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-3 font-medium">Quick Info</div>
          <div className="space-y-2.5">
            {[
              ["Market Value", "$" + (v.valP || 0).toLocaleString("en-US"), "text-[#FF6B00]"],
              ["Mileage", v.mi + " mi", "text-white"],
              ["Owners", String(v.owners), "text-white"],
              ["Fuel", v.fuel, "text-blue-400"],
              ["Power", v.hp + " hp", "text-white"],
              ["CO₂", v.co2 || "—", v.co2 === "0 g/mi" ? "text-emerald-500" : "text-white"],
            ].map(([label, val, color]) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`text-xs font-semibold ${color}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
        <div className="text-base font-bold mb-4">Timeline</div>
        <div className="relative pl-7">
          <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-[#2a2a2f]" />
          {timeline.map((ev, i) => (
            <div key={i} className={`flex items-start gap-3 relative ${i < timeline.length - 1 ? "mb-4" : ""}`}>
              <div className={`absolute -left-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] z-[1] border-2 ${
                ev.done ? "bg-emerald-500/20 border-emerald-500" : "bg-[#1e2024] border-[#2a2a2f]"
              }`}>
                {ev.done ? "✓" : ev.icon}
              </div>
              <div className="flex-1 ml-2">
                <div className={`text-sm font-semibold ${ev.done ? "text-gray-400" : "text-white"}`}>{ev.label}</div>
                <div className={`text-xs font-mono ${ev.done ? "text-gray-500" : "text-[#FF6B00]"}`}>{ev.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      {v.devs && v.devs.length > 0 && (
        <div className="bg-[#16181c] border border-red-500/10 rounded-xl p-5">
          <div className="text-base font-bold mb-3 text-red-500">Issues</div>
          {v.devs.map((d, i) => (
            <div key={i} className={`flex gap-2.5 py-2 ${i > 0 ? "border-t border-[#2a2a2f]" : ""}`}>
              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                d.sev === "critical" ? "bg-red-500" : d.sev === "moderate" ? "bg-amber-500" : "bg-blue-500"
              }`} />
              <div>
                <div className="text-sm font-semibold">{d.area}</div>
                <div className="text-xs text-gray-400">{d.desc}</div>
              </div>
              <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded self-start ${
                d.sev === "critical" ? "bg-red-500/10 text-red-500" :
                d.sev === "moderate" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
              }`}>
                {d.sev}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Equipment */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
        <div className="text-base font-bold mb-3">Equipment Highlights</div>
        <div className="flex flex-wrap gap-1.5">
          {v.equip.slice(0, 14).map((eq) => (
            <span key={eq} className="px-2.5 py-1 bg-[#FF6B00]/10 rounded-md text-xs font-medium text-[#FF6B00]">
              {eq}
            </span>
          ))}
          {v.equip.length > 14 && (
            <span className="px-2.5 py-1 bg-[#1e2024] rounded-md text-xs text-gray-500">
              +{v.equip.length - 14} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
