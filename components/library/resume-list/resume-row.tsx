import Link from "next/link";
import { Copy, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDay, formatLastEdited } from "@/lib/format/timestamp";
import { sectionSummary } from "@/lib/resume/section-summary";
import type { Resume } from "@/lib/resume/types";
import { themeName } from "@/lib/theme/theme-name";
import { ResumeThumbnail } from "./resume-thumbnail";

/** The column widths every row and the list's column headings share. */
export const LIBRARY_COLUMNS = "grid grid-cols-[minmax(0,1fr)_190px_190px_112px] items-center";

/**
 * One Resume in the Library. Its title opens it in the editor. Duplicate and
 * the "…" menu are shown but disabled until #11–#13 build them.
 */
export function ResumeRow({ resume, now }: { resume: Resume; now: Date }) {
  const { id, title, lastEditedAt, createdAt } = resume.metadata;

  return (
    <li className={`${LIBRARY_COLUMNS} min-h-15 border-b border-line-soft pr-3 pl-5 last:border-b-0`}>
      <Link
        href={`/resume-builder/resumes/${id}`}
        className="flex min-w-0 items-center gap-3 py-3 text-ink hover:text-accent-strong"
      >
        <ResumeThumbnail />
        <span className="flex min-w-0 flex-col gap-0.75">
          <span className="truncate text-sm font-medium">{title}</span>
          <span className="text-[11.5px] text-ink-meta">
            {themeName(resume.themeSettings.themeId)} · {sectionSummary(resume)}
          </span>
        </span>
      </Link>
      <span className="text-[13px] text-ink">{formatLastEdited(lastEditedAt, now)}</span>
      <span className="text-[13px] text-ink-muted">{formatDay(createdAt)}</span>
      <div className="flex justify-end gap-0.5">
        <Button variant="ghost" size="icon" disabled aria-label={`Duplicate ${title}`}>
          <Copy aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" disabled aria-label={`More actions for ${title}`}>
          <Ellipsis aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
