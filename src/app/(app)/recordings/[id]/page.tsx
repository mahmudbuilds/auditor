import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { MOCK_RECORDINGS } from "@/data/mockRecordings";
import { RecordingWorkspace } from "@/components/recordings/RecordingWorkspace";
import type { RecordingItem } from "@/types/recording";

// Static parameters for Next.js Cache Components build-time prerendering
export function generateStaticParams() {
  return MOCK_RECORDINGS.map((rec) => ({
    id: rec.id,
  }));
}

export default async function RecordingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initial = MOCK_RECORDINGS.find((r) => r.id === id);

  // If not in seeded mock data, provide a fallback template for newly created user recordings
  // which will be populated client-side from AppProvider's localStorage
  const fallbackRecording: RecordingItem = initial || {
    id,
    title: "Recording Session",
    course: "General",
    speaker: "Speaker",
    date: "Today",
    duration: "00:00",
    durationSeconds: 0,
    type: "lecture",
    status: "processing",
    summary: {
      overview: "Loading recording data...",
      keyTakeaways: [],
      studyQuestions: [],
    },
    transcript: [],
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center text-xs font-mono text-[#6b6455]">
          Loading AUDIOTAP Workspace...
        </div>
      }
    >
      <RecordingWorkspace initialRecording={fallbackRecording} />
    </Suspense>
  );
}
