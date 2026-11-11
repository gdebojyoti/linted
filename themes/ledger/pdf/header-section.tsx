import { Text, View } from "@react-pdf/renderer";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { HeaderSection as StoredHeaderSection } from "@/lib/resume/types";
import { ContactEntry } from "./contact-entry";
import { styles } from "./styles";

/** The name, headline and contact line, kept together on one page. */
export function HeaderSection({
  header,
  spaceBefore,
}: {
  header: Rendered<StoredHeaderSection>;
  spaceBefore: number;
}) {
  return (
    <View style={[styles.header, { marginTop: spaceBefore }]} wrap={false}>
      {header.name && <Text style={styles.name}>{header.name}</Text>}
      {header.headline && <Text style={styles.headline}>{header.headline}</Text>}
      {header.entries.length > 0 && (
        <View style={styles.contacts}>
          {header.entries.map((entry) => (
            <Text key={entry.id}>
              <ContactEntry entry={entry} />
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
