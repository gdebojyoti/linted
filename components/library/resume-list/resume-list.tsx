import { ArrowDown } from "lucide-react";
import { type Ref, useState } from "react";
import { formatLibraryCount } from "@/lib/format/library-count";
import { searchResumes } from "@/lib/resume/search-resumes";
import type { Resume } from "@/lib/resume/types";
import { NewResumeButton } from "@/components/library/new-resume-button";
import { StorageNote } from "@/components/library/storage-note";
import { NoMatches } from "./no-matches";
import { ResumeRow } from "./resume-row";
import { SearchBox } from "./search-box";
import { LIBRARY_COLUMNS } from "./utils";

/**
 * The Library's Resumes, the most recently edited first (already sorted by
 * the Library). `now` is when they were loaded, for the "Last edited" column.
 * The search box shows only the Resumes whose Resume Title contains what's
 * typed. It's kept while the list is read again after a rename or delete.
 */
export function ResumeList({
  resumes,
  now,
  creating,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
  newResumeRef,
}: {
  resumes: Resume[];
  now: Date;
  creating: boolean;
  onCreate: (opener: HTMLElement) => void;
  onRename: (resume: Resume, opener: HTMLElement) => void;
  onDuplicate: (resume: Resume, opener: HTMLElement) => void;
  onDelete: (resume: Resume, opener: HTMLElement) => void;
  newResumeRef: Ref<HTMLButtonElement>;
}) {
  const [query, setQuery] = useState("");
  const shown = searchResumes(resumes, query);

  return (
    <main className="flex grow justify-center px-16 pt-10 pb-10">
      <div className="flex w-280 max-w-full flex-col gap-5">
        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[26px] font-semibold tracking-tight">Library</h1>
            <span className="text-xs text-ink-meta" aria-live="polite">
              {formatLibraryCount(shown.length, resumes.length)} · most recently edited first
            </span>
          </div>
          <div className="grow" />
          <SearchBox query={query} onQueryChange={setQuery} />
          <NewResumeButton ref={newResumeRef} creating={creating} onCreate={onCreate} />
        </div>

        {shown.length === 0 ? (
          <NoMatches query={query} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div
              aria-hidden="true"
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
              {shown.map((resume) => (
                <ResumeRow
                  key={resume.metadata.id}
                  resume={resume}
                  now={now}
                  onRename={onRename}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          </div>
        )}

        <StorageNote />
      </div>
    </main>
  );
}
