"use client";

import React, { useState } from "react";
import { CourseItem, RecordingItem } from "@/types/recording";
import { CourseIcon, getCourseIconFromList } from "./CourseIcon";

interface RecordingsTableProps {
  recordings: RecordingItem[];
  selectedRecording: RecordingItem;
  onSelectRecording: (rec: RecordingItem) => void;
  onOpenWorkspace: (rec: RecordingItem) => void;
  isPlaying: boolean;
  onTogglePlay: (rec: RecordingItem) => void;
  onToggleStar: (id: string) => void;
  searchQuery: string;
  selectedCourse: string;
  onSelectCourse?: (course: string) => void;
  courses?: (CourseItem | string)[];
}

export function RecordingsTable({
  recordings,
  selectedRecording,
  onSelectRecording,
  onOpenWorkspace,
  isPlaying,
  onTogglePlay,
  onToggleStar,
  searchQuery,
  selectedCourse,
  onSelectCourse,
  courses,
}: RecordingsTableProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "lecture" | "voice_memo" | "starred"
  >("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Base items in the currently selected course
  const baseRecordings =
    selectedCourse !== "All Courses"
      ? recordings.filter((r) => r.course === selectedCourse)
      : recordings;

  // Filtering
  const filtered = recordings.filter((rec) => {
    // Tab filter
    if (activeTab === "lecture" && rec.type !== "lecture") return false;
    if (activeTab === "voice_memo" && rec.type !== "voice_memo") return false;
    if (activeTab === "starred" && !rec.isStarred) return false;

    // Course filter
    if (selectedCourse !== "All Courses" && rec.course !== selectedCourse)
      return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = rec.title.toLowerCase().includes(q);
      const inSpeaker = rec.speaker.toLowerCase().includes(q);
      const inCourse = rec.course.toLowerCase().includes(q);
      const inOverview = rec.summary.overview.toLowerCase().includes(q);
      const inTranscript = rec.transcript.some((t) =>
        t.text.toLowerCase().includes(q),
      );
      if (!inTitle && !inSpeaker && !inCourse && !inOverview && !inTranscript)
        return false;
    }

    return true;
  });

  return (
    <div className="rounded-2xl bg-[#181c22] border border-white/[0.08] overflow-hidden shadow-sm">
      {/* Active Course Banner when filtered */}
      {selectedCourse !== "All Courses" && (
        <div className="px-4 sm:px-5 py-2.5 bg-[#1e242d] border-b border-white/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#8b919a]">Showing:</span>
            <span className="font-semibold text-[#e5a93c] bg-[#e5a93c]/15 px-2 py-0.5 rounded border border-[#e5a93c]/30">
              {selectedCourse}
            </span>
            <span className="text-[#8b919a] text-[11px]">
              ({baseRecordings.length}{" "}
              {baseRecordings.length === 1 ? "session" : "sessions"})
            </span>
          </div>
          {onSelectCourse && (
            <button
              type="button"
              onClick={() => onSelectCourse("All Courses")}
              className="text-[#e5a93c] hover:underline font-medium cursor-pointer"
            >
              Show all courses
            </button>
          )}
        </div>
      )}

      {/* Top Filter & View Controls */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-[#252c34] text-[#f5f2eb] border border-white/[0.1] font-semibold"
                : "text-[#8b919a] hover:text-[#f5f2eb]"
            }`}
          >
            All ({baseRecordings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("lecture")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === "lecture"
                ? "bg-[#252c34] text-[#f5f2eb] border border-white/[0.1] font-semibold"
                : "text-[#8b919a] hover:text-[#f5f2eb]"
            }`}
          >
            Lectures (
            {baseRecordings.filter((r) => r.type === "lecture").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("voice_memo")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === "voice_memo"
                ? "bg-[#252c34] text-[#f5f2eb] border border-white/[0.1] font-semibold"
                : "text-[#8b919a] hover:text-[#f5f2eb]"
            }`}
          >
            Voice Memos (
            {baseRecordings.filter((r) => r.type === "voice_memo").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("starred")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === "starred"
                ? "bg-[#252c34] text-[#f5f2eb] border border-white/[0.1] font-semibold"
                : "text-[#8b919a] hover:text-[#f5f2eb]"
            }`}
          >
            Starred ★ ({baseRecordings.filter((r) => r.isStarred).length})
          </button>
        </div>

        {/* View Switcher: List vs Grid */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="inline-flex rounded-xl bg-[#14171a] p-1 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "list"
                  ? "bg-[#252c34] text-[#f5f2eb]"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
              title="List view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-[#252c34] text-[#f5f2eb]"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
              title="Grid card view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-[#20252c] text-[#8b919a]">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h4 className="font-sans text-base font-semibold text-[#f5f2eb]">
            No recordings found
          </h4>
          <p className="text-xs text-[#8b919a] max-w-sm mx-auto">
            {searchQuery
              ? `No recordings matched "${searchQuery}". Try searching for another topic or clearing filters.`
              : "No recordings available in this view."}
          </p>
          {selectedCourse !== "All Courses" && onSelectCourse && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectCourse("All Courses")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20252c] hover:bg-[#282f38] text-xs font-medium text-[#e5a93c] transition-colors cursor-pointer"
              >
                Reset course filter
              </button>
            </div>
          )}
        </div>
      ) : viewMode === "list" ? (
        /* Spacious List Layout */
        <div className="divide-y divide-white/[0.04]">
          {filtered.map((rec) => {
            const isSelected = selectedRecording.id === rec.id;
            const isCurrentPlaying = isSelected && isPlaying;

            return (
              <div
                key={rec.id}
                onClick={() => onSelectRecording(rec)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#212730]/80 border-l-2 border-[#e5a93c]"
                    : "hover:bg-[#1e232a]/70"
                }`}
              >
                {/* Left: Play button + Title + Snippet */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {/* Large Tactile Play Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePlay(rec);
                    }}
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 shadow-sm ${
                      isCurrentPlaying
                        ? "bg-[#e5a93c] text-[#14171a] shadow-[0_2px_12px_rgba(229,169,60,0.4)]"
                        : "bg-[#242a32] text-[#e5a93c] hover:bg-[#e5a93c] hover:text-[#14171a]"
                    }`}
                    aria-label={isCurrentPlaying ? "Pause" : "Play"}
                  >
                    {isCurrentPlaying ? (
                      <div className="flex items-center gap-0.5 h-3.5">
                        <span className="w-0.5 h-3 bg-[#14171a] animate-pulse" />
                        <span className="w-0.5 h-2 bg-[#14171a] animate-ping" />
                        <span className="w-0.5 h-3.5 bg-[#14171a] animate-pulse" />
                      </div>
                    ) : (
                      <svg
                        className="w-4 h-4 fill-current ml-0.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Title & Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#e5e0d6] bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded inline-flex items-center gap-1.5">
                        <CourseIcon
                          icon={getCourseIconFromList(
                            typeof courses?.[0] === "string" ? undefined : (courses as CourseItem[]),
                            rec.course,
                          )}
                          className="w-3 h-3 text-[#9ba1a8]"
                        />
                        <span>{rec.course}</span>
                      </span>
                      <span className="text-xs text-[#8b919a]">
                        {rec.speaker} · {rec.date}
                      </span>
                    </div>

                    <h4 className="font-sans text-sm sm:text-base font-semibold text-[#f5f2eb] mt-1 group-hover:text-[#e5a93c] transition-colors truncate tracking-tight">
                      {rec.title}
                    </h4>

                    {/* AI Takeaway preview snippet */}
                    <p className="text-xs text-[#9ba1a8] mt-1 line-clamp-1">
                      {rec.summary.overview}
                    </p>
                  </div>
                </div>

                {/* Right: Duration + Star + Notes action */}
                <div
                  className="flex items-center justify-between sm:justify-end gap-3.5 sm:flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="font-mono text-xs text-[#8b919a]">
                    {rec.duration}
                  </span>

                  {/* Star Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleStar(rec.id)}
                    className={`p-2 rounded-lg hover:bg-[#252c34] text-sm transition-colors ${
                      rec.isStarred
                        ? "text-[#e5a93c]"
                        : "text-[#8b919a] hover:text-[#f5f2eb]"
                    }`}
                    title={rec.isStarred ? "Remove star" : "Star note"}
                  >
                    ★
                  </button>

                  {/* Open Notes Workspace */}
                  <button
                    type="button"
                    onClick={() => onOpenWorkspace(rec)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#242a32] hover:bg-[#e5a93c] hover:text-[#14171a] text-xs font-semibold text-[#f5f2eb] border border-white/[0.08] transition-all"
                  >
                    <span>Notes & AI</span>
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Card Layout */
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((rec) => {
            const isSelected = selectedRecording.id === rec.id;
            const isCurrentPlaying = isSelected && isPlaying;

            return (
              <div
                key={rec.id}
                onClick={() => onSelectRecording(rec)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#212730] border-[#e5a93c]/50 shadow-md"
                    : "bg-[#181c22] border-white/[0.06] hover:border-white/[0.14] hover:bg-[#1d2228]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#e5e0d6] bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded inline-flex items-center gap-1.5">
                      <CourseIcon
                        icon={getCourseIconFromList(
                          typeof courses?.[0] === "string" ? undefined : (courses as CourseItem[]),
                          rec.course,
                        )}
                        className="w-3 h-3 text-[#9ba1a8]"
                      />
                      <span>{rec.course}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(rec.id);
                      }}
                      className={`text-sm ${
                        rec.isStarred ? "text-[#e5a93c]" : "text-[#8b919a]"
                      }`}
                    >
                      ★
                    </button>
                  </div>

                  <h4 className="font-sans text-base sm:text-lg font-semibold text-[#f5f2eb] line-clamp-2 tracking-tight leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-[#8b919a] mt-1">
                    {rec.speaker} · {rec.date}
                  </p>

                  <p className="text-xs text-[#9ba1a8] mt-3 line-clamp-3 leading-relaxed">
                    {rec.summary.overview}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePlay(rec);
                      }}
                      className="h-8 w-8 rounded-full bg-[#e5a93c] text-[#14171a] flex items-center justify-center transition-transform active:scale-95"
                    >
                      {isCurrentPlaying ? (
                        <div className="flex items-center gap-0.5 h-3">
                          <span className="w-0.5 h-2.5 bg-[#14171a] animate-pulse" />
                          <span className="w-0.5 h-1.5 bg-[#14171a] animate-ping" />
                          <span className="w-0.5 h-3 bg-[#14171a] animate-pulse" />
                        </div>
                      ) : (
                        <svg
                          className="w-3.5 h-3.5 fill-current ml-0.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <span className="text-xs font-mono text-[#8b919a]">
                      {rec.duration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenWorkspace(rec);
                    }}
                    className="text-xs text-[#e5a93c] hover:underline font-semibold"
                  >
                    Notes & AI →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
