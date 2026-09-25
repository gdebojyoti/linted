import type { ReactNode } from "react";
import { linkHref } from "@/lib/format/link-href";
import styles from "./ledger.module.css";

/** A link in the accent colour, or plain text when the URL is missing or unsafe. */
export function TextLink({ url, children }: { url: string; children: ReactNode }) {
  const href = linkHref(url);
  if (!href) return <>{children}</>;
  return (
    <a className={styles.link} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
