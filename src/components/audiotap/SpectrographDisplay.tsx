"use client";

import React, { useEffect, useState } from "react";

interface SpectrographDisplayProps {
  statusText?: string;
  isRecording?: boolean;
  isPlaying?: boolean;
  timerString?: string;
  title?: string;
  className?: string;
}

export function SpectrographDisplay({
  statusText = "RECORDING...",
  isRecording = true,
  isPlaying = false,
  timerString = "00:12:34",
  title = "Lecture - Computer Science 101",
  className = "",
}: SpectrographDisplayProps) {
  // Generate 48 frequency bars matching target screenshot curve
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 48 }, (_, i) => {
      const dist = Math.abs(i - 24) / 24;
      const base = (1 - dist * 0.7) * 48;
      const variation = Math.sin(i * 0.8) * 12 + ((i * 7) % 11);
      return Math.max(10, Math.min(85, Math.round(base + variation)));
    }),
  );

  useEffect(() => {
    if (!isPlaying && !isRecording) {
      setBars((prev) => prev.map((val) => Math.max(8, Math.round(val * 0.94))));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((_, i) => {
          const dist = Math.abs(i - 24) / 24;
          const wave = Math.sin((i / 48) * Math.PI) * 0.65 + 0.35;
          const energy = Math.random() * 55 + 20;
          return Math.max(
            8,
            Math.min(92, Math.round(wave * energy * (1 - dist * 0.25))),
          );
        }),
      );
    }, 90);

    return () => clearInterval(interval);
  }, [isPlaying, isRecording]);

  const displayStatus = isRecording
    ? "RECORDING..."
    : isPlaying
      ? "PLAYBACK..."
      : statusText;

  return (
    <div
      className={`relative w-full rounded-[3px] bg-[#0c0d10] border border-[#23262c] px-4 py-3 shadow-[inset_0_4px_16px_rgba(0,0,0,0.99),_0_1px_0_rgba(255,255,255,0.7)] overflow-hidden select-none ${className}`}
    >
      {/* Subtle Warm CRT Screen Glow & Horizontal Scanlines */}
      <div className="absolute inset-0 bg-radial from-[#e5a93c]/5 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)",
        }}
      />

      {/* Top Status Header Line */}
      <div className="flex items-center justify-between gap-3 text-xs font-mono tracking-widest relative z-10">
        {/* Left: Blinking Red LED + Status Text */}
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all shrink-0 ${
              isRecording
                ? "bg-[#ef4444] shadow-[0_0_8px_#ef4444,0_0_12px_rgba(239,68,68,0.7)] animate-pulse"
                : isPlaying
                  ? "bg-[#22c55e] shadow-[0_0_8px_#22c55e]"
                  : "bg-[#712222]"
            }`}
          />
          <span className="font-bold tracking-widest text-[#f5a623] audiotap-amber-glow text-[11px] sm:text-xs">
            {displayStatus}
          </span>
        </div>

        {/* Center: Amber Digital Timer Readout */}
        <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.2em] text-[#f5a623] audiotap-amber-glow tabular-nums">
          {timerString}
        </div>

        {/* Right: Lecture / Audio Title */}
        <div className="font-mono text-[10px] sm:text-xs text-[#e5a93c]/90 truncate max-w-[200px] sm:max-w-[280px] text-right">
          {title}
        </div>
      </div>

      {/* Center Spectrograph / Equalizer Bars */}
      <div className="mt-4 pt-1 h-16 sm:h-20 flex items-end justify-between gap-[2px] sm:gap-[3px] relative z-10 border-b border-[#2d2518]/50 pb-1">
        {bars.map((heightPercent, idx) => {
          const isHigh = heightPercent > 55;
          const isPeak = heightPercent > 74;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-end items-center h-full group"
            >
              {/* Peak cap segment */}
              <div
                className={`w-full h-[2px] mb-[1.5px] rounded-[0.5px] transition-all duration-75 ${
                  isPeak
                    ? "bg-[#fb923c] shadow-[0_0_5px_#fb923c]"
                    : isHigh
                      ? "bg-[#f59e0b] shadow-[0_0_4px_#f59e0b]"
                      : "bg-[#b45309]/80"
                }`}
              />

              {/* Main spectrum bar */}
              <div
                className="w-full rounded-[0.5px] transition-all duration-75"
                style={{
                  height: `${heightPercent}%`,
                  background: isPeak
                    ? "linear-gradient(180deg, #fb923c 0%, #f59e0b 45%, #b45309 100%)"
                    : isHigh
                      ? "linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #92400e 100%)"
                      : "linear-gradient(180deg, #d97706 0%, #92400e 60%, #451a03 100%)",
                  boxShadow:
                    isPlaying || isRecording
                      ? "0 0 5px rgba(245, 166, 35, 0.45)"
                      : "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
