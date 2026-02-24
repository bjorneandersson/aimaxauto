"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { id: "home", path: "/", label: "Home", svg: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
  { id: "explore", path: "/explore", label: "Explore", svg: "M4 9h16 M4 15h16 M10 3l-2 18 M16 3l-2 18" },
  { id: "garage", path: "/garage", label: "My Garage", svg: "M1 3h15a2 2 0 0 1 2 2v11H1V5a2 2 0 0 1 2-2z M16 8l4 0 3 3v5h-3 M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" },
  { id: "market", path: "/market", label: "AutoMarket", svg: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" },
  { id: "pay", path: "/pay", label: "AimaxPAY", svg: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22" },
  { id: "ads", path: "/ads", label: "Advertise", svg: "M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M12 8v8 M8 12h8" },
  { id: "offers", path: "/offers", label: "Offers", svg: "M12 8v4l3 3 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
  { id: "bookmarks", path: "/bookmarks", label: "Saved", svg: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
  { id: "community", path: "/community", label: "Community", svg: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" },
  { id: "notifications", path: "/notifications", label: "Notifications", svg: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" },
  { id: "profile", path: "/profile", label: "Profile", svg: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
];

export function LeftNav() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="h-screen sticky top-0 flex flex-col py-3 px-2 border-r border-[#2a2a2f] bg-[#0a0a0c] z-20 overflow-y-auto overflow-x-hidden flex-shrink-0"
      style={{
        width: expanded ? 240 : 72,
        transition: "width 0.25s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 px-2 mb-2 cursor-pointer flex-shrink-0 overflow-hidden no-underline"
      >
        <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0">
          Ai
        </div>
        {expanded && (
          <span className="text-lg font-bold text-white whitespace-nowrap tracking-tight">
            Aimaxauto
          </span>
        )}
      </Link>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`relative flex items-center gap-4 w-full h-11 rounded-full overflow-hidden whitespace-nowrap no-underline transition-all ${
                active
                  ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                  : "text-white hover:bg-[#1e2024]"
              }`}
              style={{
                padding: expanded ? "10px 14px" : "10px 0",
                justifyContent: expanded ? "flex-start" : "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={active ? "#FF6B00" : "#e4e6ea"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 min-w-[24px]"
              >
                <path d={item.svg} />
              </svg>
              {expanded && (
                <span className={`text-[15px] ${active ? "font-semibold" : "font-normal"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#2a2a2f] pt-2 mt-1 flex flex-col gap-1">
        <button
          className="flex items-center gap-3 w-full h-10 rounded-full text-gray-400 text-sm cursor-pointer overflow-hidden whitespace-nowrap hover:bg-[#1e2024] transition-colors"
          style={{
            padding: expanded ? "8px 14px" : "8px 0",
            justifyContent: expanded ? "flex-start" : "center",
          }}
        >
          <span className="text-base min-w-[24px] text-center">🌐</span>
          {expanded && <span>English ▾</span>}
        </button>
      </div>
    </aside>
  );
}
