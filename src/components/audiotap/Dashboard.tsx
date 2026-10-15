"use client";

import React, { useState } from "react";
import {
  AudioLines,
  Bell,
  BookOpen,
  BookText,
  ChevronRight,
  Clapperboard,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  Layers,
  Mic,
  MessageSquare,
  Pause,
  Play,
  Search,
  Settings,
  Sparkles,
  Upload,
  Users,
  Volume2,
  ChevronDown,
  Send,
  FileAudio,
} from "lucide-react";
import { ScrewHead } from "./ScrewHead";

/* ---------- helpers ---------- */

/** Four screws, one per corner, identical inset and orientation. */
function Screws() {
  return (
    <>
      <ScrewHead
        className="absolute top-1.5 left-1.5 !w-2 !h-2"
        rotation={45}
      />
      <ScrewHead
        className="absolute top-1.5 right-1.5 !w-2 !h-2"
        rotation={45}
      />
      <ScrewHead
        className="absolute bottom-1.5 left-1.5 !w-2 !h-2"
        rotation={45}
      />
      <ScrewHead
        className="absolute bottom-1.5 right-1.5 !w-2 !h-2"
        rotation={45}
      />
    </>
  );
}

const CREAM_PANEL =
  "relative rounded-[6px] border border-[#b9b09f] bg-gradient-to-b from-[#e9e3d7] to-[#ddd6c7] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.12)]";
const DARK_PANEL =
  "relative rounded-[6px] border border-[#2a2a2a] bg-gradient-to-b from-[#1a1a1a] to-[#101010] text-[#f3efe6] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)]";
const INNER_CARD =
  "rounded-[5px] border border-[#bdb4a3] bg-[#ece6da] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]";
const DARK_CARD =
  "rounded-[5px] border border-[#3a3a3a] bg-[#161616] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

const SPECTRUM = [
  4, 6, 9, 14, 10, 7, 12, 20, 34, 24, 18, 28, 46, 38, 26, 42, 58, 48, 32, 40,
  62, 50, 36, 30, 44, 54, 40, 26, 34, 22, 16, 24, 30, 20, 14, 18, 12, 8, 6, 4,
];

const RECENT = [
  {
    icon: "cap",
    title: "Computer Science Lecture",
    meta: "Today",
    dur: "42:17",
    status: "Transcript ready",
    tone: "text-[#6fcf8a]",
  },
  {
    icon: "cap",
    title: "Biology Class",
    meta: "Yesterday",
    dur: "36:05",
    status: "Summary ready",
    tone: "text-[#6fcf8a]",
  },
  {
    icon: "mic",
    title: "Idea for my project",
    meta: "Yesterday",
    dur: "00:42",
    status: "Summary ready",
    tone: "text-[#6fcf8a]",
  },
  {
    icon: "cap",
    title: "Physics Lecture",
    meta: "Oct 8",
    dur: "1:12:33",
    status: "Processing...",
    tone: "text-[#5aa0f0]",
  },
];

const LIBRARY = [
  {
    icon: "wave",
    title: "Computer Science Lecture",
    sub: "Object-Oriented Programming",
    type: "Lecture",
    date: "Today, 09:45",
    dur: "42:17",
    status: "Ready",
  },
  {
    icon: "wave",
    title: "Biology Class",
    sub: "Cell Structure & Function",
    type: "Lecture",
    date: "Yesterday, 14:20",
    dur: "36:05",
    status: "Ready",
  },
  {
    icon: "mic",
    title: "Idea for my project",
    sub: "Random thoughts",
    type: "Memo",
    date: "Yesterday, 08:12",
    dur: "00:42",
    status: "Ready",
  },
  {
    icon: "wave",
    title: "Physics Lecture",
    sub: "Electricity & Magnetism",
    type: "Lecture",
    date: "Oct 8, 16:32",
    dur: "1:12:33",
    status: "Processing",
  },
  {
    icon: "group",
    title: "Study Group Meeting",
    sub: "Project discussion",
    type: "Meeting",
    date: "Oct 7, 19:03",
    dur: "48:21",
    status: "Ready",
  },
];

const REVIEWS = [
  { title: "OOP Basics", due: "Due today", cards: "5 cards" },
  { title: "Cell Structure", due: "Due tomorrow", cards: "8 cards" },
  { title: "Electricity & Magnetism", due: "Due in 2 days", cards: "12 cards" },
];

