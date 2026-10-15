import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/settings/SettingsPageContent";

export const metadata: Metadata = {
  title: "Settings — AUDIOTAP",
  description:
    "Calibrate audio recording quality, neural transcription, storage, and accessibility.",
};

export default function SettingsPage() {
  return <SettingsPageContent />;
}
