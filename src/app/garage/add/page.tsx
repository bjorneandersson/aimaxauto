"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LeftNav from "@/components/layout/LeftNav";
import RightBar from "@/components/layout/RightBar";

// ═══════════════════════════════════════════════════════════════
// ADD VEHICLE — Registration Number Lookup + Form
// Uses Biluppgifter API for Swedish vehicle data
// ═══════════════════════════════════════════════════════════════

interface VehicleLookupData {
  brand: string;
  model: string;
  year: number;
  body: string | null;
  fuel: string;
  hp: number | null;
  color: string | null;
  licensePlate: string;
  vin: string | null;
  regCountry: string;
  mileage: number;
  owners: number;
  drive: string | null;
  trans: string | null;
  topSpeed: string | null;
  consumption: string | null;
  co2: string | null;
  battery: string | null;
  rangemi: string | null;
  weight: string | null;
  towCapacity: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
  seats: number | null;
  inspectionStatus: string | null;
  lastInspection: string | null;
  nextInspection: string | null;
  annualTax: number;
  marketValue: number | null;
  stolen: boolean;
  imported: boolean;
  leasing: boolean;
  boughtOnCredit: boolean;
  firstRegistered: string | null;
  manufactureCountry: string | null;
  euroClass: string | null;
  tires: { front: string; rear: string; rimFront: string | null; rimRear: string | null } | null;
}

