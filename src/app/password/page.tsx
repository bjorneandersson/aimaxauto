"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = from;
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        {/* Logo */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "linear-gradient(135deg, #FF6B00, #FF8533)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 20,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          Ai
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#e7e9ea",
            marginBottom: 8,
          }}
        >
          Aimaxauto
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#71767b",
            marginBottom: 32,
          }}
        >
          Enter password to continue
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 16px",
              borderRadius: 12,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              fontSize: 13,
            }}
          >
            Wrong password
          </div>
        )}

        {/* Input */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Password"
          autoFocus
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "#16181c",
            border: "1px solid #2a2a2f",
            borderRadius: 12,
            color: "#e7e9ea",
            fontSize: 15,
            outline: "none",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !password}
          style={{
            width: "100%",
            padding: "14px 0",
            background: password ? "#FF6B00" : "#2a2a2f",
            color: password ? "#fff" : "#536471",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: password ? "pointer" : "not-allowed",
            border: "none",
            transition: "all 0.2s",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "..." : "Enter"}
        </button>
      </div>
    </div>
  );
}
