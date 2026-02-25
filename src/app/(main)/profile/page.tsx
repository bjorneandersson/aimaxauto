"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const isPremium = true;

  const vehicles = [
    { id: 1, brand: "Tesla", model: "Model Y", reg: "YETI", mi: "12,400", year: 2023, status: "ok" },
    { id: 2, brand: "Ford", model: "F-150 XLT", reg: "FRD-150", mi: "67,200", year: 2021, status: "warning" },
    { id: 3, brand: "Honda", model: "CR-V Hybrid", reg: "HND-CRV", mi: "45,800", year: 2022, status: "critical" },
    { id: 4, brand: "BMW", model: "X3 M Sport", reg: "BMW-X3M", mi: "31,500", year: 2023, status: "ok" },
  ];

  return (
    <div className="py-5 px-4">
      {/* Membership */}
      <div className="bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8533]/5 border border-[#FF6B00]/20 rounded-2xl p-4 mb-5 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-xl text-white flex-shrink-0">
          ⚡
        </div>
        <div className="flex-1">
          <div className="text-[15px] font-bold">Premium Member</div>
          <div className="text-xs text-gray-400">Unlimited AIRA access · Partner offers · Priority support</div>
        </div>
        <span className="px-2.5 py-1 bg-[#FF6B00]/10 text-[#FF6B00] rounded-md text-xs font-semibold">Active</span>
      </div>

      {/* Personal Information */}
      <div className="text-sm font-bold text-gray-400 mb-2.5">Personal Information</div>
      <div className="flex gap-5 items-start mb-6">
        <div className="w-20 h-20 rounded-full bg-[#1e2024] flex items-center justify-center flex-shrink-0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="flex-1 space-y-3">
          {[["First Name", "James"], ["Last Name", "Mitchell"], ["Email", "james.mitchell@gmail.com"], ["Phone", "(310) 555-0147"]].map(([label, value]) => (
            <div key={label}>
              <label className="text-xs text-gray-400 block mb-1">{label}</label>
              <input
                defaultValue={value}
                className="w-full px-3.5 py-2.5 bg-[#16181c] border border-[#2a2a2f] rounded-lg text-white text-sm outline-none focus:border-[#FF6B00]/40 transition-colors"
              />
            </div>
          ))}
          <button className="px-5 py-2.5 bg-[#FF6B00] text-white rounded-lg text-sm font-semibold hover:bg-[#FF8533] transition-colors">
            Save changes
          </button>
        </div>
      </div>

      {/* Vehicles */}
      <div className="text-sm font-bold text-gray-400 mb-2.5">Your vehicles</div>
      {vehicles.map((v) => (
        <div key={v.id} className={`bg-[#16181c] border rounded-xl p-4 mb-2 flex justify-between items-center ${v.status !== "ok" ? "border-red-500/20" : "border-[#2a2a2f]"}`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full ${v.status === "ok" ? "bg-emerald-500" : v.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
            <div>
              <div className="text-sm font-semibold">{v.brand} {v.model}</div>
              <div className="text-xs text-gray-400">{v.reg} · {v.mi} mi · {v.year}</div>
            </div>
          </div>
          <button className="px-3.5 py-1.5 border border-red-500/30 text-red-500 rounded-md text-xs hover:bg-red-500/10 transition-colors">
            Remove
          </button>
        </div>
      ))}
      <button className="w-full py-3 border border-[#FF6B00] text-[#FF6B00] rounded-lg text-sm font-semibold mt-2 hover:bg-[#FF6B00]/10 transition-colors">
        + Add Vehicle
      </button>

      {/* Notifications */}
      <div className="text-sm font-bold text-gray-400 mt-6 mb-2.5">Notifications</div>
      {([
        ["Email Notifications", emailNotif, setEmailNotif, "AIRA reports and weekly summaries"],
        ["Push Notifications", pushNotif, setPushNotif, "Urgent inspection, service and AIRA insights"],
        ["SMS Notifications", smsNotif, setSmsNotif, "Only for urgent events (inspection, driving ban)"],
      ] as [string, boolean, (v: boolean) => void, string][]).map(([label, value, setter, desc]) => (
        <div key={label} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 mb-2 flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">{label}</span>
            <div className="text-xs text-gray-500">{desc}</div>
          </div>
          <button
            onClick={() => setter(!value)}
            className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-[#FF6B00]" : "bg-[#2a2a2f]"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${value ? "left-5.5" : "left-0.5"}`}
              style={{ left: value ? 22 : 2 }}
            />
          </button>
        </div>
      ))}

      {/* Payment */}
      <div className="text-sm font-bold text-gray-400 mt-6 mb-2.5">Payment Method</div>
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">💳</span>
          <div>
            <div className="text-sm font-medium">Visa •••• 4832</div>
            <div className="text-xs text-gray-500">Expires 08/27 · Used for AIRA tokens and Premium</div>
          </div>
        </div>
        <button className="px-3.5 py-1.5 border border-[#2a2a2f] text-white rounded-md text-xs hover:bg-[#1e2024] transition-colors">
          Change
        </button>
      </div>

      {/* Privacy */}
      <div className="text-sm font-bold text-gray-400 mt-6 mb-2.5">Privacy & Consent</div>
      {[
        ["I accept the terms of service and privacy policy", true],
        ["I consent to the processing of my personal data", true],
        ["I want to receive offers from Aimaxauto and partners (optional)", true],
      ].map(([label, checked], i) => (
        <label key={i} className="flex items-start gap-2.5 mb-3 cursor-pointer">
          <input type="checkbox" defaultChecked={checked as boolean} className="accent-[#FF6B00] w-4 h-4 mt-0.5" />
          <span className="text-sm text-gray-400">{label as string}</span>
        </label>
      ))}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button className="py-3.5 border border-[#2a2a2f] text-white rounded-lg text-sm font-semibold hover:bg-[#1e2024] transition-colors">
          Sign Out
        </button>
        <button className="py-3.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
