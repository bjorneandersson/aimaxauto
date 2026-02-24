"use client";

import { useState } from "react";
import Link from "next/link";

interface Notif {
  id: number;
  type: string;
  title: string;
  desc: string;
  date: string;
  vId: number | null;
  urgent: boolean;
  read: boolean;
  aira: boolean;
}

const NOTIFS: Notif[] = [
  { id: 1, type: "inspection", title: "Smog check today!", desc: "Ford F-150 (8DEF456) is due for smog check today.", date: "Today", vId: 2, urgent: true, read: false, aira: false },
  { id: 2, type: "service", title: "Service due soon", desc: "Ford F-150 — 1,200 miles remaining.", date: "Today", vId: 2, urgent: true, read: false, aira: false },
  { id: 3, type: "inspection", title: "Inspection failed", desc: "Honda CR-V — retest by Mar 10.", date: "Yesterday", vId: 3, urgent: true, read: false, aira: false },
  { id: 10, type: "value", title: "⚡ AIRA: Your Tesla is rising in value", desc: "The market price for Tesla Model Y Long Range has increased 2.7% in the last month. Your vehicle is now valued at $41,500. This could be a good time to sell — want me to do a deeper analysis?", date: "Today", vId: 1, urgent: false, read: false, aira: true },
  { id: 11, type: "insurance", title: "⚡ AIRA: Insurance expiring soon", desc: "Your Ford F-150 has GEICO Full Coverage expiring 2026-04-15. I've compared 3 alternatives: State Farm ($178/mo), Progressive ($165/mo) and your current GEICO ($185/mo). You could save $240/year.", date: "Today", vId: 2, urgent: false, read: false, aira: true },
  { id: 12, type: "service", title: "⚡ AIRA: Optimize your service cost", desc: "Your Honda CR-V needs brake rotors replaced. I've found 3 shops near you: Pep Boys Glendale ($380), Firestone Pasadena ($420), Meineke Burbank ($350). Your Premium discount at Pep Boys saves you $50.", date: "Yesterday", vId: 3, urgent: true, read: false, aira: true },
  { id: 13, type: "value", title: "⚡ AIRA: Weekly report — Your garage", desc: "Summary: Total garage value $129,300 (+0.8% this week). 2 actions needed. Monthly cost: $1,245. Next event: Ford smog check today.", date: "Yesterday", vId: null, urgent: false, read: false, aira: true },
  { id: 4, type: "garage", title: "Garage Update", desc: "Vehicle (7ABC123) has been added.", date: "23 days ago", vId: 1, urgent: false, read: true, aira: false },
  { id: 5, type: "garage", title: "Garage Update", desc: "Vehicle (8DEF456) has been added.", date: "4 months ago", vId: 2, urgent: false, read: true, aira: false },
  { id: 6, type: "offer", title: "New Offer Available!", desc: "20% off service at Pep Boys (valid until Feb 28 2026).", date: "4 months ago", vId: null, urgent: false, read: true, aira: false },
  { id: 7, type: "comment", title: "New Comment", desc: 'James Mitchell commented: "great post"', date: "17 days ago", vId: null, urgent: false, read: true, aira: false },
];

const TYPE_ICON: Record<string, string> = {
  inspection: "📋", service: "🔧", garage: "🚗", offer: "🎁",
  comment: "💬", value: "📈", insurance: "🛡", system: "⚙️",
};

