import { View } from "@react-pdf/renderer";
import type { ComponentType, ReactNode } from "react";
import { SectionTitle } from "./section-title";
import { styles } from "./styles";

type Style = (typeof styles)[keyof typeof styles];

/**
 * A Section drawn as its title and a list of Entries. The title is handed to
 * the first Entry, which keeps it on the same page as its own first line.
 */
export function EntryList<E extends { id: string }>({
  section,
  Entry,
  style = styles.entries,
  spaceBefore,
}: {
  section: { title: string; entries: E[] };
  Entry: ComponentType<{ entry: E; heading?: ReactNode }>;
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
        />
      ))}
    </View>
  );
}
