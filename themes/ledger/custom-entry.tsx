import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { CustomEntry as StoredCustomEntry } from "@/lib/resume/types";
import { BulletList } from "./bullet-list";
import { EntryLine } from "./entry-line";
import styles from "./ledger.module.css";

// "Idempotency at scale — GopherCon UK        14 Aug 2025"
export function CustomEntry({ entry }: { entry: Rendered<StoredCustomEntry> }) {
  return (
    <div className={styles.entry}>
      <EntryLine
        strong={entry.title}
        rest={entry.subtitle}
        separator=" — "
        meta={formatDateRange(entry.dates)}
      />
      <BulletList bullets={entry.bullets} />
    </div>
  );
}