const TYPE_COLOR: Record<string, string> = {
  inspection: "#f59e0b", service: "#3b82f6", garage: "#FF6B00", offer: "#10b981",
  comment: "#3b82f6", value: "#10b981", insurance: "#8b5cf6", system: "#71767b",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(NOTIFS);
  const [filter, setFilter] = useState("all");

  const markAll = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const dismiss = (id: number) => setNotifs((n) => n.filter((x) => x.id !== id));
  const snooze = (id: number) => { dismiss(id); };
  const markRead = (id: number) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  const filters = [
    { id: "all", label: "All", count: notifs.length },
    { id: "aira", label: "⚡ AIRA", count: notifs.filter((n) => n.aira).length },
    { id: "urgent", label: "Urgent", count: notifs.filter((n) => n.urgent).length },
    { id: "garage", label: "Vehicles", count: notifs.filter((n) => ["inspection", "service", "garage", "value"].includes(n.type) && !n.aira).length },
    { id: "social", label: "Social", count: notifs.filter((n) => ["comment", "offer"].includes(n.type)).length },
  ];

  const filtered = notifs.filter((n) => {
    if (filter === "all") return true;
    if (filter === "aira") return n.aira;
    if (filter === "urgent") return n.urgent;
    if (filter === "garage") return ["inspection", "service", "garage", "value"].includes(n.type) && !n.aira;
    if (filter === "social") return ["comment", "offer"].includes(n.type);
    return true;
  });

  const unread = filtered.filter((n) => !n.read);
  const read = filtered.filter((n) => n.read);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0c]/90 backdrop-blur-xl">
        <div className="px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold">Notifications</h1>
            {unread.length > 0 && (
              <span className="bg-[#FF6B00] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unread.length} new
              </span>
            )}
          </div>
          <button
            onClick={markAll}
            className="px-3.5 py-2 bg-[#FF6B00] text-white rounded-lg text-xs font-semibold hover:bg-[#FF8533] transition-colors"
          >
            Mark all read
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-[#2a2a2f] px-3 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2.5 text-sm flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                filter === f.id
                  ? "font-semibold text-[#FF6B00] border-[#FF6B00]"
                  : "font-normal text-gray-400 border-transparent hover:text-gray-200"
              }`}
            >
              {f.label}
              {f.count > 0 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  filter === f.id ? "bg-[#FF6B00]/10 text-[#FF6B00]" : "bg-[#1e2024] text-gray-500"
                }`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Unread */}
        {unread.length > 0 && (
          <>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 py-2">
              New
            </div>
            {unread.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 mb-2 flex gap-3 cursor-pointer hover:bg-[#1c1e22] transition-colors"
                style={{ borderLeftColor: TYPE_COLOR[n.type] || "#2a2a2f", borderLeftWidth: 3 }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{
                    background: n.aira
                      ? "linear-gradient(135deg, #FF6B00, #FF8533)"
                      : (TYPE_COLOR[n.type] || "#71767b") + "15",
                    color: n.aira ? "#fff" : "inherit",
                  }}
                >
                  {n.aira ? "⚡" : TYPE_ICON[n.type] || "📌"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-sm font-semibold ${
                      n.aira ? "text-[#FF6B00]" : n.urgent ? "text-amber-500" : "text-white"
                    }`}>
                      {n.title}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{n.date}</span>
                  </div>
                  <div className="text-sm text-gray-400 leading-relaxed">{n.desc}</div>
                  <div className="flex gap-1.5 mt-2.5">
                    <Link
                      href={n.vId ? "/garage" : "#"}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold text-white no-underline"
                      style={{ background: n.aira ? "#FF6B00" : TYPE_COLOR[n.type] || "#FF6B00" }}
                    >
                      {n.aira ? "⚡ Ask AIRA" : "View →"}
                    </Link>
                    <button
                      onClick={(e) => { e.stopPropagation(); snooze(n.id); }}
                      className="px-3 py-1.5 border border-[#2a2a2f] text-gray-400 rounded-md text-xs hover:bg-[#1e2024] transition-colors"
                    >
                      Snooze
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                      className="px-3 py-1.5 border border-[#2a2a2f] text-gray-500 rounded-md text-xs hover:bg-[#1e2024] transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Read */}
        {read.length > 0 && (
          <>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 py-2 mt-4">
              Earlier
            </div>
            {read.map((n) => (
              <div
                key={n.id}
                className="border border-[#2a2a2f] rounded-xl p-3 mb-2 flex gap-3 opacity-60 hover:opacity-100 transition-opacity"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1e2024] flex items-center justify-center text-sm flex-shrink-0">
                  {TYPE_ICON[n.type] || "📌"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{n.title}</span>
                    <span className="text-xs text-gray-500">{n.date}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{n.desc}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-3xl mb-2">🔔</div>
            <div className="text-sm text-gray-500">No notifications to show</div>
          </div>
        )}
      </div>
    </div>
  );
}
