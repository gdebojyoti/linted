import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { EducationEntry as StoredEducationEntry } from "@/lib/resume/types";
import { joinMeta } from "@/themes/ledger/join-meta";
import { EntryBlock } from "./entry-block";
import { EntryLine } from "./entry-line";

/**
 * "University of Manchester        Manchester · 2013 – 2017"
 * "BSc Computer Science            First-class honours"
 */
export function EducationEntry({
  entry,
  heading,
}: {
  entry: Rendered<StoredEducationEntry>;
  heading?: ReactNode;
}) {
  const firstLine = joinMeta(entry.location, formatDateRange(entry.dates));

  return (
    <EntryBlock
      heading={heading}
      lines={
        <>
          {(entry.institution || firstLine) && (
            <EntryLine strong={entry.institution} meta={firstLine} />
          )}
          {(entry.degree || entry.results) && (
            <EntryLine strong="" rest={entry.degree} meta={entry.results} />
          )}
        </>
      }
      bullets={entry.bullets}
    />
  );
}
