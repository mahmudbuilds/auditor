"use client";

import {
  AudioLines,
  BookOpen,
  BookText,
  ChevronRight,
  FileAudio,
  FileText,
  GraduationCap,
  Layers,
  type LucideIcon,
  MessageSquare,
  Mic,
  Pause,
  Play,
  Search,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { RecordingTable } from "@/components/recordings/RecordingList";
import {
  Chip,
  DARK_CARD,
  INNER_CARD,
  IconTile,
  LinkButton,
  Panel,
  RecDot,
  SectionLabel,
} from "@/components/ui/kit";
import {
  FILTERS,
  type FilterName,
  filterRecordings,
  statusNote,
} from "@/lib/browse";
import { clock, relativeDate, TYPE_META } from "@/lib/format";
import { usePlayer } from "@/lib/hooks";
import { flashcardsOf, REVIEW_DUE } from "@/lib/study";

const SPECTRUM = [
  4, 6, 9, 14, 10, 7, 12, 20, 34, 24, 18, 28, 46, 38, 26, 42, 58, 48, 32, 40,
  62, 50, 36, 30, 44, 54, 40, 26, 34, 22, 16, 24, 30, 20, 14, 18, 12, 8, 6, 4,
];

function VuMeter({ label, delay }: { label: string; delay: string }) {
  return (
    <div className="relative flex-1 overflow-hidden rounded-[4px] border border-[#444] bg-gradient-to-b from-[#e6d7ae] to-[#c9b580] p-1">
      <svg viewBox="0 0 100 56" className="block h-auto w-full" aria-hidden>
        <path
          d="M12 44 A38 38 0 0 1 88 44"
          fill="none"
          stroke="#3a2f14"
          strokeWidth="0.8"
        />
        {[-20, -10, -7, -5, -3, 0, 3].map((v, i) => {
          const a = Math.PI * (1 - (i + 0.5) / 7);
          return (
            <text
              key={v}
              x={50 + 38 * Math.cos(a)}
              y={48 - 38 * Math.sin(a) + 4}
              fontSize="4.5"
              textAnchor="middle"
              fill={v > 0 ? "#b3261e" : "#3a2f14"}
            >
              {v}
            </text>
          );
        })}
        <g
          className="animate-vu-needle"
          style={{ transformOrigin: "50px 52px", animationDelay: delay }}
        >
          <line
            x1="50"
            y1="52"
            x2="50"
            y2="20"
            stroke="#111"
            strokeWidth="0.9"
          />
        </g>
        <circle cx="50" cy="52" r="2.2" fill="#111" />
        <text x="50" y="13" fontSize="5" textAnchor="middle" fill="#3a2f14">
          dB
        </text>
      </svg>
      <div className="-mx-1 -mb-1 mt-0.5 bg-[#111] py-0.5 text-center text-[9px] font-semibold tracking-[0.16em] text-[#f3efe6]">
        {label}
      </div>
    </div>
  );
}

export function HomeDashboard() {
  const { recordings } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterName>("All");
  const [query, setQuery] = useState("");
  const [ask, setAsk] = useState("");

  const sorted = filterRecordings(recordings, { sort: "newest" });
  const latest = sorted.find((r) => r.status === "ready") ?? sorted[0];
  const rows = filterRecordings(recordings, {
    filter,
    query,
    sort: "newest",
  }).slice(0, 5);
  const reviews = sorted
    .filter((r) => r.status === "ready" && r.summary.studyQuestions.length > 0)
    .slice(0, 3);
  const dueCards = reviews[0] ? flashcardsOf([reviews[0]]).length : 0;

  const player = usePlayer(latest?.durationSeconds ?? 1, 0);
  const submitAsk = () => {
    const q = ask.trim();
    router.push(q ? `/chat?q=${encodeURIComponent(q)}` : "/chat");
  };

  const quick: { label: string; icon: LucideIcon; tab: string }[] = [
    { label: "Transcript", icon: FileText, tab: "transcript" },
    { label: "Summary", icon: Sparkles, tab: "summary" },
    { label: "Flashcards", icon: Layers, tab: "study" },
    { label: "Study guide", icon: BookOpen, tab: "study" },
    { label: "Ask AI", icon: MessageSquare, tab: "ask" },
  ];

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
      <div className="flex min-w-0 flex-col gap-3">
        {/* ================= HERO ================= */}
        <Panel tone="dark" className="p-5 pt-6">
          <div className="mb-4 flex items-center justify-between px-1 text-[10px] font-semibold tracking-[0.18em]">
            <span className="flex items-center gap-2">
              <span className="rec-blink h-2 w-2 rounded-full bg-[#d6322b] shadow-[0_0_6px_#d6322b]" />
              READY TO RECORD
            </span>
            <span className="text-[#f6ad3c]">AUDIOTAP</span>
          </div>
          <div className="grid gap-5 px-1 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1.1fr]">
            <div className="flex flex-col">
              <h1 className="text-[30px] leading-tight font-bold tracking-tight">
                Capture your next idea.
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-[#d9d3c6]">
                Record lectures, voice memos, or import audio. Turn them into
                notes, summaries, flashcards and more.
              </p>
              <LinkButton
                href="/record"
                variant="primary"
                size="lg"
                className="mt-5 w-full max-w-[200px]"
              >
                <RecDot /> Start recording
              </LinkButton>
              <div className="mt-3 flex max-w-[320px] gap-2.5">
                <Link
                  href="/import"
                  className={`${DARK_CARD} flex h-11 flex-1 items-center justify-center gap-2 text-[12px] font-medium transition hover:bg-[#202020]`}
                >
                  <FileAudio className="h-4 w-4" aria-hidden /> Import audio
                </Link>
                <Link
                  href="/record/live?type=memo"
                  className={`${DARK_CARD} flex h-11 flex-1 items-center justify-center gap-2 text-[12px] font-medium transition hover:bg-[#202020]`}
                >
                  <Mic className="h-4 w-4" aria-hidden /> Quick memo
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-end" aria-hidden>
              <div className="flex h-[150px] items-end gap-[3px] border-b border-[#444] px-1 pb-px">
                {SPECTRUM.map((h, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars
                    key={i}
                    className="eq-bar flex-1 rounded-[1px] bg-gradient-to-t from-[#b9761f] to-[#f6ad3c]"
                    style={{
                      height: `${Math.min(100, h * 1.6)}%`,
                      animationDelay: `${(i % 9) * -0.17}s`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between px-1 font-mono text-[10px] text-[#a8a296]">
                {["-24", "-12", "-6", "0", "+6"].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 xl:col-span-1">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[#a8a296]">
                RECENT ACTIVITY
              </p>
              {sorted.slice(0, 4).map((r) => {
                const meta = TYPE_META[r.type];
                return (
                  <Link
                    key={r.id}
                    href={`/recordings/${r.id}`}
                    className={`${DARK_CARD} flex items-center gap-3 px-2.5 py-2 text-left transition hover:bg-[#202020]`}
                  >
                    <IconTile
                      icon={meta.icon}
                      className="h-9 w-9"
                      iconClass="h-4 w-4"
                    />
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[12px] font-semibold">
                        {r.title}
                      </span>
                      <span className="block text-[11px] text-[#a8a296]">
                        {relativeDate(r.date)} · {r.duration} ·{" "}
                        <span
                          className={
                            r.status === "processing"
                              ? "text-[#5aa0f0]"
                              : "text-[#6fcf8a]"
                          }
                        >
                          {statusNote(r)}
                        </span>
                      </span>
                    </span>
                    <ChevronRight
                      className="h-3.5 w-3.5 text-[#a8a296]"
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </Panel>

        {/* ================= LIBRARY ================= */}
        <Panel>
          <SectionLabel
            icon={AudioLines}
            action={
              <Link
                href="/library"
                className="flex items-center gap-1 rounded-[3px] border border-[#a99f8e] bg-[#ece6da] px-2.5 py-1 text-[11px] font-medium hover:bg-[#e2dccf]"
              >
                View all <ChevronRight className="h-3 w-3" aria-hidden />
              </Link>
            }
          >
            My library
          </SectionLabel>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label
              className={`${INNER_CARD} flex h-9 w-full items-center gap-2 px-2.5 sm:w-[260px]`}
            >
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Filter recordings"
                placeholder="Search recordings…"
                className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#4d473d]"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {FILTERS.filter((f) => f !== "Starred").map((f) => (
                <Chip
                  key={f}
                  active={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Chip>
              ))}
            </div>
          </div>
          {rows.length === 0 ? (
            <p className="rounded-[5px] border border-[#bdb4a3] bg-[#efe9de] py-8 text-center text-[13px] text-[#6b6455]">
              No recordings match.
            </p>
          ) : (
            <RecordingTable recs={rows} />
          )}
        </Panel>

        {/* ================= BOTTOM ROW ================= */}
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-[1.05fr_1.15fr_1.3fr]">
          <Panel>
            <SectionLabel
              icon={AudioLines}
              action={
                latest && (
                  <Link
                    href={`/recordings/${latest.id}`}
                    className="text-[11px] font-medium underline-offset-2 hover:underline"
                  >
                    View
                  </Link>
                )
              }
            >
              Recent recording
            </SectionLabel>
            {latest ? (
              <>
                <div className="flex items-center gap-3">
                  <IconTile icon={GraduationCap} className="h-11 w-11" />
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-[13px] font-semibold">
                      {latest.title}
                    </p>
                    <p className="text-[12px] text-[#6b6455]">
                      {relativeDate(latest.date)} · {latest.duration} ·{" "}
                      {TYPE_META[latest.type].label}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={player.playing ? "Pause" : "Play"}
                    onClick={player.toggle}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#f3b45a] to-[#e0963a] shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                  >
                    {player.playing ? (
                      <Pause className="h-4 w-4" aria-hidden />
                    ) : (
                      <Play
                        className="ml-0.5 h-4 w-4"
                        fill="currentColor"
                        aria-hidden
                      />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <input
                      type="range"
                      min={0}
                      max={latest.durationSeconds}
                      value={player.pos}
                      onChange={(e) => player.seek(Number(e.target.value))}
                      aria-label="Seek"
                      className="h-1 w-full cursor-pointer accent-[#e0963a]"
                    />
                    <p className="mt-1 font-mono text-[11px] text-[#4d473d]">
                      {clock(player.pos)} / {latest.duration}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={player.cycleSpeed}
                    aria-label={`Playback speed ${player.speed}x`}
                    className="h-7 rounded border border-[#a99f8e] px-1.5 font-mono text-[11px]"
                  >
                    ×{player.speed}
                  </button>
                  <Volume2 className="hidden h-4 w-4 sm:block" aria-hidden />
                </div>
              </>
            ) : (
              <p className="text-[13px] text-[#6b6455]">No recordings yet.</p>
            )}
          </Panel>

          <Panel>
            <SectionLabel icon={Sparkles}>Quick access</SectionLabel>
            <div className="grid grid-cols-5 gap-2">
              {quick.map(({ label, icon: Icon, tab }) => (
                <Link
                  key={label}
                  href={
                    latest ? `/recordings/${latest.id}?tab=${tab}` : "/library"
                  }
                  className={`${INNER_CARD} flex h-[72px] flex-col items-center justify-center gap-1.5 text-[10px] font-medium transition hover:bg-[#e4ddd0]`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                  <span className="leading-none">{label}</span>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel className="md:col-span-2 2xl:col-span-1">
            <SectionLabel icon={Sparkles}>
              AI assistant
              <span className="rounded border border-[#a99f8e] bg-[#e2dccf] px-1.5 text-[10px] font-medium tracking-normal normal-case">
                Beta
              </span>
            </SectionLabel>
            <div className={`${INNER_CARD} flex items-start gap-2 p-2.5`}>
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p className="text-[12px] leading-snug text-[#4d473d]">
                Ask anything about your recordings, notes, or study materials…
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAsk();
              }}
              className={`${INNER_CARD} mt-2 flex h-10 items-center gap-2 px-2.5`}
            >
              <input
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                aria-label="Ask a question"
                placeholder="Type your question…"
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#4d473d]"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-7 w-7 items-center justify-center rounded-[3px] bg-[#1a1a1a] text-[#f3efe6]"
              >
                <Send className="h-3.5 w-3.5" aria-hidden />
              </button>
            </form>
          </Panel>
        </div>
      </div>

      {/* ================= RIGHT COLUMN ================= */}
      <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:flex xl:flex-col">
        <Panel>
          <SectionLabel icon={BookText}>Student activity</SectionLabel>
          <div className={`${INNER_CARD} p-3`}>
            <div className="flex items-center gap-3">
              <BookText
                className="h-9 w-9 shrink-0"
                strokeWidth={1.2}
                aria-hidden
              />
              <div className="leading-tight">
                <p className="text-[13px] font-semibold">Continue studying</p>
                <p className="text-[12px] text-[#6b6455]">
                  You have {dueCards} cards due for review.
                </p>
              </div>
            </div>
            <LinkButton
              href="/study"
              variant="light"
              size="sm"
              className="mx-auto mt-3 w-[140px]"
            >
              Go to study <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </LinkButton>
          </div>
        </Panel>

        <Panel>
          <SectionLabel
            action={
              <Link
                href="/study"
                className="flex items-center gap-0.5 text-[11px] font-medium"
              >
                View all <ChevronRight className="h-3 w-3" aria-hidden />
              </Link>
            }
          >
            Upcoming reviews
          </SectionLabel>
          <div className="flex flex-col gap-2">
            {reviews.length === 0 && (
              <p className="text-[12px] text-[#6b6455]">
                Nothing to review yet.
              </p>
            )}
            {reviews.map((r, i) => (
              <Link
                key={r.id}
                href={`/recordings/${r.id}?tab=study`}
                className={`${INNER_CARD} flex items-center gap-3 p-2 transition hover:bg-[#e4ddd0]`}
              >
                <IconTile
                  icon={GraduationCap}
                  className="h-9 w-9"
                  iconClass="h-4 w-4"
                />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-[12px] font-semibold">
                    {r.title}
                  </span>
                  <span className="block text-[11px] text-[#6b6455]">
                    {REVIEW_DUE[i]} · {flashcardsOf([r]).length} cards
                  </span>
                </span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
          </div>
        </Panel>

        <Panel
          tone="dark"
          className="flex min-h-[110px] flex-col justify-between p-5"
        >
          <p
            className="text-2xl leading-none font-bold text-[#f6ad3c]"
            aria-hidden
          >
            “
          </p>
          <p className="-mt-1 text-[14px] leading-snug font-medium">
            Discipline turns
            <br />
            intention into progress.
          </p>
          <svg viewBox="0 0 120 12" className="mt-2 h-3 w-full" aria-hidden>
            <path
              d="M0 8 Q 40 8 60 6 T 120 2"
              fill="none"
              stroke="#6b6558"
              strokeWidth="0.8"
            />
            <circle cx="60" cy="6" r="1.4" fill="#f6ad3c" />
          </svg>
        </Panel>

        <Panel tone="dark" className="p-3 pt-5 pb-5">
          <div className="flex gap-2">
            <VuMeter label="LEFT" delay="0s" />
            <VuMeter label="RIGHT" delay="-0.7s" />
          </div>
        </Panel>

        <Panel className="pb-5 md:col-span-2 xl:col-span-1">
          <SectionLabel>System status</SectionLabel>
          <div className="flex justify-between text-[12px]">
            {["Audio", "Transcription", "AI"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#3aa55d] shadow-[0_0_4px_#3aa55d]" />
                {s}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
