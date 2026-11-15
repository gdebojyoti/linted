// Copied from Ledger (themes/ledger/pdf/summary-section.tsx), so each Theme stays independent.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

import { Text } from "@react-pdf/renderer";
import { parseProse } from "@/lib/prose/parse-prose";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { SummarySection as StoredSummarySection } from "@/lib/resume/types";
import { ProseText } from "./prose-text";
import { SectionTitle } from "./section-title";
import { useMarginLook } from "./look";
import { SPACE_BETWEEN_PARAGRAPHS } from "./styles";

/**
 * A Summary: its title, then a paragraph per Entry, keeping the line breaks
 * the user typed. A long paragraph breaks across pages. The title and
 * paragraphs sit straight on the page, not in a box of their own: react-pdf
 * only keeps a title with what follows when something comes before it in
 * the same box.
 */
export function SummarySection({
  section,
  spaceBefore,
}: {
  section: Rendered<StoredSummarySection>;
  spaceBefore: number;
}) {
  const { twoLines } = useMarginLook();
  return (
    <>
      <SectionTitle title={section.title} spaceBefore={spaceBefore} keepWithNext={twoLines} />
      {section.entries.map((entry, i) => (
        <Text key={entry.id} style={{ marginTop: i === 0 ? 0 : SPACE_BETWEEN_PARAGRAPHS }}>
          <ProseText nodes={parseProse(entry.text)} />
        </Text>
      ))}
    </>
  );
}
