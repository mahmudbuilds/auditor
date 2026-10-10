"use client";

import React, { useEffect, useRef, useState } from "react";
import { RecordingItem } from "@/types/recording";
import { downloadRecordingAudio } from "@/utils/audioDownload";
import { CourseIcon, getCourseIconFromList } from "./CourseIcon";

interface DockedAudioPlayerProps {
  recording: RecordingItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenWorkspace: (recording: RecordingItem) => void;
  onClose?: () => void;
}

export function DockedAudioPlayer({
  recording,
  isPlaying,
  onTogglePlay,
  onOpenWorkspace,
  onClose,
}: DockedAudioPlayerProps) {
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
      // Ignore localStorage read errors
    }
  }, []);

  const handleToggleDownloadVisibility = () => {
    setIsDownloadHidden((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("auditor_player_hide_download", String(next));
      } catch {
        // Ignore localStorage write errors
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

  // Simulate playback progression
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

  // Find active speech segment from transcript
  const activeSegmentIndex = recording.transcript.findIndex(
    (seg, idx, arr) =>
      currentSeconds >= seg.seconds &&
      (idx === arr.length - 1 || currentSeconds < arr[idx + 1].seconds)
  );
  const activeSegment =
    activeSegmentIndex !== -1 ? recording.transcript[activeSegmentIndex] : null;

  // Waveform bars count
  const waveformBars = 32;
  const baseWaveform = recording.waveform || [
    35, 50, 70, 85, 60, 45, 65, 90, 80, 55, 45, 75, 95, 80, 60, 70, 85, 90, 65,
    45, 40, 60, 75, 50, 65, 80, 70, 55, 65, 80, 60, 45,
  ];

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    const secs = Math.floor((pct / 100) * totalSeconds);
    setHoverPosition({ percent: pct, seconds: secs });
  };

  const handleScrubberMouseLeave = () => {
    setHoverPosition(null);
  };

  return (
    <div
      id="docked-audio-player-container"
      className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-[#161a20]/95 backdrop-blur-md border-t border-white/[0.1] px-4 sm:px-6 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] animate-slide-up"
    >
      {/* Top enhanced micro progress bar with pulse glow */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#20252c]">
        {/* Buffered preview background */}
        <div className="absolute top-0 left-0 h-full w-full bg-white/[0.04]" />
        {/* Progress fill */}
        <div
          className="h-full bg-gradient-to-r from-[#c59235] via-[#e5a93c] to-[#ffd175] transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Glowing pulse head on leading edge */}
        <div
          className={`absolute top-0 -mt-0.5 h-2.5 w-2.5 rounded-full bg-[#ffd175] shadow-[0_0_8px_#e5a93c] transition-all duration-200 ${
            isPlaying ? "scale-110 animate-pulse" : "scale-90"
          }`}
          style={{ left: `calc(${progressPercent}% - 5px)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Track Info & Play Button */}
        <div className="flex items-center gap-3.5 w-full md:w-1/3 min-w-0">
          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            id="docked-play-pause-btn"
            className="h-11 w-11 rounded-full bg-[#e5a93c] hover:bg-[#f3b74b] text-[#14171a] flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(229,169,60,0.35)] transition-transform active:scale-95"
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

          {/* Title & Metadata & Spoken Context */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#e5e0d6] bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded inline-flex items-center gap-1.5">
                <CourseIcon
                  icon={getCourseIconFromList(undefined, recording.course)}
                  className="w-3 h-3 text-[#9ba1a8]"
                />
                <span>{recording.course}</span>
              </span>
              <span className="text-xs text-[#8b919a] hidden sm:inline">
                {recording.speaker}
              </span>
            </div>
            <h4 className="font-sans text-xs sm:text-sm font-semibold text-[#f5f2eb] truncate mt-0.5 tracking-tight">
              {recording.title}
            </h4>
            {/* Live Spoken Segment preview */}
            {activeSegment && (
              <p className="text-[11px] text-[#9ba1a8] truncate flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c] animate-pulse flex-shrink-0" />
                <span className="text-[#c59e5e] font-mono text-[10px]">
                  {activeSegment.timestamp}
                </span>
                <span className="truncate italic">
                  "{activeSegment.speaker.split(" ")[0]}: {activeSegment.text}"
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Center: Waveform & High-Visibility Progress Bar */}
        <div className="w-full md:w-5/12 flex flex-col items-center gap-1.5">
          {/* Interactive Multi-Bar Waveform */}
          <div className="w-full h-7 flex items-center justify-between gap-[2px] px-1 bg-[#14171a]/50 rounded-lg border border-white/[0.04]">
            {Array.from({ length: waveformBars }).map((_, idx) => {
              const val =
                baseWaveform[idx % baseWaveform.length] ||
                40 + ((idx * 17) % 50);
              const barProgress = (idx / waveformBars) * 100;
              const isPast = barProgress <= progressPercent;
              const isCurrent =
                barProgress <= progressPercent &&
                (idx + 1) * (100 / waveformBars) > progressPercent;

              // Animated wave height while playing
              const dynamicHeight = isPlaying
                ? Math.max(
                    15,
                    val * (0.8 + 0.35 * Math.sin(idx * 0.5 + currentSeconds * 0.8))
                  )
                : val;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    const newSecs = Math.floor(
                      (idx / waveformBars) * totalSeconds
                    );
                    setCurrentSeconds(newSecs);
                  }}
                  className={`flex-1 rounded-full cursor-pointer transition-all duration-150 ${
                    isCurrent
                      ? "bg-[#ffd175] shadow-[0_0_8px_rgba(255,209,117,0.8)] scale-y-110"
                      : isPast
                        ? "bg-[#e5a93c] shadow-[0_0_4px_rgba(229,169,60,0.3)]"
                        : "bg-[#252b34] hover:bg-[#343d49]"
                  }`}
                  style={{
                    height: `${Math.min(100, Math.max(18, dynamicHeight))}%`,
                    minHeight: "4px",
                  }}
                  title={`Jump to ${formatTime(
                    Math.floor((idx / waveformBars) * totalSeconds)
                  )}`}
                />
              );
            })}
          </div>

          {/* Scrubber Slider Track with Custom Filled Gradient */}
          <div
            ref={scrubberRef}
            onMouseMove={handleScrubberMouseMove}
            onMouseLeave={handleScrubberMouseLeave}
            className="w-full relative py-1"
          >
            {/* Hover timestamp tooltip */}
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

            {/* Custom Progress Track Bar */}
            <div className="w-full h-2 bg-[#20252c] rounded-full overflow-hidden relative border border-white/[0.08]">
              {/* Buffer Bar */}
              <div className="absolute top-0 left-0 h-full w-[94%] bg-white/[0.06]" />
              {/* Filled Progress Gradient Bar */}
              <div
                className="h-full bg-gradient-to-r from-[#c59235] via-[#e5a93c] to-[#ffd175] transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Ghost hover position indicator */}
              {hoverPosition && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                  style={{ left: `${hoverPosition.percent}%` }}
                />
              )}
            </div>

            {/* Glowing Circular Scrubber Thumb Head */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -mt-0.5 h-3.5 w-3.5 rounded-full bg-[#f5f2eb] border-2 border-[#e5a93c] shadow-[0_0_10px_rgba(229,169,60,0.85)] pointer-events-none transition-transform duration-100 ${
                isPlaying ? "scale-110" : "scale-100"
              }`}
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />

            {/* Accessible Overlaid HTML Range Input */}
            <input
              type="range"
              min={0}
              max={totalSeconds}
              value={currentSeconds}
              onChange={(e) => setCurrentSeconds(Number(e.target.value))}
              aria-label="Audio playback progress"
              aria-valuenow={currentSeconds}
              aria-valuemin={0}
              aria-valuemax={totalSeconds}
              aria-valuetext={`${formatTime(currentSeconds)} of ${formatTime(totalSeconds)}`}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>

          {/* Time & Percentage Progress Feedback Row */}
          <div className="w-full flex items-center justify-between text-xs font-mono text-[#8b919a]">
            {/* Elapsed Time */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#f5f2eb]">
                {formatTime(currentSeconds)}
              </span>
              <span className="text-[10px] text-[#8b919a]">elapsed</span>
            </div>

            {/* Percentage Progress Pill Badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e5a93c]/15 text-[#e5a93c] border border-[#e5a93c]/30 text-[11px] font-bold"
              title={`${Math.round(progressPercent)}% of lecture completed`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
              <span>{Math.round(progressPercent)}%</span>
            </div>

            {/* Total Duration & Remaining Countdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#c59e5e]">
                -{formatTime(remainingSeconds)} left
              </span>
              <span className="text-[#8b919a]">/</span>
              <span className="text-[#8b919a]">{formatTime(totalSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Hidable Download, Speed & Navigation */}
        <div className="flex items-center gap-2 sm:gap-2.5 self-end md:self-auto flex-wrap justify-end">
          {/* Quick skip buttons */}
          <div className="flex items-center gap-1 text-[#8b919a] bg-[#1d222a] px-1.5 py-0.5 rounded-lg border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setCurrentSeconds((prev) => Math.max(0, prev - 10))}
              className="p-1 hover:text-[#f5f2eb] rounded transition-colors text-xs flex items-center"
              title="Rewind 10 seconds"
              aria-label="Rewind 10 seconds"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNextSpeed}
              className="px-1.5 py-0.5 rounded bg-[#252c35] text-[#e5a93c] text-[11px] font-mono hover:bg-[#2d3540] transition-colors"
              title="Playback speed"
            >
              {playbackSpeed}x
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentSeconds((prev) => Math.min(totalSeconds, prev + 10))
              }
              className="p-1 hover:text-[#f5f2eb] rounded transition-colors text-xs flex items-center"
              title="Forward 10 seconds"
              aria-label="Forward 10 seconds"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
                />
              </svg>
            </button>
          </div>

          {/* Hidable Download Feature */}
          {!isDownloadHidden ? (
            <div className="flex items-center rounded-xl bg-[#20262e] border border-white/[0.08] p-0.5 shadow-sm group/dl">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloadStatus === "downloading"}
                id="docked-download-audio-btn"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  downloadStatus === "downloaded"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : downloadStatus === "downloading"
                      ? "bg-[#e5a93c]/20 text-[#e5a93c]"
                      : "text-[#f5f2eb] hover:bg-[#28303a] hover:text-[#e5a93c]"
                }`}
                title="Download lecture audio file (.wav)"
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
                    <span className="hidden sm:inline">Download</span>
                  </>
                )}
              </button>

              {/* Hide Download Button Trigger */}
              <button
                type="button"
                onClick={handleToggleDownloadVisibility}
                className="p-1.5 text-[#8b919a] hover:text-[#f5f2eb] hover:bg-[#2a323d] rounded-lg transition-colors ml-0.5"
                title="Hide download button from media player"
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
            /* When hidden: compact unobtrusive reveal toggle */
            <button
              type="button"
              onClick={handleToggleDownloadVisibility}
              className="p-1.5 rounded-xl bg-[#20262e]/70 hover:bg-[#252c34] text-[#8b919a] hover:text-[#e5a93c] border border-white/[0.06] hover:border-[#e5a93c]/30 transition-all text-xs flex items-center gap-1"
              title="Show media player download button"
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
              <span className="text-[10px] hidden xl:inline font-mono">
                +Download
              </span>
            </button>
          )}

          {/* Notes & AI Workspace button */}
          <button
            type="button"
            onClick={() => onOpenWorkspace(recording)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#252c34] hover:bg-[#e5a93c] hover:text-[#14171a] text-xs font-semibold text-[#f5f2eb] border border-white/[0.08] transition-all"
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

          {/* Close Player */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#8b919a] hover:text-[#f5f2eb] rounded-lg hover:bg-[#20252c] transition-colors"
              title="Close player"
              aria-label="Close audio player"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
