"use client";

import React, { useState } from "react";
import { CourseItem, RecordingItem } from "@/types/recording";
import { ScrewHead } from "./ScrewHead";
import { downloadRecordingAudio } from "@/utils/audioDownload";

interface LibraryViewProps {
  recordings: RecordingItem[];
  selectedRecording: RecordingItem;
  onSelectRecording: (rec: RecordingItem) => void;
  onPlayRecording: (rec: RecordingItem) => void;
  courses: (CourseItem | string)[];
  onDeleteRecording?: (id: string) => void;
  className?: string;
}

export function LibraryView({
  recordings,
  selectedRecording,
  onSelectRecording,
  onPlayRecording,
  courses,
  onDeleteRecording,
  className = "",
}: LibraryViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  const filtered = recordings.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.course.toLowerCase().includes(search.toLowerCase()) ||
      r.speaker.toLowerCase().includes(search.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" || r.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div
      className={`audiotap-panel rounded-[3px] p-5 relative flex flex-col select-none ${className}`}
    >
      {/* 4 Corner Screws */}
      <ScrewHead className="absolute top-2 left-2" rotation={14} />
      <ScrewHead className="absolute top-2 right-2" rotation={68} />
      <ScrewHead className="absolute bottom-2 left-2" rotation={44} />
      <ScrewHead className="absolute bottom-2 right-2" rotation={28} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#baa791]">
        <div>
          <h2 className="audiotap-label text-sm text-[#22201c] font-black">
            AUDIOTAP MASTER ARCHIVES & TAPE VAULT
          </h2>
          <p className="text-xs text-[#6e685c] mt-0.5">
            {recordings.length} Total Master Tapes // High-Bias Analog Emulation
            // Lossless PCM Audio
          </p>
        </div>

        {/* Search Bar in Inset Metal Slot */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tapes, courses, speakers..."
            className="w-full bg-[#16181b] border border-[#373b42] rounded-[3px] px-3 py-1.5 text-xs text-[#f5f2eb] placeholder-[#7a7467] font-mono focus:outline-none focus:border-[#e5a93c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
          />
        </div>
      </div>

      {/* Course Filter Pills */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto">
        {[
          "All Courses",
          "Computer Science 101",
          "Biology 102",
          "Physics 201",
          "Economics 101",
          "Personal Notes",
        ].map((courseName) => {
          const isActive = selectedCourse === courseName;
          return (
            <button
              key={courseName}
              type="button"
              onClick={() => setSelectedCourse(courseName)}
              className={`px-3 py-1 rounded-[2px] text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#24221f] text-[#f5f2eb] shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                  : "bg-[#d8d0c0] hover:bg-[#e4ddd0] text-[#4d473b] border border-[#b8af9e]"
              }`}
            >
              {courseName}
            </button>
          );
        })}
      </div>

      {/* Tapes Grid / Table */}
      <div className="space-y-2 mt-2">
        {filtered.map((rec) => {
          const isSelected = rec.id === selectedRecording.id;

          return (
            <div
              key={rec.id}
              className={`p-3 rounded-[3px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isSelected
                  ? "bg-[#eae4d7] border-[#8a7f6e] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),_0_2px_4px_rgba(0,0,0,0.1)]"
                  : "bg-[#dfd7ca]/50 hover:bg-[#eae4d7]/70 border-[#c4baa9] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              }`}
            >
              {/* Left Info */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Cassette Icon */}
                <div className="w-10 h-7 rounded-[2px] bg-[#1a1c1f] border border-[#3e4249] flex items-center justify-around px-1 shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ded6c7] border border-[#555]" />
                  <span className="w-3 h-0.5 bg-[#555]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ded6c7] border border-[#555]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1f1d1a] truncate">
                      {rec.title}
                    </span>
                    {rec.isStarred && (
                      <span className="text-[#e5a93c] text-xs">★</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#6d6657] flex items-center gap-2 mt-0.5 font-mono">
                    <span className="font-semibold text-[#3b372f]">
                      {rec.course}
                    </span>
                    <span>•</span>
                    <span>{rec.speaker}</span>
                    <span>•</span>
                    <span>{rec.date}</span>
                    <span>•</span>
                    <span className="text-[#a16207] font-bold">
                      {rec.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {/* Load into deck button */}
                <button
                  type="button"
                  onClick={() => onSelectRecording(rec)}
                  className={`audiotap-btn-tactile px-3 py-1 rounded-[2px] text-xs font-bold ${
                    isSelected ? "is-pressed text-[#e11d48]" : "text-[#24221f]"
                  }`}
                  title="Load into Master Deck"
                >
                  {isSelected ? "LOADED IN DECK" : "LOAD TAPE"}
                </button>

                {/* Play button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRecording(rec);
                    onPlayRecording(rec);
                  }}
                  className="audiotap-btn-tactile px-3 py-1 rounded-[2px] text-xs font-bold text-[#24221f]"
                  title="Play"
                >
                  ▶ PLAY
                </button>

                {/* Download Audio */}
                <button
                  type="button"
                  onClick={() => downloadRecordingAudio(rec)}
                  className="audiotap-btn-tactile px-2.5 py-1 rounded-[2px] text-xs font-bold text-[#454137]"
                  title="Download Lossless WAV Audio"
                >
                  ↓ WAV
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#686255] font-mono text-xs">
            No recordings found matching your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
