"use client";

import { useState } from "react";
import { FEED, PROMOTIONS, ALERTS, type FeedPost } from "@/data/feed";

export default function HomePage() {
  const [feed, setFeed] = useState<FeedPost[]>(FEED);
  const [tab, setTab] = useState("forYou");
  const [showAds, setShowAds] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);

  const onPost = (text: string) => {
    setFeed([
      {
        id: Date.now(), type: "post",
        user: { name: "You", handle: "@you", av: "Y" },
        text, time: "Now", likes: 0, cmts: 0, liked: false,
      },
      ...feed,
    ]);
  };

  const toggleLike = (id: number) => {
    setFeed(feed.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: (p.likes || 0) + (p.liked ? -1 : 1) } : p
    ));
  };

  const filtered = tab === "mine"
    ? feed.filter((p) => p.user?.name === "You")
    : feed;

  // Mix in ads and alerts
  const mixed: { type: string; data: any }[] = [];
  filtered.forEach((p, i) => {
    mixed.push({ type: "post", data: p });
    if (showAlerts && i === 0) mixed.push({ type: "alert", data: ALERTS[0] });
    if (showAds && i === 1) mixed.push({ type: "ad", data: PROMOTIONS[0] });
    if (showAlerts && i === 3) mixed.push({ type: "alert", data: ALERTS[1] });
    if (showAds && i === 4) mixed.push({ type: "ad", data: PROMOTIONS[1] });
  });

  return (
    <div className="py-5 px-4">
      {/* Tabs + toggles */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          {[["forYou", "For You"], ["following", "Following"], ["mine", "My Posts"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-sm border-b-2 transition-all ${
                tab === id ? "font-semibold text-[#FF6B00] border-[#FF6B00]" : "text-gray-400 border-transparent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowAds(!showAds)}
            className={`px-2.5 py-1 rounded-full text-[10px] border ${
              showAds ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]" : "bg-[#1e2024] border-[#2a2a2f] text-gray-500"
            }`}
          >
            Ads {showAds ? "on" : "off"}
          </button>
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`px-2.5 py-1 rounded-full text-[10px] border ${
              showAlerts ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]" : "bg-[#1e2024] border-[#2a2a2f] text-gray-500"
            }`}
          >
            Alerts {showAlerts ? "on" : "off"}
          </button>
        </div>
      </div>

      {/* Compose */}
      <ComposeBox onPost={onPost} />

      {/* Feed */}
      {mixed.map((item, i) => {
        if (item.type === "post") return <PostCard key={item.data.id} post={item.data} onLike={() => toggleLike(item.data.id)} />;
        if (item.type === "ad") return <AdCard key={item.data.id} ad={item.data} />;
        if (item.type === "alert") return <AlertCard key={item.data.id} alert={item.data} />;
        return null;
      })}
    </div>
  );
}

// ── Compose ──
function ComposeBox({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const charPct = text.length / 280 * 100;

  return (
    <div className={`border-b border-[#2a2a2f] pb-4 mb-4 transition-colors ${focused ? "bg-[#16181c]/40" : ""}`}>
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] font-bold text-sm flex-shrink-0">
          Y
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 280))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="What's happening?"
            className="w-full bg-transparent text-white text-base resize-none border-none outline-none leading-relaxed placeholder-gray-500"
            style={{ minHeight: focused ? 80 : 50 }}
            rows={2}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-0.5">
              {["🖼", "GIF", "📊", "😊"].map((ic, i) => (
                <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors">
                  {ic}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              {text.length > 0 && (
                <div className="relative w-7 h-7">
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="12" fill="none" stroke="#2a2a2f" strokeWidth="2.5" />
                    <circle cx="14" cy="14" r="12" fill="none"
                      stroke={text.length > 260 ? "#ef4444" : text.length > 220 ? "#f59e0b" : "#71767b"}
                      strokeWidth="2.5"
                      strokeDasharray={`${charPct * 0.754} 100`}
                      strokeLinecap="round"
                      transform="rotate(-90 14 14)"
                    />
                  </svg>
                  {text.length > 240 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color: text.length > 260 ? "#ef4444" : "#f59e0b" }}>
                      {280 - text.length}
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={() => { if (text.trim()) { onPost(text); setText(""); } }}
                disabled={!text.trim()}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  text.trim() ? "bg-[#FF6B00] text-white hover:bg-[#FF8533]" : "bg-[#1e2024] text-gray-500 cursor-not-allowed"
                }`}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PostCard ──
function PostCard({ post, onLike }: { post: FeedPost; onLike: () => void }) {
  const [showComments, setShowComments] = useState(false);

  // Alert type
  if (post.type === "alert") {
    const colors: Record<string, string> = { vehicle: "#ef4444", deadline: "#f59e0b", value: "#3b82f6" };
    const color = colors[post.alertType || ""] || "#FF6B00";
    return (
      <div className="rounded-xl p-4 mb-3 flex items-center gap-3" style={{ background: color + "0d", border: `1px solid ${color}33` }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}66` }} />
        <div className="flex-1 text-sm text-white leading-relaxed">
          <RenderBold text={post.text || ""} />
        </div>
        <span className="text-xs text-gray-500">{post.time}</span>
      </div>
    );
  }

  const isAira = post.type === "aira_insight";
  const isYoutube = post.type === "youtube";

  return (
    <div className="bg-[#16181c] border border-[#2a2a2f] rounded-2xl p-4 mb-3">
      {/* Header */}
      <div className="flex gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
          isAira ? "bg-gradient-to-br from-[#FF6B00] to-[#FF8533] text-white" :
          isYoutube ? "bg-red-600 text-white" :
          "bg-[#FF6B00]/10 text-[#FF6B00]"
        }`}>
          {isAira ? "⚡" : isYoutube ? "▶" : post.user?.av || post.user?.name?.[0] || "?"}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            {post.user?.name || "Anonymous"}
            {post.user?.verified && <span className="ml-1 text-[#FF6B00]">✓</span>}
          </div>
          <div className="text-xs text-gray-500">{post.time}</div>
        </div>
      </div>

      {/* Text */}
      {post.text && (
        <div className="text-sm text-white leading-relaxed mb-3 whitespace-pre-line">
          <RenderBold text={post.text} />
        </div>
      )}

      {/* Image */}
      {post.img && !isYoutube && (
        <div className="rounded-xl overflow-hidden mb-3 relative" style={{ paddingBottom: "56%" }}>
          <img src={post.img} className="absolute inset-0 w-full h-full object-cover" alt="" />
        </div>
      )}

      {/* YouTube */}
      {isYoutube && post.ytId && (
        <div className="rounded-xl overflow-hidden mb-3">
          <a
            href={`https://www.youtube.com/watch?v=${post.ytId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full bg-[#111] rounded-xl overflow-hidden no-underline"
            style={{ paddingBottom: "56.25%" }}
          >
            <img
              src={`https://img.youtube.com/vi/${post.ytId}/mqdefault.jpg`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex items-center justify-center">
              <div className="w-16 h-12 rounded-2xl bg-red-600/90 flex items-center justify-center shadow-lg">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[18px] border-l-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2.5 left-3.5 right-3.5">
              <div className="text-sm font-semibold text-white drop-shadow-lg">{post.title}</div>
            </div>
          </a>
          <div className="flex items-center gap-1.5 pt-1.5 px-1">
            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0">▶</div>
            <span className="text-xs text-gray-500">{post.channel} · YouTube</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button onClick={onLike} className={`text-xs flex items-center gap-1 ${post.liked ? "text-[#FF6B00]" : "text-gray-500"} hover:text-[#FF6B00] transition-colors`}>
          {post.liked ? "♥" : "♡"} {post.likes || 0}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="text-xs text-gray-500 hover:text-white transition-colors">
          💬 {post.cmts || 0}
        </button>
        <button className="text-xs text-gray-500 hover:text-white transition-colors">↗ Share</button>
      </div>

      {showComments && (
        <div className="mt-3 p-3 bg-[#0a0a0c] rounded-lg">
          <div className="text-xs text-gray-500">Comments appear here...</div>
        </div>
      )}
    </div>
  );
}

// ── Ad Card ──
function AdCard({ ad }: { ad: { id: string; brand: string; text: string; cta: string } }) {
  return (
    <div className="bg-[#16181c] border border-[#2a2a2f] rounded-2xl p-4 mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Sponsored</span>
        <span className="text-xs font-semibold text-[#FF6B00]">{ad.brand}</span>
      </div>
      <div className="text-sm text-white mb-3">{ad.text}</div>
      <button className="px-3.5 py-1.5 bg-[#FF6B00] text-white rounded-md text-xs font-semibold hover:bg-[#FF8533] transition-colors">
        {ad.cta}
      </button>
    </div>
  );
}

// ── Alert Card (inline) ──
function AlertCard({ alert }: { alert: { id: string; icon: string; text: string; action: string } }) {
  return (
    <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-2xl p-3.5 mb-3 flex items-center gap-2.5">
      <span className="text-base">{alert.icon}</span>
      <div className="flex-1 text-sm text-white">{alert.text}</div>
      <button className="px-3 py-1.5 bg-[#FF6B00] text-white rounded-md text-[10px] font-semibold flex-shrink-0 hover:bg-[#FF8533] transition-colors">
        {alert.action}
      </button>
    </div>
  );
}

// ── Bold text renderer ──
function RenderBold({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="text-[#FF6B00] font-semibold">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}
