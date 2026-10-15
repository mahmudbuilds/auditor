"use client";

import {
  FolderOpen,
  LayoutGrid,
  List,
  Mic,
  Search,
  Upload,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import {
  RecordingCards,
  RecordingTable,
} from "@/components/recordings/RecordingList";
import {
  Button,
  Chip,
  EmptyState,
  INPUT,
  LinkButton,
  PageHeader,
  Panel,
  RecDot,
} from "@/components/ui/kit";
import {
  FILTERS,
  type FilterName,
  filterRecordings,
  SORTS,
  type SortName,
} from "@/lib/browse";

interface BrowserProps {
  initialQuery: string;
  /** Locks the type filter (used by the Voice memos page). */
  fixedFilter?: FilterName;
  title: string;
  subtitle: string;
}

function Browser({ initialQuery, fixedFilter, title, subtitle }: BrowserProps) {
  const { recordings } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<FilterName>(fixedFilter ?? "All");
  const [sort, setSort] = useState<SortName>("newest");
  const [course, setCourse] = useState("All courses");
  const [view, setView] = useState<"list" | "grid">("list");

  const courses = [
    "All courses",
    ...Array.from(new Set(recordings.map((r) => r.course))).sort(),
  ];
  const activeFilter = fixedFilter ?? filter;
  const results = filterRecordings(recordings, {
    filter: activeFilter,
    query,
    course,
    sort,
  });
  const isMemos = fixedFilter === "Memos";

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <LinkButton href="/import" variant="light">
              <Upload className="h-4 w-4" aria-hidden /> Import
            </LinkButton>
            <LinkButton
              href={isMemos ? "/record/live?type=memo" : "/record"}
              variant="primary"
            >
              <RecDot className="!h-3.5 !w-3.5" />
              {isMemos ? "New memo" : "New recording"}
            </LinkButton>
          </>
        }
      />

      <Panel>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="relative min-w-[200px] flex-1 sm:max-w-sm">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search the library"
              placeholder="Search titles, speakers or transcripts…"
              className={`${INPUT} pl-9`}
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortName)}
            aria-label="Sort recordings"
            className={`${INPUT} w-auto`}
          >
            {Object.entries(SORTS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            aria-label="Filter by course"
            className={`${INPUT} w-auto max-w-[220px]`}
          >
            {courses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="ml-auto flex gap-1" role="group" aria-label="View">
            <Button
              variant={view === "list" ? "dark" : "light"}
              size="sm"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className="!w-10 !px-0"
            >
              <List className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              variant={view === "grid" ? "dark" : "light"}
              size="sm"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className="!w-10 !px-0"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>

        {!fixedFilter && (
          <div className="mb-3 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Chip>
            ))}
          </div>
        )}

        <p className="mb-2 text-[12px] text-[#5f594c]" aria-live="polite">
          {results.length} {results.length === 1 ? "recording" : "recordings"}
        </p>

        {results.length === 0 ? (
          <div className="rounded-[5px] border border-[#bdb4a3] bg-[#efe9de]">
            <EmptyState
              icon={isMemos ? Mic : FolderOpen}
              title={
                query || course !== "All courses"
                  ? "Nothing matches those filters"
                  : activeFilter === "Imported"
                    ? "No imported audio yet"
                    : "No recordings here yet"
              }
              body={
                query || course !== "All courses"
                  ? "Try a different search term or clear the course filter."
                  : "Record something or import an audio file to get started."
              }
              action={
                <LinkButton
                  href={activeFilter === "Imported" ? "/import" : "/record"}
                  variant="primary"
                >
                  {activeFilter === "Imported"
                    ? "Import audio"
                    : "Start recording"}
                </LinkButton>
              }
            />
          </div>
        ) : view === "list" ? (
          <RecordingTable recs={results} deletable />
        ) : (
          <RecordingCards recs={results} />
        )}
      </Panel>
    </>
  );
}

function WithQuery(props: Omit<BrowserProps, "initialQuery">) {
  const q = useSearchParams().get("q") ?? "";
  // Re-key so a new header search replaces the field instead of being ignored.
  return <Browser key={q} initialQuery={q} {...props} />;
}

export function LibraryBrowser(props: Omit<BrowserProps, "initialQuery">) {
  return (
    <Suspense fallback={<Browser initialQuery="" {...props} />}>
      <WithQuery {...props} />
    </Suspense>
  );
}
