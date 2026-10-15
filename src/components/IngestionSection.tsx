"use client";

import React from "react";

export function IngestionSection() {
  const channels = [
    {
      mode: "BY VOICE",
      detail:
        "Open Auditor on your phone, watch, or laptop. One tap initiates ambient spatial recording with neural noise reduction and local storage encryption.",
    },
    {
      mode: "BY FILE",
      detail:
        "Drag and drop past recordings in MP3, WAV, FLAC, M4A, or MP4 formats up to 4GB. Batch transcription processes at 45x realtime speed.",
    },
    {
      mode: "BY STREAM",
      detail:
        "Paste any Zoom, Google Meet, Microsoft Teams, or YouTube URL. Auditor listens silently in the background and indexes the discussion live.",
    },
    {
      mode: "BY ARCHIVE",
      detail:
        "Continuous two-way bidirectional sync with Obsidian vault directories, Notion academic workspaces, and Anki spaced-repetition card decks.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-4">
            <h2 className="font-roman text-2xl sm:text-3xl tracking-[0.16em] text-[#f4f1eb]">
              INGESTION &amp; <br />
              CAPTURE MODES
            </h2>
            <p className="font-editorial italic text-base text-[#8e959e] mt-3">
              Four frictionless doorways to archive every lecture, seminar, and
              dialogue into memory.
            </p>
          </div>

          {/* Right Column: Ingestion Channels List */}
          <div className="lg:col-span-8 space-y-6">
            {channels.map((ch, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 border-b border-white/[0.06] pb-6 last:border-b-0"
              >
                <div className="sm:col-span-4">
                  <span className="font-roman text-xs tracking-wider text-[#e5a93c]">
                    {ch.mode}
                  </span>
                </div>
                <div className="sm:col-span-8">
                  <p className="font-editorial text-sm sm:text-base text-[#9da4ad] leading-relaxed">
                    {ch.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
