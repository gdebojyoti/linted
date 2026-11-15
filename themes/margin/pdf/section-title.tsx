// Copied from Ledger (themes/ledger/pdf/section-title.tsx), so each Theme stays independent.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

import { Text } from "@react-pdf/renderer";
import { useMarginLook } from "./look";
import { styles } from "./styles";

/**
 * A Section's title over its rule. `keepWithNext` is how many pt of what
 * follows must fit on the same page, or the title moves to the next one.
 */
export function SectionTitle({
  title,
  spaceBefore = 0,
  keepWithNext,
}: {
  title: string;
  spaceBefore?: number;
  keepWithNext?: number;
}) {
  const { accent } = useMarginLook();
  return (
    <Text style={[styles.sectionTitle, { marginTop: spaceBefore, color: accent }]} minPresenceAhead={keepWithNext}>
      {title}
    </Text>
  );
}
