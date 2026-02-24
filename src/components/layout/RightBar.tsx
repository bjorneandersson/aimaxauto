"use client";

import Link from "next/link";

interface RightBarProps {
  vehicles: { brand: string; model: string; mileage: number; year: number; marketValue: number | null; status: string }[];
}

export function RightBar({ vehicles }: RightBarProps) {
  const totalVal = vehicles.reduce((s, v) => s + (v.marketValue || 0), 0);
  const issues = vehicles.filter((v) => v.status !== "ok");

  return (
    <aside className="w-[320px] h-screen sticky top-0 overflow-y-auto border-l border-[#2a2a2f] bg-[#0a0a0c] flex-shrink-0 hidden xl:block">
      <div className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            placeholder="Search Aimaxauto..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#16181c] border border-[#2a2a2f] rounded-xl text-sm text-white placeholder-gray-500 focus:border-[#FF6B00]/50 outline-none transition-colors"
          />
        </div>

        {/* AIRA */}
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-xs font-bold text-white">
              ⚡
            </div>
            <div>
              <div className="text-sm font-bold">AIRA</div>
              <div className="text-xs text-gray-500">AI advisor & document scanning</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-[#FF6B00] text-white rounded-lg text-xs font-semibold hover:bg-[#FF8533] transition-colors">
              💬 Ask a Question
            </button>
            <button className="flex-1 py-2 bg-[#1e2024] text-white border border-[#2a2a2f] rounded-lg text-xs font-semibold hover:bg-[#252830] transition-colors">
              📄 Scan Document
            </button>
          </div>
          <div className="text-[10px] text-gray-500 mt-2">
            Cost depends on question complexity. Set monthly limit in profile (default: max $100/mo).
          </div>
        </div>

        {/* My Garage */}
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl mb-4 overflow-hidden">
          <div className="p-4 pb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold">My Garage</span>
              <span className="text-sm font-bold text-[#FF6B00] font-mono">
                {totalVal.toLocaleString("en-US")} <span className="text-xs text-gray-400 font-normal">USD</span>
              </span>
            </div>
            <div className="text-xs text-gray-500">Total Value</div>
          </div>

          {issues.length > 0 && (
            <div className="mx-4 mb-2 px-3 py-1.5 bg-amber-500/10 rounded-lg flex items-center gap-1.5">
              <span className="text-amber-500 text-xs">⚠</span>
              <span className="text-xs text-amber-500 font-medium">
                {issues.length} vehicle{issues.length > 1 ? "s" : ""} need attention
              </span>
            </div>
          )}

          {vehicles.map((v, i) => (
            <Link
              key={i}
              href="/garage"
              className="flex items-center px-4 py-2.5 border-t border-[#2a2a2f] cursor-pointer hover:bg-[#1e2024] transition-colors no-underline"
            >
              <span className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                v.status === "ok" ? "bg-emerald-500" : v.status === "warning" ? "bg-amber-500" : "bg-red-500"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {v.brand} {v.model.split(" ")[0]}
                </div>
                <div className="text-[10px] text-gray-500">
                  {v.mileage?.toLocaleString("en-US")} mi · {v.year}
                </div>
              </div>
              <span className="text-xs font-bold text-[#FF6B00] font-mono ml-2">
                {(v.marketValue || 0).toLocaleString("en-US")}
              </span>
            </Link>
          ))}

          <div className="px-4 py-2 border-t border-[#2a2a2f]">
            <Link href="/garage" className="text-[#FF6B00] text-xs font-medium no-underline hover:underline">
              View garage →
            </Link>
          </div>
        </div>

        {/* Quick Valuation */}
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4">
          <div className="text-sm font-bold mb-1">Quick Valuation</div>
          <div className="text-xs text-gray-500 mb-3">Enter VIN or Year/Make/Model</div>
          <input
            placeholder="E.G. 5YJ3E7EA5MF123456"
            className="w-full px-3 py-2.5 bg-[#0a0a0c] border border-[#2a2a2f] rounded-lg text-sm text-white placeholder-gray-500 font-mono mb-2 focus:border-[#FF6B00]/50 outline-none"
          />
          <input
            placeholder="Mileage in miles (optional)"
            className="w-full px-3 py-2.5 bg-[#0a0a0c] border border-[#2a2a2f] rounded-lg text-sm text-white placeholder-gray-500 mb-3 focus:border-[#FF6B00]/50 outline-none"
          />
          <button className="w-full py-2.5 bg-[#FF6B00] text-white rounded-lg text-sm font-semibold hover:bg-[#FF8533] transition-colors">
            Get Valuation
          </button>
        </div>
      </div>
    </aside>
  );
}
