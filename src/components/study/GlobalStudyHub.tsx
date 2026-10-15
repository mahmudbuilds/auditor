"use client";

import React, { useState } from "react";
import { Brain, Layers, Search, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { PageHeader, Panel, SectionLabel, INPUT } from "@/components/ui/kit";
import { StudyTools } from "./StudyTools";

export function GlobalStudyHub() {
  const { recordings } = useApp();
  const [selectedRecId, setSelectedRecId] = useState<string>("all");

  const readyRecordings = recordings.filter(
    (r) =>
      r.status === "ready" &&
      (r.summary.keyTakeaways.length > 0 ||
        r.summary.studyQuestions.length > 0),
  );

  const activeRecs =
    selectedRecId === "all"
      ? readyRecordings
      : readyRecordings.filter((r) => r.id === selectedRecId);

  const selectedRec = readyRecordings.find((r) => r.id === selectedRecId);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <PageHeader
        eyebrow="Intelligence & Retention"
        title="Study & Synthesis Hub"
        subtitle="Review flashcards, test yourself with practice quizzes, and explore neural concept maps across your lecture library."
      />

      {/* Recording Scope Selector */}
      <Panel tone="cream" className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3a352c]">
              Study Scope:
            </span>
            <select
              value={selectedRecId}
              onChange={(e) => setSelectedRecId(e.target.value)}
              aria-label="Select study scope"
              className={`${INPUT} w-auto max-w-[320px] h-9 text-[13px] py-1`}
            >
              <option value="all">
                All Master Recordings ({readyRecordings.length} tapes)
              </option>
              {readyRecordings.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.course})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-[#6b6455]">
            {selectedRec ? (
              <span>
                Focused on:{" "}
                <strong className="text-[#1a1916]">{selectedRec.title}</strong>
              </span>
            ) : (
              <span>
                Synthesizing cross-course knowledge from all available
                recordings
              </span>
            )}
          </div>
        </div>
      </Panel>

      {/* Study Tools Interactive Workspace */}
      <StudyTools
        recs={activeRecs.length > 0 ? activeRecs : recordings.slice(0, 3)}
        heading={
          selectedRec
            ? `Study Materials for: ${selectedRec.title}`
            : "Master Study & Review System"
        }
        initialTool="flashcards"
      />
    </div>
  );
}