function RowIcon({ kind }: { kind: string }) {
  const cls = "w-4 h-4 text-[#f3efe6]";
  if (kind === "cap") return <GraduationCap className={cls} />;
  if (kind === "mic") return <Mic className={cls} />;
  if (kind === "group") return <Users className={cls} />;
  return <AudioLines className={cls} />;
}

function VuMeter({ label }: { label: string }) {
  return (
    <div className="flex-1 rounded-[4px] border border-[#444] bg-gradient-to-b from-[#e6d7ae] to-[#c9b580] p-1 relative overflow-hidden">
      <svg viewBox="0 0 100 56" className="w-full h-auto block">
        <path
          d="M12 44 A38 38 0 0 1 88 44"
          fill="none"
          stroke="#3a2f14"
          strokeWidth="0.8"
        />
        {[-20, -10, -7, -5, -3, 0, 3].map((v, i) => {
          const a = Math.PI * (1 - (i + 0.5) / 7);
          const x = 50 + 38 * Math.cos(a);
          const y = 48 - 38 * Math.sin(a);
          return (
            <text
              key={v}
              x={x}
              y={y + 4}
              fontSize="4.5"
              textAnchor="middle"
              fill={v > 0 ? "#b3261e" : "#3a2f14"}
            >
              {v}
            </text>
          );
        })}
        <line x1="50" y1="52" x2="64" y2="22" stroke="#111" strokeWidth="0.9" />
        <circle cx="50" cy="52" r="2.2" fill="#111" />
        <text x="50" y="13" fontSize="5" textAnchor="middle" fill="#3a2f14">
          dB
        </text>
      </svg>
      <div className="text-center text-[8px] tracking-[0.16em] font-semibold text-[#f3efe6] bg-[#111] -mx-1 -mb-1 py-0.5 mt-0.5">
        {label}
      </div>
    </div>
  );
}

interface DashboardProps {
  onNavigate: (page: "library" | "settings" | "features") => void;
  onStartRecording: () => void;
  onToast: (msg: string) => void;
  onOpenStudyGuide: () => void;
  onOpenMindMap: () => void;
}

