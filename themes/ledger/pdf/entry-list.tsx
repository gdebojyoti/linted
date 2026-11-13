import { View } from "@react-pdf/renderer";
import type { ComponentType, ReactNode } from "react";
import { SectionTitle } from "./section-title";
import { SPACE_BETWEEN_ENTRIES, styles } from "./styles";

type Style = (typeof styles)[keyof typeof styles];

/**
 * A Section drawn as its title and a list of Entries. The title is handed to
 * the first Entry, which keeps it on the same page as its own first line.
 * Each Entry but the last is given the space to leave below it, which a
 * Skills Entry doesn't need: Skills rows are spaced by their Section's gap.
 */
export function EntryList<E extends { id: string }>({
  section,
  Entry,
  style = styles.entries,
  spaceBefore,
}: {
  section: { title: string; entries: E[] };
  Entry: ComponentType<{ entry: E; heading?: ReactNode; spaceAfter: number }>;
  style?: Style;
  spaceBefore: number;
}) {
  return (
    <View style={[style, { marginTop: spaceBefore }]}>
      {section.entries.map((entry, i) => (
        <Entry
          key={entry.id}
          entry={entry}
          heading={i === 0 ? <SectionTitle title={section.title} /> : undefined}
          spaceAfter={i < section.entries.length - 1 ? SPACE_BETWEEN_ENTRIES : 0}
        />
      ))}
    </View>
  );
}
