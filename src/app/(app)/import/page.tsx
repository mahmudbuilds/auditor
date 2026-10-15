import type { Metadata } from "next";
import { ImportAudio } from "@/components/record/ImportAudio";

export const metadata: Metadata = { title: "Import audio — AUDIOTAP" };

export default function ImportPage() {
  return <ImportAudio />;
}
