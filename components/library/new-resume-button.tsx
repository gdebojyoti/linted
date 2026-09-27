import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Creates a Resume. The same size everywhere, matching the search box's
 * height. Disabled while one is being created, so a double click makes only one.
 */
export function NewResumeButton({ creating, onCreate }: { creating: boolean; onCreate: () => void }) {
  return (
    <Button size="lg" onClick={onCreate} disabled={creating}>
      <Plus aria-hidden="true" />
      New resume
    </Button>
  );
}
