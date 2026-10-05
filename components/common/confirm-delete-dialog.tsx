import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Asks before something is deleted for good, such as a Resume or a Section.
 * Styled like the title dialog. Cancel and Esc leave it as it is; focus
 * starts on Cancel.
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  heading,
  message,
  action,
  deleting = false,
  onConfirm,
  returnFocusTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** e.g. "Delete resume?" */
  heading: string;
  /** Says what will be deleted, and that it can't be undone. */
  message: ReactNode;
  /** The red button's label, e.g. "Delete resume". */
  action: string;
  deleting?: boolean;
  onConfirm: () => void;
  /** Focused when the dialog closes: the "…" button, or another control once the deleted thing is gone. */
  returnFocusTo: () => HTMLElement | null;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        finalFocus={() => returnFocusTo()}
        className="block w-115 max-w-[calc(100%-2rem)] gap-0 rounded-2xl p-0 text-ink shadow-dialog ring-0 data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-115"
      >
        <div className="flex flex-col gap-2 px-6 pt-5 pb-6">
          <AlertDialogTitle className="text-lg leading-8 font-semibold tracking-[-0.01em]">{heading}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-ink-muted">{message}</AlertDialogDescription>
        </div>
        <div className="flex items-center justify-end gap-2 rounded-b-2xl border-t border-line-soft bg-surface-soft py-3.5 pr-4 pl-6">
          <AlertDialogCancel size="lg" disabled={deleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            size="lg"
            onClick={onConfirm}
            disabled={deleting}
            className="bg-danger text-white hover:bg-danger/90"
          >
            {action}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
