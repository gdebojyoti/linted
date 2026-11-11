import { Text } from "@react-pdf/renderer";
import type { ProseNode } from "@/lib/prose/parse-prose";
import { styles } from "./styles";
import { TextLink } from "./text-link";

/** Draws parsed Prose inside a `<Text>`: bold, italic and links, with everything else as text. */
export function ProseText({ nodes }: { nodes: ProseNode[] }) {
  return nodes.map((node, i) => {
    switch (node.type) {
      case "text":
        return node.text;
      case "bold":
        return (
          <Text key={i} style={styles.strong}>
            <ProseText nodes={node.children} />
          </Text>
        );
      case "italic":
        return (
          <Text key={i} style={styles.italic}>
            <ProseText nodes={node.children} />
          </Text>
        );
      case "link":
        return (
          <TextLink key={i} url={node.href}>
            <ProseText nodes={node.children} />
          </TextLink>
        );
    }
  });
}