export default function AddVehiclePage() {
  const router = useRouter();
  const [regno, setRegno] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lookupData, setLookupData] = useState<VehicleLookupData | null>(null);
  const [looked, setLooked] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Form state (editable after lookup)
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    body: "",
    fuel: "Bensin",
    hp: "",
    color: "",
    licensePlate: "",
    vin: "",
    mileage: "",
    drive: "",
    trans: "",
  });

  const handleLookup = async () => {
    const cleaned = regno.toUpperCase().replace(/\s/g, "");
    if (!cleaned) {
      setError("Ange ett registreringsnummer");
      return;
    }

    setLoading(true);
    setError("");
    setLookupData(null);
    setLooked(false);

    try {
      const res = await fetch(`/api/vehicle-lookup?regno=${cleaned}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kunde inte hämta fordonsdata");
        setLoading(false);
        return;
      }

      setLookupData(data);
      setLooked(true);

      // Auto-fill form
      setForm({
        brand: data.brand || "",
        model: data.model || "",
        year: data.year || new Date().getFullYear(),
        body: data.body || "",
        fuel: data.fuel || "Bensin",
        hp: data.hp?.toString() || "",
        color: data.color || "",
        licensePlate: data.licensePlate || cleaned,
        vin: data.vin || "",
        mileage: data.mileage?.toString() || "0",
        drive: data.drive || "",
        trans: data.trans || "",
      });

      // Scroll to form
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch {
      setError("Nätverksfel. Kontrollera din anslutning.");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.brand || !form.model || !form.fuel) {
      setError("Fyll i märke, modell och bränsletyp");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const saveData = {
        brand: form.brand,
        model: form.model,
        year: Number(form.year),
        body: form.body || null,
        fuel: form.fuel,
        hp: form.hp ? Number(form.hp) : null,
        color: form.color || null,
        licensePlate: form.licensePlate || null,
        vin: form.vin || null,
        regCountry: "SE",
        mileage: form.mileage ? Number(form.mileage) : 0,
        drive: form.drive || null,
        trans: form.trans || null,
        // Pass through all lookup data
        ...(lookupData
          ? {
              owners: lookupData.owners,
              topSpeed: lookupData.topSpeed,
              consumption: lookupData.consumption,
              co2: lookupData.co2,
              battery: lookupData.battery,
              rangemi: lookupData.rangemi,
              weight: lookupData.weight,
              towCapacity: lookupData.towCapacity,
              length: lookupData.length,
              width: lookupData.width,
              height: lookupData.height,
              seats: lookupData.seats,
              inspectionStatus: lookupData.inspectionStatus,
              lastInspection: lookupData.lastInspection,
              nextInspection: lookupData.nextInspection,
              annualTax: lookupData.annualTax,
              marketValue: lookupData.marketValue,
              tires: lookupData.tires,
              status: lookupData.inspectionStatus === "failed" ? "critical" : lookupData.inspectionStatus === "warning" ? "warning" : "ok",
              statusText: lookupData.inspectionStatus === "failed"
                ? "Besiktning utgången"
                : lookupData.inspectionStatus === "warning"
                ? "Besiktning snart"
                : "Allt bra",
            }
          : {}),
      };

      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Kunde inte spara fordonet");
        setSaving(false);
        return;
      }

      // Success — redirect to garage
      router.push("/garage");
    } catch {
      setError("Nätverksfel. Försök igen.");
    }

    setSaving(false);
  };

  const formatRegno = (val: string) => {
    // Auto-format: ABC 123
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length > 3) {
      return clean.slice(0, 3) + " " + clean.slice(3, 6);
    }
    return clean;
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <LeftNav />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1"
            >
              ← Tillbaka till garaget
            </button>
            <h1 className="text-2xl font-bold">Lägg till fordon</h1>
            <p className="text-gray-400 mt-1">
              Ange registreringsnummer för att hämta fordonsdata automatiskt
            </p>
          </div>

          {/* Registration Number Lookup */}
          <div className="bg-[#111] border border-gray-800 rounded-xl p-6 mb-6">
            <label className="text-sm text-gray-400 block mb-2">
              Registreringsnummer
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                {/* Swedish license plate style input */}
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-blue-600 rounded-l-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <input
                  type="text"
                  value={regno}
                  onChange={(e) => setRegno(formatRegno(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  placeholder="ABC 123"
                  maxLength={7}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-14 pr-4 py-3 text-xl font-mono tracking-wider text-center focus:outline-none focus:border-blue-500 uppercase"
                  autoFocus
                />
              </div>
              <button
                onClick={handleLookup}
                disabled={loading || !regno.replace(/\s/g, "")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Söker...
                  </>
                ) : (
                  <>🔍 Sök</>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Quick info after lookup */}
            {lookupData && (
              <div className="mt-4 p-4 bg-[#0d1f0d] border border-green-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-3">
                  <span>✅</span> Fordon hittat!
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Märke/Modell:</span>{" "}
                    <span className="font-medium">{lookupData.brand} {lookupData.model}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Årsmodell:</span>{" "}
                    <span className="font-medium">{lookupData.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Färg:</span>{" "}
                    <span className="font-medium">{lookupData.color || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Bränsle:</span>{" "}
                    <span className="font-medium">{lookupData.fuel}</span>
                  </div>
                  {lookupData.hp && (
                    <div>
                      <span className="text-gray-400">Effekt:</span>{" "}
                      <span className="font-medium">{lookupData.hp} hk</span>
                    </div>
                  )}
                  {lookupData.mileage > 0 && (
                    <div>
                      <span className="text-gray-400">Mätarställning:</span>{" "}
                      <span className="font-medium">{lookupData.mileage.toLocaleString("sv-SE")} mil</span>
                    </div>
                  )}
                  {lookupData.marketValue && (
                    <div>
                      <span className="text-gray-400">Uppskattad värdering:</span>{" "}
                      <span className="font-medium text-green-400">
                        {lookupData.marketValue.toLocaleString("sv-SE")} kr
                      </span>
                    </div>
                  )}
                  {lookupData.stolen && (
                    <div className="col-span-2 text-red-400 font-bold">
                      ⚠️ FORDONET ÄR STULET / EFTERLYST
                    </div>
                  )}
                  {lookupData.inspectionStatus === "failed" && (
                    <div className="col-span-2 text-red-400">
                      🔴 Besiktning utgången (giltig t.o.m. {lookupData.nextInspection})
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Manual Entry / Edit Form */}
          <div ref={formRef} className={`transition-opacity duration-500 ${looked || !lookupData ? "opacity-100" : "opacity-50"}`}>
            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {looked ? "Kontrollera & justera uppgifter" : "Eller fyll i manuellt"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Märke *</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Volvo"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Modell *</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    placeholder="XC60 T6 AWD"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Årsmodell</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    min={1900}
                    max={2030}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Fuel */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Bränsle *</label>
                  <select
                    value={form.fuel}
                    onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option>Bensin</option>
                    <option>Diesel</option>
                    <option>El</option>
                    <option>Hybrid</option>
                    <option>PHEV</option>
                    <option>Etanol/E85</option>
                    <option>Gas</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Färg</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="Svart"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* HP */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Hästkrafter</label>
                  <input
                    type="number"
                    value={form.hp}
                    onChange={(e) => setForm({ ...form, hp: e.target.value })}
                    placeholder="250"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Karosstyp</label>
                  <select
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Välj...</option>
                    <option>Sedan</option>
                    <option>Kombi</option>
                    <option>SUV</option>
                    <option>Hatchback</option>
                    <option>Coupé</option>
                    <option>Cabriolet</option>
                    <option>Pickup</option>
                    <option>Minibuss</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Växellåda</label>
                  <select
                    value={form.trans}
                    onChange={(e) => setForm({ ...form, trans: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Välj...</option>
                    <option>Automat</option>
                    <option>Manuell</option>
                  </select>
                </div>

                {/* Drive */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Drivning</label>
                  <select
                    value={form.drive}
                    onChange={(e) => setForm({ ...form, drive: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Välj...</option>
                    <option>FWD</option>
                    <option>RWD</option>
                    <option>AWD</option>
                    <option>4WD</option>
                  </select>
                </div>

                {/* Mileage */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Mätarställning (mil)</label>
                  <input
                    type="number"
                    value={form.mileage}
                    onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                    placeholder="85000"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* License plate */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Registreringsnummer</label>
                  <input
                    type="text"
                    value={form.licensePlate}
                    onChange={(e) => setForm({ ...form, licensePlate: e.target.value.toUpperCase() })}
                    placeholder="ABC 123"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* VIN */}
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">Chassinummer (VIN)</label>
                  <input
                    type="text"
                    value={form.vin}
                    onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })}
                    placeholder="WVWZZZ3CZDE010906"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Additional info from lookup */}
              {lookupData && (
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">
                    Automatiskt hämtad data (sparas med fordonet)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {lookupData.consumption && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Förbrukning:</span>{" "}
                        <span>{lookupData.consumption}</span>
                      </div>
                    )}
                    {lookupData.co2 && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">CO₂:</span>{" "}
                        <span>{lookupData.co2}</span>
                      </div>
                    )}
                    {lookupData.weight && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Tjänstevikt:</span>{" "}
                        <span>{lookupData.weight}</span>
                      </div>
                    )}
                    {lookupData.topSpeed && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Toppfart:</span>{" "}
                        <span>{lookupData.topSpeed}</span>
                      </div>
                    )}
                    {lookupData.towCapacity && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Dragvikt:</span>{" "}
                        <span>{lookupData.towCapacity}</span>
                      </div>
                    )}
                    {lookupData.euroClass && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Euroklass:</span>{" "}
                        <span>{lookupData.euroClass}</span>
                      </div>
                    )}
                    {lookupData.owners > 0 && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Ägare:</span>{" "}
                        <span>{lookupData.owners} st</span>
                      </div>
                    )}
                    {lookupData.annualTax > 0 && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Fordonsskatt:</span>{" "}
                        <span>{lookupData.annualTax.toLocaleString("sv-SE")} kr/år</span>
                      </div>
                    )}
                    {lookupData.manufactureCountry && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Tillverkningsland:</span>{" "}
                        <span>{lookupData.manufactureCountry}</span>
                      </div>
                    )}
                    {lookupData.firstRegistered && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Först registrerad:</span>{" "}
                        <span>{lookupData.firstRegistered}</span>
                      </div>
                    )}
                    {lookupData.tires && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Däck:</span>{" "}
                        <span>{lookupData.tires.front}</span>
                      </div>
                    )}
                    {lookupData.battery && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Batteri:</span>{" "}
                        <span>{lookupData.battery}</span>
                      </div>
                    )}
                    {lookupData.rangemi && (
                      <div className="bg-[#1a1a1a] rounded px-3 py-2">
                        <span className="text-gray-500">Räckvidd:</span>{" "}
                        <span>{lookupData.rangemi}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-[#1a1a1a] border border-gray-700 hover:border-gray-600 rounded-lg font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.brand || !form.model}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sparar...
                  </>
                ) : (
                  <>✅ Lägg till i garaget</>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <RightBar />
    </div>
  );
}
