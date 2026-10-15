"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AudioLines,
  ArrowRight,
  Check,
  Disc3,
  Mic,
  Radio,
  Sparkles,
  Waves,
} from "lucide-react";
import { Button, ImagePlaceholder, Panel, RecDot } from "@/components/ui/kit";
import { useApp } from "@/components/providers/AppProvider";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [micGranted, setMicGranted] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      toast("Setup complete! Welcome to AUDIOTAP.");
      router.push("/");
    }
  };

  const handleRequestMic = async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // Release stream right away after verification
        for (const track of stream.getTracks()) track.stop();
        setMicGranted(true);
        toast("Microphone access authorized.");
        setStep(3);
      } else {
        setStep(3);
      }
    } catch {
      toast("Microphone permission skipped or blocked.");
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#ded7ca]">
      {/* Onboarding Shell (Screen 2: 3 Screens Walkthrough) */}
      <Panel
        tone="cream"
        className="w-full max-w-md p-6 sm:p-8 flex flex-col justify-between min-h-[580px] shadow-[0_16px_40px_rgba(0,0,0,0.16)] animate-fade-in"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#cdc4b3]">
          <div className="flex items-center gap-2">
            <AudioLines className="w-5 h-5 text-[#1a1916]" strokeWidth={2.4} />
            <span className="text-sm font-black tracking-[0.2em] text-[#1a1916] uppercase">
              AUDIOTAP
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-[#6b6455] hover:text-[#1a1916] transition"
          >
            Skip
          </Link>
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center my-auto py-6 animate-fade-in">
            <div className="w-full max-w-[260px] aspect-[4/3] mb-6">
              <ImagePlaceholder
                slot="onboarding-tape-player"
                label="Vintage Cassette Recorder"
                icon={Radio}
                className="w-full h-full"
                tone="cream"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#1a1916]">
              Record anything.
              <br />
              Understand everything.
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#5f594c] leading-relaxed max-w-xs">
              Turn lectures, voice memos, and audio into transcripts, summaries,
              flashcards and more with AI.
            </p>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center my-auto py-6 animate-fade-in">
            <div className="w-full max-w-[260px] aspect-[4/3] mb-6">
              <ImagePlaceholder
                slot="onboarding-microphone"
                label="Studio Microphone"
                icon={Mic}
                className="w-full h-full"
                tone="cream"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#1a1916]">
              Allow microphone access
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#5f594c] leading-relaxed max-w-xs">
              We need your permission to record audio and generate live
              synchronized transcripts.
            </p>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center my-auto py-6 animate-fade-in">
            <div className="w-full max-w-[260px] aspect-[4/3] mb-6">
              <ImagePlaceholder
                slot="onboarding-spectrum"
                label="Audio Spectrum & Recording Counter"
                icon={Waves}
                className="w-full h-full"
                tone="dark"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#1a1916]">
              Start recording
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#5f594c] leading-relaxed max-w-xs">
              Tap the button and start capturing your lecture, idea, or voice
              memo with one touch.
            </p>
          </div>
        )}

        {/* Bottom Actions & Stepper */}
        <div className="flex flex-col gap-4 pt-4 border-t border-[#cdc4b3]">
          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-1.5" aria-hidden>
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-6 bg-[#e0963a]" : "w-1.5 bg-[#b9b09f]"
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          {step === 1 && (
            <Button
              variant="dark"
              size="lg"
              onClick={handleNext}
              className="w-full text-sm font-semibold justify-center"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-2">
              <Button
                variant="dark"
                size="lg"
                onClick={handleRequestMic}
                className="w-full text-sm font-semibold justify-center"
              >
                Allow microphone
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="text-xs text-[#6b6455]"
              >
                Not now
              </Button>
            </div>
          )}

          {step === 3 && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              className="w-full text-sm font-semibold justify-center gap-2"
            >
              <RecDot /> Start now
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}