export function Dashboard({
  onNavigate,
  onStartRecording,
  onToast,
  onOpenStudyGuide,
  onOpenMindMap,
}: DashboardProps) {
  const [filter, setFilter] = useState("All");
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("");
  const [nav, setNav] = useState("Home");

  const navItems = [
    { label: "Home", icon: Home },
    { label: "Record", icon: Mic },
    { label: "Library", icon: FolderOpen },
    { label: "Study", icon: Layers },
    { label: "AI Chat", icon: MessageSquare },
    { label: "Settings", icon: Settings },
  ];

  const handleNav = (label: string) => {
    setNav(label);
    if (label === "Library") onNavigate("library");
    else if (label === "Settings") onNavigate("settings");
    else if (label === "Record") onStartRecording();
    else if (label === "Study") onOpenStudyGuide();
    else if (label === "AI Chat") onToast("AI Chat is coming soon.");
  };

  const rows = LIBRARY.filter(
    (r) =>
      (filter === "All" || `${r.type}s` === filter) &&
      (query === "" ||
        (r.title + r.sub).toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="w-full flex flex-col gap-2.5 text-[#22201d]">
      {/* ================= HEADER ================= */}
      <header className="flex items-center gap-4 h-11 px-3">
        <div className="flex items-center gap-2.5 min-w-[270px]">
          <AudioLines className="w-6 h-6" strokeWidth={2.4} />
          <span className="text-[19px] font-bold tracking-[0.2em]">
            AUDIOTAP
          </span>
          <span className="ml-3 pl-3 border-l border-[#b3a998] text-[9px] tracking-[0.18em] font-medium text-[#3a352c] whitespace-nowrap">
            RECORD&nbsp;&nbsp;·&nbsp;&nbsp;TRANSCRIBE&nbsp;&nbsp;·&nbsp;&nbsp;LEARN
          </span>
        </div>
        <div className="flex-1" />
        <label
          className={`${INNER_CARD} flex items-center gap-2 h-8 px-3 w-[330px] max-w-[40%]`}
        >
          <Search className="w-4 h-4 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recordings, notes, or ask AI..."
            className="flex-1 min-w-0 bg-transparent outline-none text-[11px] placeholder:text-[#4d473d]"
          />
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 border border-[#a89e8e] rounded-[3px] bg-[#e2dccf]">
            Ctrl K
          </kbd>
        </label>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => onToast("No new notifications.")}
          className="p-1.5"
        >
          <Bell className="w-[18px] h-[18px]" />
        </button>
        <div className="flex items-center gap-1">
          <span className="w-8 h-8 rounded-full bg-[#141414] text-[#f3efe6] flex items-center justify-center text-xs font-semibold ring-1 ring-[#b3a998]">
            M
          </span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[170px_minmax(0,1fr)_230px] gap-2.5 items-stretch">
        {/* ---------- LEFT SIDEBAR ---------- */}
        <aside className={`${CREAM_PANEL} p-3 pt-5 pb-5 flex flex-col gap-3`}>
          <Screws />
          <nav className="flex flex-col gap-1.5">
            {navItems.map(({ label, icon: Icon }) => {
              const active = nav === label;
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => handleNav(label)}
                  className={`flex items-center gap-3 h-9 px-3 rounded-[5px] text-[12px] font-medium text-left transition-colors ${
                    active
                      ? "bg-[#1a1a1a] text-[#f3efe6] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "hover:bg-[#d3cbbb]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${active ? "text-[#f6ad3c]" : ""}`}
                  />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="h-px bg-[#b9b09f] my-1" />
          <p className="text-[10px] font-semibold text-[#3a352c] px-1">
            Quick Actions
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Start recording", icon: null, fn: onStartRecording },
              {
                label: "Quick memo",
                icon: Mic,
                fn: () => onToast("Quick memo started."),
              },
              {
                label: "Import audio",
                icon: Upload,
                fn: () => onToast("Choose an audio file to import."),
              },
            ].map(({ label, icon: Icon, fn }) => (
              <button
                type="button"
                key={label}
                onClick={fn}
                className={`${INNER_CARD} flex items-center gap-2.5 h-9 px-3 text-[11px] font-medium hover:brightness-95 transition`}
              >
                {Icon ? (
                  <Icon className="w-4 h-4" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#d6322b] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.3)]" />
                )}
                <span className="flex-1 text-left">{label}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-6" />

          {/* cassette */}
          <div className="rounded-[6px] bg-gradient-to-b from-[#d2cab9] to-[#c4bba8] border border-[#a99f8e] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <p className="text-[8px] italic leading-tight text-[#3a352c] mb-1.5">
              Small steps.
              <br />
              Big progress.
            </p>
            <div className="rounded-[4px] bg-[#1b1b1b] border border-[#000] h-[46px] flex items-center justify-center gap-4 px-2">
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-[#d8d0c0] bg-[#2a2a2a] flex items-center justify-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d8d0c0]" />
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* ---------- CENTER ---------- */}
        <main className="flex flex-col gap-2.5 min-w-0">
          {/* hero */}
          <section className={`${DARK_PANEL} p-4 pt-5`}>
            <Screws />
            <div className="flex items-center justify-between text-[8px] tracking-[0.18em] font-semibold mb-3 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d6322b] shadow-[0_0_6px_#d6322b]" />
                READY TO RECORD
              </span>
              <span className="text-[#f6ad3c]">AUDIOTAP</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_1.05fr] gap-4 px-1">
              {/* left copy */}
              <div className="flex flex-col">
                <h1 className="text-[28px] leading-tight font-bold tracking-tight">
                  Capture your next idea.
                </h1>
                <p className="mt-3 text-[11px] leading-relaxed text-[#d9d3c6]">
                  Record lectures, voice memos, or import audio.
                  <br />
                  Turn them into notes, summaries, flashcards and more.
                </p>
                <button
                  type="button"
                  onClick={onStartRecording}
                  className="mt-4 flex items-center justify-center gap-3 h-11 w-full max-w-[160px] rounded-[5px] bg-gradient-to-b from-[#f3b45a] to-[#e0963a] text-[#1a1a1a] text-[13px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.4)] hover:brightness-105 active:translate-y-px transition"
                >
                  <span className="w-4 h-4 rounded-full bg-[#c62820] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.35)]" />
                  Start recording
                </button>
                <div className="mt-2.5 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToast("Choose an audio file to import.")}
                    className={`${DARK_CARD} flex-1 h-9 flex items-center justify-center gap-2 text-[10px] font-medium hover:bg-[#202020] transition`}
                  >
                    <FileAudio className="w-3.5 h-3.5" /> Import audio
                  </button>
                  <button
                    type="button"
                    onClick={() => onToast("Quick memo started.")}
                    className={`${DARK_CARD} flex-1 h-9 flex items-center justify-center gap-2 text-[10px] font-medium hover:bg-[#202020] transition`}
                  >
                    <Mic className="w-3.5 h-3.5" /> Quick memo
                  </button>
                </div>
              </div>

              {/* spectrum */}
              <div className="flex flex-col justify-end">
                <div className="h-[130px] flex items-end gap-[3px] border-b border-[#444] pb-px px-1">
                  {SPECTRUM.map((h, i) => (
                    <span
                      key={`${h}-${i}`}
                      className="flex-1 rounded-[1px] bg-gradient-to-t from-[#b9761f] to-[#f6ad3c]"
                      style={{ height: `${h * 1.7}px`, maxHeight: "100%" }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-[#a8a296] mt-1 px-1 font-mono">
                  {["-24", "-12", "-6", "0", "+6"].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>

              {/* recent activity */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[8px] tracking-[0.16em] text-[#a8a296] font-semibold">
                  RECENT ACTIVITY
                </p>
                {RECENT.map((r) => (
                  <button
                    type="button"
                    key={r.title}
                    onClick={() => onToast(`Opening "${r.title}"`)}
                    className={`${DARK_CARD} flex items-center gap-2.5 px-2 py-1.5 text-left hover:bg-[#202020] transition`}
                  >
                    <span className="w-8 h-8 rounded-[4px] bg-[#0b0b0b] border border-[#3a3a3a] flex items-center justify-center shrink-0">
                      <RowIcon kind={r.icon} />
                    </span>
                    <span className="flex-1 min-w-0 leading-tight">
                      <span className="block text-[10px] font-semibold truncate">
                        {r.title}
                      </span>
                      <span className="block text-[8px] text-[#a8a296]">
                        {r.meta} · {r.dur} ·{" "}
                        <span className={r.tone}>{r.status}</span>
                      </span>
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#a8a296]" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* library */}
          <section className={`${CREAM_PANEL} p-3 pt-5`}>
            <Screws />
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="flex items-center gap-1.5 text-[9px] tracking-[0.14em] font-bold">
                <AudioLines className="w-3.5 h-3.5" /> MY LIBRARY
              </p>
              <button
                type="button"
                onClick={() => onNavigate("library")}
                className="text-[9px] flex items-center gap-1 border border-[#a99f8e] rounded-[3px] px-1.5 py-0.5 bg-[#ece6da]"
              >
                View all <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-2 px-1">
              <label
                className={`${INNER_CARD} flex items-center gap-2 h-7 px-2.5 w-[240px] max-w-full`}
              >
                <Search className="w-3 h-3 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search recordings, transcripts, or notes..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-[9px] placeholder:text-[#4d473d]"
                />
              </label>
              {["All", "Lectures", "Memos", "Meetings", "Imported"].map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`h-6 px-3 rounded-[4px] text-[9px] font-medium border transition ${
                    filter === f
                      ? "bg-[#1a1a1a] text-[#f3efe6] border-[#000]"
                      : "bg-[#ece6da] border-[#b3a998] hover:bg-[#e2dccf]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="rounded-[5px] border border-[#bdb4a3] bg-[#efe9de] overflow-hidden">
              <div className="grid grid-cols-[2.2fr_1fr_1.2fr_0.8fr_1fr_24px] px-3 py-1.5 text-[8px] font-semibold text-[#3a352c] border-b border-[#cdc4b3]">
                <span>Title</span>
                <span>Type</span>
                <span>Date</span>
                <span>Duration</span>
                <span>Status</span>
                <span />
              </div>
              {rows.length === 0 && (
                <p className="text-center text-[10px] py-6 text-[#6b6455]">
                  No recordings match.
                </p>
              )}
              {rows.map((r) => (
                <button
                  type="button"
                  key={r.title}
                  onClick={() => onToast(`Loaded "${r.title}".`)}
                  className="w-full grid grid-cols-[2.2fr_1fr_1.2fr_0.8fr_1fr_24px] items-center px-3 py-1.5 text-left border-b last:border-b-0 border-[#d6cdbd] hover:bg-[#e6e0d3] transition text-[9px]"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-[4px] bg-[#141414] flex items-center justify-center shrink-0">
                      <RowIcon kind={r.icon} />
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block font-semibold truncate">
                        {r.title}
                      </span>
                      <span className="block text-[8px] text-[#6b6455] truncate">
                        {r.sub}
                      </span>
                    </span>
                  </span>
                  <span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#d8d1c2] px-2 py-0.5 text-[8px]">
                      <RowIcon
                        kind={
                          r.type === "Meeting"
                            ? "group"
                            : r.type === "Memo"
                              ? "mic"
                              : "cap"
                        }
                      />
                      {r.type}
                    </span>
                  </span>
                  <span>{r.date}</span>
                  <span>{r.dur}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${r.status === "Ready" ? "bg-[#3aa55d]" : "bg-[#3b82d6]"}`}
                    />
                    {r.status}
                  </span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </section>

          {/* bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1.15fr_1.3fr] gap-2.5">
            {/* recent recording */}
            <section className={`${CREAM_PANEL} p-3 pt-5`}>
              <Screws />
              <div className="flex justify-between text-[8px] tracking-[0.12em] font-bold mb-2">
                <span className="flex items-center gap-1">
                  <AudioLines className="w-3 h-3" /> RECENT RECORDING
                </span>
                <span className="font-medium tracking-normal">View</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-[4px] bg-[#141414] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#f3efe6]" />
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-semibold">
                    Computer Science Lecture
                  </p>
                  <p className="text-[8px] text-[#6b6455]">
                    Today · 42:17 · Lecture
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying((p) => !p)}
                  className="w-7 h-7 rounded-full bg-gradient-to-b from-[#f3b45a] to-[#e0963a] flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                >
                  {playing ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="h-[3px] rounded bg-[#b9b09f]">
                    <div className="h-full w-[29%] rounded bg-[#e0963a]" />
                  </div>
                  <p className="text-[7px] font-mono mt-1 text-[#4d473d]">
                    12:34 / 42:17
                  </p>
                </div>
                <span className="text-[8px] border border-[#a99f8e] rounded px-1">
                  ×1.0
                </span>
                <Volume2 className="w-3 h-3" />
              </div>
            </section>

            {/* quick access */}
            <section className={`${CREAM_PANEL} p-3 pt-5`}>
              <Screws />
              <p className="text-[8px] tracking-[0.12em] font-bold mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> QUICK ACCESS
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  {
                    label: "Transcript",
                    icon: FileText,
                    fn: () => onToast("Transcript opened."),
                  },
                  { label: "Summary", icon: Sparkles, fn: onOpenMindMap },
                  {
                    label: "Flashcards",
                    icon: Layers,
                    fn: () => onToast("Flashcards opened."),
                  },
                  {
                    label: "Study Guide",
                    icon: BookOpen,
                    fn: onOpenStudyGuide,
                  },
                  {
                    label: "Ask AI",
                    icon: MessageSquare,
                    fn: () => onToast("Ask AI is coming soon."),
                  },
                ].map(({ label, icon: Icon, fn }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={fn}
                    className={`${INNER_CARD} h-[62px] flex flex-col items-center justify-center gap-1.5 text-[7px] font-medium hover:bg-[#e4ddd0] transition`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.6} />
                    <span className="leading-none">{label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* AI assistant */}
            <section className={`${CREAM_PANEL} p-3 pt-5`}>
              <Screws />
              <p className="text-[8px] tracking-[0.12em] font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> AI ASSISTANT
                <span className="text-[7px] font-medium tracking-normal border border-[#a99f8e] rounded px-1 bg-[#e2dccf]">
                  Beta
                </span>
              </p>
              <div
                className={`${INNER_CARD} flex items-start gap-2 p-2 h-[40px]`}
              >
                <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <p className="text-[8px] leading-snug text-[#4d473d]">
                  Ask anything about your recordings, notes, or study
                  materials...
                </p>
              </div>
              <label
                className={`${INNER_CARD} flex items-center gap-2 h-7 px-2 mt-2`}
              >
                <input
                  placeholder="Type your question..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-[9px] placeholder:text-[#4d473d]"
                />
                <button
                  type="button"
                  aria-label="Send"
                  onClick={() => onToast("AI Assistant is thinking...")}
                  className="w-5 h-5 rounded-[3px] bg-[#1a1a1a] text-[#f3efe6] flex items-center justify-center"
                >
                  <Send className="w-2.5 h-2.5" />
                </button>
              </label>
            </section>
          </div>
        </main>

        {/* ---------- RIGHT COLUMN ---------- */}
        <aside className="flex flex-col gap-2.5 min-w-0">
          <section className={`${CREAM_PANEL} p-3 pt-5`}>
            <Screws />
            <p className="text-[9px] tracking-[0.12em] font-bold flex items-center gap-1.5 mb-2">
              <Clapperboard className="w-3.5 h-3.5" /> STUDENT ACTIVITY
            </p>
            <div className={`${INNER_CARD} p-2.5`}>
              <div className="flex items-center gap-2.5">
                <BookText className="w-9 h-9" strokeWidth={1.2} />
                <div className="leading-tight">
                  <p className="text-[10px] font-semibold">Continue studying</p>
                  <p className="text-[8px] text-[#6b6455]">
                    You have 3 cards due for review.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenStudyGuide}
                className="mt-2 mx-auto flex items-center justify-center gap-2 h-7 w-[120px] rounded-[4px] border border-[#8e8574] bg-[#efe9de] text-[9px] font-medium hover:bg-[#e4ddd0] transition"
              >
                Go to study <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </section>

          <section className={`${CREAM_PANEL} p-3 pt-5`}>
            <Screws />
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold">Upcoming Reviews</p>
              <button
                type="button"
                onClick={onOpenStudyGuide}
                className="text-[8px] flex items-center gap-0.5"
              >
                View all <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {REVIEWS.map((r) => (
                <button
                  type="button"
                  key={r.title}
                  onClick={onOpenStudyGuide}
                  className={`${INNER_CARD} flex items-center gap-2.5 p-1.5 text-left hover:bg-[#e4ddd0] transition`}
                >
                  <span className="w-8 h-8 rounded-[4px] bg-[#141414] flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-[#f3efe6]" />
                  </span>
                  <span className="flex-1 leading-tight min-w-0">
                    <span className="block text-[10px] font-semibold truncate">
                      {r.title}
                    </span>
                    <span className="block text-[8px] text-[#6b6455]">
                      {r.due} · {r.cards}
                    </span>
                  </span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </section>

          <section
            className={`${DARK_PANEL} p-4 pt-5 min-h-[104px] flex flex-col justify-between`}
          >
            <Screws />
            <p className="text-[#f6ad3c] text-2xl font-bold leading-none">“</p>
            <p className="text-[13px] font-medium leading-snug -mt-1">
              “Discipline turns
              <br />
              intention into progress.”
            </p>
            <svg
              viewBox="0 0 120 12"
              className="w-full h-3 mt-2"
              aria-hidden="true"
            >
              <path
                d="M0 8 Q 40 8 60 6 T 120 2"
                fill="none"
                stroke="#6b6558"
                strokeWidth="0.8"
              />
              <circle cx="60" cy="6" r="1.4" fill="#f6ad3c" />
            </svg>
          </section>

          <section className={`${DARK_PANEL} p-2.5 pt-4 pb-4`}>
            <Screws />
            <div className="flex gap-2">
              <VuMeter label="LEFT" />
              <VuMeter label="RIGHT" />
            </div>
          </section>

          <section className={`${CREAM_PANEL} p-3 pt-5 pb-5 flex-1`}>
            <Screws />
            <p className="text-[8px] tracking-[0.12em] font-bold mb-2">
              SYSTEM STATUS
            </p>
            <div className="flex justify-between text-[8px]">
              {["Audio", "Transcription", "AI"].map((s) => (
                <span key={s} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3aa55d] shadow-[0_0_4px_#3aa55d]" />
                  {s}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
