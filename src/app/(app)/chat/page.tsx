import type { Metadata } from "next";
import { GlobalChat } from "@/components/chat/GlobalChat";

export const metadata: Metadata = {
  title: "AI Chat — AUDIOTAP",
  description:
    "Ask questions and interrogate your lecture library with grounded AI.",
};

export default function ChatPage() {
  return <GlobalChat />;
}
