import { NewResumeButton } from "@/components/library/new-resume-button";
import { StorageNote } from "@/components/library/storage-note";
import { StackedPages } from "./stacked-pages";

/** What the Library shows before the user has any Resumes. */
export function EmptyLibrary({ creating, onCreate }: { creating: boolean; onCreate: () => void }) {
  return (
    <main className="flex grow items-center justify-center px-4 pb-14">
      <div className="flex w-[520px] max-w-full flex-col items-center gap-5 text-center">
        <StackedPages />
        <div className="flex flex-col gap-2">
          <h1 className="text-[26px] font-semibold tracking-tight">No resumes yet</h1>
          <p className="text-sm leading-relaxed text-ink-muted">
            Start a resume and fill in only what you want. Keep several for different roles, and
            choose what each one includes.
          </p>
        </div>
        <NewResumeButton creating={creating} onCreate={onCreate} />
        <StorageNote className="mt-3 rounded-lg border border-line bg-surface px-3.5 py-3 text-left leading-snug" />
      </div>
    </main>
  );
}
