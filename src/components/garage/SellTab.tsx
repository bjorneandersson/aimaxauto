"use client";

import type { GarageVehicle } from "@/data/vehicles";
import { calcMarketValue } from "@/engine";

export function SellTab({ v }: { v: GarageVehicle }) {
  const engineV = { brand: v.brand, model: v.model, year: v.year, fuel: v.fuel, hp: v.hp, mi: v.mi, drive: v.drive, body: v.body, regRegion: "westcoast", regCountry: "US", valP: v.valP, tax: v.tax || 0, devs: v.devs || [] };
  const mv = calcMarketValue(engineV);
  const gold = "#b89b5e";

  return (
    <div className="space-y-4">
      {/* Aimaxauto Sales Hero */}
      <div className="relative overflow-hidden rounded-2xl p-9 text-center" style={{ background: "linear-gradient(135deg, #0d1117, #131920, #0d1117)", border: "1px solid #FF6B0025" }}>
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FF6B00]/5" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-[#FF6B00]/3" />
        <div className="relative z-10">
          <div className="text-[10px] text-[#FF6B00] font-semibold tracking-[0.12em] uppercase mb-3">AIMAXAUTO SALES</div>
          <div className="text-2xl font-bold text-white leading-tight mb-1.5">Sell Your Car the Smart Way</div>
          <div className="text-sm text-[#8a8a96] max-w-[380px] mx-auto leading-relaxed mb-2">
            Professional pricing, AI-powered listings, and verified buyer matching — so you get the best deal with minimal effort.
          </div>
          <div className="text-xs text-[#FF6B00]/80 max-w-[340px] mx-auto leading-relaxed mb-5 italic">
            AIRA guides you from valuation to closing — data-driven insights ensure you never leave money on the table.
          </div>
          <button className="px-9 py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white text-sm font-semibold tracking-wide rounded-md hover:brightness-110 transition-all">
            Sell My Car →
          </button>
          <div className="flex justify-center gap-7 mt-6">
            {[["✓", "Free Valuation"], ["🛡", "Secure Process"], ["⚡", "AI-Powered"]].map(([ic, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="text-sm">{ic}</span>
                <span className="text-[10px] text-[#8a8a96]">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AutoAD PRO */}
      <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #12110e, #1a1814)", border: `1px solid ${gold}30` }}>
        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-2.5" style={{ color: gold }}>AUTOAD PRO</div>
        <div className="text-xl font-semibold text-white leading-tight mb-2">Create a Professional Listing</div>
        <div className="text-sm text-[#8a8a96] max-w-[340px] mx-auto leading-relaxed">
          AI generates four listing styles. Publish on 12+ platforms.
        </div>

        <div className="grid grid-cols-3 gap-2.5 max-w-[360px] mx-auto mt-5">
          {[
            ["Quick Sale", Math.round((v.valP || 0) * 0.95), false],
            ["Listing Price", v.valP || 0, true],
            ["Optimistic", Math.round((v.valP || 0) * 1.05), false],
          ].map(([label, price, highlight]) => (
            <div key={label as string} className="p-2.5 rounded-lg text-center" style={{
              background: highlight ? `${gold}22` : `${gold}0d`,
              border: `1px solid ${highlight ? `${gold}66` : `${gold}33`}`,
            }}>
              <div className="text-[9px]" style={{ color: gold, fontWeight: highlight ? 600 : 400 }}>{label as string}</div>
              <div className="text-base font-bold font-mono mt-0.5" style={{ color: highlight ? gold : "#fff" }}>
                ${(price as number).toLocaleString("en-US")}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-5 px-8 py-3 text-white text-xs font-semibold tracking-wide rounded" style={{ background: gold }}>
          Create Listing →
        </button>

        <div className="flex justify-center gap-7 mt-6">
          {[["4", "Styles"], ["25", "Photos"], ["12+", "Channels"]].map(([n, l]) => (
            <div key={l}>
              <div className="text-xl font-semibold text-white">{n}</div>
              <div className="text-[9px] text-[#8a8a96]">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AutoValue PRO */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
        <div className="flex justify-between items-center mb-3.5">
          <div>
            <div className="text-sm font-bold">AutoValue PRO</div>
            <div className="text-[10px] text-gray-500">Real-time market valuation based on {mv.tier1Count}+ active listings</div>
          </div>
          <button className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-xs font-semibold hover:bg-[#FF8533] transition-colors">
            Refresh Value
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-[#0a0a0c] rounded-xl text-center">
            <div className="text-[10px] text-gray-500">Current Value</div>
            <div className="text-xl font-bold text-[#FF6B00] font-mono">${(v.valP || 0).toLocaleString("en-US")}</div>
            <div className="text-[10px] text-gray-500">USD</div>
          </div>
          <div className="p-3.5 bg-[#0a0a0c] rounded-xl text-center">
            <div className="text-[10px] text-gray-500">Confidence</div>
            <div className={`text-xl font-bold font-mono ${mv.confidence > 70 ? "text-emerald-500" : mv.confidence > 40 ? "text-[#FF6B00]" : "text-red-500"}`}>
              {mv.confidence}
            </div>
            <div className="text-[10px] text-gray-500">/ 100</div>
          </div>
          <div className="p-3.5 bg-[#0a0a0c] rounded-xl text-center">
            <div className="text-[10px] text-gray-500">Est. Time to Sell</div>
            <div className="text-xl font-bold font-mono">21</div>
            <div className="text-[10px] text-gray-500">days</div>
          </div>
        </div>
      </div>

      {/* Listing Plan */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-5">
        <div className="text-sm font-bold mb-3">Listing Plan</div>
        {[
          ["Start Fee · $39", "One-time setup per listing — includes AI-generated ad copy", "Per listing"],
          ["Aimaxauto + AutoAD PRO · $9.90 / 2 weeks", "Published on Aimaxauto marketplace + AutoAD PRO", "14 days"],
          ["Social · $9.90 / 2 weeks", "Facebook, Instagram, YouTube, TikTok", "Add-on"],
          ["External · $4.90 / 2 weeks", "Autotrader, CarGurus, Cars.com — transfer fee only", "Add-on"],
        ].map(([title, desc, period], i) => (
          <div key={i} className={`flex justify-between items-center py-2.5 ${i < 2 ? "border-b border-[#2a2a2f]/15" : ""}`}>
            <div>
              <div className="text-sm font-semibold">{title}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-3">{period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
