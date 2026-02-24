"use client";

export function HealthRing({ score, size = 80 }: { score: number; size?: number }) {
  const pct = (score / 100) * 283;
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2a2f" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${pct} 283`} strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold" style={{ fontSize: size * 0.28, color }}>{score}</span>
        <span className="text-gray-500" style={{ fontSize: size * 0.11, marginTop: -2 }}>of 100</span>
      </div>
    </div>
  );
}
