"use client";

import { useState } from "react";

const DOC_TYPES = [
  { icon: "🔧", title: "Service Invoice", cost: "$0.35" },
  { icon: "📋", title: "Inspection Report", cost: "$0.30" },
  { icon: "🛡️", title: "Insurance Letter", cost: "$0.55" },
  { icon: "💳", title: "Loan Agreement", cost: "$0.55" },
  { icon: "🔄", title: "Tire Receipt", cost: "$0.35" },
  { icon: "📑", title: "Purchase Agreement", cost: "$0.45" },
];

const SECTIONS = [
  { title: "Repairs & Invoices", icon: "🔧" },
  { title: "Inspection Reports", icon: "📋" },
  { title: "Notes", icon: "📝" },
];

export function DocsTab() {
  const [scanning, setScanning] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);

  const startScan = (title: string) => {
    setScanning(title);
    setScanStep(1);
    setTimeout(() => setScanStep(2), 1500);
    setTimeout(() => { setScanStep(3); setTimeout(() => { setScanning(null); setScanStep(0); }, 2000); }, 3500);
  };

  return (
    <div className="space-y-4">
      {/* AIRA Scan Hero */}
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #1a1814, #12110e)", border: "1px solid #FF6B0030" }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center text-lg">📸</div>
          <div>
            <div className="text-[15px] font-bold text-white">Scan with AIRA</div>
            <div className="text-xs text-gray-500">Take a photo of a document — AIRA reads and auto-fills</div>
          </div>
        </div>

        {/* Document type grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {DOC_TYPES.map((doc) => (
            <button
              key={doc.title}
              onClick={() => startScan(doc.title)}
              className="p-2.5 rounded-lg text-left transition-colors hover:bg-[#1e2024]/80"
              style={{ background: "#0a0a0c80", border: "1px solid #2a2a2f40" }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{doc.icon}</span>
                <span className="text-xs font-semibold text-white">{doc.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Scan progress */}
        {scanning && (
          <div className="p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-lg mb-3">
            <div className="text-xs font-semibold text-[#FF6B00] mb-2">Scanning {scanning}...</div>
            <div className="flex gap-2">
              {["📷 Capturing", "🔍 Reading", "✅ Saved"].map((step, i) => (
                <div key={i} className={`flex items-center gap-1 text-[10px] transition-opacity ${scanStep > i ? "opacity-100 text-white" : "opacity-30 text-gray-500"}`}>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="p-3 bg-[#0a0a0c]/40 rounded-lg mb-3">
          <div className="text-xs font-semibold text-[#FF6B00] mb-2">How it works</div>
          <div className="grid grid-cols-4 gap-2">
            {[["📷", "Take photo"], ["🤖", "AIRA reads"], ["✅", "Review"], ["💾", "Saved"]].map(([ic, t]) => (
              <div key={t} className="text-center">
                <div className="text-base mb-0.5">{ic}</div>
                <div className="text-[10px] font-semibold text-white">{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => startScan("document")}
            className="flex-1 py-3 bg-[#FF6B00] text-white rounded-lg text-sm font-semibold hover:bg-[#FF8533] transition-colors"
          >
            📷 Take photo of document
          </button>
          <button
            onClick={() => startScan("document")}
            className="flex-1 py-3 bg-[#0a0a0c] text-white rounded-lg text-sm font-semibold border border-[#2a2a2f] hover:bg-[#1e2024] transition-colors"
          >
            📁 Select existing photo
          </button>
        </div>
      </div>

      {/* Document sections */}
      {SECTIONS.map((sec) => (
        <div key={sec.title} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-8 text-center">
          <div className="text-2xl mb-2 opacity-40">{sec.icon}</div>
          <div className="text-sm text-gray-400">No {sec.title.toLowerCase()} yet</div>
          <button className="mt-3 px-5 py-2 bg-[#FF6B00] text-white rounded-lg text-xs font-semibold hover:bg-[#FF8533] transition-colors">
            + Add
          </button>
        </div>
      ))}
    </div>
  );
}
