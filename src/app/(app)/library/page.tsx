import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/recordings/LibraryBrowser";

export const metadata: Metadata = { title: "Library — AUDIOTAP" };

export default function LibraryPage() {
  return (
    <LibraryBrowser
      title="My library"
      subtitle="Every lecture, memo and meeting in one searchable place."
    />
  );
}
