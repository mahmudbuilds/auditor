import type { Metadata } from "next";
import { LiveRecorder } from "@/components/record/LiveRecorder";

export const metadata: Metadata = { title: "Recording — AUDIOTAP" };

export default function LiveRecordPage() {
  return <LiveRecorder />;
}
