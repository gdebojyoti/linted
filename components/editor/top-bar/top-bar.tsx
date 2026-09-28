import Link from "next/link";
import { Copy, Download } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";

/**
 * The editor's header bar. Kept separate from the Library's header, although
 * they look alike, because the two headers are expected to differ more over time.
 */
export function TopBar({
  resumeTitle,
  onDuplicate,
  onExport,
}: {
  resumeTitle: string;
  /** Gets the Duplicate button, so focus can return to it. */
  onDuplicate: (opener: HTMLElement) => void;
  onExport: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-5">
      <Logo />

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
        <Button variant="outline" size="lg" onClick={(event) => onDuplicate(event.currentTarget)}>
          <Copy aria-hidden="true" />
          Duplicate
        </Button>
        <Button size="lg" onClick={onExport}>
          <Download aria-hidden="true" />
          Export PDF
        </Button>
      </div>
    </header>
  );
}
