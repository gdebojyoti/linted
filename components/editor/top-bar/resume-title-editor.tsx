import { Pencil } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";

/**
 * The Resume Title in the top bar, renamed in place. The pencil button, or a
 * click on the title, turns it into a field with the title selected. Enter
 * or clicking away saves; Esc cancels. A blank title is never saved: Enter
 * does nothing, and clicking away puts the old title back.
 *
 * The title itself is left out of the tab order, so keyboard users reach
 * renaming once, through the pencil button, which gets focus back after
 * Enter or Esc.
 */
export function ResumeTitleEditor({ title, onRename }: { title: string; onRename: (title: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const pencilRef = useRef<HTMLButtonElement>(null);
  /** Set once Enter, Esc or a blur ends the edit, so a blur as the field goes away can't save again. */
  const finishedRef = useRef(false);
  const blank = draft !== null && draft.trim() === "";

  function start() {
    finishedRef.current = false;
    setDraft(title);
  }

  function finish({ save, refocus }: { save: boolean; refocus: boolean }) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (save && draft !== null && draft.trim() !== "") onRename(draft);
    setDraft(null);
    if (refocus) requestAnimationFrame(() => pencilRef.current?.focus());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !blank) finish({ save: true, refocus: true });
    if (event.key === "Escape") finish({ save: false, refocus: true });
  }

  if (draft !== null) {
    return (
      <input
        aria-label="Resume title"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => finish({ save: true, refocus: false })}
        onFocus={(event) => event.target.select()}
        autoFocus
        aria-invalid={blank || undefined}
        className="h-7 w-72 rounded-md border border-accent bg-surface px-2 text-[13px] font-semibold text-ink ring-3 ring-accent-tint outline-none aria-invalid:border-danger"
      />
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button type="button" tabIndex={-1} onClick={start} className="font-semibold">
        {title}
      </button>
      <Button
        ref={pencilRef}
        variant="ghost"
        size="icon-sm"
        aria-label="Rename resume"
        onClick={start}
        className="text-ink-muted"
      >
        <Pencil aria-hidden="true" className="size-3.5" />
      </Button>
    </span>
  );
}
