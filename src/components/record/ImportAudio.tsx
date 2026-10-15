"use client";

import { FileAudio, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Field, INPUT, PageHeader, Panel } from "@/components/ui/kit";
import { makeRecording } from "@/lib/create";
import { KIND_META, type RecordKind } from "@/lib/format";

function readDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const done = (n: number) => {
      URL.revokeObjectURL(url);
      resolve(n);
    };
    audio.preload = "metadata";
    audio.onloadedmetadata = () =>
      done(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.onerror = () => done(0);
    audio.src = url;
  });
}

function size(bytes: number) {
  return bytes > 1_048_576
    ? `${(bytes / 1_048_576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ImportAudio() {
  const router = useRouter();
  const { addRecording, toast } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<RecordKind>("lecture");
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (
      !f.type.startsWith("audio/") &&
      !/\.(mp3|m4a|wav|ogg|flac|aac|webm)$/i.test(f.name)
    ) {
      setError(
        "That doesn't look like an audio file. Try MP3, M4A, WAV or OGG.",
      );
      return;
    }
    setError(null);
    setFile(f);
    setTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const submit = async () => {
    if (!file) return;
    setBusy(true);
    const seconds = await readDuration(file);
    const rec = makeRecording({ kind, title, seconds, source: "imported" });
    addRecording(rec);
    toast("Audio imported.");
    router.push(`/record/saved?id=${rec.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Import"
        title="Import audio"
        subtitle="Bring in a lecture or memo you already recorded. We'll transcribe and summarise it."
      />
      <Panel className="p-5 pt-6">
        {!file ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              pick(e.dataTransfer.files[0]);
            }}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-[6px] border-2 border-dashed px-6 py-14 text-center transition ${
              over
                ? "border-[#e0963a] bg-[#f3eee4]"
                : "border-[#a99f8e] bg-[#e4ddd0] hover:bg-[#ece6da]"
            }`}
          >
            <Upload
              className="h-14 w-14 text-[#6b6455]"
              strokeWidth={1.2}
              aria-hidden
            />
            <span className="text-[16px] font-semibold">
              Drop an audio file here
            </span>
            <span className="text-[13px] text-[#5f594c]">
              or click to browse · MP3, M4A, WAV, OGG
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="audio/*,.mp3,.m4a,.wav,.ogg,.flac,.aac,.webm"
              className="sr-only"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </label>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-[5px] border border-[#bdb4a3] bg-[#ece6da] p-3">
              <FileAudio className="h-8 w-8 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold">
                  {file.name}
                </p>
                <p className="text-[12px] text-[#6b6455]">{size(file.size)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Remove file"
                onClick={() => setFile(null)}
                className="!w-9 !px-0"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
            <Field label="Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Type">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as RecordKind)}
                className={INPUT}
              >
                {(Object.keys(KIND_META) as RecordKind[]).map((k) => (
                  <option key={k} value={k}>
                    {KIND_META[k].label}
                  </option>
                ))}
              </select>
            </Field>
            <Button
              variant="primary"
              size="lg"
              onClick={submit}
              disabled={busy}
            >
              {busy ? "Importing…" : "Import & process"}
            </Button>
          </div>
        )}
        {error && (
          <p
            role="alert"
            className="mt-3 text-[13px] font-medium text-[#b3261e]"
          >
            {error}
          </p>
        )}
      </Panel>
    </div>
  );
}
