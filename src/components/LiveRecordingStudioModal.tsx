"use client";

import React, { useEffect, useRef, useState } from "react";
import { CourseItem, RecordingItem } from "@/types/recording";

interface LiveRecordingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialCourse?: string;
  initialSpeaker?: string;
  courses: (CourseItem | string)[];
  onSaveSession: (newSession: RecordingItem) => void;
}

export function LiveRecordingStudioModal({
  isOpen,
  onClose,
  initialTitle = "New Lecture Capture",
  initialCourse = "Economics 101",
  initialSpeaker = "Prof. David Miller",
  courses,
  onSaveSession,
}: LiveRecordingStudioModalProps) {
  const courseNames = courses.map((c) => (typeof c === "string" ? c : c.name));
  const [title, setTitle] = useState(initialTitle);
  const [course, setCourse] = useState(initialCourse);
  const [speaker, setSpeaker] = useState(initialSpeaker);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<
    { speaker: string; timestamp: string; seconds: number; text: string }[]
  >([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sample phrases that stream in during recording
  const streamQueue = [
    {
      delay: 3,
      speaker: speaker || "Professor",
      text: "Good morning everyone. Let us begin today's discussion on real-world market dynamics.",
    },
    {
      delay: 9,
      speaker: speaker || "Professor",
      text: "Notice that when consumer demand shifts unexpectedly, producers must either adjust inventory or change prices.",
    },
    {
      delay: 16,
      speaker: "Student",
      text: "How quickly do prices adapt when a sudden supply bottleneck occurs?",
    },
    {
      delay: 24,
      speaker: speaker || "Professor",
      text: "It depends heavily on price elasticity. Essential goods react very quickly, while luxury goods often see retailers absorb short-term price spikes.",
    },
    {
      delay: 34,
      speaker: speaker || "Professor",
      text: "Keep this in mind for our homework assignment due next week: price ceilings always lead to shortages if set below the market clearing rate.",
    },
  ];

  // Initialize and reset
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setCourse(initialCourse);
      setSpeaker(initialSpeaker);
      setSeconds(0);
      setIsPaused(false);
      setLiveTranscript([]);
      startAudioCapture();
    } else {
      stopAudioCapture();
    }
  }, [isOpen]);

  // Audio capture & canvas visualization
  const startAudioCapture = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        navigator.mediaDevices?.getUserMedia
      ) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        renderWaveform();
      } else {
        renderSimulatedWaveform();
      }
    } catch {
      // Fallback to simulated audio waveform if mic permission denied or unavailable
      renderSimulatedWaveform();
    }
  };

  const stopAudioCapture = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const renderWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const analyser = analyserRef.current;
    if (!analyser) {
      renderSimulatedWaveform();
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
        ctx.fillStyle = "#e5a93c";
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };

    draw();
  };

  const renderSimulatedWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      tick++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 32;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height =
          Math.sin(i * 0.3 + tick * 0.1) * 20 +
          Math.cos(i * 0.5 + tick * 0.08) * 15 +
          35;
        ctx.fillStyle = "#e5a93c";
        ctx.fillRect(
          i * barWidth,
          canvas.height - Math.max(6, height),
          barWidth - 3,
          height,
        );
      }
    };

    draw();
  };

  // Timer progression
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  // Streaming transcript simulation
  useEffect(() => {
    if (!isOpen) return;

    const currentItem = streamQueue.find((item) => item.delay === seconds);
    if (currentItem) {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      const timeStr = `${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;

      setLiveTranscript((prev) => [
        ...prev,
        {
          speaker: currentItem.speaker,
          timestamp: timeStr,
          seconds,
          text: currentItem.text,
        },
      ]);
    }
  }, [seconds, isOpen]);

  const formatTimer = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFinishAndSave = () => {
    stopAudioCapture();

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const durationStr = `${m}m ${s.toString().padStart(2, "0")}s`;

    const fullTranscript =
      liveTranscript.length > 0
        ? liveTranscript
        : [
            {
              speaker: speaker || "Speaker",
              timestamp: "00:01",
              seconds: 1,
              text: "Recorded audio capture from session. Spoken words transcribed with studio clarity.",
            },
          ];

    const newRec: RecordingItem = {
      id: `rec-${Date.now()}`,
      title: title || "New Audio Session",
      course: course || "General Notes",
      speaker: speaker || "Self",
      date: "Just now · Oct 8, 2026",
      duration: durationStr,
      durationSeconds: Math.max(30, seconds),
      type: seconds > 600 ? "lecture" : "voice_memo",
      status: "ready",
      isStarred: false,
      waveform: [
        40, 60, 75, 90, 65, 50, 70, 85, 90, 75, 60, 80, 95, 80, 65, 75, 85, 70,
        60, 50, 65, 75, 80, 60,
      ],
      summary: {
        overview: `A freshly captured recording for ${course || "general notes"} led by ${speaker || "speaker"}. The discussion highlighted foundational concepts, student questions, and immediate practical applications in plain English.`,
        keyTakeaways: [
          `Key concept captured during the ${durationStr} session.`,
          "Practical takeaway: real-world behavior directly mirrors the fundamental principles discussed.",
          "Next step: review lecture notes and prepare for the upcoming class discussion.",
        ],
        studyQuestions: [
          {
            question: "What was the main topic introduced during this session?",
            answer:
              "The session focused on introducing the core principles and examining real-world examples in plain language.",
          },
        ],
        actionItems: [
          "Review the newly generated transcript and highlight key passages.",
        ],
      },
      transcript: fullTranscript.map((t, idx) => ({
        id: `trans-${Date.now()}-${idx}`,
        ...t,
      })),
    };

    onSaveSession(newRec);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-[#181c22] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#14171a]">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#e5a93c]">
                Live Recording Studio
              </span>
              <h3 className="font-sans text-lg sm:text-xl font-semibold text-[#f5f2eb] tracking-tight">
                {title || "Untitled Recording"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8b919a] hover:text-[#f5f2eb] rounded-lg hover:bg-[#20252b]"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8b919a] mb-1">
                Session Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Economics Recitation"
                className="w-full px-3 py-1.5 bg-[#14171a] border border-white/[0.08] rounded-lg text-xs text-[#f5f2eb] outline-none focus:border-[#e5a93c]/50"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8b919a] mb-1">
                Course / Subject
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#14171a] border border-white/[0.08] rounded-lg text-xs text-[#e5e0d6] outline-none"
              >
                {courseNames
                  .filter((c) => c !== "All Courses")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8b919a] mb-1">
                Speaker / Professor
              </label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="e.g. Prof. David Miller"
                className="w-full px-3 py-1.5 bg-[#14171a] border border-white/[0.08] rounded-lg text-xs text-[#f5f2eb] outline-none focus:border-[#e5a93c]/50"
              />
            </div>
          </div>

          {/* Live Audio Visualizer Canvas */}
          <div className="rounded-xl bg-[#121518] border border-white/[0.06] p-4 flex flex-col items-center justify-center space-y-3">
            <div className="font-mono text-4xl sm:text-5xl font-bold text-[#f5f2eb] tracking-wider">
              {formatTimer(seconds)}
            </div>

            <canvas
              ref={canvasRef}
              width={400}
              height={60}
              className="w-full max-w-md h-14"
            />

            <div className="flex items-center gap-2 text-xs text-[#8b919a]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Microphone Active · Noise Reduction On</span>
            </div>
          </div>

          {/* Real-time Streaming Transcript */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8b919a]">
              <span className="uppercase tracking-wider font-semibold text-[#c59e5e] text-[10px]">
                Live Speech Stream
              </span>
              <span>{liveTranscript.length} phrases caught</span>
            </div>

            <div className="h-32 overflow-y-auto p-3 rounded-lg bg-[#14171a] border border-white/[0.06] space-y-2 text-xs">
              {liveTranscript.length === 0 ? (
                <div className="text-center py-6 text-[#8b919a] italic">
                  Listening for speech... Words spoken will appear here in
                  real-time.
                </div>
              ) : (
                liveTranscript.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[#e5a93c]">
                      <span>{item.timestamp}</span>
                      <span className="text-[#f5f2eb] font-sans font-semibold">
                        {item.speaker}:
                      </span>
                    </div>
                    <p className="text-[#cfd4dc] pl-3 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Controls / Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#14171a] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="px-4 py-2 rounded-lg bg-[#252c34] hover:bg-[#2f3742] text-xs font-medium text-[#f5f2eb] border border-white/[0.08] transition-colors"
          >
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#8b919a] hover:text-[#f5f2eb]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFinishAndSave}
              className="px-5 py-2 rounded-lg bg-[#e5a93c] hover:bg-[#f3b74b] text-[#14171a] font-semibold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Stop & Save Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
