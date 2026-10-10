"use client";

import React, { useState, useEffect, useRef } from "react";
import { RecordingItem, TranscriptSegment } from "@/types/recording";
import { downloadRecordingAudio } from "@/utils/audioDownload";
import { CourseIcon, getCourseIconFromList } from "./CourseIcon";

interface RecordingWorkspaceProps {
  recording: RecordingItem;
  onBack: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onToggleStar: (id: string) => void;
}

export function RecordingWorkspace({
  recording,
  onBack,
  isPlaying,
  onTogglePlay,
  onToggleStar,
}: RecordingWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<
    "summary" | "takeaways" | "questions" | "actions" | "chat"
  >("summary");
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [revealedQuestions, setRevealedQuestions] = useState<
    Record<number, boolean>
  >({});
  const [currentSeconds, setCurrentSeconds] = useState(120);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isDownloadHidden, setIsDownloadHidden] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "downloaded"
  >("idle");
  const [hoverPosition, setHoverPosition] = useState<{
    percent: number;
    seconds: number;
  } | null>(null);

  const scrubberRef = useRef<HTMLDivElement>(null);

  // Load download visibility preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("auditor_player_hide_download");
      if (saved === "true") {
        setIsDownloadHidden(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleToggleDownloadVisibility = () => {
    setIsDownloadHidden((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("auditor_player_hide_download", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleDownload = () => {
    setDownloadStatus("downloading");
    const success = downloadRecordingAudio(recording);
    if (success) {
      setDownloadStatus("downloaded");
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 2500);
    } else {
      setDownloadStatus("idle");
    }
  };

  // Grounded AI Chat state
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "ai"; text: string; time: string }[]
  >([
    {
      sender: "ai",
      text: `Hello! I'm your study assistant for "${recording.title}". Ask me any question about what Prof. ${recording.speaker.split(" · ")[0]} discussed, key concepts, or upcoming assignments.`,
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const totalSeconds = recording.durationSeconds || 1800;

  // Sync playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSeconds((prev) => {
        if (prev >= totalSeconds) return 0;
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (secs: number) => {
    setCurrentSeconds(secs);
  };

  const toggleQuestion = (idx: number) => {
    setRevealedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyTranscript = () => {
    const text = recording.transcript
      .map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Filter transcript segments
  const filteredTranscript = recording.transcript.filter((seg) => {
    if (!transcriptSearch.trim()) return true;
    const q = transcriptSearch.toLowerCase();
    return (
      seg.text.toLowerCase().includes(q) ||
      seg.speaker.toLowerCase().includes(q)
    );
  });

  // Handle grounded chat question
  const handleSendChat = (questionText?: string) => {
    const text = (questionText || chatInput).trim();
    if (!text) return;

    const userMsg = {
      sender: "user" as const,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    // Generate grounded, contextual response based on the actual recording
    setTimeout(() => {
      let aiResponse = "";
      const lower = text.toLowerCase();

      if (
        lower.includes("summary") ||
        lower.includes("overview") ||
        lower.includes("about")
      ) {
        aiResponse = recording.summary.overview;
      } else if (
        lower.includes("takeaway") ||
        lower.includes("main point") ||
        lower.includes("key point")
      ) {
        aiResponse = `Here are the top key takeaways from this recording:\n\n• ${recording.summary.keyTakeaways.join("\n• ")}`;
      } else if (
        lower.includes("assignment") ||
        lower.includes("due") ||
        lower.includes("homework") ||
        lower.includes("next step")
      ) {
        if (
          recording.summary.actionItems &&
          recording.summary.actionItems.length > 0
        ) {
          aiResponse = `Action items noted in this session:\n\n• ${recording.summary.actionItems.join("\n• ")}`;
        } else {
          aiResponse =
            "There were no formal homework deadlines assigned in this recording; focus on reviewing the core concepts!";
        }
      } else if (
        lower.includes("example") ||
        lower.includes("coffee") ||
        lower.includes("avocado") ||
        lower.includes("habit")
      ) {
        aiResponse = `In this session, ${recording.speaker} explained this through everyday examples. Rather than abstract formulas, the speaker emphasized how everyday consumer choices directly demonstrate the principle in action.`;
      } else {
        aiResponse = `Based directly on the transcript: ${recording.summary.keyTakeaways[0]} Additionally, ${recording.speaker} highlighted that understanding these core principles helps you connect classroom theory to real-world observations.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiResponse,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const promptSuggestions = [
    "What was the main conclusion?",
    "Summarize the key takeaways in 3 bullets",
    "What real-world examples were used?",
    "Are there any upcoming assignments mentioned?",
  ];

  return (
    <div className="space-y-4">
      {/* Top Workspace Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-[#1a1e24] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252c34] hover:bg-[#2f3742] text-xs font-medium text-[#f5f2eb] border border-white/[0.08] transition-colors"
          >
            <span>←</span>
            <span>Dashboard</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#e5e0d6] bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded inline-flex items-center gap-1.5">
                <CourseIcon
                  icon={getCourseIconFromList(undefined, recording.course)}
                  className="w-3 h-3 text-[#9ba1a8]"
                />
                <span>{recording.course}</span>
              </span>
              <span className="text-xs text-[#8b919a]">
                {recording.speaker}
              </span>
              <span className="text-xs text-[#8b919a] hidden sm:inline">
                · {recording.date}
              </span>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#f5f2eb] tracking-tight mt-0.5">
              {recording.title}
            </h2>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => onToggleStar(recording.id)}
            className={`p-2 rounded-lg border border-white/[0.08] text-xs transition-colors ${
              recording.isStarred
                ? "bg-[#e5a93c]/15 text-[#e5a93c] border-[#e5a93c]/30"
                : "bg-[#252c34] text-[#8b919a] hover:text-[#f5f2eb]"
            }`}
            title="Star note"
          >
            ★ {recording.isStarred ? "Starred" : "Star"}
          </button>

          <button
            type="button"
            onClick={handleCopyTranscript}
            className="px-3 py-1.5 rounded-lg bg-[#252c34] hover:bg-[#2f3742] text-xs font-medium text-[#f5f2eb] border border-white/[0.08] transition-colors"
          >
            {copyFeedback ? "Copied!" : "Copy Transcript"}
          </button>
        </div>
      </div>

      {/* Synchronized Workspace Audio Player Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161a1f] border border-white/[0.08] shadow-md space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Controls: Play/Pause, Rewind, FastForward, Time Readout */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onTogglePlay}
              className="h-10 w-10 rounded-full bg-[#e5a93c] hover:bg-[#f3b74b] text-[#14171a] flex items-center justify-center shadow-[0_2px_12px_rgba(229,169,60,0.35)] active:scale-95 transition-transform"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 fill-current ml-0.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentSeconds((p) => Math.max(0, p - 10))}
              className="px-2 py-1 text-xs text-[#8b919a] hover:text-[#f5f2eb] rounded hover:bg-[#20252c] transition-colors"
              title="Rewind 10s"
            >
              -10s
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentSeconds((p) => Math.min(totalSeconds, p + 10))
              }
              className="px-2 py-1 text-xs text-[#8b919a] hover:text-[#f5f2eb] rounded hover:bg-[#20252c] transition-colors"
              title="Forward 10s"
            >
              +10s
            </button>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="font-semibold text-[#f5f2eb]">
                {formatTime(currentSeconds)}
              </span>
              <span className="text-[#8b919a]">
                / {formatTime(totalSeconds)}
              </span>
            </div>

            {/* Progress Percentage Badge */}
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e5a93c]/15 text-[#e5a93c] border border-[#e5a93c]/30 text-[11px] font-mono font-bold"
              title="Audio playback progress"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
              <span>{Math.round((currentSeconds / totalSeconds) * 100)}%</span>
            </div>
          </div>

          {/* Right Controls: Speed Selector & Hidable Download */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Speed Toggle */}
            <div className="flex items-center gap-1.5 bg-[#20252c] px-1.5 py-1 rounded-xl border border-white/[0.06]">
              <span className="text-[11px] text-[#8b919a] hidden sm:inline ml-1">
                Speed:
              </span>
              {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 text-xs font-mono rounded ${
                    playbackSpeed === s
                      ? "bg-[#e5a93c] text-[#14171a] font-bold"
                      : "text-[#8b919a] hover:text-[#f5f2eb]"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Hidable Download Button */}
            {!isDownloadHidden ? (
              <div className="flex items-center rounded-xl bg-[#20262e] border border-white/[0.08] p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloadStatus === "downloading"}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    downloadStatus === "downloaded"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : downloadStatus === "downloading"
                        ? "bg-[#e5a93c]/20 text-[#e5a93c]"
                        : "text-[#f5f2eb] hover:bg-[#28303a] hover:text-[#e5a93c]"
                  }`}
                  title="Download session audio file (.wav)"
                >
                  {downloadStatus === "downloaded" ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Saved!</span>
                    </>
                  ) : downloadStatus === "downloading" ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 animate-spin text-[#e5a93c]"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-[#e5a93c]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Download Audio</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleToggleDownloadVisibility}
                  className="p-1.5 text-[#8b919a] hover:text-[#f5f2eb] hover:bg-[#2a323d] rounded-lg transition-colors ml-0.5"
                  title="Hide download button from media player"
                  aria-label="Hide download button"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleToggleDownloadVisibility}
                className="p-1.5 rounded-xl bg-[#20262e]/70 hover:bg-[#252c34] text-[#8b919a] hover:text-[#e5a93c] border border-white/[0.06] hover:border-[#e5a93c]/30 transition-all text-xs flex items-center gap-1"
                title="Show media player download button"
                aria-label="Show download button"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="text-[10px] font-mono">+Download</span>
              </button>
            )}
          </div>
        </div>

        {/* Multi-Bar Interactive Soundwave representation */}
        <div className="w-full h-8 flex items-center justify-between gap-[2px] px-1 bg-[#14171a]/60 rounded-lg border border-white/[0.04]">
          {Array.from({ length: 48 }).map((_, idx) => {
            const waveformList = recording.waveform || [
              35, 50, 70, 85, 60, 45, 65, 90, 80, 55, 45, 75, 95, 80, 60, 70, 85,
              90, 65, 45, 40, 60, 75, 50,
            ];
            const val =
              waveformList[idx % waveformList.length] || 35 + ((idx * 13) % 55);
            const barProgress = (idx / 48) * 100;
            const currentPct = (currentSeconds / totalSeconds) * 100;
            const isPast = barProgress <= currentPct;
            const isCurrent =
              barProgress <= currentPct && (idx + 1) * (100 / 48) > currentPct;

            const dynamicHeight = isPlaying
              ? Math.max(
                  15,
                  val * (0.8 + 0.35 * Math.sin(idx * 0.4 + currentSeconds * 0.7))
                )
              : val;

            return (
              <div
                key={idx}
                onClick={() => {
                  const newSecs = Math.floor((idx / 48) * totalSeconds);
                  setCurrentSeconds(newSecs);
                }}
                className={`flex-1 rounded-full cursor-pointer transition-all duration-150 ${
                  isCurrent
                    ? "bg-[#ffd175] shadow-[0_0_8px_rgba(255,209,117,0.8)] scale-y-110"
                    : isPast
                      ? "bg-[#e5a93c] shadow-[0_0_4px_rgba(229,169,60,0.3)]"
                      : "bg-[#252b34] hover:bg-[#343d49]"
                }`}
                style={{
                  height: `${Math.min(100, Math.max(16, dynamicHeight))}%`,
                  minHeight: "4px",
                }}
                title={`Jump to ${formatTime(
                  Math.floor((idx / 48) * totalSeconds)
                )}`}
              />
            );
          })}
        </div>

        {/* High-Visibility Custom Scrubber Slider Track */}
        <div
          ref={scrubberRef}
          onMouseMove={(e) => {
            if (!scrubberRef.current) return;
            const rect = scrubberRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const pct = (x / rect.width) * 100;
            const secs = Math.floor((pct / 100) * totalSeconds);
            setHoverPosition({ percent: pct, seconds: secs });
          }}
          onMouseLeave={() => setHoverPosition(null)}
          className="w-full relative py-1"
        >
          {/* Hover timestamp tooltip */}
          {hoverPosition && (
            <div
              className="absolute -top-7 -translate-x-1/2 pointer-events-none z-30 bg-[#252c34] border border-white/20 px-2 py-0.5 rounded text-[10px] font-mono font-semibold text-[#f5f2eb] shadow-lg flex items-center gap-1"
              style={{ left: `${hoverPosition.percent}%` }}
            >
              <span>{formatTime(hoverPosition.seconds)}</span>
              <span className="text-[#8b919a]">
                ({Math.round(hoverPosition.percent)}%)
              </span>
            </div>
          )}

          {/* Custom Track */}
          <div className="w-full h-2.5 bg-[#20252c] rounded-full overflow-hidden relative border border-white/[0.08]">
            {/* Buffer Bar */}
            <div className="absolute top-0 left-0 h-full w-[95%] bg-white/[0.06]" />
            {/* Filled Progress Bar */}
            <div
              className="h-full bg-gradient-to-r from-[#c59235] via-[#e5a93c] to-[#ffd175] transition-all duration-150"
              style={{
                width: `${Math.min(100, (currentSeconds / totalSeconds) * 100)}%`,
              }}
            />
            {/* Ghost hover indicator */}
            {hoverPosition && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                style={{ left: `${hoverPosition.percent}%` }}
              />
            )}
          </div>

          {/* Glowing Playhead Head */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -mt-0.5 h-4 w-4 rounded-full bg-[#f5f2eb] border-2 border-[#e5a93c] shadow-[0_0_10px_rgba(229,169,60,0.85)] pointer-events-none transition-transform duration-100 ${
              isPlaying ? "scale-110" : "scale-100"
            }`}
            style={{
              left: `calc(${Math.min(100, (currentSeconds / totalSeconds) * 100)}% - 8px)`,
            }}
          />

          {/* Transparent Input Range */}
          <input
            type="range"
            min={0}
            max={totalSeconds}
            value={currentSeconds}
            onChange={(e) => setCurrentSeconds(Number(e.target.value))}
            aria-label="Audio scrubber"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
        </div>

        {/* Readout Sub-row: Remaining Time indicator */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8b919a]">
          <span className="text-[#c59e5e]">
            Playing: {recording.title.slice(0, 40)}...
          </span>
          <span className="text-[#8b919a]">
            -{formatTime(Math.max(0, totalSeconds - currentSeconds))} remaining
          </span>
        </div>
      </div>

      {/* Split Workspace: Left Pane = Synchronized Transcript; Right Pane = AI Notes & Grounded Q&A */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (lg:col-span-6): Interactive Transcript */}
        <div className="lg:col-span-6 rounded-xl bg-[#1a1e24] border border-white/[0.08] flex flex-col h-[650px] overflow-hidden">
          {/* Header & Local Search */}
          <div className="p-4 border-b border-white/[0.08] space-y-3 bg-[#14171a]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#e5a93c]" />
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#c59e5e]">
                  Synchronized Transcript
                </h3>
              </div>
              <span className="text-xs text-[#8b919a] font-mono">
                {recording.transcript.length} speech segments
              </span>
            </div>

            {/* Local Search Input */}
            <div className="relative">
              <input
                type="text"
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                placeholder="Search words spoken in this lecture..."
                className="w-full pl-8 pr-4 py-1.5 bg-[#1b2026] border border-white/[0.08] focus:border-[#e5a93c]/50 rounded-lg text-xs text-[#f5f2eb] placeholder-[#8b919a] outline-none"
              />
              <svg
                className="w-3.5 h-3.5 text-[#8b919a] absolute left-2.5 top-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Transcript Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredTranscript.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8b919a]">
                No phrases matched "{transcriptSearch}".
              </div>
            ) : (
              filteredTranscript.map((seg) => {
                const isCurrent =
                  currentSeconds >= seg.seconds &&
                  currentSeconds < seg.seconds + 60;

                return (
                  <div
                    key={seg.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? "bg-[#252c36] border-[#e5a93c]/40 shadow-sm"
                        : "bg-[#181c22]/70 border-white/[0.04] hover:border-white/[0.1] hover:bg-[#1b2027]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#f5f2eb]">
                          {seg.speaker}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold text-[#e5a93c] bg-[#e5a93c]/15 px-1.5 py-0.2 rounded">
                            Playing
                          </span>
                        )}
                      </div>

                      {/* Clickable timestamp that jumps audio */}
                      <button
                        type="button"
                        onClick={() => handleSeek(seg.seconds)}
                        className="font-mono text-[11px] text-[#e5a93c] hover:underline bg-[#14171a] px-2 py-0.5 rounded border border-white/[0.06]"
                        title="Jump playback to this moment"
                      >
                        {seg.timestamp}
                      </button>
                    </div>

                    <p className="text-xs text-[#cfd4dc] leading-relaxed">
                      {seg.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (lg:col-span-6): AI Intelligence & Grounded Chat */}
        <div className="lg:col-span-6 rounded-xl bg-[#1a1e24] border border-white/[0.08] flex flex-col h-[650px] overflow-hidden">
          {/* Tabs */}
          <div className="p-2 border-b border-white/[0.08] bg-[#14171a]/50 flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === "summary"
                  ? "bg-[#252c34] text-[#f5f2eb] border border-white/[0.08]"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("takeaways")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === "takeaways"
                  ? "bg-[#252c34] text-[#f5f2eb] border border-white/[0.08]"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
            >
              Key Takeaways ({recording.summary.keyTakeaways.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("questions")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === "questions"
                  ? "bg-[#252c34] text-[#f5f2eb] border border-white/[0.08]"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
            >
              Study Quiz ({recording.summary.studyQuestions.length})
            </button>
            {recording.summary.actionItems &&
              recording.summary.actionItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("actions")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === "actions"
                      ? "bg-[#252c34] text-[#f5f2eb] border border-white/[0.08]"
                      : "text-[#8b919a] hover:text-[#f5f2eb]"
                  }`}
                >
                  Action Items ({recording.summary.actionItems.length})
                </button>
              )}
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "chat"
                  ? "bg-[#252c34] text-[#e5a93c] border border-[#e5a93c]/30"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {/* TAB 1: SUMMARY */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-base sm:text-lg font-semibold text-[#f5f2eb] tracking-tight mb-2">
                    Lecture Summary & Themes
                  </h3>
                  <p className="text-xs text-[#cfd4dc] leading-relaxed whitespace-pre-line">
                    {recording.summary.overview}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#c59e5e]">
                    Why This Matters
                  </span>
                  <p className="text-xs text-[#9ba1a8] leading-relaxed">
                    This lecture directly addresses the practical mechanics
                    behind the subject, explaining why everyday real-world
                    examples reflect foundational classroom principles.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: KEY TAKEAWAYS */}
            {activeTab === "takeaways" && (
              <div className="space-y-3">
                <h3 className="font-sans text-base sm:text-lg font-semibold text-[#f5f2eb] tracking-tight mb-1">
                  Core Takeaways
                </h3>
                <p className="text-xs text-[#8b919a] mb-3">
                  High-yield concepts distilled from the recorded audio.
                </p>

                <div className="space-y-2.5">
                  {recording.summary.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#181c22] border border-white/[0.04] flex items-start gap-3"
                    >
                      <span className="h-5 w-5 rounded-full bg-[#e5a93c]/15 text-[#e5a93c] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-[#cfd4dc] leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: STUDY QUESTIONS / EXAM PREP */}
            {activeTab === "questions" && (
              <div className="space-y-3">
                <h3 className="font-sans text-base sm:text-lg font-semibold text-[#f5f2eb] tracking-tight mb-1">
                  Study & Exam Questions
                </h3>
                <p className="text-xs text-[#8b919a] mb-3">
                  Self-test questions to review comprehension before tests or
                  discussions.
                </p>

                {recording.summary.studyQuestions.length === 0 ? (
                  <p className="text-xs text-[#8b919a]">
                    No study questions created for this voice note.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recording.summary.studyQuestions.map((q, idx) => {
                      const isRevealed = !!revealedQuestions[idx];
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg bg-[#181c22] border border-white/[0.06] space-y-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs font-semibold text-[#f5f2eb]">
                              Q{idx + 1}: {q.question}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleQuestion(idx)}
                              className="text-[11px] text-[#e5a93c] hover:underline whitespace-nowrap"
                            >
                              {isRevealed ? "Hide" : "Reveal Answer"}
                            </button>
                          </div>

                          {isRevealed && (
                            <div className="pt-2 border-t border-white/[0.06] text-xs text-[#9ba1a8] leading-relaxed bg-[#14171a]/50 p-2.5 rounded">
                              <span className="font-semibold text-[#e5a93c]">
                                Answer:{" "}
                              </span>
                              {q.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ACTION ITEMS */}
            {activeTab === "actions" && (
              <div className="space-y-3">
                <h3 className="font-sans text-base sm:text-lg font-semibold text-[#f5f2eb] tracking-tight mb-1">
                  Action Items & Follow-ups
                </h3>
                <div className="space-y-2">
                  {(recording.summary.actionItems || []).map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#181c22] border border-white/[0.06] flex items-center gap-3 text-xs text-[#cfd4dc]"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[#343b44] text-[#e5a93c] focus:ring-0"
                      />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: ASK AI GROUNDED CHAT */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-full space-y-3">
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-[#e5a93c] text-[#14171a] font-medium"
                            : "bg-[#181c22] border border-white/[0.06] text-[#f5f2eb]"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-[#8b919a] mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="p-3 rounded-xl bg-[#181c22] border border-white/[0.06] text-xs text-[#8b919a] inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#e5a93c] animate-pulse" />
                      <span>Reviewing lecture transcript...</span>
                    </div>
                  )}
                </div>

                {/* Suggestions Pills */}
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {promptSuggestions.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendChat(prompt)}
                        className="px-2.5 py-1 rounded-full bg-[#20252b] hover:bg-[#282f37] text-[11px] text-[#cfd4dc] whitespace-nowrap border border-white/[0.06] transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChat();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask anything about this recording..."
                      className="flex-1 px-3 py-2 bg-[#14171a] border border-white/[0.08] focus:border-[#e5a93c]/50 rounded-lg text-xs text-[#f5f2eb] placeholder-[#8b919a] outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isTyping}
                      className="px-4 py-2 bg-[#e5a93c] disabled:opacity-50 hover:bg-[#f3b74b] text-[#14171a] font-semibold text-xs rounded-lg transition-all"
                    >
                      Ask
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
