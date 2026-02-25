"use client";

export default function AdsPage() {
  return (
    <div className="py-5 px-4">
      <div className="mb-5">
        <h1 className="text-xl font-bold">Advertise</h1>
        <p className="text-sm text-gray-400">List on America's smartest vehicle platform</p>
      </div>

      {/* Hero */}
      <div className="rounded-2xl p-6 mb-5" style={{ background: "linear-gradient(135deg, #1a1814, #12110e)", border: "1px solid #FF6B0030" }}>
        <div className="text-xl font-bold text-white mb-1.5">Reach vehicle owners at exactly the right time</div>
        <div className="text-sm text-gray-500 leading-relaxed mb-4">
          Aimaxauto has real-time data on what each user drives, when their car needs service, when insurance expires, and when they're considering switching. Your offer reaches the right person when the need is greatest.
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Targeted Advertising", "Reach users by make, model, year, region, fuel type and vehicle status"],
            ["Offers & Deals", "Present offers when users have active needs — inspection, tires, insurance"],
            ["Partner Agreements", "Revenue-share model through AimaxPAY with full traceability"],
          ].map(([t, d]) => (
            <div key={t} className="p-3.5 bg-[#0a0a0c]/30 rounded-xl border border-[#2a2a2f]/30">
              <div className="text-sm font-bold text-white mb-1">{t}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Advertisers */}
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-2xl p-5">
          <div className="text-base font-bold mb-3">For Advertisers</div>
          <div className="text-xs text-gray-500 leading-relaxed mb-3">
            List on Aimaxauto and reach thousands of active vehicle owners. Unique targeting based on vehicle data — not personal data.
          </div>
          {[
            "Trigger-based ads (inspection, tires, insurance, service)",
            "Targeted by make, model, region, fuel type",
            "Sponsored placements in MyGarage and AIRA",
            "Brand advertising",
            "Measurable ROI via AimaxPAY",
          ].map((t, i) => (
            <div key={i} className="text-xs py-1.5 border-b border-[#2a2a2f]/15 flex gap-1.5">
              <span className="text-[#FF6B00]">•</span><span>{t}</span>
            </div>
          ))}
          <button className="w-full mt-4 py-3 bg-[#FF6B00] text-white rounded-lg text-sm font-semibold hover:bg-[#FF8533] transition-colors">
            Contact us for advertising
          </button>
        </div>

        {/* Partners */}
        <div className="bg-[#16181c] border border-[#2a2a2f] rounded-2xl p-5">
          <div className="text-base font-bold mb-3">For Partners</div>
          <div className="text-xs text-gray-500 leading-relaxed mb-3">
            Become a partner and access qualified customers with real needs. Framework agreement with automatic settlement through AimaxPAY.
          </div>
          {[
            "Workshops & Service Chains",
            "Tire shops & storage",
            "Insurance providers",
            "Banks & leasing companies",
            "Car dealers (new and used)",
            "Car wash, charging, accessories",
          ].map((t, i) => (
            <div key={i} className="text-xs py-1.5 border-b border-[#2a2a2f]/15 flex gap-1.5">
              <span className="text-emerald-500">•</span><span>{t}</span>
            </div>
          ))}
          <button className="w-full mt-4 py-3 border border-[#2a2a2f] text-white rounded-lg text-sm font-semibold hover:bg-[#1e2024] transition-colors">
            Apply for Partnership
          </button>
        </div>
      </div>

      {/* Sales fees */}
      <div className="bg-[#16181c] border border-[#2a2a2f] rounded-2xl p-5">
        <div className="text-base font-bold mb-3">Vehicle Sales via Aimaxauto</div>
        <div className="text-xs text-gray-500 leading-relaxed mb-4">
          We leverage market data and the AutoValue Engine for accurate pricing and fast buyer-seller matching.
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-[#0a0a0c] rounded-xl">
            <div className="text-sm font-bold mb-2">Sales Fees</div>
            {[["Sales Commission", "7%"], ["Buyer's Fee", "3%"], ["Minimum fee", "$1,500"], ["Registration", "$125"]].map(([l, v], i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-[#2a2a2f]/20 text-xs">
                <span>{l}</span><span className="font-semibold text-[#FF6B00] font-mono">{v}</span>
              </div>
            ))}
          </div>
          <div className="p-3.5 bg-[#0a0a0c] rounded-xl">
            <div className="text-sm font-bold mb-2">Example: $22,000 sale</div>
            {[["Sales Commission (7%)", "$1,540"], ["Buyer's Fee (3%)", "$660"], ["Registration", "$125"], ["Total", "$2,325"]].map(([l, v], i) => (
              <div key={i} className={`flex justify-between py-1.5 border-b border-[#2a2a2f]/20 text-xs ${i === 3 ? "font-bold" : ""}`}>
                <span>{l}</span><span className="font-semibold font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
