"use client";

import React, { useState } from "react";
import {
  HardDrive,
  Keyboard,
  Languages,
  Mic,
  Palette,
  RotateCcw,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  Wand2,
} from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import {
  Button,
  Field,
  INNER_CARD,
  PageHeader,
  Panel,
  SectionLabel,
  Switch,
  INPUT,
} from "@/components/ui/kit";

export function SettingsPageContent() {
  const { settings, updateSettings, resetData, toast } = useApp();
  const [activeSection, setActiveSection] = useState<
    "recording" | "transcription" | "storage" | "appearance"
  >("recording");

  const sections = [
    {
      id: "recording" as const,
      label: "Recording & Hardware",
      icon: Mic,
      desc: "Microphone input, fidelity, noise gates, and analog filters.",
    },
    {
      id: "transcription" as const,
      label: "Transcription & AI",
      icon: Wand2,
      desc: "Language selection, neural summary depth, and auto-flashcards.",
    },
    {
      id: "storage" as const,
      label: "Storage & Vault",
      icon: HardDrive,
      desc: "Disk allocation, cloud synchronization, and local backups.",
    },
    {
      id: "appearance" as const,
      label: "Accessibility & Display",
      icon: Palette,
      desc: "Typography scale, high contrast, reduced motion, and keybindings.",
    },
  ];

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all settings and restore initial laboratory recordings? This will clear all personal notes.",
      )
    ) {
      resetData();
      toast("Restored factory settings and demo tapes.");
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in max-w-5xl mx-auto w-full">
      <PageHeader
        eyebrow="Console Calibration"
        title="Settings & Hardware Preferences"
        subtitle="Configure recording quality, transcription engines, storage limits, and console ergonomics."
      />

      {/* Main Settings Layout (Screen 14 Navigation) */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-4 items-start">
        {/* Navigation Sidebar */}
        <Panel tone="cream" className="p-3">
          <SectionLabel icon={SlidersHorizontal}>Categories</SectionLabel>
          <div className="flex flex-col gap-1.5 mt-2">
            {sections.map(({ id, label, icon: Icon, desc }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`flex flex-col text-left p-2.5 rounded-[5px] transition ${
                    active
                      ? "bg-[#1a1a1a] text-[#f3efe6] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "hover:bg-[#d8d0c0] text-[#22201d]"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-[13px]">
                    <Icon
                      className={`w-4 h-4 ${active ? "text-[#f6ad3c]" : "text-[#6b6455]"}`}
                    />
                    <span>{label}</span>
                  </div>
                  <span
                    className={`text-[11px] mt-0.5 leading-tight ${
                      active ? "text-[#c2bab0]" : "text-[#6b6455]"
                    }`}
                  >
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-3 border-t border-[#cdc4b3]">
            <Button
              variant="light"
              size="sm"
              className="w-full text-xs"
              onClick={handleReset}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore factory defaults
            </Button>
          </div>
        </Panel>

        {/* Section Content Pane */}
        <div className="flex flex-col gap-4">
          {/* 1. RECORDING SECTION */}
          {activeSection === "recording" && (
            <Panel tone="cream" className="p-5 flex flex-col gap-5">
              <SectionLabel icon={Mic}>
                Recording & Hardware Audio Capture
              </SectionLabel>

              <Field
                label="Audio Capture Quality"
                hint="Higher bitrates preserve finer acoustic nuances for acoustic lecture halls."
              >
                <select
                  value={settings.recordingQuality}
                  onChange={(e) =>
                    updateSettings({
                      recordingQuality: e.target.value as
                        | "standard"
                        | "high"
                        | "lossless",
                    })
                  }
                  className={INPUT}
                >
                  <option value="standard">
                    Standard (AAC 128 kbps — Compact storage)
                  </option>
                  <option value="high">
                    High Fidelity (PCM 256 kbps — Recommended for lectures)
                  </option>
                  <option value="lossless">
                    Lossless Master (FLAC 24-bit 96 kHz — Maximum fidelity)
                  </option>
                </select>
              </Field>

              <div className="flex flex-col gap-3 pt-2 border-t border-[#cdc4b3]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Analog Noise Filter
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Filters out AC hum, air conditioning, and room rumble.
                    </span>
                  </div>
                  <Switch
                    checked={settings.noiseReduction}
                    onChange={(v) => {
                      updateSettings({ noiseReduction: v });
                      toast(`Noise filter ${v ? "enabled" : "disabled"}.`);
                    }}
                    label="Noise reduction"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Voice Clarity Enhancement
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Compresses dynamics and lifts quiet speech clarity.
                    </span>
                  </div>
                  <Switch
                    checked={settings.voiceEnhance}
                    onChange={(v) => {
                      updateSettings({ voiceEnhance: v });
                      toast(`Voice enhancement ${v ? "enabled" : "disabled"}.`);
                    }}
                    label="Voice enhance"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Keep Screen Active While Recording
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Prevents the device display from locking during lectures.
                    </span>
                  </div>
                  <Switch
                    checked={settings.keepScreenAwake}
                    onChange={(v) => updateSettings({ keepScreenAwake: v })}
                    label="Keep screen awake"
                  />
                </div>
              </div>
            </Panel>
          )}

          {/* 2. TRANSCRIPTION & AI SECTION */}
          {activeSection === "transcription" && (
            <Panel tone="cream" className="p-5 flex flex-col gap-5">
              <SectionLabel icon={Wand2}>
                Transcription & Neural AI Engines
              </SectionLabel>

              <Field
                label="Primary Lecture Language"
                hint="Spoken language model applied to audio files."
              >
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                  className={INPUT}
                >
                  <option value="English (US)">English (United States)</option>
                  <option value="English (UK)">English (United Kingdom)</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                  <option value="German">Deutsch (German)</option>
                  <option value="Japanese">日本語 (Japanese)</option>
                </select>
              </Field>

              <Field
                label="AI Summary Depth"
                hint="Length and formatting of generated lecture overviews."
              >
                <select
                  value={settings.summaryLength}
                  onChange={(e) =>
                    updateSettings({
                      summaryLength: e.target.value as
                        | "short"
                        | "balanced"
                        | "detailed",
                    })
                  }
                  className={INPUT}
                >
                  <option value="short">
                    Short & Punchy (Key takeaways only)
                  </option>
                  <option value="balanced">
                    Balanced (Overview + Takeaways + Exam questions)
                  </option>
                  <option value="detailed">
                    Detailed (Comprehensive transcript outline)
                  </option>
                </select>
              </Field>

              <div className="flex flex-col gap-3 pt-2 border-t border-[#cdc4b3]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Automatic Transcription
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Begins transcribing as soon as an audio tape is saved.
                    </span>
                  </div>
                  <Switch
                    checked={settings.autoTranscribe}
                    onChange={(v) => updateSettings({ autoTranscribe: v })}
                    label="Auto transcribe"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Speaker Diarization
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Differentiates between lecturer and student questions.
                    </span>
                  </div>
                  <Switch
                    checked={settings.speakerLabels}
                    onChange={(v) => updateSettings({ speakerLabels: v })}
                    label="Speaker labels"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Auto-generate Study Flashcards
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Extracts question-and-answer flashcard decks on save.
                    </span>
                  </div>
                  <Switch
                    checked={settings.autoFlashcards}
                    onChange={(v) => updateSettings({ autoFlashcards: v })}
                    label="Auto flashcards"
                  />
                </div>
              </div>
            </Panel>
          )}

          {/* 3. STORAGE & VAULT SECTION */}
          {activeSection === "storage" && (
            <Panel tone="cream" className="p-5 flex flex-col gap-5">
              <SectionLabel icon={HardDrive}>
                Storage & Tape Archive Allocation
              </SectionLabel>

              <div className={`${INNER_CARD} p-4`}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span>Tape Archive Storage Used</span>
                  <span>24.2 GB / 60.0 GB</span>
                </div>
                <div className="w-full bg-[#cfc6b5] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#e0963a] h-full w-[40.3%] rounded-full" />
                </div>
                <p className="text-[11px] text-[#6b6455] mt-2">
                  18 Master tapes stored in local device cache.
                </p>
              </div>

              <Field label="Archive Retention Period">
                <select
                  value={settings.keepAudioDays}
                  onChange={(e) =>
                    updateSettings({
                      keepAudioDays: e.target.value as "30" | "90" | "forever",
                    })
                  }
                  className={INPUT}
                >
                  <option value="forever">Keep all audio files forever</option>
                  <option value="90">
                    Retain audio for 90 days (Transcripts kept forever)
                  </option>
                  <option value="30">Retain audio for 30 days</option>
                </select>
              </Field>

              <div className="flex flex-col gap-3 pt-2 border-t border-[#cdc4b3]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Encrypted Cloud Backup
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Sync tapes and study decks across mobile and desktop.
                    </span>
                  </div>
                  <Switch
                    checked={settings.cloudBackup}
                    onChange={(v) => {
                      updateSettings({ cloudBackup: v });
                      toast(`Cloud backup ${v ? "enabled" : "disabled"}.`);
                    }}
                    label="Cloud backup"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Wi-Fi Only Synchronization
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Pause uploads when on mobile cellular connections.
                    </span>
                  </div>
                  <Switch
                    checked={settings.wifiOnly}
                    onChange={(v) => updateSettings({ wifiOnly: v })}
                    label="Wi-Fi only"
                  />
                </div>
              </div>
            </Panel>
          )}

          {/* 4. ACCESSIBILITY & DISPLAY SECTION */}
          {activeSection === "appearance" && (
            <Panel tone="cream" className="p-5 flex flex-col gap-5">
              <SectionLabel icon={Palette}>
                Ergonomics & Accessibility
              </SectionLabel>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Display Name">
                  <input
                    value={settings.displayName}
                    onChange={(e) =>
                      updateSettings({ displayName: e.target.value })
                    }
                    className={INPUT}
                  />
                </Field>

                <Field label="Account Email">
                  <input
                    value={settings.email}
                    onChange={(e) => updateSettings({ email: e.target.value })}
                    className={INPUT}
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-3 pt-2 border-t border-[#cdc4b3]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      High Contrast Dial Plates
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Increases contrast ratio for bright daylight visibility.
                    </span>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onChange={(v) => {
                      updateSettings({ highContrast: v });
                      toast(
                        `High contrast ${v ? "activated" : "deactivated"}.`,
                      );
                    }}
                    label="High contrast"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Expanded Typography Scale
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Increases text size throughout transcripts and summaries.
                    </span>
                  </div>
                  <Switch
                    checked={settings.largeText}
                    onChange={(v) => {
                      updateSettings({ largeText: v });
                      toast(`Large text ${v ? "activated" : "deactivated"}.`);
                    }}
                    label="Large text"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#22201d] block">
                      Reduce Hardware Motions
                    </span>
                    <span className="text-[12px] text-[#5f594c] block">
                      Disables VU needle bounce and cassette rotation
                      animations.
                    </span>
                  </div>
                  <Switch
                    checked={settings.reduceMotion}
                    onChange={(v) => {
                      updateSettings({ reduceMotion: v });
                      toast(`Motion reduction ${v ? "enabled" : "disabled"}.`);
                    }}
                    label="Reduce motion"
                  />
                </div>
              </div>

              {/* Keyboard Shortcuts Table */}
              <div className="pt-2 border-t border-[#cdc4b3]">
                <SectionLabel icon={Keyboard}>
                  Console Keyboard Shortcuts
                </SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {[
                    { key: "Space", action: "Play / Pause" },
                    { key: "M", action: "Mark Moment" },
                    { key: "Ctrl + K", action: "Quick Search" },
                    { key: "Esc", action: "Dismiss Modal" },
                  ].map((sc) => (
                    <div
                      key={sc.key}
                      className={`${INNER_CARD} p-2 text-center`}
                    >
                      <kbd className="px-1.5 py-0.5 rounded border border-[#a89e8e] bg-[#e2dccf] font-mono text-[10px] font-bold">
                        {sc.key}
                      </kbd>
                      <span className="block text-[11px] text-[#4d473d] mt-1 font-medium">
                        {sc.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
