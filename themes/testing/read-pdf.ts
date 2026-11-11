import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { ReactElement } from "react";

/** A run of text as drawn in the PDF, with the font it was drawn in. */
export type PdfText = {
  text: string;
  /** The embedded font's PostScript name, without the subset prefix, e.g. "SourceSerif4-Italic". */
  font: string;
  /** From the page's left edge, in pt. */
  x: number;
  /** From the page's top edge, in pt. */
  y: number;
};

export type PdfLink = { url: string };

export type PdfPage = {
  /** In pt. */
  width: number;
  height: number;
  text: PdfText[];
  links: PdfLink[];
};

/**
 * Renders a react-pdf Document to a real PDF file and reads it back with
 * pdf.js: the text on each page (selectable text, never shapes), the font of
 * each run, and the clickable links. This is how Themes are tested (#83).
 */
export async function readPdf(document: ReactElement<DocumentProps>): Promise<PdfPage[]> {
  const bytes = await withFileFetch(() => renderToBuffer(document));
  // fontExtraProperties keeps each font's name, which tells bold and italic apart.
  const pdf = await getDocument({
    data: new Uint8Array(bytes),
    verbosity: 0,
    fontExtraProperties: true,
  }).promise;

  const pages: PdfPage[] = [];
  for (let number = 1; number <= pdf.numPages; number++) {
    const page = await pdf.getPage(number);
    const [, , width, height] = page.view;
    await page.getOperatorList(); // loads the page's fonts into commonObjs
    const content = await page.getTextContent();
    const text = content.items.flatMap((item) => {
      if (!("str" in item) || item.str === "") return [];
      const font = page.commonObjs.get(item.fontName) as { name: string };
      return [
        {
          text: item.str,
          font: font.name.replace(/^[A-Z]{6}\+/, ""),
          x: item.transform[4],
          y: height - item.transform[5],
        },
      ];
    });
    // unsafeUrl is the URL as written in the PDF; pdf.js normalises `url`.
    const annotations = await page.getAnnotations();
    const links = annotations
      .filter((annotation) => annotation.subtype === "Link" && annotation.unsafeUrl)
      .map((annotation) => ({ url: annotation.unsafeUrl as string }));
    pages.push({ width, height, text, links });
  }
  return pages;
}

/** All of a page's text joined into one string, for checking what it says. */
export function pageText(page: PdfPage): string {
  return page.text.map((run) => run.text).join("");
}

/**
 * react-pdf fetches fonts registered by URL. A Theme registers its font files
 * as `new URL(..., import.meta.url)`, which in tests is a file: URL that
 * Node's fetch can't open, so this lets fetch read those from disk.
 */
async function withFileFetch<T>(run: () => Promise<T>): Promise<T> {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.startsWith("file:")) return realFetch(input, init);
    return new Response(await readFile(fileURLToPath(url)));
  };
  try {
    return await run();
  } finally {
    globalThis.fetch = realFetch;
  }
}
