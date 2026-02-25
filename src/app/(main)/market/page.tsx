"use client";

import { useState } from "react";
import { MARKET, WANTED, type MarketCar } from "@/data/market";

export default function MarketPage() {
  const [tab, setTab] = useState("vehicles");
  const [brand, setBrand] = useState("");
  const [fuel, setFuel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selCar, setSelCar] = useState<MarketCar | null>(null);
  const [showAira, setShowAira] = useState(false);

  const filtered = MARKET.filter((c) => {
    return (!brand || c.brand === brand) && (!fuel || c.fuel === fuel) && (!maxPrice || c.price <= parseInt(maxPrice));
  });

  // ── Detail View ──
  if (selCar) return (
    <div className="py-5 px-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => { setSelCar(null); setShowAira(false); }} className="text-lg hover:text-[#FF6B00] transition-colors">←</button>
        <h1 className="text-lg font-bold flex-1">{selCar.brand} {selCar.model}</h1>
        <button className="px-3.5 py-2 border border-[#2a2a2f] rounded-lg text-xs font-semibold hover:bg-[#1e2024] transition-colors">🔖 Save</button>
      </div>

      <div className="bg-gradient-to-br from-[#16181c] to-[#1e2024] rounded-2xl p-6 text-center mb-4">
        <div className="text-2xl font-bold text-[#FF6B00] font-mono">${selCar.price.toLocaleString("en-US")} <span className="text-sm text-gray-400 font-normal">USD</span></div>
        <div className="text-sm text-gray-400 mt-1">{selCar.seller === "Dealer" ? "🏢" : "👤"} {selCar.sellerName} · {selCar.city}</div>
      </div>

      <button onClick={() => setShowAira(!showAira)}
        className={`w-full p-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 mb-4 transition-all ${showAira ? "bg-[#FF6B00]/10 border-[#FF6B00] text-[#FF6B00]" : "bg-[#16181c] border-[#2a2a2f] text-white"} border`}>
        ⚡ {showAira ? "Hide AIRA analysis" : "Ask AIRA — Is this a good deal?"}
      </button>

      {showAira && (
        <div className="bg-[#16181c] border border-[#FF6B00]/20 border-l-[3px] border-l-[#FF6B00] rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-xs text-white">⚡</div>
            <span className="text-sm font-bold">AIRA Analysis</span>
          </div>
          <div className="text-sm text-gray-400 leading-relaxed space-y-2">
            <p><strong className="text-white">Price:</strong> {selCar.price < 40000 ? "Price is in line with the market for this model and year." : "Price is on the high end. There may be room to negotiate."}</p>
            <p><strong className="text-white">Condition:</strong> Inspection {selCar.inspSt === "ok" ? "passed, which is positive" : "needs closer review"}.</p>
            <p><strong className="text-white">Equipment:</strong> {selCar.equip.length >= 4 ? `Good trim level with ${selCar.equip.length} options.` : "Standard equipment."}</p>
            <p className="text-[#FF6B00] font-medium">I can compare with similar cars or calculate ownership costs. Just ask.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[["Year", String(selCar.year)], ["Mileage", selCar.mi + " mi"], ["Fuel", selCar.fuel], ["Power", selCar.hp], ["Trans", selCar.gearbox], ["Drive", selCar.drive], ["Color", selCar.color], ["CO₂", selCar.co2], ["Inspection", selCar.inspSt === "ok" ? "✅ Passed" : "⚠️"]].map(([l, v]) => (
          <div key={l} className="bg-[#16181c] border border-[#2a2a2f] rounded-lg p-2.5">
            <div className="text-[10px] text-gray-500">{l}</div>
            <div className="text-sm font-semibold mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      {selCar.equip.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-bold mb-2">Equipment</div>
          <div className="flex gap-1.5 flex-wrap">
            {selCar.equip.map((e) => <span key={e} className="px-2.5 py-1 bg-[#FF6B00]/10 text-[#FF6B00] rounded-md text-xs font-medium">{e}</span>)}
          </div>
        </div>
      )}

      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 mb-4">
        <div className="text-sm font-bold mb-1.5">Description</div>
        <div className="text-sm text-gray-400 leading-relaxed">{selCar.desc}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="py-3.5 bg-[#FF6B00] text-white rounded-xl text-sm font-semibold hover:bg-[#FF8533] transition-colors">Contact Seller</button>
        <button className="py-3.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">🛒 Buy via Aimaxauto</button>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">Buy Now includes buyer guarantee and admin fee of $2,900.</div>
    </div>
  );

  // ── List View ──
  return (
    <div className="py-5 px-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">AutoMarket</h1>
          <p className="text-sm text-gray-400">Buy, sell and find your next vehicle</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white rounded-full text-xs font-semibold">+ Create Listing</button>
      </div>

      <div className="flex border-b border-[#2a2a2f] mb-4">
        {[["vehicles", "Vehicles", MARKET.length], ["wanted", "Wanted 🔍", WANTED.length], ["mine", "My Listings", 0]].map(([id, label, count]) => (
          <button key={id as string} onClick={() => setTab(id as string)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-all ${tab === id ? "font-semibold text-[#FF6B00] border-[#FF6B00]" : "text-gray-400 border-transparent"}`}>
            {label as string} <span className="text-gray-500">({count as number})</span>
          </button>
        ))}
      </div>

      {tab === "vehicles" && (
        <>
          <div className="flex gap-2 flex-wrap mb-4">
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="px-3 py-2 bg-[#16181c] border border-[#2a2a2f] rounded-lg text-white text-xs">
              <option value="">All Makes</option>
              {["BMW", "Honda", "Kia", "Ram", "Tesla", "Toyota"].map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="px-3 py-2 bg-[#16181c] border border-[#2a2a2f] rounded-lg text-white text-xs">
              <option value="">Fuel Type</option>
              {["Electric", "Hybrid", "Gas"].map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="px-3 py-2 bg-[#16181c] border border-[#2a2a2f] rounded-lg text-white text-xs">
              <option value="">Max Price</option>
              {[30000, 35000, 40000, 45000, 50000].map((p) => <option key={p} value={p}>${(p / 1000)}k</option>)}
            </select>
            {(brand || fuel || maxPrice) && <button onClick={() => { setBrand(""); setFuel(""); setMaxPrice(""); }} className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs">Clear</button>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((c) => (
              <div key={c.id} onClick={() => setSelCar(c)} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-transform">
                <div className="h-40 bg-gradient-to-br from-[#1e2024] to-[#0a0a0c] flex items-center justify-center text-4xl relative">
                  🚗
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded-md text-xs text-white">{c.fuel}</span>
                  {c.seller === "Dealer" && <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#FF6B00] rounded-md text-[10px] text-white font-semibold">Dealer</span>}
                </div>
                <div className="p-3.5">
                  <div className="text-base font-bold">{c.brand} {c.model}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{c.year} · {c.mi} mi · {c.city}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {c.equip.slice(0, 3).map((e) => <span key={e} className="text-[10px] px-1.5 py-0.5 bg-[#0a0a0c] rounded text-gray-400">{e}</span>)}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-[#FF6B00] font-mono">${c.price.toLocaleString("en-US")}</span>
                    <span className="text-[10px] text-emerald-500">✅ Inspected</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center text-gray-400 py-10">No vehicles match your filters.</div>}
        </>
      )}

      {tab === "wanted" && (
        <div>
          <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-xl p-4 mb-4 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-lg flex-shrink-0">🔍</div>
            <div className="flex-1">
              <div className="text-sm font-bold">Looking for a specific car?</div>
              <div className="text-xs text-gray-400">Create a want ad and AIRA will match you.</div>
            </div>
            <button className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-xs font-semibold flex-shrink-0">Create</button>
          </div>
          {WANTED.map((w) => (
            <div key={w.id} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 mb-2.5 flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1e2024] flex items-center justify-center text-lg flex-shrink-0">👤</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">{w.user}</span>
                  {w.matched && <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-semibold">✅ AIRA matched</span>}
                </div>
                <div className="text-sm text-gray-400 mt-1 leading-relaxed">{w.want}</div>
                <div className="flex gap-3 mt-1.5">
                  <span className="text-xs text-[#FF6B00] font-medium">{w.budget}</span>
                  <span className="text-xs text-gray-500">{w.fuel}</span>
                  <span className="text-xs text-gray-500">{w.created}</span>
                </div>
              </div>
              {!w.matched && <button className="px-3 py-1.5 bg-[#FF6B00] text-white rounded-md text-xs font-semibold self-center flex-shrink-0">Offer</button>}
            </div>
          ))}
        </div>
      )}

      {tab === "mine" && (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">📝</div>
          <div className="text-base font-semibold mb-1">No active listings</div>
          <div className="text-sm text-gray-400 mb-4">Create your first listing via AutoAD PRO.</div>
          <button className="px-6 py-3 bg-[#FF6B00] text-white rounded-lg text-sm font-semibold">Create listing via AutoAD PRO</button>
        </div>
      )}
    </div>
  );
}
