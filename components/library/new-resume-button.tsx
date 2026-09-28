import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Opens the New resume dialog. The same size everywhere, matching the search
 * box's height. Disabled while a Resume is being created. Passes itself to
 * `onCreate`, so focus can return to it when the dialog closes.
 */
export function NewResumeButton({ creating, onCreate }: { creating: boolean; onCreate: (opener: HTMLElement) => void }) {
  return (
    <Button size="lg" onClick={(event) => onCreate(event.currentTarget)} disabled={creating}>
      <Plus aria-hidden="true" />
      New resume
    </Button>
  );
}
