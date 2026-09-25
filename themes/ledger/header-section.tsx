import type { Rendered } from "@/lib/resume/renderable-view";
import type { HeaderSection as StoredHeaderSection } from "@/lib/resume/types";
import { ContactEntry } from "./contact-entry";
import styles from "./ledger.module.css";

export function HeaderSection({ header }: { header: Rendered<StoredHeaderSection> }) {
  return (
    <header className={styles.header}>
      {header.name && <h1 className={styles.name}>{header.name}</h1>}
      {header.headline && <p className={styles.headline}>{header.headline}</p>}
      {header.entries.length > 0 && (
        <ul className={styles.contacts}>
          {header.entries.map((entry) => (
            <li key={entry.id}>
              <ContactEntry entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
