import { linkHref } from "@/lib/format/link-href";

/**
 * Prose as a Theme draws it (ADR 0004): plain text, bold, italic and links.
 * A tree, never HTML, so nothing the user types can become markup.
 */
export type ProseNode =
  | { type: "text"; text: string }
  | { type: "bold"; children: ProseNode[] }
  | { type: "italic"; children: ProseNode[] }
  /** `href` is always http(s) or mailto (linkHref). */
  | { type: "link"; href: string; children: ProseNode[] };

/** Characters a backslash turns into plain text: `\*` shows "*", `\\` shows "\". */
const ESCAPABLE = new Set(["*", "[", "]", "\\"]);

type Parsed = { nodes: ProseNode[]; brokenLinks: string[] };

/**
 * Turns Prose's Markdown source into the nodes a Theme draws. Only
 * `**bold**`, `*italic*` and `[label](url)` mean anything; all other text,
 * underscores, headings, lists and HTML included, stays as typed.
 *
 * A link whose URL isn't http(s) or mailto shows as its whole source, so the
 * user can see it didn't work (see brokenLinks).
 */
export function parseProse(source: string): ProseNode[] {
  return parse(source).nodes;
}

/**
 * The source of each `[label](url)` in the Prose whose URL can't become a
 * link, e.g. "[GitHub](github.com/maya)", for the editor to point out.
 * These are still saved as typed.
 */
export function brokenLinks(source: string): string[] {
  return parse(source).brokenLinks;
}

function parse(source: string): Parsed {
  const brokenLinks: string[] = [];
  const nodes = parseInline(source, { allowLinks: true, brokenLinks });
  return { nodes, brokenLinks };
}

type Context = { allowLinks: boolean; brokenLinks: string[] };

function parseInline(source: string, context: Context): ProseNode[] {
  const nodes: ProseNode[] = [];
  let text = "";

  function push(node: ProseNode) {
    if (text !== "") nodes.push({ type: "text", text });
    text = "";
    nodes.push(node);
  }

  let i = 0;
  while (i < source.length) {
    const char = source[i];

    if (char === "\\" && ESCAPABLE.has(source[i + 1])) {
      text += source[i + 1];
      i += 2;
      continue;
    }

    if (char === "[" && context.allowLinks) {
      const link = matchLink(source, i);
      if (link) {
        const href = linkHref(link.url);
        if (href) {
          push({ type: "link", href, children: parseInline(link.label, { ...context, allowLinks: false }) });
        } else {
          text += link.source;
          context.brokenLinks.push(link.source);
        }
        i = link.end;
        continue;
      }
    }

    if (char === "*") {
      const emphasis = matchEmphasis(source, i, 2) ?? matchEmphasis(source, i, 1);
      if (emphasis) {
        push({
          type: emphasis.length === 2 ? "bold" : "italic",
          children: parseInline(emphasis.content, context),
        });
        i = emphasis.end;
        continue;
      }
    }

    text += char;
    i++;
  }

  if (text !== "") nodes.push({ type: "text", text });
  return nodes;
}

/** The index just past a backslash escape at `i`, or `i` itself when there isn't one. */
function skipEscape(source: string, i: number): number {
  return source[i] === "\\" && ESCAPABLE.has(source[i + 1]) ? i + 2 : i;
}

/**
 * `[label](url)` starting at `start`: a non-empty label up to the first
 * unescaped "]", then "(" straight after it, then the URL up to its matching ")".
 */
function matchLink(source: string, start: number) {
  let i = start + 1;
  while (i < source.length && source[i] !== "]") {
    const next = skipEscape(source, i);
    i = next > i ? next : i + 1;
  }
  const label = source.slice(start + 1, i);
  if (i >= source.length || label === "" || source[i + 1] !== "(") return null;

  // The URL may hold balanced brackets, as in ".../Go_(programming_language)".
  let close = i + 2;
  for (let depth = 0; close < source.length; close++) {
    if (source[close] === "(") depth++;
    if (source[close] === ")") {
      if (depth === 0) break;
      depth--;
    }
  }
  if (close >= source.length) return null;

  return { label, url: source.slice(i + 2, close), source: source.slice(start, close + 1), end: close + 1 };
}

/**
 * Emphasis of `length` asterisks (2 = bold, 1 = italic) opening at `start`.
 * It closes at the next run of asterisks that can close it: a run of two or
 * more for bold (its last two), or any run but exactly two for italic (its
 * last one), so `***both***` and `*a **b** c*` nest. The content can't be
 * empty or start or end with a space, so "5 * 3 * 2" stays as typed; and
 * italic content can't start with "*", which belongs to a longer run.
 */
function matchEmphasis(source: string, start: number, length: 1 | 2) {
  if (source.slice(start, start + length) !== "*".repeat(length)) return null;

  let i = start + length;
  while (i < source.length) {
    const next = skipEscape(source, i);
    if (next > i) {
      i = next;
      continue;
    }
    if (source[i] !== "*") {
      i++;
      continue;
    }

    let run = 1;
    while (source[i + run] === "*") run++;
    const closes = length === 2 ? run >= 2 : run !== 2;
    if (closes) {
      const close = i + run - length;
      const content = source.slice(start + length, close);
      const fits = content !== "" && content.trim() === content && !(length === 1 && content.startsWith("*"));
      if (fits) return { length, content, end: close + length };
    }
    i += run;
  }
  return null;
}
