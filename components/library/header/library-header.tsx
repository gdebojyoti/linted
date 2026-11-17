import { Monitor } from "lucide-react";
import { Logo } from "@/components/common/logo";

/**
 * The Library's header bar: the logo, the page name, and where Resumes are
 * saved (the logo only, on mobile). Kept separate from the editor's TopBar, although they look alike,
 * because the two headers are expected to differ more over time.
 */
export function LibraryHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-4 md:px-5">
      <Logo />
      {/* On mobile, the logo only. */}
      <div className="h-5 w-px bg-line max-md:hidden" />
      <span className="text-[13px] font-semibold max-md:hidden">Library</span>
      <div className="grow" />
      <span className="flex items-center gap-1.5 text-xs text-ink-muted max-md:hidden">
        <Monitor className="size-3.5" aria-hidden="true" />
        Saved in this browser
      </span>
    </header>
  );
}
