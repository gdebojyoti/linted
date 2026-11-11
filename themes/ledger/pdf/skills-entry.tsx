import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { SkillsEntry as StoredSkillsEntry } from "@/lib/resume/types";
import { styles } from "./styles";

/**
 * "Languages      Go, Python, SQL, TypeScript"
 *
 * For a Section's first Entry, `heading` is the Section's title, kept on the
 * same page.
 */
export function SkillsEntry({
  entry,
  heading,
}: {
  entry: Rendered<StoredSkillsEntry>;
  heading?: ReactNode;
}) {
  return (
    <View wrap={false}>
      {heading}
      <View style={styles.skillsEntry}>
        <Text style={styles.skillsLabel}>{entry.label}</Text>
        <Text style={styles.skillsList}>{entry.skills}</Text>
      </View>
    </View>
  );
}
