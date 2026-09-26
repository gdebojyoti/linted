import Link from "next/link";

export function TopBar({ resumeTitle, onExport }: { resumeTitle: string; onExport: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-5">
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-sm bg-accent text-white">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12l5 5 9-10" />
          </svg>
        </div>
        <span className="text-[15px] font-semibold tracking-tight">linted</span>
      </div>

      <div className="h-5 w-px bg-line" />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px]">
        <Link href="/resume-builder" className="text-ink-muted hover:text-ink">
          Resumes
        </Link>
        <span className="text-ink-disabled">/</span>
        <span className="font-semibold">{resumeTitle}</span>
      </nav>

      <div className="grow" />

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex h-[34px] items-center gap-1.5 rounded-md border border-line bg-app px-3 text-[13px] font-medium text-ink-disabled disabled:cursor-not-allowed"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
          Duplicate
        </button>
        <button
          type="button"
          onClick={onExport}
          className="flex h-[34px] items-center gap-1.5 rounded-md border border-accent bg-accent px-3.5 text-[13px] font-medium text-white hover:border-accent-strong hover:bg-accent-strong"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4v11" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 20h14" />
          </svg>
          Export PDF
        </button>
      </div>
    </header>
  );
}
