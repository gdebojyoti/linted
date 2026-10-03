import { useRef, useState, type ChangeEvent, type FocusEvent, type KeyboardEvent } from "react";

/**
 * Renaming something in place: `start` turns its name into a field with the
 * name selected. Enter or clicking away saves; Esc cancels. A blank name is
 * never saved: Enter does nothing, and clicking away puts the old name back.
 * After Enter or Esc, focus goes back to the button that started it
 * (`buttonRef`).
 *
 * `draft` is null while not renaming. Spread `inputProps` on the field.
 */
export function useInlineRename(name: string, onRename: (name: string) => void) {
  const [draft, setDraft] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  /** Set once Enter, Esc or a blur ends the edit, so a blur as the field goes away can't save again. */
  const finishedRef = useRef(false);
  const blank = draft !== null && draft.trim() === "";

  function start() {
    finishedRef.current = false;
    setDraft(name);
  }

  function finish({ save, refocus }: { save: boolean; refocus: boolean }) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (save && draft !== null && draft.trim() !== "") onRename(draft);
    setDraft(null);
    if (refocus) requestAnimationFrame(() => buttonRef.current?.focus());
  }

  return {
    draft,
    start,
    buttonRef,
    inputProps: {
      value: draft ?? "",
      onChange: (event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value),
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !blank) finish({ save: true, refocus: true });
        if (event.key === "Escape") finish({ save: false, refocus: true });
      },
      onBlur: () => finish({ save: true, refocus: false }),
      onFocus: (event: FocusEvent<HTMLInputElement>) => event.target.select(),
      autoFocus: true,
      "aria-invalid": blank || undefined,
    },
  };
}
