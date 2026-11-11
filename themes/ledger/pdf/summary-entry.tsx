import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { parseProse } from "@/lib/prose/parse-prose";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { SummaryEntry as StoredSummaryEntry } from "@/lib/resume/types";
import { ProseText } from "./prose-text";

/**
 * A Summary paragraph, keeping the line breaks the user typed. For a
 * Section's first Entry, `heading` is the Section's title, kept on the same
 * page.
 */
export function SummaryEntry({
  entry,
  heading,
}: {
  entry: Rendered<StoredSummaryEntry>;
  heading?: ReactNode;
}) {
  const paragraph = (
    <Text>
      <ProseText nodes={parseProse(entry.text)} />
    </Text>
  );
  if (!heading) return paragraph;
  return (
    <View wrap={false}>
      {heading}
      {paragraph}
    </View>
  );
}
