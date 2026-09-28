import type { ProseNode } from "@/lib/prose/parse-prose";
import styles from "./ledger.module.css";
import { TextLink } from "./text-link";

/** Draws parsed Prose: bold, italic and links, with everything else as text. */
export function ProseText({ nodes }: { nodes: ProseNode[] }) {
  return nodes.map((node, i) => {
    switch (node.type) {
      case "text":
        return node.text;
      case "bold":
        return (
          <strong key={i} className={styles.strong}>
            <ProseText nodes={node.children} />
          </strong>
        );
      case "italic":
        return (
          <em key={i}>
            <ProseText nodes={node.children} />
          </em>
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
