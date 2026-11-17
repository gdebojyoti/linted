import Link from "next/link";
import { formatDay, formatEditedPhrase, formatLastEdited } from "@/lib/format/timestamp";
import { sectionSummary } from "@/lib/resume/section-summary";
import type { Resume } from "@/lib/resume/types";
import { themeName } from "@/lib/theme/theme-name";
import { ResumeThumbnail } from "./resume-thumbnail";
import { RowMenu } from "./row-menu";
import { RowSheet } from "./row-sheet";
import { LIBRARY_COLUMNS } from "./utils";

/**
 * One Resume in the Library. Clicking anywhere on the row opens it in the
 * editor: the title's link stretches over the whole row. Its "…" button
 * (Rename, Duplicate, Delete) opens a menu, or on mobile a sheet from the
 * bottom, and passes itself along, so focus can return to it.
 */
export function ResumeRow({
  resume,
  now,
  onRename,
  onDuplicate,
  onDelete,
}: {
  resume: Resume;
  now: Date;
  onRename: (resume: Resume, opener: HTMLElement) => void;
  onDuplicate: (resume: Resume, opener: HTMLElement) => void;
  onDelete: (resume: Resume, opener: HTMLElement) => void;
}) {
  const { id, title, lastEditedAt, createdAt } = resume.metadata;
  const edited = formatEditedPhrase(lastEditedAt, now);
  const actions = {
    title,
    onRename: (opener: HTMLElement) => onRename(resume, opener),
    onDuplicate: (opener: HTMLElement) => onDuplicate(resume, opener),
    onDelete: (opener: HTMLElement) => onDelete(resume, opener),
  };

  return (
    <li
      className={`${LIBRARY_COLUMNS} relative flex min-h-18 gap-1 border-b border-line-soft pr-1 pl-4 last:border-b-0 hover:bg-app md:min-h-15 md:gap-0 md:pr-3 md:pl-5`}
    >
      <Link
        href={`/resume-builder/resumes/${id}`}
        className="flex min-w-0 grow items-center gap-3 py-3 text-ink outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
      >
        <span className="max-md:hidden">
          <ResumeThumbnail />
        </span>
        <span className="flex min-w-0 flex-col gap-1 md:gap-0.75">
          <span className="truncate text-[15px] font-medium md:text-sm">{title}</span>
          <span className="text-[11.5px] text-ink-meta max-md:hidden">
            {themeName(resume.themeSettings.themeId)} · {sectionSummary(resume)}
          </span>
          {/* Mobile has no columns, so the last-edited time is on this line. */}
          <span className="text-[12.5px] text-ink-muted md:hidden">
            {edited} · <span className="text-[11.5px] text-ink-meta">{sectionSummary(resume)}</span>
          </span>
        </span>
      </Link>
      {/* The column headings sit apart from the rows, so screen readers get each label here. */}
      <span className="text-[13px] text-ink max-md:hidden">
        <span className="sr-only">Last edited </span>
        {formatLastEdited(lastEditedAt, now)}
      </span>
      <span className="text-[13px] text-ink-muted max-md:hidden">
        <span className="sr-only">Created </span>
        {formatDay(createdAt)}
      </span>
      {/* Above the stretched link, so a click on a button never opens the Resume. */}
      <div className="relative z-10 flex shrink-0 justify-end">
        <div className="max-md:hidden">
          <RowMenu {...actions} />
        </div>
        <div className="md:hidden">
          <RowSheet {...actions} edited={edited} />
        </div>
      </div>
    </li>
  );
}
