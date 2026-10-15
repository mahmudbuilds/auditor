"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AudioLines,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  FileText,
  Flag,
  GraduationCap,
  Layers,
  MessageSquare,
  Network,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash2,
  Volume2,
  Wand2,
} from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import {
  Button,
  Chip,
  DARK_CARD,
  EmptyState,
  INNER_CARD,
  IconTile,
  LinkButton,
  Panel,
  RecDot,
  SectionLabel,
  StatusDot,
  Tabs,
  Waveform,
  INPUT,
} from "@/components/ui/kit";
import { clock, relativeDate, STATUS_LABEL, TYPE_META } from "@/lib/format";
import { usePlayer } from "@/lib/hooks";
import { StudyTools } from "@/components/study/StudyTools";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ProcessingSteps } from "@/components/recordings/ProcessingSteps";
import { conceptsOf, flashcardsOf } from "@/lib/study";
import type { RecordingItem, TranscriptSegment } from "@/types/recording";

type WorkspaceTab = "transcript" | "summary" | "study" | "ask" | "notes";

interface RecordingWorkspaceProps {
  initialRecording: RecordingItem;
}

export function RecordingWorkspace({
  initialRecording,
}: RecordingWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab =
    (searchParams.get("tab") as WorkspaceTab) || "transcript";

  const {
    getRecording,
    updateRecording,
    deleteRecording,
    toggleStar,
    toast,
    doneActions,
    toggleAction,
    hydrated,
  } = useApp();

  // Pick up dynamically updated version from context (e.g. when processing finishes or notes are updated)
  const contextRecording = getRecording(initialRecording.id);
  const rec = contextRecording || initialRecording;

  const [activeTab, setActiveTab] = useState<WorkspaceTab>(requestedTab);
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [notesDraft, setNotesDraft] = useState(rec.notes || "");
  const [isCopied, setIsCopied] = useState(false);

  // Sync tab with URL search parameter if it changes
  useEffect(() => {
    if (
      requestedTab &&
      ["transcript", "summary", "study", "ask", "notes"].includes(requestedTab)
    ) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  // Audio Player hook
  const player = usePlayer(rec.durationSeconds || 1, 0);

  // Handle note blur/save
  const handleSaveNotes = () => {
    updateRecording(rec.id, { notes: notesDraft });
    toast("Notes saved to recording.");
  };

  const handleCopySummary = () => {
    const text = `${rec.title}\n\nSummary:\n${rec.summary.overview}\n\nKey Takeaways:\n${rec.summary.keyTakeaways
      .map((t) => `• ${t}`)
      .join("\n")}`;
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    toast("Summary copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const text = `Title: ${rec.title}\nDate: ${rec.date}\nDuration: ${rec.duration}\n\nTranscript:\n${rec.transcript
      .map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
      .join("\n\n")}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${rec.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_transcript.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast("Transcript text file downloaded.");
  };

  const filteredTranscript = rec.transcript.filter(
    (t) =>
      transcriptSearch.trim() === "" ||
      t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase()),
  );

  const tabs: { id: WorkspaceTab; label: string; icon: any }[] = [
    { id: "transcript", label: "Transcript", icon: FileText },
    { id: "summary", label: "Summary", icon: Sparkles },
    { id: "study", label: "Study", icon: Layers },
    { id: "ask", label: "Ask AI", icon: MessageSquare },
    { id: "notes", label: "Notes", icon: NotebookPen },
  ];

  const meta = TYPE_META[rec.type];

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#b9b09f]/60">
        <div className="flex items-center gap-2 text-[12px] text-[#6b6455]">
          <Link
            href="/library"
            className="hover:text-[#181613] flex items-center gap-1 font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" /> Library
          </Link>
          <span>/</span>
          <span className="text-[#2b2822] font-semibold truncate max-w-[240px] sm:max-w-md">
            {rec.title}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 rounded-full bg-[#d8d1c2] px-2.5 py-0.5 text-[11px] font-medium text-[#2b2822]">
            <StatusDot status={rec.status} />
            {STATUS_LABEL[rec.status]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="light"
            size="sm"
            aria-label={rec.isStarred ? "Unstar recording" : "Star recording"}
            onClick={() => {
              toggleStar(rec.id);
              toast(
                rec.isStarred ? "Removed from starred" : "Starred recording",
              );
            }}
          >
            <Star
              className={`w-3.5 h-3.5 ${rec.isStarred ? "fill-[#e0963a] text-[#e0963a]" : "text-[#6b6455]"}`}
            />
            <span className="hidden sm:inline">
              {rec.isStarred ? "Starred" : "Star"}
            </span>
          </Button>

          <Button
            variant="light"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: rec.title,
                    text: rec.summary.overview,
                    url: window.location.href,
                  })
                  .catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast("Link copied to clipboard!");
              }
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-[#992218] hover:bg-[#f6dcda]"
            onClick={() => {
              if (
                window.confirm(`Delete "${rec.title}"? This cannot be undone.`)
              ) {
                deleteRecording(rec.id);
                toast("Recording deleted.");
                router.push("/library");
              }
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Primary Workspace Header Card */}
      <Panel tone="cream" className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <IconTile
              icon={meta.icon}
              className="h-12 w-12 sm:h-14 sm:w-14"
              iconClass="h-6 w-6"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1916] truncate">
                  {rec.title}
                </h1>
                <span className="inline-flex sm:hidden items-center gap-1.5 rounded-full bg-[#d8d1c2] px-2 py-0.5 text-[10px] font-medium text-[#2b2822]">
                  <StatusDot status={rec.status} />
                  {STATUS_LABEL[rec.status]}
                </span>
              </div>
              <p className="mt-1 text-[12px] sm:text-[13px] text-[#6b6455] flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{rec.course}</span>
                <span>•</span>
                <span className="font-mono">{rec.duration}</span>
                <span>•</span>
                <span>{relativeDate(rec.date)}</span>
                <span>•</span>
                <span className="capitalize">{meta.label}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={activeTab === "summary" ? "dark" : "light"}
              size="sm"
              onClick={() => setActiveTab("summary")}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e0963a]" />
              Summary
            </Button>
            <Button
              variant={activeTab === "study" ? "dark" : "light"}
              size="sm"
              onClick={() => setActiveTab("study")}
            >
              <Layers className="w-3.5 h-3.5 text-[#3b82d6]" />
              Flashcards
            </Button>
            <Button
              variant={activeTab === "ask" ? "dark" : "light"}
              size="sm"
              onClick={() => setActiveTab("ask")}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask AI
            </Button>
          </div>
        </div>

        {/* In-Console Integrated Audio Player (Screen 7 Style) */}
        <div className="mt-4 pt-4 border-t border-[#cdc4b3] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#4d473d]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1a1916]">AUDIOTAP DECK</span>
              <span className="text-[#8c8270]">|</span>
              <span className="text-[#3aa55d] flex items-center gap-1 font-sans font-semibold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3aa55d] inline-block" />{" "}
                PLAYBACK SYNC
              </span>
            </div>
            <span>
              {clock(player.pos)} / {rec.duration}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={player.playing ? "Pause recording" : "Play recording"}
              onClick={player.toggle}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#f3b45a] to-[#e0963a] text-[#141414] shadow-[0_2px_4px_rgba(0,0,0,0.35)] hover:brightness-105 active:translate-y-px transition"
            >
              {player.playing ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <input
                type="range"
                min={0}
                max={rec.durationSeconds}
                value={player.pos}
                onChange={(e) => player.seek(Number(e.target.value))}
                aria-label="Seek audio position"
                className="w-full h-2 cursor-pointer accent-[#e0963a] bg-[#cfc6b5] rounded-lg"
              />
              <div className="mt-1">
                <Waveform
                  bars={
                    rec.waveform || [
                      35, 50, 70, 85, 60, 45, 65, 80, 90, 75, 55, 45, 60, 75,
                      85, 70, 50, 40,
                    ]
                  }
                  progress={player.pos / (rec.durationSeconds || 1)}
                  className="h-4 w-full"
                  tone="cream"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={player.cycleSpeed}
              aria-label={`Playback speed ${player.speed}x`}
              className="h-8 rounded border border-[#a99f8e] px-2 font-mono text-[11px] font-semibold bg-[#ece6da] hover:bg-[#e4ddd0] transition"
            >
              ×{player.speed}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-[#5f594c]">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Panel>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-[#baa791] pb-2">
        <Tabs
          tabs={tabs}
          value={activeTab}
          onChange={(id) => setActiveTab(id)}
        />
      </div>

      {/* Processing Banner (if in progress) */}
      {rec.status === "processing" && (
        <Panel tone="cream" className="p-4 border-[#3b82d6]/60 bg-[#edf5fd]">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82d6] animate-pulse" />
            <h3 className="text-sm font-bold text-[#1f4a7d]">
              AI Processing in progress
            </h3>
          </div>
          <ProcessingSteps rec={rec} />
        </Panel>
      )}

      {/* ================= TAB CONTENT ================= */}

      {/* 1. TRANSCRIPT TAB */}
      {activeTab === "transcript" && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
          {/* Left: Transcript text feed */}
          <Panel tone="cream" className="p-4 sm:p-5 flex flex-col gap-3">
            <SectionLabel
              icon={FileText}
              action={
                <div className="flex items-center gap-2">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={handleDownloadTranscript}
                  >
                    <Download className="w-3 h-3" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              }
            >
              Synchronized Transcript
            </SectionLabel>

            {/* Transcript Search bar */}
            <label
              className={`${INNER_CARD} flex items-center gap-2 h-9 px-3 w-full`}
            >
              <Search className="w-4 h-4 shrink-0 text-[#6b6455]" />
              <input
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                placeholder="Search transcript..."
                className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#6b6455]"
              />
              {transcriptSearch && (
                <button
                  type="button"
                  onClick={() => setTranscriptSearch("")}
                  className="text-xs text-[#8c8270] hover:text-[#181613]"
                >
                  Clear
                </button>
              )}
            </label>

            {/* Transcript Segments list */}
            <div className="flex flex-col gap-2 mt-2">
              {filteredTranscript.length === 0 ? (
                <p className="text-center py-10 text-[13px] text-[#6b6455]">
                  {transcriptSearch
                    ? `No transcript lines matching "${transcriptSearch}".`
                    : "No transcript segments recorded yet."}
                </p>
              ) : (
                filteredTranscript.map((segment) => {
                  const isCurrent =
                    player.pos >= segment.seconds &&
                    player.pos < segment.seconds + 45;

                  return (
                    <div
                      key={segment.id}
                      onClick={() => player.seek(segment.seconds)}
                      className={`group flex items-start gap-3 p-3 rounded-[5px] border cursor-pointer transition ${
                        isCurrent
                          ? "border-[#e0963a] bg-[#fbf8f2] shadow-[0_1px_4px_rgba(224,150,58,0.2)]"
                          : "border-[#d8d0c0] bg-[#efe9de] hover:bg-[#e8e1d2]"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Jump to ${segment.timestamp}`}
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-[3px] shrink-0 transition ${
                          isCurrent
                            ? "bg-[#e0963a] text-[#1a1a1a]"
                            : "bg-[#d8d0c0] text-[#4d473d] group-hover:bg-[#1a1a1a] group-hover:text-[#f3efe6]"
                        }`}
                      >
                        {segment.timestamp}
                      </button>

                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] font-bold text-[#6b6455] uppercase tracking-wider mb-0.5">
                          {segment.speaker}
                        </span>
                        <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#22201d]">
                          {segment.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Panel>

          {/* Right: Quick actions sidebar (Matches Screen 7 right pane) */}
          <div className="flex flex-col gap-3">
            <Panel tone="cream" className="p-4">
              <SectionLabel icon={Wand2}>Quick actions</SectionLabel>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  variant="light"
                  size="sm"
                  className="w-full justify-start text-[12px] h-10"
                  onClick={() => setActiveTab("summary")}
                >
                  <Sparkles className="w-4 h-4 text-[#e0963a]" />
                  Generate summary
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  className="w-full justify-start text-[12px] h-10"
                  onClick={() => setActiveTab("study")}
                >
                  <Layers className="w-4 h-4 text-[#3b82d6]" />
                  Create flashcards
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  className="w-full justify-start text-[12px] h-10"
                  onClick={() => setActiveTab("study")}
                >
                  <BookOpen className="w-4 h-4 text-[#3aa55d]" />
                  Make study guide
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  className="w-full justify-start text-[12px] h-10"
                  onClick={() => setActiveTab("study")}
                >
                  <Network className="w-4 h-4 text-[#9b59b6]" />
                  Generate mind map
                </Button>
              </div>
            </Panel>

            {/* Key Moments */}
            <Panel tone="cream" className="p-4">
              <SectionLabel icon={Flag}>Important moments</SectionLabel>
              <div className="flex flex-col gap-2 mt-2">
                {rec.marks && rec.marks.length > 0
                  ? rec.marks.map((markSec, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => player.seek(markSec)}
                        className={`${INNER_CARD} flex items-center justify-between p-2 text-left hover:bg-[#e4ddd0] transition`}
                      >
                        <span className="text-[12px] font-medium">
                          Bookmark #{idx + 1}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#e0963a]">
                          {clock(markSec)}
                        </span>
                      </button>
                    ))
                  : [
                      { title: "Key Definition", time: "00:45", sec: 45 },
                      { title: "Core Architecture", time: "01:32", sec: 92 },
                      {
                        title: "Python Implementation",
                        time: "03:05",
                        sec: 185,
                      },
                    ].map((mom) => (
                      <button
                        key={mom.title}
                        type="button"
                        onClick={() => player.seek(mom.sec)}
                        className={`${INNER_CARD} flex items-center justify-between p-2 text-left hover:bg-[#e4ddd0] transition`}
                      >
                        <span className="text-[12px] font-medium text-[#22201d] truncate">
                          {mom.title}
                        </span>
                        <span className="font-mono text-[11px] text-[#e0963a] shrink-0 ml-2">
                          {mom.time}
                        </span>
                      </button>
                    ))}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* 2. SUMMARY TAB (Matches Screen 8) */}
      {activeTab === "summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_1fr] gap-4 items-start">
          <Panel tone="cream" className="p-5 flex flex-col gap-4">
            <div className="border-b border-[#cdc4b3] pb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c6b2d]">
                  {rec.course} • GENERATED FROM TRANSCRIPT
                </p>
                <h2 className="text-lg font-bold text-[#1a1916] mt-0.5">
                  Lecture summary
                </h2>
              </div>
              <Button variant="light" size="sm" onClick={handleCopySummary}>
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-[#3aa55d]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>

            {/* Main idea */}
            <div className={`${INNER_CARD} p-4`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#3a352c] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e0963a]" /> Main idea
              </h3>
              <p className="text-[14px] leading-relaxed text-[#22201d]">
                {rec.summary.overview ||
                  "Overview will be generated as soon as the audio has finished processing."}
              </p>
            </div>

            {/* Key takeaways */}
            <div className={`${INNER_CARD} p-4`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#3a352c] mb-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#3aa55d]" /> Key takeaways
              </h3>
              <ul className="flex flex-col gap-2.5">
                {rec.summary.keyTakeaways.length > 0 ? (
                  rec.summary.keyTakeaways.map((takeaway, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-[#22201d] leading-snug"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e0963a] shrink-0 mt-2" />
                      <span>{takeaway}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-[#6b6455]">
                    Processing key points...
                  </p>
                )}
              </ul>
            </div>

            {/* Action Buttons row (Matches Screen 8 footer) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#cdc4b3]">
              <Button
                variant="light"
                size="sm"
                onClick={() =>
                  toast("Regenerating summary with neural model...")
                }
              >
                <RotateCcw className="w-3.5 h-3.5" /> Regenerate
              </Button>
              <Button variant="light" size="sm" onClick={handleCopySummary}>
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("study")}
              >
                <Layers className="w-3.5 h-3.5" /> Make cards
              </Button>
              <Button
                variant="light"
                size="sm"
                onClick={handleDownloadTranscript}
              >
                <Download className="w-3.5 h-3.5" /> Download
              </Button>
            </div>
          </Panel>

          {/* Right column: Important moments cards with Jump to Recording */}
          <div className="flex flex-col gap-3">
            <Panel tone="cream" className="p-4">
              <SectionLabel icon={Flag}>Important moments</SectionLabel>
              <div className="flex flex-col gap-2.5 mt-2">
                {[
                  {
                    title: "Class vs. object",
                    desc: "Difference between blueprint template and in-memory allocated instance.",
                    time: "01:32",
                    sec: 92,
                  },
                  {
                    title: "Encapsulation",
                    desc: "Hiding internal object state behind public methods.",
                    time: "04:12",
                    sec: 252,
                  },
                  {
                    title: "Inheritance",
                    desc: "Deriving child classes from a parent base class.",
                    time: "08:15",
                    sec: 495,
                  },
                ].map((moment) => (
                  <div
                    key={moment.title}
                    className={`${INNER_CARD} p-3 flex flex-col gap-1.5`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-[13px] font-bold text-[#1a1916]">
                        {moment.title}
                      </h4>
                      <span className="font-mono text-[11px] font-bold text-[#e0963a]">
                        {moment.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b6455] leading-snug">
                      {moment.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        player.seek(moment.sec);
                        toast(`Jumped playback to ${moment.time}`);
                      }}
                      className="mt-1 text-left text-[11px] font-semibold text-[#8c6b2d] hover:underline flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" /> Jump to
                      recording
                    </button>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Action items if any */}
            {rec.summary.actionItems && rec.summary.actionItems.length > 0 && (
              <Panel tone="cream" className="p-4">
                <SectionLabel icon={Check}>Action items</SectionLabel>
                <ul className="flex flex-col gap-2 mt-2">
                  {rec.summary.actionItems.map((act, idx) => {
                    const key = `${rec.id}-act-${idx}`;
                    const isDone = !!doneActions[key];
                    return (
                      <li
                        key={key}
                        onClick={() => toggleAction(key)}
                        className={`${INNER_CARD} p-2.5 flex items-start gap-2.5 cursor-pointer hover:bg-[#e4ddd0] transition`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="mt-0.5 rounded accent-[#e0963a] cursor-pointer"
                        />
                        <span
                          className={`text-[12px] leading-snug ${
                            isDone
                              ? "line-through text-[#8c8270]"
                              : "text-[#22201d]"
                          }`}
                        >
                          {act}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            )}
          </div>
        </div>
      )}

      {/* 3. STUDY TAB (Matches Screen 9) */}
      {activeTab === "study" && (
        <StudyTools
          recs={[rec]}
          heading={`Study Material: ${rec.title}`}
          initialTool="flashcards"
        />
      )}

      {/* 4. ASK AI TAB (Matches Screen 10) */}
      {activeTab === "ask" && (
        <Panel tone="cream" className="p-5 max-w-3xl mx-auto w-full">
          <SectionLabel icon={MessageSquare}>
            Ask about this recording
          </SectionLabel>
          <p className="-mt-2 mb-4 text-[13px] text-[#5f594c]">
            Answers are retrieved strictly from what was spoken in "{rec.title}
            ".
          </p>
          <ChatPanel recs={[rec]} />
        </Panel>
      )}

      {/* 5. NOTES TAB */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] gap-4">
          <Panel tone="cream" className="p-5 flex flex-col gap-3">
            <SectionLabel icon={NotebookPen}>
              Personal session notes
            </SectionLabel>
            <p className="-mt-1 text-[12px] text-[#5f594c]">
              Freeform notes, observations, and takeaways. Changes persist
              automatically.
            </p>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Type your notes here... (e.g. Remember to check lecture slides page 14 for the midterm)"
              rows={12}
              className="w-full rounded-[5px] border border-[#bdb4a3] bg-[#fbf9f5] p-3 text-[14px] text-[#22201d] outline-none focus:border-[#e0963a] font-sans leading-relaxed shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
            />
            <div className="flex justify-end">
              <Button variant="dark" size="sm" onClick={handleSaveNotes}>
                Save notes
              </Button>
            </div>
          </Panel>

          <Panel tone="cream" className="p-4 flex flex-col gap-3">
            <SectionLabel icon={Sparkles}>Key concepts</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {conceptsOf(rec).map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-[#b3a998] bg-[#ece6da] px-2.5 py-1 text-[11px] font-semibold text-[#3a352c]"
                >
                  {concept}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
