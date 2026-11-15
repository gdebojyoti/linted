import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { EducationEntry as StoredEducationEntry } from "@/lib/resume/types";
import { joinMeta } from "@/themes/margin/join-meta";
import { EntryBlock } from "./entry-block";
import { styles } from "./styles";

/**
 * "University of Manchester"
 * "BSc Computer Science"
 * "Manchester · 2013 – 2017 · First-class honours"
 *
 * Stacked, as in the design, so it fits the sidebar, in any Zone.
 */
export function EducationEntry({
  entry,
  heading,
  spaceAfter,
}: {
  entry: Rendered<StoredEducationEntry>;
  heading?: ReactNode;
  spaceAfter: number;
}) {
  const meta = joinMeta(entry.location, formatDateRange(entry.dates), entry.results);

  return (
    <EntryBlock
      heading={heading}
      spaceAfter={spaceAfter}
      lines={
        <View style={styles.educationLines}>
          {entry.institution && <Text style={styles.strong}>{entry.institution}</Text>}
          {entry.degree && <Text>{entry.degree}</Text>}
          {meta && <Text style={styles.meta}>{meta}</Text>}
        </View>
      }
      bullets={entry.bullets}
    />
  );
}
