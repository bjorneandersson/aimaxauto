"use client";

import { useState } from "react";

const OFFERS = [
  { id: 201, partner: "State Farm", logo: "🛡", title: "15% off auto insurance", desc: "Exclusive for Aimaxauto Premium members. Applies to new full coverage policies.", type: "insurance", discount: "-15%", expires: "Jun 30, 2026", premium: true },
  { id: 202, partner: "Pep Boys", logo: "🔧", title: "$75 off service", desc: "Valid on all service packages over $200. Show your Premium QR at checkout.", type: "service", discount: "-$75", expires: "Apr 30, 2026", premium: true },
  { id: 203, partner: "ChargePoint", logo: "⚡", title: "10% off charging", desc: "Applies to all ChargePoint stations nationwide. Activated automatically.", type: "charging", discount: "-10%", expires: "Dec 31, 2026", premium: true },
  { id: 204, partner: "GEICO", logo: "🏠", title: "Bundle auto + home", desc: "Save up to 20% when you bundle auto and home insurance.", type: "insurance", discount: "-20%", expires: "May 31, 2026", premium: true },
  { id: 205, partner: "Tire Rack", logo: "🛞", title: "Free tire storage first year", desc: "With purchase of new tires from Tire Rack. Value $150/season.", type: "tires", discount: "Free", expires: "Mar 31, 2026", premium: true },
  { id: 206, partner: "Tesla Insurance", logo: "🚗", title: "Tesla owners: 12% off", desc: "Special offer for Tesla owners. AIRA has verified your ownership.", type: "insurance", discount: "-12%", expires: "Jul 31, 2026", premium: true },
  { id: 207, partner: "RockAuto", logo: "📦", title: "Free shipping on parts", desc: "Free shipping on all orders over $50 via RockAuto.", type: "parts", discount: "Free shipping", expires: "Aug 31, 2026", premium: false },
  { id: 208, partner: "Kelley Blue Book", logo: "📈", title: "Free detailed valuation", desc: "Complete market valuation with report. Normal price $229.", type: "valuation", discount: "Free", expires: "May 15, 2026", premium: false },
  { id: 209, partner: "EcoDrive Alliance", logo: "🌱", title: "Eco-Friendly SUV Bonus", desc: "Receive a $500 bonus on electric SUV purchases.", type: "general", discount: "$500", expires: "Jun 30, 2026", premium: false },
  { id: 210, partner: "Partner Motors", logo: "🏷", title: "Exclusive Sedan Discount", desc: "Get 15% off on all new sedan models this month.", type: "general", discount: "-15%", expires: "Mar 15, 2026", premium: false },
];

const TYPE_COLORS: Record<string, string> = {
  insurance: "#3b82f6", service: "#22c55e", charging: "#f59e0b",
  tires: "#e5e7eb", parts: "#FF6B00", valuation: "#FF6B00", general: "#9ca3af",
};

export default function OffersPage() {
  const [filter, setFilter] = useState("all");
  const isPremium = true;

  const filtered = filter === "all" ? OFFERS
    : filter === "premium" ? OFFERS.filter((o) => o.premium)
    : OFFERS.filter((o) => !o.premium);

  return (
    <div className="py-5 px-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">Offers</h1>
        <p className="text-sm text-gray-400">Exclusive deals for Aimaxauto members</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2a2a2f] mb-4">
        {[["all", "All"], ["premium", "Premium ⚡"], ["free", "Open"]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-all ${
              filter === id ? "font-semibold text-[#FF6B00] border-[#FF6B00]" : "text-gray-400 border-transparent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Offers */}
      {filtered.map((o) => {
        const color = TYPE_COLORS[o.type] || "#FF6B00";
        return (
          <div key={o.id} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 mb-2.5 flex gap-3.5 hover:-translate-y-0.5 transition-transform">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: color + "15" }}>
              {o.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-semibold" style={{ color }}>{o.partner}</span>
                {o.premium && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#FF6B00]/10 text-[#FF6B00] rounded font-semibold">PREMIUM ⚡</span>
                )}
              </div>
              <div className="text-[15px] font-bold">{o.title}</div>
              <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{o.desc}</div>
              {o.expires && (
                <div className="text-xs text-gray-500 mt-1">
                  Expires <span className="text-[#FF6B00]">{o.expires}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-base font-bold text-emerald-500 font-mono">{o.discount}</span>
              <button className="px-3.5 py-1.5 bg-[#FF6B00] text-white rounded-md text-xs font-semibold hover:bg-[#FF8533] transition-colors">
                Activate
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
