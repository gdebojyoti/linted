import { Plus } from "lucide-react";
import type { Ref } from "react";
import { Button } from "@/components/ui/button";

/**
 * Opens the New resume dialog. The same size everywhere, matching the search
 * box's height. Disabled while a Resume is being created. Passes itself to
 * `onCreate`, so focus can return to it when the dialog closes; `ref` lets
 * the Library send focus here after a Resume is deleted.
 */
export function NewResumeButton({
  ref,
  creating,
  onCreate,
}: {
  ref?: Ref<HTMLButtonElement>;
  creating: boolean;
  onCreate: (opener: HTMLElement) => void;
}) {
  return (
    <Button ref={ref} size="lg" onClick={(event) => onCreate(event.currentTarget)} disabled={creating}>
      <Plus aria-hidden="true" />
      New resume
    </Button>
  );
}
