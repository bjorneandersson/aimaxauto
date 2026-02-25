"use client";

import { useState } from "react";
import { MARKET } from "@/data/market";

export default function BookmarksPage() {
  const [tab, setTab] = useState("cars");
  const savedCars = MARKET.slice(0, 2);

  return (
    <div className="py-5 px-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Saved</h1>
        <p className="text-sm text-gray-400">Your saved cars, posts and alerts</p>
      </div>

      <div className="flex border-b border-[#2a2a2f] mb-4">
        {[["cars", "Cars", savedCars.length], ["posts", "Posts", 2], ["alerts", "Alerts", 1]].map(([id, label, count]) => (
          <button key={id as string} onClick={() => setTab(id as string)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-all ${tab === id ? "font-semibold text-[#FF6B00] border-[#FF6B00]" : "text-gray-400 border-transparent"}`}>
            {label as string} ({count as number})
          </button>
        ))}
      </div>

      {tab === "cars" && (
        <div>
          {savedCars.map((c) => (
            <div key={c.id} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-3.5 mb-2.5 flex gap-3.5 items-center cursor-pointer hover:border-[#FF6B00]/30 transition-colors">
              <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-[#1e2024] to-[#0a0a0c] flex items-center justify-center text-2xl flex-shrink-0">🚗</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{c.brand} {c.model}</div>
                <div className="text-xs text-gray-400">{c.year} · {c.mi} mi · {c.city}</div>
                <div className="text-sm font-bold text-[#FF6B00] font-mono mt-0.5">${c.price.toLocaleString("en-US")}</div>
              </div>
              <button className="text-gray-500 text-xs hover:text-red-500 transition-colors">✕</button>
            </div>
          ))}
        </div>
      )}

      {tab === "posts" && (
        <div className="text-center py-10">
          <div className="text-3xl mb-2">🔖</div>
          <div className="text-sm">2 saved posts</div>
          <div className="text-xs text-gray-500 mt-1">Your bookmarked posts from feed appear here.</div>
        </div>
      )}

      {tab === "alerts" && (
        <div>
          <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-xl p-4 flex gap-3 items-center mb-3">
            <span className="text-xl">⚡</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">AIRA watch: Tesla insurance</div>
              <div className="text-xs text-gray-400">Your insurance expires 2026-04-15. AIRA compares alternatives.</div>
            </div>
            <span className="text-[10px] text-emerald-500 font-medium">Active</span>
          </div>
          <button className="w-full py-3 border border-dashed border-[#2a2a2f] rounded-lg text-sm text-gray-400 hover:border-[#FF6B00]/40 transition-colors">
            + Add Alert
          </button>
        </div>
      )}
    </div>
  );
}
