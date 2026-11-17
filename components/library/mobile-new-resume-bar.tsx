import type { Ref } from "react";
import { NewResumeButton } from "./new-resume-button";

/**
 * On mobile, New resume sits in a bar stuck to the bottom of the screen,
 * below the list. Hidden from `md` up, where it's beside the search box.
 */
export function MobileNewResumeBar({
  creating,
  onCreate,
  newResumeRef,
}: {
  creating: boolean;
  onCreate: (opener: HTMLElement) => void;
  newResumeRef: Ref<HTMLButtonElement>;
}) {
  return (
    <div className="sticky bottom-0 border-t border-line bg-surface px-4 py-3 md:hidden">
      <NewResumeButton ref={newResumeRef} creating={creating} onCreate={onCreate} size="xl" className="w-full" />
    </div>
  );
}
