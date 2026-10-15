"use client";

import React from "react";
import { RecordingItem } from "@/types/recording";
import { ScrewHead } from "./ScrewHead";
import { Mic, ChevronRight } from "lucide-react";

interface RecentRecordingsPanelProps {
  recordings: RecordingItem[];
  selectedRecording: RecordingItem;
  onSelectRecording: (rec: RecordingItem) => void;
  className?: string;
}

export function RecentRecordingsPanel({
  recordings,
  selectedRecording,
  onSelectRecording,
  className = "",
}: RecentRecordingsPanelProps) {
  // Show 5 items matching the target design
  const displayItems = recordings.slice(0, 5);

  return (
    <div
      className={`audiotap-panel rounded-[4px] p-3.5 relative flex flex-col justify-between select-none ${className}`}
    >
      {/* 4 Corner Chassis Screws */}
      <ScrewHead className="absolute top-2.5 left-2.5" rotation={22} />
      <ScrewHead className="absolute top-2.5 right-2.5" rotation={64} />
      <ScrewHead className="absolute bottom-2.5 left-2.5" rotation={40} />
      <ScrewHead className="absolute bottom-2.5 right-2.5" rotation={10} />

      {/* Header: RECENT RECORDINGS */}
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="audiotap-label text-[11px] font-extrabold text-[#38332b]">
          RECENT RECORDINGS
        </h3>
      </div>

      {/* Recordings List */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        {displayItems.map((rec) => {
          const isSelected = rec.id === selectedRecording.id;

          return (
            <div
              key={rec.id}
              onClick={() => onSelectRecording(rec)}
              className={`rounded-[3px] px-2.5 py-2 flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                isSelected
                  ? "bg-[#eae3d5] border-[#b0a695] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),_0_1px_2px_rgba(0,0,0,0.08)]"
                  : "bg-[#dfd7ca]/50 hover:bg-[#eae3d5]/80 border-[#c9c1b2] shadow-[0_1px_1px_rgba(0,0,0,0.03)]"
              }`}
            >
              {/* Left: Microphone Icon */}
              <div className="w-5 h-5 flex items-center justify-center shrink-0 text-[#474135]">
                <Mic className="w-4 h-4 stroke-[1.8]" />
              </div>

              {/* Center: Title & Metadata */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-semibold truncate ${
                    isSelected ? "text-[#181613] font-bold" : "text-[#2e2b25]"
                  }`}
                >
                  {rec.title}
                </div>
                <div className="text-[10px] text-[#6d6658] tracking-tight mt-0.5 flex items-center gap-1.5">
                  <span>{rec.date}</span>
                  <span className="text-[#968d7e]">•</span>
                  <span>{rec.duration}</span>
                </div>
              </div>

              {/* Right: Chevron Arrow */}
              <div className="shrink-0 text-[#7a7364]">
                <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
