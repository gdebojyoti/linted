import { X } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ResumeTitleForm } from "./resume-title-form";

/** The footer hint for dialogs that set a title the user may want to change later. */
export const CHANGE_LATER_HINT = "You can change the title later.";

/**
 * A dialog that asks for a Resume Title, e.g. before a new Resume is created.
 * The heading, button label and starting title come from the caller, so a
 * Duplicate can use it too. Esc, Cancel, the close button and a click outside
 * all close it without submitting.
 *
 * The close button comes after the form in the page, so the title field is
 * the first thing focused; it's placed in the header's corner.
 */
export function ResumeTitleDialog({
  open,
  onOpenChange,
  heading,
  submitLabel,
  footerHint,
  initialTitle,
  submitting,
  onSubmit,
  returnFocusTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heading: string;
  submitLabel: string;
  footerHint?: string;
  initialTitle: string;
  submitting: boolean;
  onSubmit: (title: string) => void;
  /** Focused when the dialog closes, usually the button that opened it. */
  returnFocusTo: RefObject<HTMLElement | null>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        finalFocus={returnFocusTo}
        showCloseButton={false}
        className="block w-115 max-w-[calc(100%-2rem)] gap-0 rounded-2xl p-0 text-ink shadow-dialog ring-0 sm:max-w-115"
      >
        <DialogTitle className="px-6 pt-5 text-lg leading-8 font-semibold tracking-[-0.01em]">{heading}</DialogTitle>
        <ResumeTitleForm
          initialTitle={initialTitle}
          submitLabel={submitLabel}
          footerHint={footerHint}
          submitting={submitting}
          onSubmit={onSubmit}
        />
        <DialogClose
          render={<Button variant="ghost" size="icon" className="absolute top-5 right-4 size-8 text-ink-muted" />}
        >
          <X aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
