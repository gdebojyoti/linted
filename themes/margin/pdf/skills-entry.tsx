import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { SkillsEntry as StoredSkillsEntry } from "@/lib/resume/types";
import { styles } from "./styles";

/**
 * "Languages"
 * "Go, Python, SQL, TypeScript"
 *
 * The label above its list, so it fits the sidebar, in any Zone. For a
 * Section's first Entry, `heading` is the Section's title, kept on the same
 * page.
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
        {entry.label && <Text style={styles.skillsLabel}>{entry.label}</Text>}
        {entry.skills && <Text>{entry.skills}</Text>}
      </View>
    </View>
  );
}
