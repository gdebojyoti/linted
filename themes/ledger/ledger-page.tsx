import type { PlacedSections } from "@/lib/theme/place-sections";
import { ledgerFont } from "./font";
import { LedgerSection } from "./ledger-section";
import styles from "./ledger.module.css";

export function LedgerPage({ zones }: { zones: PlacedSections }) {
  return (
    <article aria-label="Resume page" className={`${styles.page} ${ledgerFont.className}`}>
      <div className={styles.zones}>
        {[...zones.header, ...zones.main].map((section) => (
          <LedgerSection key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
}
