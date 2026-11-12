import { Text } from "@react-pdf/renderer";
import { useLedgerLook } from "./look";
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
  const { accent } = useLedgerLook();
  return (
    <Text style={[styles.sectionTitle, { marginTop: spaceBefore, color: accent }]} minPresenceAhead={keepWithNext}>
      {title}
    </Text>
  );
}
