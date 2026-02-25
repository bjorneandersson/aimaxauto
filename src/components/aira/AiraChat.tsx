"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: number;
  from: "user" | "aira";
  text: string;
  time: string;
}

const QUICK_QUESTIONS = [
  { q: "Help me prioritize my vehicle issues", ic: "🎯" },
  { q: "Should I keep or sell any of my cars?", ic: "🤔" },
  { q: "How can I optimize my car costs?", ic: "💰" },
  { q: "What should I be thinking about right now?", ic: "💡" },
];

function RenderBold({ text }: { text: string }) {
  const parts = text.split(/\*\*/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-[#FF6B00]">{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function AiraChat({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showQuickQs, setShowQuickQs] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [msgs, streaming, scrollToBottom]);

  // Send greeting on mount
  useEffect(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Hey" : "Good evening";
    sendToApi([{
      role: "user" as const,
      content: `[SYSTEM: The user just opened the AIRA chat. Greet them with a ${greeting} and give a brief status of their garage. Mention any vehicles that need attention. Keep it warm and concise — 3-4 sentences max. Address them as James.]`
    }], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendToApi = async (apiMessages: { role: string; content: string }[], isGreeting = false) => {
    setStreaming(true);
    if (!isGreeting) setShowQuickQs(false);

    const airaId = Date.now() + 1;
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // Add empty AIRA message that we'll stream into
    setMsgs(prev => [...prev, { id: airaId, from: "aira", text: "", time }]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/aira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `API error ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              fullText += parsed.delta.text;
              setMsgs(prev =>
                prev.map(m => m.id === airaId ? { ...m, text: fullText } : m)
              );
            }
          } catch {
            // Skip unparseable lines
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setMsgs(prev =>
        prev.map(m =>
          m.id === airaId
            ? { ...m, text: m.text || `Sorry, I couldn't connect right now. ${err.message || "Please try again."}` }
            : m
        )
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
      setTimeout(() => setShowQuickQs(true), 300);
    }
  };

  const send = (text: string) => {
    if (!text.trim() || streaming) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const userMsg: Message = { id: Date.now(), from: "user", text: text.trim(), time: now };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");

    // Build conversation history for API (skip the greeting system message)
    const apiMessages = msgs
      .filter(m => m.text) // skip empty
      .map(m => ({
        role: m.from === "user" ? "user" as const : "assistant" as const,
        content: m.text,
      }));

    // Add the new user message
    apiMessages.push({ role: "user", content: text.trim() });

    // Remove the initial system greeting prompt if present
    if (apiMessages.length > 0 && apiMessages[0].content.startsWith("[SYSTEM:")) {
      apiMessages.shift();
    }

    sendToApi(apiMessages);
  };

  const clearChat = () => {
    if (abortRef.current) abortRef.current.abort();
    setMsgs([]);
    setStreaming(false);
    setShowQuickQs(true);
    // Re-trigger greeting
    setTimeout(() => {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Hey" : "Good evening";
      sendToApi([{
        role: "user",
        content: `[SYSTEM: The user cleared the conversation and reopened AIRA. Give a fresh ${greeting} greeting. Be brief — 2 sentences max.]`
      }], true);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-[#2a2a2f] flex items-center gap-2.5 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-sm">
          ⚡
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">AIRA</div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Your personal vehicle advisor
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Clear conversation"
          className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 text-xs hover:bg-[#1e2024] transition-colors"
        >
          🗑
        </button>
        <button
          onClick={onClose}
          title="Close chat"
          className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 text-base hover:bg-[#1e2024] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
        {msgs.map(m => (
          <div key={m.id} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[88%] px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line ${
                m.from === "user"
                  ? "bg-[#FF6B00] text-white rounded-2xl rounded-br-sm"
                  : "bg-[#16181c] border border-[#2a2a2f] text-gray-200 rounded-2xl rounded-bl-sm"
              }`}
            >
              {m.text ? <RenderBold text={m.text} /> : (
                <div className="flex gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse [animation-delay:0.4s]" />
                </div>
              )}
            </div>
            <span className="text-[9px] text-gray-600 mt-0.5 px-1">{m.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {showQuickQs && msgs.length <= 2 && !streaming && (
        <div className="px-3 pb-1.5 flex flex-wrap gap-1.5 border-t border-[#2a2a2f] pt-2">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q.q}
              onClick={() => send(q.q)}
              className="px-2 py-1 bg-[#16181c] border border-[#2a2a2f] rounded-lg text-[11px] text-gray-300 hover:border-[#FF6B00] hover:bg-[#FF6B00]/10 transition-all flex items-center gap-1"
            >
              {q.ic} {q.q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-2 border-t border-[#2a2a2f] flex gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Ask AIRA..."
          disabled={streaming}
          className="flex-1 px-3 py-2 bg-[#16181c] border border-[#2a2a2f] rounded-full text-sm text-white placeholder-gray-500 focus:border-[#FF6B00]/60 outline-none transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || streaming}
          className="w-9 h-9 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FF8533] transition-all shadow-lg shadow-[#FF6B00]/20"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
