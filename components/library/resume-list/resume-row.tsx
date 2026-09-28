import Link from "next/link";
import { Copy, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDay, formatLastEdited } from "@/lib/format/timestamp";
import { sectionSummary } from "@/lib/resume/section-summary";
import type { Resume } from "@/lib/resume/types";
import { themeName } from "@/lib/theme/theme-name";
import { ResumeThumbnail } from "./resume-thumbnail";
import { LIBRARY_COLUMNS } from "./utils";

/**
 * One Resume in the Library. Clicking anywhere on the row opens it in the
 * editor: the title's link stretches over the whole row. Duplicate passes
 * itself along, so focus can return to it. The "…" menu is shown but
 * disabled until #11 and #13 build Rename and Delete.
 */
export function ResumeRow({
  resume,
  now,
  onDuplicate,
}: {
  resume: Resume;
  now: Date;
  onDuplicate: (resume: Resume, opener: HTMLElement) => void;
}) {
  const { id, title, lastEditedAt, createdAt } = resume.metadata;

  return (
    <li
      className={`${LIBRARY_COLUMNS} relative min-h-15 border-b border-line-soft pr-3 pl-5 last:border-b-0 hover:bg-app`}
    >
      <Link
        href={`/resume-builder/resumes/${id}`}
        className="flex min-w-0 items-center gap-3 py-3 text-ink outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
      >
        <ResumeThumbnail />
        <span className="flex min-w-0 flex-col gap-0.75">
          <span className="truncate text-sm font-medium">{title}</span>
          <span className="text-[11.5px] text-ink-meta">
            {themeName(resume.themeSettings.themeId)} · {sectionSummary(resume)}
          </span>
        </span>
      </Link>
      {/* The column headings sit apart from the rows, so screen readers get each label here. */}
      <span className="text-[13px] text-ink">
        <span className="sr-only">Last edited </span>
        {formatLastEdited(lastEditedAt, now)}
      </span>
      <span className="text-[13px] text-ink-muted">
        <span className="sr-only">Created </span>
        {formatDay(createdAt)}
      </span>
      {/* Above the stretched link, so a click on a button never opens the Resume. */}
      <div className="relative z-10 flex justify-end gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Duplicate ${title}`}
          onClick={(event) => onDuplicate(resume, event.currentTarget)}
        >
          <Copy aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" disabled aria-label={`More actions for ${title}`}>
          <Ellipsis aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
