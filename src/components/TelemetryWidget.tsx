"use client";

import React, { useState } from "react";

interface TelemetryWidgetProps {
  onQuickRecord: () => void;
}

export function TelemetryWidget({ onQuickRecord }: TelemetryWidgetProps) {
  const [selectedMonth, setSelectedMonth] = useState("OCT");

  const monthData: Record<
    string,
    {
      hours: string;
      sessions: string;
      accuracy: string;
      wordCount: string;
      nextLecture: string;
    }
  > = {
    OCT: {
      hours: "20:06",
      sessions: "14",
      accuracy: "99.4%",
      wordCount: "148,220 words",
      nextLecture: "Advanced Quantum Topology · Today at 14:00 GMT · Hall 302",
    },
    NOV: {
      hours: "18:42",
      sessions: "12",
      accuracy: "99.1%",
      wordCount: "132,800 words",
      nextLecture:
        "Epistemology & Cognitive Bias · Nov 4 at 10:00 GMT · Hall A",
    },
    DEC: {
      hours: "12:15",
      sessions: "8",
      accuracy: "99.6%",
      wordCount: "94,100 words",
      nextLecture: "Computational Biology Review · Dec 1 at 15:30 GMT · Lab 4",
    },
    JAN: {
      hours: "00:00",
      sessions: "0",
      accuracy: "—",
      wordCount: "Winter Term Break",
      nextLecture: "Spring Term Opening Convocation · Jan 12 at 09:00 GMT",
    },
    FEB: {
      hours: "00:00",
      sessions: "0",
      accuracy: "—",
      wordCount: "Upcoming Term",
      nextLecture: "Advanced Theoretical Physics · Feb 2 at 11:00 GMT",
    },
  };

  const current = monthData[selectedMonth] || monthData.OCT;

  return (
    <section
      id="telemetry"
      className="w-full py-12 border-b border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* The "YOUR MONTH" Telemetry Container */}
        <div className="rounded-sm border border-white/[0.1] bg-[#1a1d22] p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
          {/* Top Row: Title & Month Filter Pills */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6">
            <div>
              <h2 className="font-roman text-sm tracking-[0.2em] text-[#f4f1eb]">
                YOUR MONTH
              </h2>
              <p className="font-editorial italic text-xs text-[#8e959e] mt-0.5">
                Archival speech metrics and transcription fidelity telemetry
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["OCT", "NOV", "DEC", "JAN", "FEB"].map((month) => {
                const isActive = selectedMonth === month;
                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => setSelectedMonth(month)}
                    className={`px-3 py-1 text-xs font-telemetry tracking-wider rounded transition-all ${
                      isActive
                        ? "bg-[#e5a93c] text-[#14171a] font-bold shadow-[0_0_12px_rgba(229,169,60,0.3)]"
                        : "text-[#8e959e] hover:text-[#f4f1eb] hover:bg-white/[0.04]"
                    }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle Row: Metrics & Diagnostic Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 items-center">
            {/* Metric 1: Hours / Minutes (matches "20:06" in reference) */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-white/[0.08] pb-6 md:pb-0 pr-0 md:pr-6">
              <div className="font-telemetry text-4xl sm:text-5xl font-light text-[#f4f1eb] tracking-tight">
                {current.hours}
              </div>
              <div className="mt-2 font-roman text-[11px] tracking-[0.16em] text-[#8e959e]">
                HOURS RECORDED
              </div>
              <div className="font-editorial italic text-xs text-[#b8bdc5] mt-0.5">
                {current.wordCount} transcribed
              </div>
            </div>

            {/* Metric 2: Sessions / Accuracy (matches "15°C" in reference) */}
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-white/[0.08] pb-6 md:pb-0 pr-0 md:pr-6">
              <div className="font-telemetry text-4xl sm:text-5xl font-light text-[#e5a93c] tracking-tight">
                {current.sessions}
                <span className="text-xl font-light text-[#8e959e] ml-1">
                  ses
                </span>
              </div>
              <div className="mt-2 font-roman text-[11px] tracking-[0.16em] text-[#8e959e]">
                LECTURES AUDITED
              </div>
              <div className="font-editorial italic text-xs text-[#b8bdc5] mt-0.5">
                Average accuracy: {current.accuracy}
              </div>
            </div>

            {/* Diagnostics List with Amber Bullets */}
            <div className="md:col-span-5 space-y-2.5 text-xs font-editorial pl-0 md:pl-4">
              <div className="flex items-start gap-2.5 text-[#d8d4cc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c] mt-1.5 shrink-0" />
                <span>Neural Whisper v3 Large active on local web worker</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#d8d4cc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c] mt-1.5 shrink-0" />
                <span>
                  3 distinct speakers diarized with confidence &gt; 98%
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-[#d8d4cc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c] mt-1.5 shrink-0" />
                <span>
                  Real-time noise floor: -44 dB (Studio quiet suppression)
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-[#d8d4cc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c] mt-1.5 shrink-0" />
                <span>Automatic two-way export to Obsidian, Notion & Anki</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Status Bar & Action Link */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-white/[0.08] pt-4 gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#8e959e] font-editorial italic">
              <span className="h-2 w-2 rounded-full bg-[#e5a93c] animate-pulse" />
              <span>{current.nextLecture}</span>
            </div>

            <button
              type="button"
              onClick={onQuickRecord}
              className="inline-flex items-center gap-1.5 font-roman text-[11px] tracking-wider text-[#e5a93c] hover:text-[#f3b74b] transition-colors self-start sm:self-auto"
            >
              <span>LAUNCH LIVE CAPTURE NOW</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
