// Copied from Ledger (themes/ledger/pdf/custom-entry.tsx), so each Theme stays independent.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

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
  spaceAfter,
}: {
  entry: Rendered<StoredCustomEntry>;
  heading?: ReactNode;
  spaceAfter: number;
}) {
  return (
    <EntryBlock
      heading={heading}
      spaceAfter={spaceAfter}
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
