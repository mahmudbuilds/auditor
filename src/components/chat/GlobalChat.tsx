"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Sparkles, FolderOpen } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { PageHeader, Panel, SectionLabel, INPUT } from "@/components/ui/kit";
import { ChatPanel } from "./ChatPanel";

function ChatInner() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const { recordings } = useApp();
  const [selectedRecId, setSelectedRecId] = useState<string>("all");

  const readyRecordings = recordings.filter(
    (r) =>
      r.status === "ready" && (r.transcript.length > 0 || r.summary.overview),
  );

  const activeRecs =
    selectedRecId === "all"
      ? readyRecordings
      : readyRecordings.filter((r) => r.id === selectedRecId);

  const selectedRec = readyRecordings.find((r) => r.id === selectedRecId);

  return (
    <div className="flex flex-col gap-4 animate-fade-in max-w-4xl mx-auto w-full">
      <PageHeader
        eyebrow="Conversational Assistant"
        title="Grounded AI Lecture Assistant"
        subtitle="Ask questions, locate specific quotes and explanations, and test your comprehension directly against what was spoken."
      />

      <Panel tone="cream" className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#cdc4b3]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3a352c]">
              Chat Knowledge Base:
            </span>
            <select
              value={selectedRecId}
              onChange={(e) => setSelectedRecId(e.target.value)}
              aria-label="Select chat knowledge base"
              className={`${INPUT} w-auto max-w-[340px] h-9 text-[13px] py-1`}
            >
              <option value="all">
                Search Entire Library ({readyRecordings.length} tapes)
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
                Focused tape:{" "}
                <strong className="text-[#1a1916]">{selectedRec.title}</strong>
              </span>
            ) : (
              <span>Searching across all verified lecture transcripts</span>
            )}
          </div>
        </div>

        <ChatPanel
          key={`${selectedRecId}-${initialQ}`}
          recs={activeRecs.length > 0 ? activeRecs : recordings}
          initialQuestion={initialQ}
        />
      </Panel>
    </div>
  );
}

export function GlobalChat() {
  return (
    <Suspense
      fallback={
        <div className="h-[400px] flex items-center justify-center text-xs font-mono text-[#6b6455]">
          Loading AI Chat...
        </div>
      }
    >
      <ChatInner />
    </Suspense>
  );
}
