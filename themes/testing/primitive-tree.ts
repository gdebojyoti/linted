import { Fragment, isValidElement, type ReactElement, type ReactNode } from "react";

/** A react-pdf primitive ("VIEW", "TEXT", "LINK"…) with its style flattened into one object. */
export type Primitive = {
  type: string;
  props: Record<string, unknown>;
  style: Record<string, unknown>;
  children: PrimitiveNode[];
};

export type PrimitiveNode = Primitive | string;

/**
 * Expands a Theme's components into the react-pdf primitives they draw, so
 * tests can check what reading the PDF back can't: colours, sizes, and which
 * parts are kept together on a page. Theme components are plain functions of
 * their props (no hooks), so each is simply called.
 */
export function primitiveTree(node: ReactNode): PrimitiveNode[] {
  if (node === null || node === undefined || typeof node === "boolean") return [];
  if (typeof node === "string" || typeof node === "number") return [String(node)];
  if (Array.isArray(node)) return node.flatMap(primitiveTree);
  if (!isValidElement(node)) throw new Error(`Can't expand ${String(node)}`);

  const element = node as ReactElement<Record<string, unknown> & { children?: ReactNode }>;
  if (element.type === Fragment) return primitiveTree(element.props.children);
  if (typeof element.type === "function") {
    const component = element.type as (props: Record<string, unknown>) => ReactNode;
    return primitiveTree(component(element.props));
  }
  if (typeof element.type !== "string") throw new Error("Can't expand this element type");

  const { children, style, ...props } = element.props;
  return [{ type: element.type, props, style: flattenStyle(style), children: primitiveTree(children) }];
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
