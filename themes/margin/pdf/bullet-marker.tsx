// Copied from Ledger (themes/ledger/pdf/bullet-marker.tsx), so each Theme stays independent.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

import { View } from "@react-pdf/renderer";
import { useMarginLook } from "./look";
import { styles } from "./styles";

/**
 * The dot before a Bullet: filled at the top level and hollow when nested,
 * like the web's disc and circle. Drawn as a shape, not a character, so it
 * never depends on the font having one.
 */
export function BulletMarker({ hollow }: { hollow: boolean }) {
  // As tall as a line of text, so the dot sits beside the first line.
  const { oneLine } = useMarginLook();
  return (
    <View style={[styles.bulletMarker, { height: oneLine }]}>
      <View style={hollow ? styles.bulletDotHollow : styles.bulletDot} />
    </View>
  );
}
