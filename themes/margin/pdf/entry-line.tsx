// Copied from Ledger (themes/ledger/pdf/entry-line.tsx), so each Theme stays independent.
// Changed for Margin: only the description below. The dates move below the
// main line when they don't fit beside it because of `styles.line` (./styles.ts).
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { styles } from "./styles";

/**
 * One line of an Entry: `strong` in bold (or in italic, for a Position's
 * role), then `rest` muted after `separator` (each only when filled), and
 * `meta` on the right, or below them when they don't fit side by side, as in
 * the narrow sidebar.
 */
export function EntryLine({
  strong,
  emphasis = "bold",
  rest,
  separator = "",
  meta,
}: {
  strong: string;
  emphasis?: "bold" | "italic";
  rest?: ReactNode;
  separator?: string;
  meta?: ReactNode;
}) {
  return (
    <View style={styles.line}>
      <Text style={styles.lineMain}>
        {strong && <Text style={emphasis === "bold" ? styles.strong : styles.italic}>{strong}</Text>}
        {rest && (
          <Text style={styles.muted}>
            {strong && separator}
            {rest}
          </Text>
        )}
      </Text>
      {meta && <Text style={styles.meta}>{meta}</Text>}
    </View>
  );
}
