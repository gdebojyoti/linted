import { describe, expect, test } from "vitest";
import { moveSection } from "@/lib/resume/layout";
import { sampleResume } from "@/lib/resume/sample-resume";
import type { Resume } from "@/lib/resume/types";
import { ledger } from "@/themes/ledger/ledger";
import { margin } from "@/themes/margin/margin";
import { pageText, readPdf } from "@/themes/testing/read-pdf";
import { exportDocument } from "./export-document";

async function exportedText(resume: Resume): Promise<string> {
  const pdfDocument = exportDocument(resume, ledger);
  if (!pdfDocument) throw new Error("Nothing was exported");
  const pages = await readPdf(pdfDocument);
  return pages.map(pageText).join("");
}

describe("exportDocument", () => {
  test("draws only Enabled, non-Empty Content", async () => {
    const text = await exportedText(sampleResume);

    expect(text).toContain("Maya Okafor");
    expect(text).toContain("Paystream");
    expect(text).not.toContain("+44 7700 900123");
    expect(text).not.toContain("Brightside Web Studio");
    expect(text).not.toContain("VOLUNTEERING");
  });

  test("places Sections by the Theme's Layout, with the Header first wherever it is in the Content", async () => {
    const [header, ...rest] = sampleResume.content.sections;
    const text = await exportedText({ ...sampleResume, content: { sections: [...rest, header] } });

    expect(text.indexOf("Maya Okafor")).toBe(0);
  });

  test("follows the saved Layout", async () => {
    const defaultText = await exportedText(sampleResume);
    const movedText = await exportedText(moveSection(sampleResume, ledger, "summary", "down"));

    expect(defaultText.indexOf("Backend engineer with 8 years")).toBeLessThan(defaultText.indexOf("Paystream"));
    expect(movedText.indexOf("Paystream")).toBeLessThan(movedText.indexOf("Backend engineer with 8 years"));
  });

  test("keeps links clickable", async () => {
    const pdfDocument = exportDocument(sampleResume, ledger);
    if (!pdfDocument) throw new Error("Nothing was exported");
    const [page] = await readPdf(pdfDocument);

    expect(page.links.map((link) => link.url)).toContain("https://github.com/example-maya");
  });

  test("draws the Theme it's given, such as Margin with its default Layout", async () => {
    const pdfDocument = exportDocument(sampleResume, margin);
    if (!pdfDocument) throw new Error("Nothing was exported");
    const [page] = await readPdf(pdfDocument);
    const xOf = (text: string) => page.text.find((run) => run.text.startsWith(text))?.x;

    // Skills in the sidebar at the left margin, Experience in main beside it.
    expect(xOf("Languages")).toBeCloseTo(48, 0);
    expect(xOf("Mentor to four engineers")).toBeGreaterThan(48 + 164);
  });

  test("gives nothing to export when no Content is Enabled and filled in", () => {
    const disabled = sampleResume.content.sections.map((section) => ({ ...section, enabled: false }));

    expect(exportDocument({ ...sampleResume, content: { sections: disabled } }, ledger)).toBeNull();
  });
});
