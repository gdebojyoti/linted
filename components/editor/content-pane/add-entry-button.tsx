import type { ReactNode, Ref } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/** The button under a Section's Entries that adds one, e.g. "Add link". */
export function AddEntryButton({
  ref,
  onClick,
  children,
}: {
  ref?: Ref<HTMLButtonElement>;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button ref={ref} variant="outline" size="sm" onClick={onClick} className="self-start">
      <Plus aria-hidden="true" />
      {children}
    </Button>
  );
}
