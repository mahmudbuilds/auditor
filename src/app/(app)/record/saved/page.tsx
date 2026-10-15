import type { Metadata } from "next";
import { SavedScreen } from "@/components/record/SavedScreen";

export const metadata: Metadata = { title: "Recording saved — AUDIOTAP" };

export default function SavedPage() {
  return <SavedScreen />;
}
