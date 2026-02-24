"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/vehicles", label: "Vehicles", icon: "🚗" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/parameters", label: "Valuation Params", icon: "⚙️" },
  { href: "/admin/moderation", label: "Moderation", icon: "🛡" },
];

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") return null;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface-raised border-r border-border flex flex-col z-40">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center text-white font-bold text-sm">
            Ai
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">Aimaxauto</div>
            <div className="text-xs text-text-tertiary">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-dim text-brand"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-card"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-surface-card flex items-center justify-center text-xs font-bold text-text-secondary">
              {user.name?.[0] || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text-primary truncate">
              {user.name || "Admin"}
            </div>
            <div className="text-xs text-text-tertiary truncate">{user.email}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-card transition-colors"
          >
            View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-status-error border border-border rounded-lg hover:bg-status-errorDim transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
