export interface FeedPost {
  id: number;
  type: "post" | "alert" | "aira_insight" | "article" | "youtube";
  user?: { name: string; handle: string; av: string; verified?: boolean };
  text?: string;
  img?: string;
  time: string;
  likes?: number;
  cmts?: number;
  liked?: boolean;
  // Alert
  alertType?: string;
  // Article
  title?: string;
  source?: string;
  desc?: string;
  // YouTube
  ytId?: string;
  channel?: string;
}

export const FEED: FeedPost[] = [
  { id: 200, type: "alert", text: "🔑 **YETI | Model Y** — Rear driver side door has been left open.", time: "Just now", alertType: "vehicle" },
  { id: 100, type: "aira_insight", user: { name: "AIRA", handle: "@aira", av: "⚡", verified: true }, text: "📊 **Monthly Garage Report**\n\nTotal garage value: **$129,300** (+0.3%)\n\n🟢 Tesla Model Y — Excellent (100/100)\n🟡 Ford F-150 — Needs attention (70/100)\n🔴 Honda CR-V — Action required (12/100)\n🟢 BMW X3 — All good (80/100)\n\n⚠️ 2 urgent actions pending.", time: "1h", likes: 0, cmts: 0, liked: false },
  { id: 1, type: "post", user: { name: "Jessica Rivera", handle: "@jess_r", av: "J" }, text: "Just got the keys to my new CR-V Hybrid! 🎉🔑 AIRA negotiated $2,400 below sticker price. The whole process through Aimaxauto Sales took 3 days — from valuation to signing. Best car buying experience I've ever had!", img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&q=80", time: "2h", likes: 87, cmts: 23, liked: false },
  { id: 201, type: "alert", text: "⚠️ **AIRA** — Your Ford F-150 smog check expires Feb 27. I found 3 stations within 5 miles — tap to book.", time: "2h", alertType: "deadline" },
  { id: 2, type: "post", user: { name: "Sarah Johnson", handle: "@sarah_j", av: "S" }, text: "Anyone switch to Michelin CrossClimate 2 on their F-150? Compared to BF Goodrich KO2? Love the all-weather capability but worried about tread life 🛞", time: "3h", likes: 18, cmts: 12, liked: false },
  { id: 10, type: "post", user: { name: "Aimaxauto Editorial", handle: "@aimaxauto", av: "📰" }, text: "**2026 Tesla Model Y Refresh — What's New**\n\nTesla's updated Model Y brings a redesigned interior, improved range up to 320 miles, and a controversial new front-end design. Dual motor AWD starts at $47,990.\n\n_Read more on aimaxauto.com_", time: "3h", likes: 112, cmts: 34, liked: false },
  { id: 3, type: "post", user: { name: "Marcus Thompson", handle: "@marcus_t", av: "M" }, text: "150,000 miles on my F-150 EcoBoost and she's still running like day one! Just finished the annual service at Pep Boys — new plugs, fluid flush, and alignment. These trucks are BUILT. 💪🔧", img: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&auto=format&q=80", time: "5h", likes: 156, cmts: 42, liked: false },
  { id: 101, type: "aira_insight", user: { name: "AIRA", handle: "@aira", av: "⚡", verified: true }, text: "💰 **Market Tip:** Tesla Model Y Long Range held steady this month while the broader market dipped 1.2%. Strong EV demand is protecting your value. Your Model Y is now worth **$41,500** — up $1,700 since you bought it.\n\n#markettip #tesla #ev", time: "6h", likes: 8, cmts: 2, liked: false },
  { id: 4, type: "post", user: { name: "David Chen", handle: "@david_c", av: "D" }, text: "PSA for BMW owners: the xDrive30i has a known issue with the transfer case at 50k-60k miles. Get it checked during your next service. Mine started making a whine at 52k. Covered under extended warranty thankfully. #bmw #x3", time: "8h", likes: 43, cmts: 15, liked: false },
  { id: 5, type: "youtube", title: "Tesla Model Y 2026 — Complete Owner's Review After 10,000 Miles", ytId: "dQw4w9WgXcQ", channel: "Aimaxauto Reviews", time: "12h", likes: 234, cmts: 67, liked: false },
  { id: 6, type: "post", user: { name: "Emily Park", handle: "@emily_p", av: "E" }, text: "Road trip report: LA to Vegas in the Ioniq 5. One charging stop, 18 min at Electrify America Baker. 800V is a game changer. Total cost: $12.40 ⚡", time: "1d", likes: 89, cmts: 22, liked: false },
  { id: 7, type: "post", user: { name: "Tom Bradley", handle: "@tom_b", av: "T" }, text: "Thinking about trading my X3 for a new RAV4 Hybrid. Anyone made a similar switch? How's the reliability comparison?", time: "1d", likes: 31, cmts: 15, liked: false },
];

export const PROMOTIONS = [
  { id: "ad1", brand: "Pep Boys", text: "Spring service from $149 — book now and get a free AC check!", cta: "Book service" },
  { id: "ad2", brand: "GEICO", text: "Switch auto insurance — save up to $500/yr. Compare in 2 minutes.", cta: "Compare rates" },
];

export const ALERTS = [
  { id: "n1", icon: "📋", text: "Your Ford F-150 is due for smog check today!", action: "See details" },
  { id: "n2", icon: "💰", text: "Tesla Model Y has increased in value +$1,700 this month.", action: "See valuation" },
];
