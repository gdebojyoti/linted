import Link from "next/link";
import { Copy, Download } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditorTabList } from "@/components/editor/tabs/editor-tab-list";
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
      /** False until the Theme has loaded, while there's nothing to export, and while exporting. */
      canExport: boolean;
      /** The PDF is being built; the button says so. */
      exporting: boolean;
    };

/**
 * The editor's header bar. Kept separate from the Library's header, although
 * they look alike, because the two headers are expected to differ more over time.
 *
 * When ready, it holds the Content · Layout · Theme tabs, so it must sit
 * inside the editor's Tabs. While loading, a skeleton keeps their place.
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

      <div className="flex grow justify-center">
        {ready ? <EditorTabList /> : props.status === "loading" && <Skeleton className="h-9 w-56 rounded-lg" />}
      </div>

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
            {ready?.exporting ? "Exporting…" : "Export PDF"}
          </Button>
        </div>
      )}
    </header>
  );
}
