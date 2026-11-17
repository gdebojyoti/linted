import type { Ref } from "react";
import { NewResumeButton } from "@/components/library/new-resume-button";
import { StorageNote } from "@/components/library/storage-note";
import { StackedPages } from "./stacked-pages";

/** What the Library shows before the user has any Resumes. */
export function EmptyLibrary({
  creating,
  onCreate,
  newResumeRef,
}: {
  creating: boolean;
  onCreate: (opener: HTMLElement) => void;
  newResumeRef: Ref<HTMLButtonElement>;
}) {
  return (
    <main className="flex grow items-center justify-center px-6 pb-8">
      <div className="flex w-130 max-w-full flex-col items-center gap-5 text-center">
        <StackedPages />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-[26px]">No resumes yet</h1>
          <p className="text-[15px] leading-relaxed text-ink-muted md:text-sm">
            Start a resume and fill in only what you want. Keep several for different roles, and
            choose what each one includes.
          </p>
        </div>
        {/* xl on mobile; back to lg's height, padding and text from md up. */}
        <NewResumeButton
          ref={newResumeRef}
          creating={creating}
          onCreate={onCreate}
          size="xl"
          className="md:h-9 md:gap-1.5 md:rounded-lg md:px-2.5 md:text-sm"
        />
        {/* Boxed on desktop; plain on mobile. */}
        <StorageNote className="mt-1 text-left leading-normal md:mt-3 md:rounded-lg md:border md:border-line md:bg-surface md:px-3.5 md:py-3 md:leading-snug" />
      </div>
    </main>
  );
}
