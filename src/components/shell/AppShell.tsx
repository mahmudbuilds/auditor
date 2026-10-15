"use client";

import {
  AudioLines,
  Bell,
  ChevronRight,
  FolderOpen,
  Home,
  Layers,
  type LucideIcon,
  MessageSquare,
  Mic,
  NotebookPen,
  Search,
  Settings,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { INNER_CARD, RecDot, Screws } from "@/components/ui/kit";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Extra path prefixes that should light this item up. */
  also?: string[];
}

const NAV: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Record", href: "/record", icon: Mic, also: ["/import"] },
  {
    label: "Library",
    href: "/library",
    icon: FolderOpen,
    also: ["/recordings", "/memos"],
  },
  { label: "Study", href: "/study", icon: Layers },
  { label: "AI Chat", href: "/chat", icon: MessageSquare },
  { label: "Notebook", href: "/notebook", icon: NotebookPen },
  { label: "Settings", href: "/settings", icon: Settings },
];

const MOBILE_NAV: NavItem[] = [NAV[0], NAV[2], NAV[1], NAV[3], NAV[4]];

function isActive(item: NavItem, pathname: string) {
  if (item.href === "/") return pathname === "/";
  return [item.href, ...(item.also ?? [])].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function NavList({
  pathname,
  variant,
}: {
  pathname: string;
  variant: "side" | "bottom";
}) {
  if (variant === "bottom") {
    return (
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {MOBILE_NAV.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          const isRecord = item.href === "/record";
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium"
              >
                {isRecord ? (
                  <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#101010] bg-gradient-to-b from-[#f3b45a] to-[#e0963a] shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                    <Icon className="h-5 w-5 text-[#1a1a1a]" aria-hidden />
                  </span>
                ) : (
                  <Icon
                    className={`h-5 w-5 ${active ? "text-[#f6ad3c]" : "text-[#a8a296]"}`}
                    aria-hidden
                  />
                )}
                <span className={active ? "text-[#f3efe6]" : "text-[#a8a296]"}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {NAV.map((item) => {
        const active = isActive(item, pathname);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-10 items-center gap-3 rounded-[5px] px-3 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-[#1a1a1a] text-[#f3efe6] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "hover:bg-[#d3cbbb]"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${active ? "text-[#f6ad3c]" : ""}`}
                aria-hidden
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** usePathname suspends on dynamic routes under Cache Components. */
function ActiveNavList({ variant }: { variant: "side" | "bottom" }) {
  const pathname = usePathname();
  return <NavList pathname={pathname} variant={variant} />;
}

function Nav({ variant }: { variant: "side" | "bottom" }) {
  return (
    <Suspense fallback={<NavList pathname="" variant={variant} />}>
      <ActiveNavList variant={variant} />
    </Suspense>
  );
}

function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(
          term ? `/library?q=${encodeURIComponent(term)}` : "/library",
        );
      }}
      className={`${INNER_CARD} flex h-10 w-full max-w-[380px] items-center gap-2 px-3`}
    >
      <Search className="h-4 w-4 shrink-0" aria-hidden />
      <input
        ref={ref}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search recordings"
        placeholder="Search recordings, notes…"
        className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#4d473d]"
      />
      <kbd className="hidden rounded-[3px] border border-[#a89e8e] bg-[#e2dccf] px-1.5 py-0.5 font-mono text-[10px] md:block">
        Ctrl K
      </kbd>
    </form>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { settings, toast } = useApp();
  const initial = (settings.displayName.trim()[0] ?? "M").toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      {/* ---------- top bar ---------- */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#b9b09f] bg-[#e4ddd0]/90 px-3 backdrop-blur sm:px-5">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="AUDIOTAP home"
        >
          <AudioLines className="h-6 w-6" strokeWidth={2.4} aria-hidden />
          <span className="text-[17px] font-bold tracking-[0.2em]">
            AUDIOTAP
          </span>
        </Link>
        <span className="ml-1 hidden border-l border-[#b3a998] pl-3 text-[10px] font-medium tracking-[0.18em] whitespace-nowrap text-[#3a352c] xl:block">
          RECORD · TRANSCRIBE · LEARN
        </span>
        <div className="flex flex-1 justify-end sm:justify-center lg:justify-end">
          <SearchBox />
        </div>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => toast("No new notifications.")}
          className="flex h-10 w-10 items-center justify-center rounded-[5px] hover:bg-[#d3cbbb]"
        >
          <Bell className="h-[18px] w-[18px]" aria-hidden />
        </button>
        <Link
          href="/settings"
          aria-label="Account and settings"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#141414] text-[13px] font-semibold text-[#f3efe6] ring-1 ring-[#b3a998]"
        >
          {initial}
        </Link>
      </header>

      <div className="flex flex-1">
        {/* ---------- sidebar ---------- */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[220px] shrink-0 p-3 lg:block">
          <div className="relative flex h-full flex-col gap-3 overflow-y-auto rounded-[6px] border border-[#b9b09f] bg-gradient-to-b from-[#e9e3d7] to-[#ddd6c7] p-3 pt-5 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(0,0,0,0.12)]">
            <Screws />
            <nav aria-label="Main">
              <Nav variant="side" />
            </nav>
            <div className="my-1 h-px bg-[#b9b09f]" />
            <p className="px-1 text-[11px] font-semibold text-[#3a352c]">
              Quick actions
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Start recording", href: "/record", icon: null },
                {
                  label: "Quick memo",
                  href: "/record/live?type=memo",
                  icon: Mic,
                },
                { label: "Import audio", href: "/import", icon: Upload },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className={`${INNER_CARD} flex h-10 items-center gap-2.5 px-3 text-[12px] font-medium transition hover:brightness-95`}
                >
                  {Icon ? (
                    <Icon className="h-4 w-4" aria-hidden />
                  ) : (
                    <RecDot className="!h-3.5 !w-3.5" />
                  )}
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              ))}
            </div>
            <div className="min-h-6 flex-1" />
            <div className="rounded-[6px] border border-[#a99f8e] bg-gradient-to-b from-[#d2cab9] to-[#c4bba8] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <p className="mb-2 text-[11px] leading-tight text-[#3a352c] italic">
                Small steps.
                <br />
                Big progress.
              </p>
              <div className="flex h-[46px] items-center justify-center gap-4 rounded-[4px] border border-black bg-[#1b1b1b] px-2">
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#d8d0c0] bg-[#2a2a2a]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d8d0c0]" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ---------- page ---------- */}
        <main className="min-w-0 flex-1 px-3 pt-5 pb-28 sm:px-5 lg:pt-4 lg:pr-5 lg:pb-8 lg:pl-0">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
      </div>

      {/* ---------- mobile tab bar ---------- */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#2a2a2a] bg-[#141414]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <Nav variant="bottom" />
      </nav>
    </div>
  );
}
