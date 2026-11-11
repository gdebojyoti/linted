import { Text } from "@react-pdf/renderer";
import { styles } from "./styles";

/**
 * A Section's title over its rule. `spaceAfter` is the gap to what follows:
 * the title is drawn inside the Section's first unbreakable group, so it is
 * never left alone at the bottom of a page, and that group sets no gap of
 * its own before it.
 */
export function SectionTitle({ title, spaceAfter }: { title: string; spaceAfter: number }) {
  return <Text style={[styles.sectionTitle, { marginBottom: spaceAfter }]}>{title}</Text>;
}
