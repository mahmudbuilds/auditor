"use client";

import type { LucideIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { ScrewHead } from "@/components/audiotap/ScrewHead";
import type { RecordingItem } from "@/types/recording";

/* ------------------------------------------------------------------ */
/* Surface tokens (lifted from the home page design)                  */
/* ------------------------------------------------------------------ */

export const CREAM_PANEL =
  "relative rounded-[6px] border border-[#b9b09f] bg-gradient-to-b from-[#e9e3d7] to-[#ddd6c7] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.12)]";
export const DARK_PANEL =
  "relative rounded-[6px] border border-[#2a2a2a] bg-gradient-to-b from-[#1a1a1a] to-[#101010] text-[#f3efe6] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)]";
export const INNER_CARD =
  "rounded-[5px] border border-[#bdb4a3] bg-[#ece6da] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]";
export const DARK_CARD =
  "rounded-[5px] border border-[#3a3a3a] bg-[#161616] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
export const INPUT =
  "h-11 w-full rounded-[5px] border border-[#bdb4a3] bg-[#f3eee4] px-3 text-[14px] text-[#22201d] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] outline-none placeholder:text-[#7a7365] focus:border-[#e0963a]";

export const MUTED = "text-[#5f594c]";

/* ------------------------------------------------------------------ */
/* Panel                                                              */
/* ------------------------------------------------------------------ */

export function Screws() {
  return (
    <>
      <ScrewHead
        className="absolute top-1.5 left-1.5 !h-2 !w-2"
        rotation={45}
      />
      <ScrewHead
        className="absolute top-1.5 right-1.5 !h-2 !w-2"
        rotation={45}
      />
      <ScrewHead
        className="absolute bottom-1.5 left-1.5 !h-2 !w-2"
        rotation={45}
      />
      <ScrewHead
        className="absolute right-1.5 bottom-1.5 !h-2 !w-2"
        rotation={45}
      />
    </>
  );
}

interface PanelProps extends ComponentProps<"section"> {
  tone?: "cream" | "dark";
  screws?: boolean;
}

export function Panel({
  tone = "cream",
  screws = true,
  className = "",
  children,
  ...rest
}: PanelProps) {
  return (
    <section
      className={`${tone === "dark" ? DARK_PANEL : CREAM_PANEL} p-4 pt-5 ${className}`}
      {...rest}
    >
      {screws && <Screws />}
      {children}
    </section>
  );
}

export function SectionLabel({
  icon: Icon,
  children,
  action,
  tone = "cream",
}: {
  icon?: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
  tone?: "cream" | "dark";
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2
        className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase ${
          tone === "dark" ? "text-[#a8a296]" : "text-[#2b2822]"
        }`}
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden />}
        {children}
      </h2>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold tracking-[0.18em] text-[#8a6a2a] uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[30px]">
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-1 max-w-xl text-[14px] ${MUTED}`}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                            */
/* ------------------------------------------------------------------ */

type Variant = "primary" | "dark" | "light" | "ghost" | "darkGhost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[#f3b45a] to-[#e0963a] text-[#1a1a1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.35)] hover:brightness-105",
  dark: "bg-[#1a1a1a] text-[#f3efe6] border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#2a2a2a]",
  light:
    "border border-[#a99f8e] bg-[#efe9de] text-[#22201d] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-[#e4ddd0]",
  ghost: "text-[#22201d] hover:bg-[#d3cbbb]",
  darkGhost:
    "border border-[#3a3a3a] bg-[#161616] text-[#f3efe6] hover:bg-[#222]",
  danger:
    "bg-gradient-to-b from-[#e0483f] to-[#c62820] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.4)] hover:brightness-105",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-[12px]",
  md: "h-11 px-4 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonClass(
  variant: Variant = "light",
  size: Size = "md",
  className = "",
) {
  return `inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-[5px] font-semibold whitespace-nowrap transition active:translate-y-px disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    // biome-ignore lint/a11y/useButtonType: type defaults to "button" above
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      {...rest}
    />
  );
}

export function LinkButton({
  variant,
  size,
  className,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}

/** The red "record" dot used on amber buttons. */
export function RecDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`h-4 w-4 shrink-0 rounded-full bg-[#c62820] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.35)] ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                       */
/* ------------------------------------------------------------------ */

export function IconTile({
  icon: Icon,
  className = "h-10 w-10",
  iconClass = "h-5 w-5",
}: {
  icon: LucideIcon;
  className?: string;
  iconClass?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[4px] border border-[#3a3a3a] bg-[#141414] ${className}`}
    >
      <Icon className={`${iconClass} text-[#f3efe6]`} aria-hidden />
    </span>
  );
}

const STATUS_STYLE: Record<RecordingItem["status"], string> = {
  ready: "bg-[#3aa55d]",
  processing: "bg-[#3b82d6]",
  recording: "bg-[#d6322b]",
};

export function StatusDot({ status }: { status: RecordingItem["status"] }) {
  return (
    <span
      aria-hidden
      className={`h-2 w-2 shrink-0 rounded-full ${STATUS_STYLE[status]} ${
        status === "processing" ? "rec-blink" : ""
      }`}
    />
  );
}

export function Chip({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-9 shrink-0 rounded-[4px] border px-3.5 text-[12px] font-medium transition ${
        active
          ? "border-black bg-[#1a1a1a] text-[#f3efe6]"
          : "border-[#b3a998] bg-[#ece6da] hover:bg-[#e2dccf]"
      }`}
    >
      {children}
    </button>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string; icon?: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`flex h-10 shrink-0 items-center gap-2 rounded-[5px] border px-4 text-[13px] font-medium transition ${
              active
                ? "border-black bg-[#1a1a1a] text-[#f3efe6] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                : "border-[#b3a998] bg-[#ece6da] hover:bg-[#e2dccf]"
            }`}
          >
            {Icon && (
              <Icon
                className={`h-4 w-4 ${active ? "text-[#f6ad3c]" : ""}`}
                aria-hidden
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
        checked
          ? "border-[#b9761f] bg-[#e0963a]"
          : "border-[#a99f8e] bg-[#cfc6b5]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-[#faf6ef] shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function Waveform({
  bars,
  progress = 0,
  className = "h-12",
  tone = "dark",
}: {
  bars: number[];
  progress?: number;
  className?: string;
  tone?: "dark" | "cream";
}) {
  const off = tone === "dark" ? "bg-[#4a463e]" : "bg-[#a99f8e]";
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden>
      {bars.map((b, i) => {
        const done = i / bars.length < progress;
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars
            key={i}
            className={`flex-1 rounded-full ${done ? "bg-[#f6ad3c]" : off}`}
            style={{ height: `${Math.max(10, b)}%` }}
          />
        );
      })}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <Icon
        className="h-14 w-14 text-[#8d8472]"
        strokeWidth={1.2}
        aria-hidden
      />
      <p className="mt-1 text-[16px] font-semibold">{title}</p>
      <p className={`max-w-sm text-[13px] ${MUTED}`}>{body}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/**
 * Stand-in for artwork. Drop the generated image over this later; the `slot`
 * name matches the prompt list handed over with the build.
 */
export function ImagePlaceholder({
  icon: Icon = ImageIcon,
  slot,
  label,
  className = "",
  tone = "cream",
}: {
  icon?: LucideIcon;
  slot: string;
  label: string;
  className?: string;
  tone?: "cream" | "dark";
}) {
  const palette =
    tone === "dark"
      ? "border-[#4a4a4a] bg-[#141414] text-[#d9d3c6]"
      : "border-[#a99f8e] bg-[#d8d0c0]/70 text-[#3a352c]";
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-4 rounded-[6px] border border-dashed ${palette} ${className}`}
    >
      <Icon
        className="h-24 w-24 sm:h-32 sm:w-32"
        strokeWidth={0.9}
        aria-hidden
      />
      <span className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-60">
        Image slot · {slot}
      </span>
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-[#2b2822]">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="text-[12px] font-medium text-[#b3261e]">
          {error}
        </span>
      ) : (
        hint && <span className={`text-[12px] ${MUTED}`}>{hint}</span>
      )}
    </label>
  );
}
