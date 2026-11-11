import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { CustomEntry as StoredCustomEntry } from "@/lib/resume/types";
import { EntryBlock } from "./entry-block";
import { EntryLine } from "./entry-line";

/**
 * "Idempotency at scale — GopherCon UK        14 Aug 2025"
 */
export function CustomEntry({
  entry,
  heading,
}: {
  entry: Rendered<StoredCustomEntry>;
  heading?: ReactNode;
}) {
  return (
    <EntryBlock
      heading={heading}
      lines={
        <EntryLine
          strong={entry.title}
          rest={entry.subtitle}
          separator=" — "
          meta={formatDateRange(entry.dates)}
        />
      }
      bullets={entry.bullets}
    />
  );
}
