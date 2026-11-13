import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { ExperienceEntry as StoredExperienceEntry } from "@/lib/resume/types";
import { joinMeta } from "@/themes/ledger/join-meta";
import { EntryBlock } from "./entry-block";
import { EntryLine } from "./entry-line";

/**
 * "Senior Backend Engineer, Paystream        London · Mar 2022 – Present"
 */
export function ExperienceEntry({
  entry,
  heading,
  spaceAfter,
}: {
  entry: Rendered<StoredExperienceEntry>;
  heading?: ReactNode;
  spaceAfter: number;
}) {
  return (
    <EntryBlock
      heading={heading}
      spaceAfter={spaceAfter}
      lines={
        <EntryLine
          strong={entry.role}
          rest={entry.company}
          separator=", "
          meta={joinMeta(entry.location, formatDateRange(entry.dates))}
        />
      }
      bullets={entry.bullets}
    />
  );
}
