import Link from "next/link";
import { Copy, Download } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeTitleEditor } from "./resume-title-editor";

type TopBarProps =
  /** The Resume is being read: a skeleton for its title, and the buttons disabled. */
  | { status: "loading" }
  /** There's no Resume to show (not found, or storage blocked): no title and no buttons. */
  | { status: "missing" }
  | {
      status: "ready";
      resumeTitle: string;
      onRename: (title: string) => void;
      /** Gets the Duplicate button, so focus can return to it. */
      onDuplicate: (opener: HTMLElement) => void;
      onExport: () => void;
      /** Export prints the Theme's page, so it waits for the Theme to load. */
      canExport: boolean;
    };

/**
 * The editor's header bar. Kept separate from the Library's header, although
 * they look alike, because the two headers are expected to differ more over time.
 */
export function TopBar(props: TopBarProps) {
  const ready = props.status === "ready" ? props : null;

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-5">
      <Logo />

      <div className="h-5 w-px bg-line" />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px]">
        <Link href="/resume-builder" className="text-ink-muted hover:text-ink">
          Resumes
        </Link>
        {props.status !== "missing" && (
          <>
            <span className="text-ink-disabled">/</span>
            {ready ? (
              <ResumeTitleEditor title={ready.resumeTitle} onRename={ready.onRename} />
            ) : (
              <Skeleton className="h-4 w-40" />
            )}
          </>
        )}
      </nav>

      <div className="grow" />

      {props.status !== "missing" && (
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="lg"
            disabled={!ready}
            onClick={(event) => ready?.onDuplicate(event.currentTarget)}
          >
            <Copy aria-hidden="true" />
            Duplicate
          </Button>
          <Button size="lg" disabled={!ready?.canExport} onClick={() => ready?.onExport()}>
            <Download aria-hidden="true" />
            Export PDF
          </Button>
        </div>
      )}
    </header>
  );
}
