import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/recordings/LibraryBrowser";

export const metadata: Metadata = { title: "Voice memos — AUDIOTAP" };

export default function MemosPage() {
  return (
    <LibraryBrowser
      fixedFilter="Memos"
      title="Voice memos"
      subtitle="Quick ideas, reminders and thoughts you captured on the go."
    />
  );
}
