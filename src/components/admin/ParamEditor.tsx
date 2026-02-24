"use client";

import { useState } from "react";

interface Param {
  id: string;
  key: string;
  value: any;
  label: string | null;
  category: string;
  updatedAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  curve: "📈 Depreciation & Age Curves",
  prestige: "⭐ Brand Prestige",
  equipment: "🔧 Equipment Values",
  region: "🌍 Regional Coefficients",
  mileage: "🛣 Mileage Adjustments",
  baseline: "💰 Model Baselines",
};

export default function ParamEditor({
  grouped,
}: {
  grouped: Record<string, Param[]>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(
    Object.keys(grouped)[0] || null
  );

  const handleSave = async (param: Param) => {
    setSaving(true);
    try {
      const parsed = JSON.parse(editValue);
      await fetch(`/api/parameters/${param.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: parsed }),
      });
      setEditingId(null);
      window.location.reload();
    } catch (err) {
      alert("Invalid JSON — please check your input");
    } finally {
      setSaving(false);
    }
  };

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="bg-surface-card border border-border rounded-2xl p-8 text-center">
        <p className="text-text-secondary mb-4">
          No valuation parameters found in the database.
        </p>
        <p className="text-xs text-text-tertiary">
          Run <code className="px-1.5 py-0.5 bg-surface-element rounded text-brand font-mono">npm run db:seed</code> to populate default parameters from the valuation engine.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([category, params]) => (
        <div
          key={category}
          className="bg-surface-card border border-border rounded-2xl overflow-hidden"
        >
          {/* Category header */}
          <button
            onClick={() => setOpenCategory(openCategory === category ? null : category)}
            className="w-full flex items-center justify-between p-4 hover:bg-surface-cardHover transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">
                {CATEGORY_LABELS[category] || category}
              </span>
              <span className="text-xs text-text-tertiary">({params.length})</span>
            </div>
            <span className="text-text-tertiary text-sm">
              {openCategory === category ? "▾" : "▸"}
            </span>
          </button>

          {/* Params list */}
          {openCategory === category && (
            <div className="border-t border-border divide-y divide-border">
              {params.map((param) => (
                <div key={param.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-text-primary font-mono">
                        {param.key}
                      </span>
                      {param.label && (
                        <span className="text-xs text-text-tertiary ml-2">{param.label}</span>
                      )}
                    </div>
                    {editingId === param.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(param)}
                          disabled={saving}
                          className="text-xs px-3 py-1 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs px-3 py-1 border border-border text-text-secondary rounded-lg hover:bg-surface-element"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(param.id);
                          setEditValue(JSON.stringify(param.value, null, 2));
                        }}
                        className="text-xs px-3 py-1 border border-border text-text-secondary rounded-lg hover:bg-surface-element"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {editingId === param.id ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={Math.min(JSON.stringify(param.value, null, 2).split("\n").length + 1, 15)}
                      className="w-full px-3 py-2 bg-surface-bg border border-border rounded-xl text-xs font-mono text-text-primary focus:outline-none focus:border-brand resize-y"
                    />
                  ) : (
                    <pre className="text-xs font-mono text-text-secondary bg-surface-bg rounded-xl p-3 overflow-x-auto max-h-32">
                      {JSON.stringify(param.value, null, 2)}
                    </pre>
                  )}

                  <div className="text-xs text-text-tertiary mt-1">
                    Last updated: {new Date(param.updatedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
