"use client";

import { useState } from "react";

const TOPICS = [
  { id: 1, title: "Rivian R2 — first deliveries", count: 342, tag: "News", personal: false, icon: "🚗", desc: "Rivian's new compact SUV is hitting driveways. Here's what the first owners think." },
  { id: 2, title: "Emissions rules 2026", count: 218, tag: "Regulation", personal: true, icon: "📋", desc: "New EPA regulations from March 1. How your car is affected." },
  { id: 3, title: "EV batteries in winter", count: 187, tag: "EV", personal: true, icon: "❄️", desc: "Range, charging, and tips to get through winter." },
  { id: 4, title: "Tesla Model 3 recall", count: 156, tag: "Alert", personal: true, icon: "⚠️", desc: "Software update required. Affects 2020-2023 models." },
  { id: 5, title: "Gas prices at 2-year low", count: 134, tag: "Economy", personal: false, icon: "⛽", desc: "Prices falling — how long the trend is expected to last." },
  { id: 6, title: "Kia EV6 vs Hyundai Ioniq 5", count: 128, tag: "Test", personal: false, icon: "⚡", desc: "Sibling rivalry on the same platform. Who wins?" },
  { id: 7, title: "Pep Boys 20% off", count: 98, tag: "Offer", personal: true, icon: "🔧", desc: "Exclusive for Aimaxauto members through March 31." },
  { id: 8, title: "Insurance comparison 2026", count: 89, tag: "Economy", personal: false, icon: "🛡", desc: "We compare 8 providers — the price difference can be $500+." },
  { id: 9, title: "How to sell your car faster", count: 76, tag: "Tips", personal: false, icon: "💰", desc: "5 things that increase value according to AutoAD PRO data." },
  { id: 10, title: "Summer tires — when to switch?", count: 64, tag: "Season", personal: false, icon: "🔄", desc: "Date, temperature, and legal requirements. Complete guide." },
];

function getArticles(topicId: number) {
  const t = TOPICS.find((x) => x.id === topicId);
  if (!t) return [];
  return [
    { id: topicId * 100 + 1, type: "news", source: "Car and Driver", title: t.title + " — full analysis", text: "An in-depth review of " + t.title.toLowerCase() + ". Industry experts say the trend is positive for consumers.", time: "3h", likes: 24, comments: 8 },
    { id: topicId * 100 + 2, type: "aira", source: "AIRA Analysis", title: "How your vehicles are affected", text: "Based on your garage vehicles, I analyzed how " + t.title.toLowerCase() + " affects you specifically. Recommendation: keep an eye on developments.", time: "Just now", likes: 12, comments: 3 },
    { id: topicId * 100 + 3, type: "community", source: "Mike R", title: "My experience", text: "I've experienced this myself. TL;DR: be proactive and don't wait. Tip: book through Aimaxauto for better pricing.", time: "5h", likes: 31, comments: 14 },
    { id: topicId * 100 + 4, type: "news", source: "MotorTrend", title: "Industry reaction", text: "The industry is divided. While some welcome the changes, others point to increased costs.", time: "1d", likes: 18, comments: 6 },
    { id: topicId * 100 + 5, type: "community", source: "Rachel K", title: "Question for the experts", text: "Anyone know how this affects older models? Appreciate any help!", time: "8h", likes: 5, comments: 11 },
  ];
}

