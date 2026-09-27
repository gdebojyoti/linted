import { Monitor } from "lucide-react";
import { Logo } from "@/components/common/logo";

/** The Library's header bar: the logo, the page name, and where Resumes are saved. */
export function LibraryHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-5">
      <Logo />
      <div className="h-5 w-px bg-line" />
      <span className="text-[13px] font-semibold">Library</span>
      <div className="grow" />
      <span className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Monitor className="size-3.5" aria-hidden="true" />
        Saved in this browser
      </span>
    </header>
  );
}
