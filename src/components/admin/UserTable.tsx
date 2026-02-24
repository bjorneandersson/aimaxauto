"use client";

import { useState } from "react";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  plan: string;
  createdAt: string;
  airaCredits: number;
  airaTokensUsed: number;
  _count: { vehicles: number; posts: number };
}

export default function UserTable({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      window.location.reload();
    } catch {
      alert("Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-surface-card border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand"
        />
      </div>

      <div className="bg-surface-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">User</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Role</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Plan</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Vehicles</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Posts</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">AIRA Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-surface-cardHover transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {u.image ? (
                      <img src={u.image} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-surface-element flex items-center justify-center text-xs font-bold text-text-secondary">
                        {u.name?.[0] || "?"}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-text-primary">{u.name || "—"}</div>
                      <div className="text-xs text-text-tertiary">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={updating === u.id}
                    className="text-xs px-2 py-1 bg-surface-element border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand cursor-pointer disabled:opacity-50"
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      u.plan === "pro"
                        ? "bg-brand-dim text-brand"
                        : u.plan === "premium"
                        ? "bg-status-infoDim text-status-info"
                        : "bg-surface-element text-text-tertiary"
                    }`}
                  >
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono text-text-secondary">
                  {u._count.vehicles}
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono text-text-secondary">
                  {u._count.posts}
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono text-text-secondary">
                  {u.airaTokensUsed.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
