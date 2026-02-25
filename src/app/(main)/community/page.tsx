"use client";

import { useState } from "react";
import { COMMUNITY_POSTS } from "@/data/market";

const GROUPS = [
  { id: 1, name: "EV Owners USA", members: 12840, desc: "Discuss charging, range and news", icon: "⚡" },
  { id: 2, name: "Truck & SUV Owners", members: 4280, desc: "F-150s, Silverados, Tacomas — mods, towing and maintenance", icon: "🛻" },
  { id: 3, name: "DIY Mechanics", members: 980, desc: "Tips, guides and repair help", icon: "🔧" },
  { id: 4, name: "Budget Car Ownership", members: 2100, desc: "Save money on service, insurance and fuel", icon: "💰" },
];

const EVENTS = [
  { id: 1, name: "Aimaxauto EV Meetup Los Angeles", date: "Mar 15, 2026", loc: "Santa Monica, CA", attending: 85, icon: "⚡" },
  { id: 2, name: "Tire Night with Tire Rack", date: "Feb 22, 2026", loc: "Pep Boys Hollywood", attending: 34, icon: "🛞" },
  { id: 3, name: "AutoAD PRO Workshop", date: "Mar 8, 2026", loc: "Online / Zoom", attending: 120, icon: "📸" },
];

export default function CommunityPage() {
  const [tab, setTab] = useState("feed");

  return (
    <div className="py-5 px-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Community</h1>
        <p className="text-sm text-gray-400">Knowledge. Community. Passion.</p>
      </div>

      <div className="flex border-b border-[#2a2a2f] mb-4">
        {[["feed", "Discussions"], ["groups", "Groups"], ["events", "Events"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-all ${tab === id ? "font-semibold text-[#FF6B00] border-[#FF6B00]" : "text-gray-400 border-transparent"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "feed" && (
        <div>
          {COMMUNITY_POSTS.map((p) => (
            <div key={p.id} className="bg-[#16181c] border border-[#2a2a2f] rounded-2xl p-4 mb-3">
              <div className="flex gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-sm font-bold text-[#FF6B00] flex-shrink-0">
                  {p.user.av}
                </div>
                <div>
                  <span className="text-sm font-bold">{p.user.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{p.time}</span>
                </div>
              </div>
              <div className="text-sm text-white leading-relaxed mb-3">{p.text}</div>
              <div className="flex gap-5">
                <button className="text-xs text-gray-500 hover:text-[#FF6B00] transition-colors">♡ {p.likes}</button>
                <button className="text-xs text-gray-500 hover:text-white transition-colors">💬 {p.comments}</button>
                <button className="text-xs text-gray-500 hover:text-white transition-colors">↗ Share</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "groups" && (
        <div>
          {GROUPS.map((g) => (
            <div key={g.id} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 mb-2.5 flex gap-3.5 items-center hover:border-[#FF6B00]/40 transition-colors cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-xl flex-shrink-0">{g.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-bold">{g.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{g.desc}</div>
                <div className="text-xs text-gray-500 mt-1">{g.members.toLocaleString()} members</div>
              </div>
              <button className="px-3.5 py-1.5 bg-[#FF6B00] text-white rounded-lg text-xs font-semibold flex-shrink-0 hover:bg-[#FF8533] transition-colors">Join</button>
            </div>
          ))}
        </div>
      )}

      {tab === "events" && (
        <div>
          {EVENTS.map((e) => (
            <div key={e.id} className="bg-[#16181c] border border-[#2a2a2f] rounded-xl p-4 mb-2.5 flex gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-2xl flex-shrink-0">{e.icon}</div>
              <div className="flex-1">
                <div className="text-[15px] font-bold">{e.name}</div>
                <div className="text-xs text-gray-400 mt-1">📅 {e.date}</div>
                <div className="text-xs text-gray-400">📍 {e.loc}</div>
                <div className="text-xs text-emerald-500 mt-1">{e.attending} attending</div>
              </div>
              <button className="px-3.5 py-1.5 border border-[#FF6B00] text-[#FF6B00] rounded-lg text-xs font-semibold self-start flex-shrink-0 hover:bg-[#FF6B00]/10 transition-colors">
                Sign up
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
