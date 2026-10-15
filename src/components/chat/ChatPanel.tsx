"use client";

import { Send, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, INPUT } from "@/components/ui/kit";
import { type Answer, answerQuestion, suggestionsFor } from "@/lib/chat";
import type { RecordingItem } from "@/types/recording";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  cite?: Answer["cite"];
}

export function ChatPanel({
  recs,
  initialQuestion,
  className = "",
}: {
  recs: RecordingItem[];
  initialQuestion?: string;
  className?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const q = initialQuestion?.trim();
    if (!q) return [];
    const a = answerQuestion(q, recs);
    return [
      { id: 0, role: "user", text: q },
      { id: 1, role: "ai", text: a.text, cite: a.cite },
    ];
  });
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll whenever the thread changes
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q || thinking) return;
    setDraft("");
    setMessages((m) => [...m, { id: m.length, role: "user", text: q }]);
    setThinking(true);
    timer.current = setTimeout(() => {
      const a = answerQuestion(q, recs);
      setMessages((m) => [
        ...m,
        { id: m.length, role: "ai", text: a.text, cite: a.cite },
      ]);
      setThinking(false);
    }, 650);
  };

  const suggestions = suggestionsFor(recs);

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className="flex min-h-[260px] flex-1 flex-col gap-3 overflow-y-auto"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div>
            <p className="mb-2 text-[12px] font-semibold text-[#2b2822]">
              Suggested questions
            </p>
            <div className="flex flex-col gap-2">
              {suggestions.length === 0 && (
                <p className="text-[13px] text-[#5f594c]">
                  Ask anything about{" "}
                  {recs.length === 1 ? "this recording" : "your recordings"}.
                </p>
              )}
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-[5px] border border-[#bdb4a3] bg-[#ece6da] px-3 py-2.5 text-left text-[13px] transition hover:bg-[#e4ddd0]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`animate-fade-in flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                m.role === "user"
                  ? "bg-[#d8d1c2]"
                  : "bg-[#1a1a1a] text-[#f6ad3c]"
              }`}
            >
              {m.role === "user" ? (
                <User className="h-4 w-4" aria-hidden />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden />
              )}
            </span>
            <div
              className={`max-w-[85%] rounded-[6px] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-[#1a1a1a] text-[#f3efe6]"
                  : "border border-[#bdb4a3] bg-[#f3eee4]"
              }`}
            >
              {m.text}
              {m.cite && (
                <Link
                  href={`/recordings/${m.cite.recId}?tab=transcript`}
                  className="mt-2 block text-[11px] font-semibold text-[#8a5a12] underline underline-offset-2"
                >
                  Source: {m.cite.recTitle}
                  {m.cite.timestamp ? ` · ${m.cite.timestamp}` : ""}
                </Link>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <p className="flex items-center gap-2 text-[12px] text-[#5f594c]">
            <Sparkles className="rec-blink h-3.5 w-3.5" aria-hidden /> Looking
            through the recording…
          </p>
        )}
        <div ref={endRef} />
      </div>

      {messages.length > 0 && suggestions.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {suggestions.slice(0, 3).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="shrink-0 rounded-full border border-[#bdb4a3] bg-[#ece6da] px-3 py-1.5 text-[12px] hover:bg-[#e4ddd0]"
            >
              {s.length > 42 ? `${s.slice(0, 40)}…` : s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Ask a question"
          placeholder="Ask a question…"
          className={INPUT}
        />
        <Button
          type="submit"
          variant="dark"
          aria-label="Send"
          disabled={thinking}
          className="!w-11 !px-0"
        >
          <Send className="h-4 w-4" aria-hidden />
        </Button>
      </form>
      <p className="mt-2 text-[11px] text-[#6b6455]">
        Answers come only from what was said in the recording.
      </p>
    </div>
  );
}
