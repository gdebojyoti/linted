import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Asks before a Resume is deleted, since there's no way to get it back.
 * Styled like the title dialog. Cancel and Esc leave the Resume as it is.
 */
export function DeleteResumeDialog({
  open,
  onOpenChange,
  title,
  deleting,
  onConfirm,
  returnFocusTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The Resume Title, named in the message. */
  title: string;
  deleting: boolean;
  onConfirm: () => void;
  /** Focused when the dialog closes: the "…" button, or New resume once the row is gone. */
  returnFocusTo: () => HTMLElement | null;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        finalFocus={() => returnFocusTo()}
        className="block w-115 max-w-[calc(100%-2rem)] gap-0 rounded-2xl p-0 text-ink shadow-dialog ring-0 data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-115"
      >
        <div className="flex flex-col gap-2 px-6 pt-5 pb-6">
          <AlertDialogTitle className="text-lg leading-8 font-semibold tracking-[-0.01em]">Delete resume?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-ink-muted">
            &ldquo;{title}&rdquo; will be deleted from this browser. This can&apos;t be undone.
          </AlertDialogDescription>
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
            Delete resume
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
