import type { ReactNode } from "react";
import styles from "./ledger.module.css";

/**
 * One line of an Entry: `strong` in bold, then `rest` muted after `separator`
 * (each only when filled), and `meta` on the right.
 */
export function EntryLine({
  strong,
  rest,
  separator = "",
  meta,
}: {
  strong: string;
  rest?: ReactNode;
  separator?: string;
  meta?: ReactNode;
}) {
  return (
    <div className={styles.line}>
      <div>
        {strong && <span className={styles.strong}>{strong}</span>}
        {rest && (
          <span className={styles.muted}>
            {strong && separator}
            {rest}
          </span>
        )}
      </div>
      {meta && <div className={styles.meta}>{meta}</div>}
    </div>
  );
}
