"use client";

import React, { useState } from "react";
import { RecordingItem } from "@/types/recording";
import { ScrewHead } from "./ScrewHead";

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  recording: RecordingItem;
}

export function StudyGuideModal({
  isOpen,
  onClose,
  recording,
}: StudyGuideModalProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, boolean>
  >({});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="audiotap-panel max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-[4px] p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[#a89e8e]">
        {/* 4 Corner Screws */}
        <ScrewHead className="absolute top-2 left-2" rotation={12} />
        <ScrewHead className="absolute top-2 right-2" rotation={52} />
        <ScrewHead className="absolute bottom-2 left-2" rotation={78} />
        <ScrewHead className="absolute bottom-2 right-2" rotation={24} />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#baa791]">
          <div>
            <h3 className="audiotap-label text-sm text-[#22201c] font-black">
              AUDIOTAP TECHNICAL STUDY GUIDE & QUIZ SYLLABUS
            </h3>
            <p className="text-xs text-[#6e685c] mt-0.5">
              {recording.course} // {recording.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6d6657] hover:text-black text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Study Syllabus Content */}
        <div className="space-y-4 my-4 font-mono text-xs">
          {/* Executive Overview */}
          <div className="p-3 rounded bg-[#eae4d7] border border-[#b8af9e]">
            <span className="font-bold text-[#1f1d1a] block mb-1">
              I. CORE DOMAIN SUMMARY:
            </span>
            <p className="text-[#454137] leading-relaxed">
              {recording.summary.overview}
            </p>
          </div>

          {/* Key Principles Checklist */}
          <div className="p-3 rounded bg-[#eae4d7] border border-[#b8af9e]">
            <span className="font-bold text-[#1f1d1a] block mb-2">
              II. EXAM READINESS PRINCIPLES:
            </span>
            <ul className="space-y-1.5 list-disc pl-4 text-[#454137]">
              {recording.summary.keyTakeaways.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>

          {/* Practice Quiz Section */}
          <div className="p-3 rounded bg-[#101215] border border-[#2b2f36] text-[#f5f2eb]">
            <span className="font-bold text-[#f59e0b] block mb-3">
              III. COMPREHENSION SELF-ASSESSMENT:
            </span>
            <div className="space-y-3">
              {recording.summary.studyQuestions.map((q, idx) => {
                const isRevealed = !!selectedAnswers[idx];

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-[#181a1e] border border-[#30353d]"
                  >
                    <div className="font-semibold text-white mb-1.5 flex items-start gap-2">
                      <span className="text-[#f59e0b]">Q{idx + 1}:</span>
                      <span>{q.question}</span>
                    </div>
                    {isRevealed ? (
                      <div className="text-[#a3e635] bg-[#142314] p-2 rounded text-[11px] border border-[#234223]">
                        <strong>Answer:</strong> {q.answer}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [idx]: true,
                          }))
                        }
                        className="px-2.5 py-1 rounded bg-[#2b3038] hover:bg-[#383e49] text-[#e5a93c] text-[10px] font-bold"
                      >
                        REVEAL ANSWER
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#baa791]">
          <span className="text-[10px] text-[#6e685c] font-mono">
            Generated via AUDIOTAP Neural Engine // Ready for Print
          </span>
          <button
            type="button"
            onClick={onClose}
            className="audiotap-btn-tactile px-4 py-2 rounded-[3px] text-xs font-bold text-[#1a1815]"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
}
