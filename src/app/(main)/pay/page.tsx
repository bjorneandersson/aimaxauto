"use client";

import { useState } from "react";

export default function PayPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="py-5 px-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold">AimaxPAY</h1>
        <p className="text-sm text-gray-400">Your payment hub for all vehicle services</p>
      </div>

      <div className="flex border-b border-[#2a2a2f] mb-4">
        {[["overview", "Overview"], ["subscriptions", "Subscriptions"], ["history", "History"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-all ${tab === id ? "font-semibold text-[#FF6B00] border-[#FF6B00]" : "text-gray-400 border-transparent"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          {/* Balance */}
          <div className="bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8533]/5 border border-[#FF6B00]/20 rounded-2xl p-5 text-center">
            <div className="text-xs text-gray-400">Monthly Total</div>
            <div className="text-3xl font-bold text-[#FF6B00] font-mono mt-1">$135.00</div>
            <div className="text-xs text-gray-500 mt-1">Parking · Wash · Tolls</div>
          </div>

          {/* Active services */}
          <div className="text-sm font-bold text-gray-400 mb-2">Active Services</div>
          {[
            ["🅿️", "Parking", "Monthly parking — Downtown LA", "$80.00/mo"],
            ["🚿", "Car Wash", "Premium wash subscription", "$35.00/mo"],
            ["🛣", "Toll Pass", "FasTrak Bay Area + SoCal", "$20.00/mo"],
          ].map(([icon, title, desc, price]) => (
            <div key={title} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 flex gap-3 items-center">
              <span className="text-lg">{icon}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
              <span className="text-sm font-bold text-[#FF6B00] font-mono">{price}</span>
            </div>
          ))}

          {/* AIRA Usage */}
          <div className="text-sm font-bold text-gray-400 mt-4 mb-2">AIRA Usage This Month</div>
          <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-3">
              {[["Questions", "12"], ["Tokens Used", "8,420"], ["Cost", "$4.80"]].map(([l, v]) => (
                <div key={l} className="text-center">
                  <div className="text-[10px] text-gray-500">{l}</div>
                  <div className="text-lg font-bold font-mono">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "subscriptions" && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8533]/5 border border-[#FF6B00]/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-lg text-white">⚡</div>
            <div className="flex-1">
              <div className="text-sm font-bold">Aimaxauto Premium</div>
              <div className="text-xs text-gray-400">Annual plan · Renews Mar 2027</div>
            </div>
            <span className="text-sm font-bold text-[#FF6B00] font-mono">$99/yr</span>
          </div>
          {[
            ["🅿️", "Downtown LA Parking", "Monthly · Since Jan 2025", "$80/mo"],
            ["🚿", "Premium Car Wash", "Monthly · Since Jun 2025", "$35/mo"],
            ["🛣", "FasTrak Toll Pass", "Usage-based · Since 2024", "~$20/mo"],
          ].map(([icon, title, desc, price]) => (
            <div key={title} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 flex gap-3 items-center">
              <span className="text-lg">{icon}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
              <span className="text-xs font-bold font-mono text-gray-300">{price}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {[
            ["Feb 15", "AIRA question — Market analysis", "-$0.42"],
            ["Feb 14", "Premium Car Wash", "-$35.00"],
            ["Feb 12", "FasTrak toll — I-405", "-$3.50"],
            ["Feb 10", "AIRA question — Insurance compare", "-$0.38"],
            ["Feb 1", "Monthly Parking", "-$80.00"],
            ["Jan 28", "AIRA document scan", "-$0.45"],
          ].map(([date, desc, amount], i) => (
            <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#2a2a2f]/20">
              <div>
                <div className="text-sm">{desc}</div>
                <div className="text-xs text-gray-500">{date}</div>
              </div>
              <span className="text-sm font-mono text-red-400">{amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
