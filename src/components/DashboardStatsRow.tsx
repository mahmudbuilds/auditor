"use client";

import React from "react";
import { UserStats } from "@/types/recording";

interface DashboardStatsRowProps {
  stats: UserStats;
  onViewLibrary: () => void;
  onOpenStudyHub: () => void;
}

export function DashboardStatsRow({
  stats,
  onViewLibrary,
  onOpenStudyHub,
}: DashboardStatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Total Recorded Time */}
      <div className="relative overflow-hidden rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 hover:border-[#e5a93c]/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#c59e5e]">
            Total Time Recorded
          </span>
          <span className="p-1.5 rounded-md bg-[#252c34] text-[#e5a93c]">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-bold text-[#f5f2eb]">
            {stats.totalHours}
          </span>
          <span className="text-xs text-emerald-400 font-medium">
            +3.5h this week
          </span>
        </div>
        <p className="mt-2 text-xs text-[#8b919a]">
          Continuous lecture & voice memo captures
        </p>
      </div>

      {/* Stat 2: Audio Sessions */}
      <div
        onClick={onViewLibrary}
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 hover:border-[#e5a93c]/40 hover:bg-[#1d2229] transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#c59e5e]">
            Audio Sessions
          </span>
          <span className="p-1.5 rounded-md bg-[#252c34] text-[#e5a93c] group-hover:scale-105 transition-transform">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-bold text-[#f5f2eb]">
            {stats.totalRecordings}
          </span>
          <span className="text-xs text-[#9ba1a8]">Across 8 courses</span>
        </div>
        <p className="mt-2 text-xs text-[#8b919a] flex items-center justify-between">
          <span>12 lectures · 6 voice memos</span>
          <span className="text-[#e5a93c] opacity-0 group-hover:opacity-100 transition-opacity">
            View all →
          </span>
        </p>
      </div>

      {/* Stat 3: Key Takeaways */}
      <div
        onClick={onOpenStudyHub}
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 hover:border-[#e5a93c]/40 hover:bg-[#1d2229] transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#c59e5e]">
            Key Takeaways
          </span>
          <span className="p-1.5 rounded-md bg-[#252c34] text-[#e5a93c] group-hover:scale-105 transition-transform">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-bold text-[#f5f2eb]">
            {stats.insightsGenerated}
          </span>
          <span className="text-xs text-amber-400 font-medium">
            Ready to review
          </span>
        </div>
        <p className="mt-2 text-xs text-[#8b919a] flex items-center justify-between">
          <span>Distilled from audio notes</span>
          <span className="text-[#e5a93c] opacity-0 group-hover:opacity-100 transition-opacity">
            Study hub →
          </span>
        </p>
      </div>

      {/* Stat 4: Transcription Accuracy */}
      <div className="relative overflow-hidden rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 hover:border-[#e5a93c]/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#c59e5e]">
            Transcription Accuracy
          </span>
          <span className="p-1.5 rounded-md bg-[#252c34] text-[#e5a93c]">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-bold text-[#f5f2eb]">
            {stats.transcriptionAccuracy}
          </span>
          <span className="text-xs text-emerald-400 font-medium">
            Clear speech
          </span>
        </div>
        <p className="mt-2 text-xs text-[#8b919a]">
          Verified against speaker audio
        </p>
      </div>
    </div>
  );
}
