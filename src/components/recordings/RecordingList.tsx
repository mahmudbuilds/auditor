"use client";

import { ChevronRight, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { IconTile, StatusDot, Waveform } from "@/components/ui/kit";
import { relativeDate, STATUS_LABEL, TYPE_META } from "@/lib/format";
import type { RecordingItem } from "@/types/recording";

const COLS = "md:grid-cols-[minmax(0,2.4fr)_110px_120px_90px_120px_76px]";

function StarButton({ rec }: { rec: RecordingItem }) {
  const { toggleStar } = useApp();
  return (
    <button
      type="button"
      aria-label={rec.isStarred ? "Remove star" : "Star recording"}
      aria-pressed={!!rec.isStarred}
      onClick={() => toggleStar(rec.id)}
      className="relative z-10 flex h-9 w-9 items-center justify-center rounded-[4px] hover:bg-[#d8d1c2]"
    >
      <Star
        className={`h-4 w-4 ${rec.isStarred ? "fill-[#e0963a] text-[#e0963a]" : "text-[#6b6455]"}`}
        aria-hidden
      />
    </button>
  );
}

function DeleteButton({ rec }: { rec: RecordingItem }) {
  const { deleteRecording, toast } = useApp();
  return (
    <button
      type="button"
      aria-label={`Delete ${rec.title}`}
      onClick={() => {
        if (window.confirm(`Delete "${rec.title}"? This can't be undone.`)) {
          deleteRecording(rec.id);
          toast("Recording deleted.");
        }
      }}
      className="relative z-10 flex h-9 w-9 items-center justify-center rounded-[4px] text-[#6b6455] hover:bg-[#d8d1c2] hover:text-[#b3261e]"
    >
      <Trash2 className="h-4 w-4" aria-hidden />
    </button>
  );
}

export function RecordingRow({
  rec,
  deletable = false,
}: {
  rec: RecordingItem;
  deletable?: boolean;
}) {
  const meta = TYPE_META[rec.type];
  return (
    <div
      className={`relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-b border-[#d6cdbd] px-3 py-2 text-[13px] transition last:border-b-0 hover:bg-[#e6e0d3] md:grid ${COLS}`}
    >
      <Link
        href={`/recordings/${rec.id}`}
        className="flex min-w-0 items-center gap-3 after:absolute after:inset-0 after:content-['']"
      >
        <IconTile
          icon={meta.icon}
          className="h-10 w-10"
          iconClass="h-[18px] w-[18px]"
        />
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-semibold">{rec.title}</span>
          <span className="block truncate text-[12px] text-[#6b6455]">
            <span className="md:hidden">
              {relativeDate(rec.date)} · {rec.duration} ·{" "}
              {STATUS_LABEL[rec.status]}
            </span>
            <span className="hidden md:inline">{rec.course}</span>
          </span>
        </span>
      </Link>
      <span className="hidden md:block">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d8d1c2] px-2.5 py-0.5 text-[12px]">
          <meta.icon className="h-3 w-3" aria-hidden />
          {meta.label}
        </span>
      </span>
      <span className="hidden md:block">{relativeDate(rec.date)}</span>
      <span className="hidden font-mono md:block">{rec.duration}</span>
      <span className="hidden items-center gap-2 md:flex">
        <StatusDot status={rec.status} />
        {STATUS_LABEL[rec.status]}
      </span>
      <span className="flex items-center justify-end">
        <StarButton rec={rec} />
        {deletable && <DeleteButton rec={rec} />}
        {!deletable && (
          <ChevronRight className="hidden h-4 w-4 md:block" aria-hidden />
        )}
      </span>
    </div>
  );
}

export function RecordingTable({
  recs,
  deletable,
}: {
  recs: RecordingItem[];
  deletable?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[5px] border border-[#bdb4a3] bg-[#efe9de]">
      <div
        className={`hidden border-b border-[#cdc4b3] px-3 py-2 text-[11px] font-semibold tracking-wide text-[#3a352c] uppercase md:grid md:gap-x-3 ${COLS}`}
      >
        <span>Title</span>
        <span>Type</span>
        <span>Date</span>
        <span>Duration</span>
        <span>Status</span>
        <span />
      </div>
      {recs.map((r) => (
        <RecordingRow key={r.id} rec={r} deletable={deletable} />
      ))}
    </div>
  );
}

export function RecordingCards({ recs }: { recs: RecordingItem[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {recs.map((rec) => {
        const meta = TYPE_META[rec.type];
        return (
          <li
            key={rec.id}
            className="relative rounded-[5px] border border-[#bdb4a3] bg-[#efe9de] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition hover:bg-[#e6e0d3]"
          >
            <div className="flex items-start gap-3">
              <IconTile icon={meta.icon} />
              <Link
                href={`/recordings/${rec.id}`}
                className="min-w-0 flex-1 leading-tight after:absolute after:inset-0 after:content-['']"
              >
                <span className="block truncate text-[14px] font-semibold">
                  {rec.title}
                </span>
                <span className="mt-0.5 block truncate text-[12px] text-[#6b6455]">
                  {rec.course}
                </span>
              </Link>
              <StarButton rec={rec} />
            </div>
            <Waveform
              bars={rec.waveform ?? [30, 50, 40, 60, 45, 35]}
              tone="cream"
              className="mt-3 h-10"
            />
            <p className="mt-2 flex items-center gap-2 text-[12px] text-[#4d473d]">
              <StatusDot status={rec.status} />
              {STATUS_LABEL[rec.status]} · {relativeDate(rec.date)} ·{" "}
              <span className="font-mono">{rec.duration}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
