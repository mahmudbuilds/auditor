import type { Metadata } from "next";
import { GlobalStudyHub } from "@/components/study/GlobalStudyHub";

export const metadata: Metadata = {
  title: "Study Hub — AUDIOTAP",
  description:
    "Review flashcards, practice quizzes, and concept maps generated from your lecture library.",
};

export default function StudyPage() {
  return <GlobalStudyHub />;
}
