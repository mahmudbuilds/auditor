"use client";

import React, { useState, useEffect, useRef } from "react";
import { RecordingItem } from "@/types/recording";
import { ScrewHead } from "./ScrewHead";
import { VuMeters } from "./VuMeters";

interface NewRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecording: (newRec: RecordingItem) => void;
}

export function NewRecordingModal({
  isOpen,
  onClose,
  onSaveRecording,
}: NewRecordingModalProps) {
  const [title, setTitle] = useState("New Studio Audio Session");
  const [course, setCourse] = useState("Computer Science 101");
  const [speaker, setSpeaker] = useState("Speaker 1");
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [micGain, setMicGain] = useState(65);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);
      }
    } catch {
      // Fallback to simulated audio recording
    }
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
    setIsRecording(false);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    handleStopRecording();
    const durationStr = formatTimer(Math.max(seconds, 45));

    const newRec: RecordingItem = {
      id: `rec-${Date.now()}`,
      title: title.trim() || "Untitled Studio Recording",
      course: course,
      speaker: speaker.trim() || "Speaker 1",
      date: "Today · Oct 15, 2026",
      duration: durationStr,
      durationSeconds: Math.max(seconds, 45),
      type: "lecture",
      status: "ready",
      isStarred: true,
      waveform: [
        35, 50, 75, 90, 65, 45, 80, 95, 75, 60, 65, 85, 90, 70, 50, 75, 80, 60,
        45, 65, 85, 70, 50, 40,
      ],
      summary: {
        overview: `Live captured audio session for ${course}. Synthesized using AUDIOTAP Dual Neural Engine. Topics covered key principles, definitions, and application methodology.`,
        keyTakeaways: [
          "Core conceptual framework established during initial recording pass.",
          "High signal-to-noise ratio achieved via active spectral subtraction.",
          "All spoken timestamps indexed for instantaneous retrieval.",
        ],
        studyQuestions: [
          {
            question: `What was the primary focus of this session in ${course}?`,
            answer: `Key foundational principles and practical problem solving under the guidance of ${speaker}.`,
          },
        ],
        actionItems: [
          "Review captured transcript timestamps.",
          "Generate interactive study flashcards.",
        ],
      },
      transcript: [
        {
          id: `tr-1-${Date.now()}`,
          speaker: speaker || "Speaker 1",
          timestamp: "00:00",
          seconds: 0,
          text: `Recording initialized for ${title}. Acoustic input level calibrated to ${micGain}%.`,
        },
        {
          id: `tr-2-${Date.now()}`,
          speaker: speaker || "Speaker 1",
          timestamp: "00:15",
          seconds: 15,
          text: "Audio track processed through AUDIOTAP high-bias tape emulator with automatic timestamp markers.",
        },
      ],
    };

    onSaveRecording(newRec);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="audiotap-panel max-w-lg w-full rounded-[4px] p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[#a89e8e]">
        {/* 4 Corner Screws */}
        <ScrewHead className="absolute top-2 left-2" rotation={28} />
        <ScrewHead className="absolute top-2 right-2" rotation={64} />
        <ScrewHead className="absolute bottom-2 left-2" rotation={42} />
        <ScrewHead className="absolute bottom-2 right-2" rotation={15} />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#baa791]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444] animate-pulse" />
            <h3 className="audiotap-label text-sm text-[#22201c] font-black">
              LIVE STUDIO RECORDING CONSOLE
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6d6657] hover:text-black text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3.5 my-4">
          <div>
            <label className="block text-[11px] font-bold text-[#454137] uppercase mb-1">
              SESSION TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#181a1d] text-[#f5f2eb] border border-[#3e4249] rounded p-2 text-xs font-mono focus:outline-none focus:border-[#e5a93c]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#454137] uppercase mb-1">
                COURSE / FOLDER
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-[#181a1d] text-[#f5f2eb] border border-[#3e4249] rounded p-2 text-xs font-mono focus:outline-none focus:border-[#e5a93c]"
              >
                <option value="Computer Science 101">
                  Computer Science 101
                </option>
                <option value="Biology 102">Biology 102</option>
                <option value="Physics 201">Physics 201</option>
                <option value="Economics 101">Economics 101</option>
                <option value="Personal Notes">Personal Notes</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#454137] uppercase mb-1">
                SPEAKER NAME
              </label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="w-full bg-[#181a1d] text-[#f5f2eb] border border-[#3e4249] rounded p-2 text-xs font-mono focus:outline-none focus:border-[#e5a93c]"
              />
            </div>
          </div>

          {/* Live Studio VU Meter Box */}
          <div className="p-3 rounded bg-[#101215] border border-[#2b2f36] flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-2 text-xs font-mono text-[#f59e0b]">
              <span className="flex items-center gap-1.5 font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${isRecording ? "bg-[#ef4444] animate-pulse" : "bg-[#555]"}`}
                />
                {isRecording ? "LIVE RECORDING" : "STANDBY"}
              </span>
              <span className="text-base font-bold tabular-nums">
                {formatTimer(seconds)}
              </span>
            </div>

            <VuMeters isRecording={isRecording} gain={micGain} />

            <div className="w-full flex items-center justify-between mt-2 px-2 text-[10px] text-[#a8a396] font-mono">
              <span>MIC PREAMP GAIN</span>
              <input
                type="range"
                min="10"
                max="100"
                value={micGain}
                onChange={(e) => setMicGain(Number(e.target.value))}
                className="w-40 accent-[#e5a93c] cursor-pointer"
              />
              <span>{micGain}%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#baa791]">
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="audiotap-btn-tactile px-4 py-2 rounded-[3px] text-xs font-bold text-[#e11d48] flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                START CAPTURE
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopRecording}
                className="audiotap-btn-tactile px-4 py-2 rounded-[3px] text-xs font-bold text-[#24221f] flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 bg-[#24221f] rounded-[0.5px]" />
                PAUSE
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-[#5c5549] hover:text-black"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="audiotap-btn-tactile px-4 py-2 rounded-[3px] text-xs font-bold text-[#1f1d1a] bg-gradient-to-b from-[#f59e0b] to-[#d97706]"
            >
              SAVE TO TAPE VAULT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
