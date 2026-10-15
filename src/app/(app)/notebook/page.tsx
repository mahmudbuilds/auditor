import type { Metadata } from "next";
import { NotebookView } from "@/components/notebook/NotebookView";

export const metadata: Metadata = {
  title: "Notebook & Notary — AUDIOTAP",
  description:
    "Highlights, bookmarks, personal observations, and action items captured during study sessions.",
};

export default function NotebookPage() {
  return <NotebookView />;
}
