import { describe, expect, test } from "vitest";
import { sampleResume } from "@/lib/resume/sample-resume";
import type { Resume } from "@/lib/resume/types";
import { LEDGER_DEFAULT_LAYOUT } from "@/themes/ledger/default-layout";
import { LedgerDocument } from "@/themes/ledger/pdf/ledger-document";
import { LEDGER_ZONES } from "@/themes/ledger/zones";
import { pageText, readPdf } from "@/themes/testing/read-pdf";
import type { Theme } from "@/themes/theme";
import { exportDocument } from "./export-document";

/**
 * Ledger without its HTML page, which needs next/font and so can't load in
 * tests. Export only uses the Theme's Document.
 */
const ledgerForExport: Theme = {
  id: "ledger",
  zones: LEDGER_ZONES,
  defaultLayout: LEDGER_DEFAULT_LAYOUT,
  Page: () => null,
  Document: LedgerDocument,
};

async function exportedText(resume: Resume): Promise<string> {
  const document = exportDocument(resume, ledgerForExport);
  if (!document) throw new Error("Nothing was exported");
  const pages = await readPdf(document);
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

  test("keeps links clickable", async () => {
    const document = exportDocument(sampleResume, ledgerForExport);
    if (!document) throw new Error("Nothing was exported");
    const [page] = await readPdf(document);

    expect(page.links.map((link) => link.url)).toContain("https://github.com/example-maya");
  });

  test("gives nothing to export when no Content is Enabled and filled in", () => {
    const disabled = sampleResume.content.sections.map((section) => ({ ...section, enabled: false }));

    expect(exportDocument({ ...sampleResume, content: { sections: disabled } }, ledgerForExport)).toBeNull();
  });
});
