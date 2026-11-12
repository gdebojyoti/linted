import { pdf, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

/** A react-pdf primitive ("VIEW", "TEXT", "LINK"…) with its style flattened into one object. */
export type Primitive = {
  type: string;
  props: Record<string, unknown>;
  style: Record<string, unknown>;
  children: PrimitiveNode[];
};

export type PrimitiveNode = Primitive | string;

/** A node as react-pdf builds it while rendering, before any layout. */
type RenderedNode = {
  type: string;
  value?: string;
  props?: Record<string, unknown>;
  style?: unknown;
  children?: RenderedNode[];
};

/**
 * Renders a Theme's Document with react-pdf, without laying it out, and gives
 * the primitives it drew, so tests can check what reading the PDF back can't:
 * colours, sizes, and which parts are kept together on a page. Hooks and
 * context work, as in a real render.
 */
export function primitiveTree(document: ReactElement<DocumentProps>): PrimitiveNode[] {
  const root = (pdf(document).container as { document: RenderedNode | null }).document;
  return root ? [toPrimitive(root)] : [];
}

function toPrimitive(node: RenderedNode): PrimitiveNode {
  if (node.type === "TEXT_INSTANCE") return node.value ?? "";
  return {
    type: node.type,
    props: node.props ?? {},
    style: flattenStyle(node.style),
    children: (node.children ?? []).map(toPrimitive),
  };
}

/** All the text inside a node, joined. */
export function textOf(node: PrimitiveNode): string {
  return typeof node === "string" ? node : node.children.map(textOf).join("");
}

/**
 * The primitives from a root down to the innermost one whose own text is
 * exactly `text`, or [] when none is. The last one is the match; the others
 * are its ancestors.
 */
export function pathTo(nodes: PrimitiveNode[], text: string): Primitive[] {
  for (const node of nodes) {
    if (typeof node === "string") continue;
    const inner = pathTo(node.children, text);
    if (inner.length > 0) return [node, ...inner];
    if (textOf(node) === text) return [node];
  }
  return [];
}

/** The innermost primitive whose text is exactly `text`. Throws when there is none. */
export function findByText(nodes: PrimitiveNode[], text: string): Primitive {
  const match = pathTo(nodes, text).at(-1);
  if (!match) throw new Error(`No primitive with the text "${text}"`);
  return match;
}

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flattenStyle));
  return style && typeof style === "object" ? { ...style } : {};
}
