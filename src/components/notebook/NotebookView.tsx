"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Check,
  ChevronRight,
  Clock,
  Highlighter,
  NotebookPen,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import {
  Button,
  INNER_CARD,
  PageHeader,
  Panel,
  SectionLabel,
  INPUT,
} from "@/components/ui/kit";
import { clock } from "@/lib/format";

export function NotebookView() {
  const {
    recordings,
    notes,
    addNote,
    removeNote,
    doneActions,
    toggleAction,
    toast,
  } = useApp();
  const [newNoteText, setNewNoteText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote(newNoteText.trim());
    setNewNoteText("");
    setIsAdding(false);
    toast("Note saved to Notebook.");
  };

  // Collect action items across all recordings
  const allActionItems = recordings.flatMap((r) =>
    (r.summary.actionItems || []).map((text, idx) => ({
      key: `${r.id}-act-${idx}`,
      recId: r.id,
      recTitle: r.title,
      text,
    })),
  );

  // Curated highlights and bookmarks for authentic retro feel
  const highlights = [
    {
      time: "08:12",
      recTitle: "Computer Science Lecture",
      recId: "rec-cs-101",
      text: "Object-oriented programming organizes software around objects and data encapsulation.",
    },
    {
      time: "06:40",
      recTitle: "Biology Class",
      recId: "rec-bio-class",
      text: "Without oxygen as the terminal acceptor, the entire mitochondrial cascade backs up immediately.",
    },
    {
      time: "04:30",
      recTitle: "Physics Lecture",
      recId: "rec-physics-lecture",
      text: "Lenz's Law ensures induced current opposes flux change, obeying conservation of energy.",
    },
  ];

  const bookmarks = [
    {
      time: "01:34",
      label: "Class vs. object",
      recTitle: "Computer Science Lecture",
      recId: "rec-cs-101",
    },
    {
      time: "04:12",
      label: "Encapsulation & Methods",
      recTitle: "Computer Science Lecture",
      recId: "rec-cs-101",
    },
    {
      time: "18:40",
      label: "ATP Synthase Mechanism",
      recTitle: "Biology Class",
      recId: "rec-bio-class",
    },
    {
      time: "22:15",
      label: "Faraday Induction Demo",
      recTitle: "Physics Lecture",
      recId: "rec-physics-lecture",
    },
  ];

  const allKeyConcepts = Array.from(
    new Set(
      recordings.flatMap((r) =>
        r.summary.keyTakeaways.flatMap((t) =>
          t.split(/[:,.]/)[0].trim().replace(/^•\s*/, ""),
        ),
      ),
    ),
  ).slice(0, 10);

  return (
    <div className="flex flex-col gap-4 animate-fade-in max-w-5xl mx-auto w-full">
      <PageHeader
        eyebrow="Knowledge Ledger"
        title="My Notebook & Notary"
        subtitle="Highlights, bookmarks, personal observations, and action items captured during study sessions."
        actions={
          <Button variant="primary" size="md" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4" /> Add note
          </Button>
        }
      />

      {/* Add note modal / inline drawer */}
      {isAdding && (
        <Panel
          tone="cream"
          className="p-4 border-[#e0963a] bg-[#fbf9f5] animate-fade-in"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#1a1916] flex items-center gap-2">
              <NotebookPen className="w-4 h-4 text-[#e0963a]" /> Write a new
              personal note
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[#8c8270] hover:text-[#181613]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAddNote} className="flex flex-col gap-3">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Jot down a quick thought, study reminder, or formula to remember..."
              rows={3}
              autoFocus
              className="w-full rounded-[5px] border border-[#bdb4a3] bg-white p-3 text-[13px] text-[#22201d] outline-none focus:border-[#e0963a]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="light"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button variant="dark" size="sm" type="submit">
                Save note
              </Button>
            </div>
          </form>
        </Panel>
      )}

      {/* Main Grid: Screen 11 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
        {/* Left Column: Highlights & Personal Notes */}
        <div className="flex flex-col gap-4">
          {/* User Personal Notes */}
          <Panel tone="cream" className="p-4 sm:p-5">
            <SectionLabel icon={NotebookPen}>
              Personal Notes ({notes.length})
            </SectionLabel>
            {notes.length === 0 ? (
              <p className="text-xs text-[#6b6455] py-4 text-center">
                No personal notes added yet. Click &quot;Add note&quot; above to
                capture spontaneous thoughts.
              </p>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`${INNER_CARD} p-3 flex items-start justify-between gap-3 group`}
                  >
                    <p className="text-[13px] leading-relaxed text-[#22201d] whitespace-pre-wrap">
                      {note.text}
                    </p>
                    <button
                      type="button"
                      aria-label="Delete note"
                      onClick={() => {
                        removeNote(note.id);
                        toast("Note removed.");
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[#8c8270] hover:text-[#b3261e] p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Highlights */}
          <Panel tone="cream" className="p-4 sm:p-5">
            <SectionLabel icon={Highlighter}>Important Highlights</SectionLabel>
            <div className="flex flex-col gap-2.5 mt-2">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className={`${INNER_CARD} p-3 flex flex-col gap-1.5 transition hover:bg-[#e4ddd0]`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#8c6b2d] uppercase tracking-wider">
                      {h.recTitle}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#e0963a]">
                      {h.time}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#22201d] italic leading-relaxed">
                    &ldquo;{h.text}&rdquo;
                  </p>
                  <Link
                    href={`/recordings/${h.recId}?tab=transcript`}
                    className="text-[11px] font-semibold text-[#6b6455] hover:text-[#181613] hover:underline mt-1 self-start flex items-center gap-1"
                  >
                    Jump to timestamp <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Column: Bookmarks, Concepts & Action Items */}
        <div className="flex flex-col gap-4">
          {/* Action Items */}
          <Panel tone="cream" className="p-4 sm:p-5">
            <SectionLabel icon={Check}>
              Action Items ({allActionItems.length})
            </SectionLabel>
            <div className="flex flex-col gap-2 mt-2">
              {allActionItems.length === 0 ? (
                <p className="text-xs text-[#6b6455] py-2">
                  No pending action items found.
                </p>
              ) : (
                allActionItems.map((item) => {
                  const isDone = !!doneActions[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleAction(item.key)}
                      className={`${INNER_CARD} p-2.5 flex items-start gap-2.5 cursor-pointer hover:bg-[#e4ddd0] transition`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {}}
                        className="mt-0.5 rounded accent-[#e0963a] cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[12px] leading-snug ${
                            isDone
                              ? "line-through text-[#8c8270]"
                              : "text-[#22201d]"
                          }`}
                        >
                          {item.text}
                        </p>
                        <span className="text-[10px] text-[#8c8270] block mt-0.5">
                          From: {item.recTitle}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Panel>

          {/* Bookmarks */}
          <Panel tone="cream" className="p-4 sm:p-5">
            <SectionLabel icon={Bookmark}>Key Bookmarks</SectionLabel>
            <div className="flex flex-col gap-2 mt-2">
              {bookmarks.map((bm, i) => (
                <Link
                  key={i}
                  href={`/recordings/${bm.recId}?tab=transcript`}
                  className={`${INNER_CARD} p-2.5 flex items-center justify-between hover:bg-[#e4ddd0] transition text-left`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[12px] font-semibold text-[#1a1916] truncate">
                      {bm.label}
                    </p>
                    <p className="text-[10px] text-[#8c8270] truncate">
                      {bm.recTitle}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#e0963a] shrink-0">
                    {bm.time}
                  </span>
                </Link>
              ))}
            </div>
          </Panel>

          {/* AI Key Concepts */}
          <Panel tone="cream" className="p-4 sm:p-5">
            <SectionLabel icon={Sparkles}>AI Key Concepts</SectionLabel>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {allKeyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-[#b3a998] bg-[#ece6da] px-2.5 py-1 text-[11px] font-medium text-[#3a352c]"
                >
                  {concept}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
