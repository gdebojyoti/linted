import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { styles } from "./styles";

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
    <View style={styles.line}>
      <Text style={styles.lineMain}>
        {strong && <Text style={styles.strong}>{strong}</Text>}
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
