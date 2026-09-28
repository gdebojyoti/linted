import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

/**
 * The Resume Title field and the dialog's footer. It starts with
 * `initialTitle` selected, so typing replaces it and Enter submits it as it
 * is. A title that's empty or only spaces can't be submitted.
 *
 * Mounted each time the dialog opens, so it always starts afresh.
 */
export function ResumeTitleForm({
  initialTitle,
  submitLabel,
  submitting,
  onSubmit,
}: {
  initialTitle: string;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (title: string) => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const canSubmit = title.trim() !== "" && !submitting;

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (canSubmit) onSubmit(title.trim());
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 px-6 pt-4 pb-6">
        <label className="flex flex-col gap-2 text-[13px] font-medium">
          Resume title
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-describedby={hintId}
            className="h-10 w-full rounded-md border border-line-input bg-surface px-3 text-sm font-normal text-ink focus:border-accent focus:ring-3 focus:ring-accent-tint focus:outline-none"
          />
        </label>
        <p id={hintId} className="text-[12.5px] leading-[1.45] text-ink-muted">
          Only you see this. It tells your resumes apart; it isn&apos;t the name printed on the page.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-b-2xl border-t border-line-soft bg-surface-soft py-3.5 pr-4 pl-6">
        <p className="grow text-[11.5px] text-ink-meta">You can change all of this later.</p>
        <DialogClose render={<Button variant="outline" size="lg" />}>Cancel</DialogClose>
        <Button type="submit" size="lg" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
