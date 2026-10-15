export interface CourseIconOption {
  id: string;
  label: string;
  category?: string;
}

export const COURSE_ICON_OPTIONS: CourseIconOption[] = [
  { id: "book", label: "Book / Humanities", category: "Humanities" },
  { id: "chart", label: "Analytics / Economics", category: "Business & Data" },
  {
    id: "brain",
    label: "Psychology / Neuroscience",
    category: "Life Sciences",
  },
  { id: "flask", label: "Chemistry / Biology", category: "Sciences" },
  { id: "landmark", label: "History / Architecture", category: "Humanities" },
  { id: "cpu", label: "Computer Science / Tech", category: "Technology" },
  { id: "pen", label: "Writing / Literature", category: "Arts & Letters" },
  { id: "leaf", label: "Ecology / Environment", category: "Sciences" },
  { id: "atom", label: "Physics / Fundamental", category: "Sciences" },
  { id: "scales", label: "Law / Philosophy / Ethics", category: "Humanities" },
  { id: "calculator", label: "Math / Statistics", category: "STEM" },
  {
    id: "globe",
    label: "Geography / Global Studies",
    category: "Social Sciences",
  },
  {
    id: "microscope",
    label: "Medical / Cellular Biology",
    category: "Life Sciences",
  },
  { id: "music", label: "Music / Audio Arts", category: "Arts" },
  { id: "palette", label: "Visual Arts / Design", category: "Arts" },
  { id: "academic-cap", label: "General Education", category: "General" },
  { id: "briefcase", label: "Business / Management", category: "Business" },
  { id: "heart", label: "Health & Anatomy", category: "Life Sciences" },
  { id: "bolt", label: "Energy & Engineering", category: "Engineering" },
  { id: "compass", label: "Exploration / Astronomy", category: "Sciences" },
  { id: "chat", label: "Linguistics & Comms", category: "Humanities" },
  { id: "film", label: "Media & Film Studies", category: "Arts" },
  { id: "folder", label: "Archive / Notes", category: "General" },
  { id: "collection", label: "All Subjects", category: "General" },
];

export const DEFAULT_COURSE_ICON_MAP: Record<string, string> = {
  "All Courses": "collection",
  "Economics 101": "chart",
  "Cognitive Psychology": "brain",
  "History 204": "landmark",
  "Human-Computer Interaction": "cpu",
  "Biology 102": "flask",
  "Literature & Writing": "pen",
  "Earth & Environmental Studies": "leaf",
  "General Notes": "folder",
};

interface CourseIconProps {
  icon?: string;
  className?: string;
}

export function CourseIcon({
  icon = "book",
  className = "w-4 h-4",
}: CourseIconProps) {
  switch (icon) {
    case "book":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      );

    case "chart":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21h18M5 21V12a1 1 0 011-1h2a1 1 0 011 1v9M11 21V7a1 1 0 011-1h2a1 1 0 011 1v14M17 21V3a1 1 0 011-1h2a1 1 0 011 1v18"
          />
        </svg>
      );

    case "brain":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.5 4a3.5 3.5 0 00-3.5 3.5c0 .34.05.67.14.98A4 4 0 004 12c0 1.7.9 3.2 2.25 3.8A3.5 3.5 0 009.5 20c.4 0 .78-.07 1.14-.2A3.5 3.5 0 0012 18.5a3.5 3.5 0 001.36 1.3c.36.13.74.2 1.14.2a3.5 3.5 0 003.25-4.2A4 4 0 0020 12a4 4 0 00-2.14-3.52c.09-.31.14-.64.14-.98A3.5 3.5 0 0014.5 4c-.7 0-1.35.21-1.9.57A3.48 3.48 0 0012 5.5a3.48 3.48 0 00-.6-.93A3.5 3.5 0 009.5 4z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12M8.5 10.5h.01M8.5 13.5h.01M15.5 10.5h.01M15.5 13.5h.01"
          />
        </svg>
      );

    case "flask":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 3h6M10 3v5.2a3 3 0 01-.6 1.8L5.2 16.5A2.5 2.5 0 007.2 21h9.6a2.5 2.5 0 002-4.5l-4.2-6.5a3 3 0 01-.6-1.8V3"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16h10" />
        </svg>
      );

    case "landmark":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21h18M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M12 3l9 5H3l9-5z"
          />
        </svg>
      );

    case "cpu":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            rx="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="9"
            y="9"
            width="6"
            height="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3M19 9h3m-3 6h3"
          />
        </svg>
      );

    case "pen":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
          />
        </svg>
      );

    case "leaf":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 4c-5.5 0-10 2.5-12.5 7A11 11 0 004 20c3.5-1 7-3.5 9-6.5 3-4.5 3-9.5 7-9.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16c2-2 4.5-4 8-6"
          />
        </svg>
      );

    case "atom":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="12" cy="12" r="2.5" />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.8"
            transform="rotate(30 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.8"
            transform="rotate(-30 12 12)"
          />
        </svg>
      );

    case "scales":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18M4 7l4 6H2l2-6zm12 0l4 6h-6l2-6zM3 7h18M8 21h8"
          />
        </svg>
      );

    case "calculator":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2m-8 4h2m4 0h2"
          />
        </svg>
      );

    case "globe":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 013.5 9 15 15 0 01-3.5 9 15 15 0 01-3.5-9 15 15 0 013.5-9z"
          />
        </svg>
      );

    case "microscope":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 21h12M12 21v-4M9 5l4-2 3 5-4 2-3-5zM11 9l-4 8h8"
          />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );

    case "music":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0zM9 9l12-2"
          />
        </svg>
      );

    case "palette":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3a9 9 0 00-9 9 9 9 0 009 9c.8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16a5 5 0 005-5c0-5-4-9-9-9z"
          />
          <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
          <circle cx="16.5" cy="10.5" r="1" fill="currentColor" />
        </svg>
      );

    case "academic-cap":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4L3 8.5 12 13l9-4.5L12 4z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.5 11.5v4.5c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.5M21 9v6"
          />
        </svg>
      );

    case "briefcase":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <rect
            x="3"
            y="7"
            width="18"
            height="13"
            rx="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M3 12h18"
          />
        </svg>
      );

    case "heart":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.8 7.2a5 5 0 00-7.1 0L12 8.9l-1.7-1.7a5 5 0 00-7.1 7.1l1.7 1.7L12 23.1l7.1-7.1 1.7-1.7a5 5 0 000-7.1z"
          />
        </svg>
      );

    case "bolt":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 2L3 14h8l-1 8 11-12h-8l1-8z"
          />
        </svg>
      );

    case "compass":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 8l-3 7-5 1 3-7 5-1z"
          />
        </svg>
      );

    case "chat":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.4-4 8-9 8a9.8 9.8 0 01-4.3-1L3 20l1.4-3.7A8.9 8.9 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z"
          />
        </svg>
      );

    case "film":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"
          />
        </svg>
      );

    case "folder":
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      );

    default:
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      );
  }
}

/**
 * Helper to resolve an icon identifier for a course name from a list of CourseItems or fallback map
 */
export function getCourseIconFromList(
  courses: Array<{ name: string; icon: string }> | undefined,
  courseName: string,
  fallback = "book",
): string {
  if (courseName === "All Courses") return "collection";
  if (courses) {
    const found = courses.find(
      (c) => c.name.toLowerCase() === courseName.toLowerCase(),
    );
    if (found?.icon) return found.icon;
  }
  return DEFAULT_COURSE_ICON_MAP[courseName] || fallback;
}