export default function ExplorePage() {
  const [selTopic, setSelTopic] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Record<number, { user: string; text: string; time: string }[]>>({});
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());

  const addComment = (articleId: number) => {
    if (!commentText.trim()) return;
    setComments((prev) => ({
      ...prev,
      [articleId]: [...(prev[articleId] || []), { user: "You", text: commentText, time: "Now" }],
    }));
    setCommentText("");
  };

  const toggleLike = (articleId: number) => {
    setLikedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(articleId)) next.delete(articleId);
      else next.add(articleId);
      return next;
    });
  };

  // ── Topic Detail View ──
  if (selTopic) {
    const t = TOPICS.find((x) => x.id === selTopic)!;
    const articles = getArticles(selTopic);

    return (
      <div className="py-5 px-4">
        <button
          onClick={() => setSelTopic(null)}
          className="flex items-center gap-1.5 text-sm text-gray-400 mb-4 hover:text-white transition-colors"
        >
          ← Back to Explore
        </button>

        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="text-2xl">{t.icon}</span>
          <div>
            <div className="text-xl font-bold">{t.title}</div>
            <div className="text-xs text-gray-500">{t.count} posts · {t.tag}</div>
          </div>
        </div>
        <div className="text-sm text-gray-400 mb-5 leading-relaxed">{t.desc}</div>

        {articles.map((a) => {
          const typeColor = a.type === "aira" ? "#b89b5e" : a.type === "news" ? "#3b82f6" : "#FF6B00";
          const typeLabel = a.type === "aira" ? "AIRA Analysis" : a.type === "news" ? "News" : "Community";
          const artComments = comments[a.id] || [];
          const liked = likedArticles.has(a.id);

          return (
            <div key={a.id} className="bg-[#16181c] border border-[#2a2a2f] rounded-2xl p-4 mb-3">
              {/* Header */}
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex gap-2 items-center">
                  <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-semibold" style={{ background: typeColor + "18", color: typeColor }}>
                    {typeLabel}
                  </span>
                  <span className="text-xs text-gray-500">{a.source}</span>
                </div>
                <span className="text-xs text-gray-500">{a.time}</span>
              </div>

              <div className="text-[15px] font-bold mb-1.5">{a.title}</div>
              <div className="text-sm text-white leading-relaxed mb-3">{a.text}</div>

              {/* Actions */}
              <div className="flex gap-3.5">
                <button onClick={() => toggleLike(a.id)} className={`text-xs ${liked ? "text-[#FF6B00]" : "text-gray-500"} hover:text-[#FF6B00] transition-colors`}>
                  {liked ? "♥" : "♡"} {a.likes + (liked ? 1 : 0)}
                </button>
                <button className="text-xs text-gray-500 hover:text-white transition-colors">
                  💬 {a.comments + artComments.length}
                </button>
                <button className="text-xs text-gray-500 hover:text-white transition-colors">↗ Share</button>
              </div>

              {/* Existing comments */}
              {artComments.map((cm, ci) => (
                <div key={ci} className="p-2.5 bg-[#0a0a0c] rounded-lg mt-1.5">
                  <div className="text-xs font-semibold">
                    {cm.user} <span className="text-gray-500 font-normal">{cm.time}</span>
                  </div>
                  <div className="text-xs text-white mt-0.5">{cm.text}</div>
                </div>
              ))}

              {/* Comment input */}
              <div className="flex gap-2 mt-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addComment(a.id); }}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 bg-[#0a0a0c] border border-[#2a2a2f] rounded-lg text-white text-xs placeholder-gray-500 outline-none focus:border-[#FF6B00]/40 transition-colors"
                />
                <button
                  onClick={() => addComment(a.id)}
                  className="px-3.5 py-2 bg-[#FF6B00] text-white rounded-lg text-xs font-semibold hover:bg-[#FF8533] transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Topic List View ──
  return (
    <div className="py-5 px-4">
      <div className="text-xl font-bold mb-1">Explore</div>
      <div className="text-sm text-gray-400 mb-5">Trending topics in vehicles and mobility</div>

      {TOPICS.map((t) => (
        <div
          key={t.id}
          onClick={() => setSelTopic(t.id)}
          className="bg-[#16181c] border border-[#2a2a2f] rounded-2xl p-3.5 mb-2 cursor-pointer flex items-center gap-3.5 hover:border-[#FF6B00]/40 transition-colors"
        >
          <div className="text-lg w-9 text-center flex-shrink-0">{t.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold truncate">{t.title}</span>
              {t.personal && (
                <span className="px-2 py-0.5 bg-[#FF6B00]/10 rounded-xl text-[9px] text-[#FF6B00] font-semibold flex-shrink-0">
                  Relevant for you
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">{t.desc}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-bold">{t.count}</div>
            <div className="text-[10px] text-gray-500">{t.tag}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
