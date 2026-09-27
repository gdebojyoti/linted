import { Info } from "lucide-react";

/**
 * Tells the user their Resumes live only in this browser (ADR 0002), because
 * clearing site data deletes them. `className` sets the surrounding look,
 * which differs between the empty state and the list.
 */
export function StorageNote({ className }: { className?: string }) {
  return (
    <p className={`flex gap-2.5 text-[12.5px] text-ink-muted ${className ?? ""}`}>
      <Info className="mt-px size-4 shrink-0" aria-hidden="true" />
      No account needed. Your resumes are saved in this browser only, so clearing site data or
      switching browser / device will not bring them with you.
    </p>
  );
}
