"use client";

import React, { useEffect, useRef, useState } from "react";
import { RecordingItem } from "@/types/recording";
import { downloadRecordingAudio } from "@/utils/audioDownload";
import { CourseIcon, getCourseIconFromList } from "./CourseIcon";

interface ActiveAudioPlayerProps {
  recording: RecordingItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenWorkspace: (recording: RecordingItem) => void;
}

export function ActiveAudioPlayer({
  recording,
  isPlaying,
  onTogglePlay,
  onOpenWorkspace,
}: ActiveAudioPlayerProps) {
  const [currentSeconds, setCurrentSeconds] = useState(120);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isDownloadHidden, setIsDownloadHidden] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "downloaded"
  >("idle");
  const [hoverPosition, setHoverPosition] = useState<{
    percent: number;
    seconds: number;
  } | null>(null);

  const totalSeconds = recording.durationSeconds || 1800;
  const scrubberRef = useRef<HTMLDivElement>(null);

  // Load download visibility preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("auditor_player_hide_download");
      if (saved === "true") {
        setIsDownloadHidden(true);
      }
    } catch {
      // Ignore
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

  // Simulate playback timer progression when playing
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

  const progressPercent = Math.min(100, (currentSeconds / totalSeconds) * 100);
  const remainingSeconds = Math.max(0, totalSeconds - currentSeconds);

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  const handleNextSpeed = () => {
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  return (
    <div className="rounded-2xl bg-[#1a1e24] border border-white/[0.08] p-4 sm:p-5 shadow-lg space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-[#e5a93c]/15 border border-[#e5a93c]/30 flex-shrink-0 flex items-center justify-center text-[#e5a93c] shadow-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#e5e0d6] bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded inline-flex items-center gap-1.5">
                <CourseIcon
                  icon={getCourseIconFromList(undefined, recording.course)}
                  className="w-3 h-3 text-[#9ba1a8]"
                />
                <span>{recording.course}</span>
              </span>
              <span className="text-xs text-[#8b919a]">Now Playing</span>
            </div>
            <h3 className="font-editorial text-base sm:text-lg font-bold text-[#f5f2eb] truncate mt-0.5">
              {recording.title}
            </h3>
            <p className="text-xs text-[#8b919a] truncate">
              {recording.speaker} · {recording.date}
            </p>
          </div>
        </div>

        {/* Top Right: Hidable Download & Open Workspace */}
        <div className="flex items-center gap-2 self-start sm:self-center">
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
                title="Download lecture audio (.wav)"
                aria-label="Download audio recording"
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
                    <span>Download</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleDownloadVisibility}
                className="p-1.5 text-[#8b919a] hover:text-[#f5f2eb] hover:bg-[#2a323d] rounded-lg transition-colors ml-0.5"
                title="Hide download button"
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
              title="Show download button"
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

          {/* Action: Open Full Workspace */}
          <button
            type="button"
            onClick={() => onOpenWorkspace(recording)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#252c34] hover:bg-[#2e3640] border border-white/[0.08] text-xs font-medium text-[#f5f2eb] transition-all hover:text-[#e5a93c]"
          >
            <span>Open Notes & Transcript</span>
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Waveform Scrubber & Interactive Time Bar */}
      <div className="space-y-2">
        {/* Animated Waveform Representation */}
        <div className="h-10 flex items-center justify-between gap-[2px] px-2 py-1 bg-[#14171a]/70 rounded-xl border border-white/[0.04]">
          {(
            recording.waveform || [
              40, 60, 75, 90, 65, 50, 70, 85, 90, 75, 60, 80, 95, 80, 65, 75,
              85, 70, 60, 50, 65, 75, 80, 60, 45, 65, 80, 55, 70, 85, 60, 50,
            ]
          ).map((val, idx) => {
            const barProgress = (idx / 32) * 100;
            const isPast = barProgress <= progressPercent;
            const isCurrent =
              barProgress <= progressPercent &&
              (idx + 1) * (100 / 32) > progressPercent;

            return (
              <div
                key={idx}
                onClick={() => {
                  const newSecs = Math.floor((idx / 32) * totalSeconds);
                  setCurrentSeconds(newSecs);
                }}
                className={`flex-1 rounded-full cursor-pointer transition-all duration-150 ${
                  isCurrent
                    ? "bg-[#ffd175] shadow-[0_0_8px_rgba(255,209,117,0.8)] scale-y-110"
                    : isPast
                      ? "bg-[#e5a93c] shadow-[0_0_4px_rgba(229,169,60,0.3)]"
                      : "bg-[#2d343d] hover:bg-[#3d4652]"
                }`}
                style={{
                  height: `${
                    isPlaying
                      ? Math.max(
                          20,
                          val * (0.8 + 0.35 * Math.sin(idx * 0.5 + currentSeconds * 0.8))
                        )
                      : val
                  }%`,
                  minHeight: "4px",
                }}
                title={`Jump to ${formatTime(
                  Math.floor((idx / 32) * totalSeconds)
                )}`}
              />
            );
          })}
        </div>

        {/* Custom Progress Slider Track with Gradient Fill and Tooltip */}
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
          className="relative py-1 w-full"
        >
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

          <div className="w-full h-2 bg-[#20252c] rounded-full overflow-hidden relative border border-white/[0.08]">
            <div className="absolute top-0 left-0 h-full w-[95%] bg-white/[0.06]" />
            <div
              className="h-full bg-gradient-to-r from-[#c59235] via-[#e5a93c] to-[#ffd175] transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
            {hoverPosition && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                style={{ left: `${hoverPosition.percent}%` }}
              />
            )}
          </div>

          <div
            className={`absolute top-1/2 -translate-y-1/2 -mt-0.5 h-3.5 w-3.5 rounded-full bg-[#f5f2eb] border-2 border-[#e5a93c] shadow-[0_0_10px_rgba(229,169,60,0.85)] pointer-events-none transition-transform duration-100 ${
              isPlaying ? "scale-110" : "scale-100"
            }`}
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />

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

        {/* Readout Row */}
        <div className="flex items-center justify-between text-xs font-mono text-[#8b919a]">
          <span className="w-12 text-left font-semibold text-[#f5f2eb]">
            {formatTime(currentSeconds)}
          </span>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#e5a93c]/15 text-[#e5a93c] border border-[#e5a93c]/30 text-[11px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#c59e5e]">
              -{formatTime(remainingSeconds)} left
            </span>
            <span>/</span>
            <span>{formatTime(totalSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons Row */}
      <div className="flex items-center justify-between pt-1">
        {/* Left: Speed Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNextSpeed}
            className="px-2.5 py-1 rounded-lg bg-[#20262e] hover:bg-[#28303a] border border-white/[0.08] text-xs font-mono text-[#e5a93c] transition-colors"
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>
          <span className="text-xs text-[#8b919a] hidden sm:inline">Speed</span>
        </div>

        {/* Center: Play, -10s, +10s */}
        <div className="flex items-center gap-3">
          {/* -10s */}
          <button
            type="button"
            onClick={() => setCurrentSeconds((prev) => Math.max(0, prev - 10))}
            className="p-2 text-[#9ba1a8] hover:text-[#f5f2eb] rounded-full hover:bg-[#252c34] transition-colors"
            title="Rewind 10 seconds"
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
                d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
              />
            </svg>
          </button>

          {/* Primary Play / Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="h-10 w-10 rounded-full bg-[#e5a93c] hover:bg-[#f3b74b] text-[#14171a] flex items-center justify-center shadow-[0_2px_12px_rgba(229,169,60,0.3)] transition-transform active:scale-95"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* +10s */}
          <button
            type="button"
            onClick={() =>
              setCurrentSeconds((prev) => Math.min(totalSeconds, prev + 10))
            }
            className="p-2 text-[#9ba1a8] hover:text-[#f5f2eb] rounded-full hover:bg-[#252c34] transition-colors"
            title="Forward 10 seconds"
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
                d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
              />
            </svg>
          </button>
        </div>

        {/* Right: Audio Fidelity indicator */}
        <div className="flex items-center gap-2 text-xs text-[#8b919a]">
          <span className="hidden sm:inline font-mono">48kHz · Clean STT</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>
    </div>
  );
}
