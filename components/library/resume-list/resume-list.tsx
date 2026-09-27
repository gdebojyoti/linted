import { ArrowDown } from "lucide-react";
import { formatCount } from "@/lib/format/count";
import type { Resume } from "@/lib/resume/types";
import { NewResumeButton } from "@/components/library/new-resume-button";
import { StorageNote } from "@/components/library/storage-note";
import { LIBRARY_COLUMNS, ResumeRow } from "./resume-row";
import { SearchBox } from "./search-box";

/**
 * The Library's Resumes, the most recently edited first (already sorted by
 * the Library). `now` is when they were loaded, for the "Last edited" column.
 */
export function ResumeList({
  resumes,
  now,
  creating,
  onCreate,
}: {
  resumes: Resume[];
  now: Date;
  creating: boolean;
  onCreate: () => void;
}) {
  return (
    <main className="flex grow justify-center px-16 pt-10 pb-10">
      <div className="flex w-[1120px] max-w-full flex-col gap-5">
        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[26px] font-semibold tracking-tight">Library</h1>
            <span className="text-xs text-ink-meta">
              {formatCount(resumes.length, "resume", "resumes")} · most recently edited first
            </span>
          </div>
          <div className="grow" />
          <SearchBox />
          <NewResumeButton size="default" creating={creating} onCreate={onCreate} />
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div
            className={`${LIBRARY_COLUMNS} h-10 border-b border-line-soft pr-3 pl-5 text-xs font-medium text-ink-muted`}
          >
            <span>Resume title</span>
            <span className="flex items-center gap-1 text-ink">
              Last edited
              <ArrowDown className="size-3" aria-hidden="true" />
            </span>
            <span>Created</span>
            <span />
          </div>
          <ul>
            {resumes.map((resume) => (
              <ResumeRow key={resume.metadata.id} resume={resume} now={now} />
            ))}
          </ul>
        </div>

        <StorageNote />
      </div>
    </main>
  );
}
