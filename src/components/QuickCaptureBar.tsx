"use client";

import React, { useState } from "react";
import { CourseItem } from "@/types/recording";

interface QuickCaptureBarProps {
  onStartRecord: (title: string, course: string, type: string) => void;
  courses: (CourseItem | string)[];
}

export function QuickCaptureBar({
  onStartRecord,
  courses,
}: QuickCaptureBarProps) {
  const courseNames = courses.map((c) => (typeof c === "string" ? c : c.name));
  const [quickTitle, setQuickTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(
    courseNames.find((c) => c !== "All Courses") || "Economics 101",
  );
  const [captureMode, setCaptureMode] = useState<"lecture" | "memo">("lecture");

  const handleLaunch = () => {
    const title =
      quickTitle.trim() ||
      (captureMode === "lecture"
        ? `${selectedCourse} Lecture`
        : "Quick Voice Note");
    onStartRecord(title, selectedCourse, captureMode);
    setQuickTitle("");
  };

  return (
    <div className="rounded-xl bg-gradient-to-r from-[#1d2229] via-[#1a1e24] to-[#1d2229] border border-white/[0.08] p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Headline & Mode */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e5a93c] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#c59e5e]">
              Instant Capture
            </span>
          </div>
          <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#f5f2eb]">
            Capture today's lectures or voice memos
          </h2>
          <p className="text-xs text-[#8b919a]">
            Record with studio fidelity. Auditor generates transcripts and key
            takeaways in plain English.
          </p>
        </div>

        {/* Right: Quick Launch Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Pill Toggle */}
          <div className="inline-flex rounded-lg bg-[#14171a] p-0.5 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setCaptureMode("lecture")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                captureMode === "lecture"
                  ? "bg-[#252c34] text-[#f5f2eb] shadow-sm"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
            >
              Lecture Mode
            </button>
            <button
              type="button"
              onClick={() => setCaptureMode("memo")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                captureMode === "memo"
                  ? "bg-[#252c34] text-[#f5f2eb] shadow-sm"
                  : "text-[#8b919a] hover:text-[#f5f2eb]"
              }`}
            >
              Quick Memo
            </button>
          </div>

          {/* Quick Course Selector */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1.5 bg-[#14171a] border border-white/[0.08] rounded-lg text-xs text-[#e5e0d6] outline-none hover:border-white/[0.16] cursor-pointer"
          >
            {courseNames
              .filter((c) => c !== "All Courses")
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          {/* Primary Record Button */}
          <button
            type="button"
            onClick={handleLaunch}
            className="flex items-center gap-2 px-4 py-2 bg-[#e5a93c] hover:bg-[#f3b74b] text-[#14171a] font-semibold text-xs rounded-lg shadow-[0_2px_12px_rgba(229,169,60,0.25)] transition-all active:scale-[0.98]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
            </svg>
            <span>Start Recording</span>
          </button>
        </div>
      </div>
    </div>
  );
}
