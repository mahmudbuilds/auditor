import type { Metadata } from "next";
import { RecordTypeSelect } from "@/components/record/RecordTypeSelect";

export const metadata: Metadata = { title: "Record — AUDIOTAP" };

export default function RecordPage() {
  return <RecordTypeSelect />;
}
