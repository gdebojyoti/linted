import { Link } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { linkHref } from "@/lib/format/link-href";
import { styles } from "./styles";

/**
 * A clickable link in the accent colour, or plain text when the URL is
 * missing or unsafe. Drawn inside a `<Text>`.
 */
export function TextLink({ url, children }: { url: string; children: ReactNode }) {
  const href = linkHref(url);
  if (!href) return <>{children}</>;
  return (
    <Link src={href} style={styles.link}>
      {children}
    </Link>
  );
}
