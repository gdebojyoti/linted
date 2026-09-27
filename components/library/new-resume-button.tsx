import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Creates a Resume. Disabled while one is being created, so a double click makes only one. */
export function NewResumeButton({
  size,
  creating,
  onCreate,
}: {
  size: "default" | "lg";
  creating: boolean;
  onCreate: () => void;
}) {
  return (
    <Button size={size} onClick={onCreate} disabled={creating}>
      <Plus aria-hidden="true" />
      New resume
    </Button>
  );
}
