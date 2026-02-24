"use client";

import { useState } from "react";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  mileage: number;
  regCountry: string;
  lastValuation: number | null;
  isForSale: boolean;
  createdAt: string;
  user: { name: string | null; email: string | null };
}

export default function VehicleTable({ vehicles }: { vehicles: Vehicle[] }) {
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = vehicles.filter(
    (v) =>
      `${v.brand} ${v.model} ${v.year}`.toLowerCase().includes(search.toLowerCase()) ||
      v.user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      window.location.reload();
    } catch {
      alert("Failed to delete vehicle");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search vehicles or owners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-surface-card border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand"
        />
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Vehicle
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Owner
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Mileage
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Valuation
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-tertiary">
                  {search ? "No vehicles matching your search" : "No vehicles registered yet"}
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} className="hover:bg-surface-cardHover transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-text-primary">
                      {v.brand} {v.model}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {v.year} · {v.fuel} · {v.regCountry}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-text-secondary">{v.user.name || "—"}</div>
                    <div className="text-xs text-text-tertiary">{v.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-mono text-text-secondary">
                      {v.mileage.toLocaleString()} mi
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-mono text-brand">
                      {v.lastValuation ? `$${v.lastValuation.toLocaleString()}` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {v.isForSale ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-status-successDim text-status-success">
                        For Sale
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-element text-text-tertiary">
                        Private
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(v.id)}
                      disabled={deleting === v.id}
                      className="text-xs text-status-error hover:text-status-error/80 disabled:opacity-50"
                    >
                      {deleting === v.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
