import { Plus } from "lucide-react";
import type { Ref } from "react";
import { Button } from "@/components/ui/button";

/**
 * Opens the New resume dialog. `lg` on desktop, matching the search box's
 * height; `xl` (48px) on mobile. Disabled while a Resume is being created. Passes itself to
 * `onCreate`, so focus can return to it when the dialog closes; `ref` lets
 * the Library send focus here after a Resume is deleted.
 */
export function NewResumeButton({
  ref,
  creating,
  onCreate,
  size = "lg",
  className,
}: {
  ref?: Ref<HTMLButtonElement>;
  creating: boolean;
  onCreate: (opener: HTMLElement) => void;
  size?: "lg" | "xl";
  className?: string;
}) {
  return (
    <Button
      ref={ref}
      size={size}
      onClick={(event) => onCreate(event.currentTarget)}
      disabled={creating}
      className={className}
    >
      <Plus aria-hidden="true" />
      New resume
    </Button>
  );
}
