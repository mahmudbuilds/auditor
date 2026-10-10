"use client";

import React, { useState } from "react";
import { CourseItem } from "@/types/recording";

interface HeroRecordSectionProps {
  onStartRecord: (title: string, course: string, mode: string) => void;
  courses: (CourseItem | string)[];
}

export function HeroRecordSection({
  onStartRecord,
  courses,
}: HeroRecordSectionProps) {
  const courseNames = courses.map((c) => (typeof c === "string" ? c : c.name));
  const [selectedCourse, setSelectedCourse] = useState(
    courseNames.find((c) => c !== "All Courses") || "Economics 101",
  );
  const [captureMode, setCaptureMode] = useState<"lecture" | "memo">("lecture");
  const [customTitle, setCustomTitle] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleRecordClick = () => {
    const defaultTitle =
      captureMode === "lecture"
        ? `${selectedCourse} Lecture`
        : "Quick Voice Note";
    const finalTitle = customTitle.trim() || defaultTitle;
    onStartRecord(finalTitle, selectedCourse, captureMode);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1c2128] to-[#161a20] border border-white/[0.08] p-6 sm:p-8 md:p-10 text-center shadow-lg">
      {/* Ambient background glow behind the record button */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#e5a93c]/[0.08] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* BIG VISIBLE HERO RECORD BUTTON */}
        <div className="relative my-2 group">
          {/* Outer gentle acoustic ripples */}
          <div
            className="absolute -inset-4 sm:-inset-5 rounded-full bg-[#e5a93c]/15 blur-md group-hover:bg-[#e5a93c]/25 transition-all duration-500 animate-pulse"
            aria-hidden="true"
          />
          <div
            className="absolute -inset-2 rounded-full border border-[#e5a93c]/30 group-hover:border-[#e5a93c]/60 group-hover:scale-105 transition-all duration-300"
            aria-hidden="true"
          />

          {/* Primary Tactile Record Button */}
          <button
            type="button"
            onClick={handleRecordClick}
            id="hero-main-record-btn"
            aria-label="Start recording audio"
            className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-b from-[#f3b74b] via-[#e5a93c] to-[#c59235] text-[#14171a] flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(229,169,60,0.35)] group-hover:shadow-[0_12px_40px_rgba(229,169,60,0.5)] group-hover:scale-105 group-active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#e5a93c]/40"
          >
            {/* Inner concentric ring */}
            <div className="absolute inset-2 rounded-full border border-black/15 pointer-events-none" />

            {/* Glowing Microphone Icon */}
            <svg
              className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>

            {/* Subtle label inside or right under */}
            <span className="text-[10px] uppercase font-bold tracking-wider mt-1 text-[#14171a]/90">
              Record
            </span>
          </button>
        </div>

        {/* Clear, focused invitation */}
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f5f2eb] mt-4 tracking-tight">
          Tap to Record
        </h2>
        <p className="text-xs sm:text-sm text-[#9ba1a8] mt-1 max-w-md">
          Capture lectures or voice notes. Auditor transcribes speech and
          extracts structured AI study takeaways instantly.
        </p>

        {/* Streamlined presets (Clean, simple, non-intrusive) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {/* Mode Pill Toggle */}
          <div className="inline-flex rounded-xl bg-[#14171a]/90 p-1 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setCaptureMode("lecture")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                captureMode === "lecture"
                  ? "bg-[#252c34] text-[#f5f2eb] shadow-sm font-semibold"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
            >
              Lecture Mode
            </button>
            <button
              type="button"
              onClick={() => setCaptureMode("memo")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                captureMode === "memo"
                  ? "bg-[#252c34] text-[#f5f2eb] shadow-sm font-semibold"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
            >
              Voice Memo
            </button>
          </div>

          {/* Quick Course Selector */}
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3.5 py-2 bg-[#14171a]/90 border border-white/[0.08] hover:border-white/[0.2] rounded-xl text-xs text-[#e5e0d6] outline-none cursor-pointer transition-colors"
            >
              {courseNames
                .filter((c) => c !== "All Courses")
                .map((c) => (
                  <option key={c} value={c} className="bg-[#1a1e23]">
                    {c}
                  </option>
                ))}
            </select>
          </div>

          {/* Optional Title input toggle */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-2 text-xs text-[#8b919a] hover:text-[#e5a93c] transition-colors"
          >
            {showDetails ? "Hide Title" : "+ Add Title"}
          </button>
        </div>

        {/* Collapsible custom title field */}
        {showDetails && (
          <div className="mt-3 w-full max-w-sm animate-fade-in">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Chapter 4: Market Dynamics"
              className="w-full px-3.5 py-2 rounded-xl bg-[#14171a] border border-white/[0.1] text-xs text-[#f5f2eb] placeholder-[#8b919a] outline-none focus:border-[#e5a93c]/60 text-center transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
}
