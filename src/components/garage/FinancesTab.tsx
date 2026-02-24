"use client";

import type { GarageVehicle } from "@/data/vehicles";
import { calcMarketValue, calcValueTimeline, calcTCO } from "@/engine";

export function FinancesTab({ v }: { v: GarageVehicle }) {
  // Map GarageVehicle to engine Vehicle shape
  const engineV = {
    brand: v.brand,
    model: v.model,
    year: v.year,
    fuel: v.fuel,
    hp: v.hp,
    mi: v.mi,
    drive: v.drive,
    body: v.body,
    regRegion: "westcoast",
    regCountry: "US",
    valP: v.valP,
    tax: v.tax || 0,
    ins: v.ins,
    fuelActual: v.fuelActual,
    devs: v.devs || [],
  };

  const mv = calcMarketValue(engineV);
  const tl = calcValueTimeline(engineV);
  const tco = calcTCO(engineV);

  // Scale engine steps to match actual valP
  const engineTotal = mv.steps.find((s) => s.nr === 12)?.value || mv.totalValue;
  const actual = v.valP || engineTotal;
  const ratio = engineTotal > 0 ? actual / engineTotal : 1;
  const adjustments = mv.steps
    .filter((s) => s.nr > 1 && s.nr < 12 && s.value !== 0)
    .map((s) => ({ ...s, value: Math.round(s.value * ratio) }));
  const adjSum = adjustments.reduce((sum, s) => sum + s.value, 0);
  const anchorValue = actual - adjSum;

  const confColor = mv.confidence > 70 ? "text-emerald-500" : mv.confidence > 40 ? "text-[#FF6B00]" : "text-red-500";
  const confBg = mv.confidence > 70 ? "bg-emerald-500/10" : mv.confidence > 40 ? "bg-[#FF6B00]/10" : "bg-red-500/10";

  // TCO total
  const tcoTotal = (tco.monthly?.depreciation || 0) + (tco.monthly?.fuel || 0) +
    (tco.monthly?.insurance || v.ins?.cost || 0) + (v.fin?.monthly || 0) +
    (tco.monthly?.tax || 0) + (tco.monthly?.service || 0) + (tco.monthly?.tires || 0) +
    (v.pay?.total || 0);

  return (
    <div className="space-y-4">
      {/* Market Value + Confidence */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
        <div className="text-center mb-3">
          <div className="text-xs text-gray-500 mb-1">Market Value</div>
          <div className="text-3xl font-bold text-[#FF6B00] font-mono">
            ${(v.valP || mv.totalValue || 0).toLocaleString("en-US")}
            <span className="text-base ml-1">USD</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 ${confBg} rounded-full`}>
            <div className={`w-1.5 h-1.5 rounded-full ${confColor.replace("text-", "bg-")}`} />
            <span className={`text-xs ${confColor}`}>
              Confidence {mv.confidence}/100 · {mv.tier1Count} listings analyzed
            </span>
          </div>
        </div>
      </div>

      {/* 3 Time Points */}
      {tl.months && tl.months.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 bg-[#16181c] border border-[#2a2a2f] rounded-xl">
            <div className="text-[10px] text-gray-500">3 mo ago</div>
            <div className="text-base font-semibold font-mono mt-1">
              ${(tl.months[0]?.value || 0).toLocaleString("en-US")}
            </div>
          </div>
          <div className="text-center p-3 bg-[#FF6B00]/5 border border-[#FF6B00]/30 rounded-xl">
            <div className="text-[10px] text-[#FF6B00] font-semibold">Today</div>
            <div className="text-base font-bold font-mono text-[#FF6B00] mt-1">
              ${(v.valP || mv.totalValue || 0).toLocaleString("en-US")}
            </div>
          </div>
          <div className="text-center p-3 bg-[#16181c] border border-[#2a2a2f] rounded-xl">
            <div className="text-[10px] text-gray-500">3 mo forecast</div>
            <div className="text-base font-semibold font-mono mt-1">
              ${(tl.months[6]?.value || tl.projection3m || 0).toLocaleString("en-US")}
            </div>
          </div>
        </div>
      )}

      {/* Depreciation Rate */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Depreciation</span>
          <span className="text-sm font-bold text-red-500 font-mono">
            -${tl.depreciationPerMonth?.toLocaleString("en-US")}/mo
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">Annual</span>
          <span className="text-xs text-gray-400 font-mono">
            -${tl.depreciationPerYear?.toLocaleString("en-US")}/yr
          </span>
        </div>
        {/* Mini bar */}
        <div className="mt-3 h-1.5 bg-[#2a2a2f] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-[#FF6B00] rounded-full"
            style={{ width: `${Math.max(5, 100 - (tl.depreciationPerYear || 0) / (v.valP || 1) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-500">Retained</span>
          <span className="text-[10px] text-gray-500">Lost</span>
        </div>
      </div>

      {/* TCO Summary */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold">Ownership Cost</span>
          <span className="text-lg font-bold text-[#FF6B00] font-mono">
            ${tcoTotal.toLocaleString("en-US")}
            <span className="text-xs text-gray-400 font-normal">/mo</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ["Depreciation", tco.monthly?.depreciation || 0, "#ef4444"],
            ["Fuel", tco.monthly?.fuel || 0, "#f97316"],
            ["Insurance", tco.monthly?.insurance || v.ins?.cost || 0, "#3b82f6"],
            ["Financing", v.fin?.monthly || 0, "#8b5cf6"],
            ["Tax", tco.monthly?.tax || 0, "#f59e0b"],
            ["Service", tco.monthly?.service || 0, "#10b981"],
            ["Tires", tco.monthly?.tires || 0, "#6b7280"],
            ["Extras", v.pay?.total || 0, "#71767b"],
          ]
            .filter(([, val]) => (val as number) > 0)
            .map(([label, val, color]) => (
              <div key={label as string} className="text-center p-2 bg-[#0a0a0c] rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-sm" style={{ background: color as string }} />
                  <span className="text-[10px] text-gray-500">{label as string}</span>
                </div>
                <div className="text-sm font-semibold font-mono">
                  ${(val as number).toLocaleString("en-US")}
                  <span className="text-[9px] text-gray-500"> /mo</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Valuation Steps */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4">
        <div className="text-sm font-semibold mb-3">How Value is Calculated</div>

        {/* Market Anchor */}
        <div className="flex justify-between py-2 border-b border-[#2a2a2f]/20">
          <span className="text-xs text-gray-400">Market Anchor</span>
          <span className="text-xs font-semibold font-mono text-white">
            ${anchorValue.toLocaleString("en-US")}
          </span>
        </div>

        {/* Adjustments */}
        {adjustments.map((s, i) => (
          <div key={i} className="flex justify-between py-2 border-b border-[#2a2a2f]/20">
            <span className="text-xs text-gray-400">{s.label}</span>
            <span className={`text-xs font-semibold font-mono ${
              s.value > 0 ? "text-emerald-500" : s.value < 0 ? "text-red-500" : "text-gray-500"
            }`}>
              {s.value > 0 ? "+" : ""}{s.value.toLocaleString("en-US")}
            </span>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-between py-2 mt-1">
          <span className="text-xs text-[#FF6B00] font-semibold">Market Value</span>
          <span className="text-xs font-bold font-mono text-[#FF6B00]">
            ${actual.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* Search Tier Breakdown */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4">
        <div className="text-sm font-semibold mb-3">Market Data Sources</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Tier 1", "Exact Match", mv.tier1Count, "text-emerald-500"],
            ["Tier 2", "Similar", mv.tier2Count, "text-blue-400"],
            ["Tier 3", "Segment", mv.tier3Count, "text-amber-500"],
          ].map(([tier, desc, count, color]) => (
            <div key={tier as string} className="text-center p-2.5 bg-[#0a0a0c] rounded-lg">
              <div className={`text-lg font-bold font-mono ${color}`}>{count as number}</div>
              <div className="text-[10px] font-semibold text-white mt-0.5">{tier as string}</div>
              <div className="text-[9px] text-gray-500">{desc as string}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center">
          <span className="text-[10px] text-gray-500">
            {mv.totalListings} total listings · {mv.spread}% price spread
          </span>
        </div>
      </div>

      {/* Mileage Analysis */}
      {mv.empAnalysis && mv.empAnalysis.method !== "theoretical" && (
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4">
          <div className="text-sm font-semibold mb-2">Mileage Analysis</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-[#0a0a0c] rounded-lg">
              <div className="text-[10px] text-gray-500">Method</div>
              <div className="text-xs font-semibold capitalize">{mv.empAnalysis.method}</div>
            </div>
            <div className="p-2.5 bg-[#0a0a0c] rounded-lg">
              <div className="text-[10px] text-gray-500">Mileage Ratio</div>
              <div className="text-xs font-semibold font-mono">{mv.empAnalysis.vehicleRatio}x</div>
            </div>
            {mv.empAnalysis.regression && (
              <>
                <div className="p-2.5 bg-[#0a0a0c] rounded-lg">
                  <div className="text-[10px] text-gray-500">$/10k mi</div>
                  <div className="text-xs font-semibold font-mono text-red-500">
                    {mv.empAnalysis.regression.krPer10Mil < 0 ? "" : "-"}
                    ${Math.abs(mv.empAnalysis.regression.krPer10Mil).toLocaleString("en-US")}
                  </div>
                </div>
                <div className="p-2.5 bg-[#0a0a0c] rounded-lg">
                  <div className="text-[10px] text-gray-500">R²</div>
                  <div className="text-xs font-semibold font-mono">{mv.empAnalysis.regression.rSquared}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
