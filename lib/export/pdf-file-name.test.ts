import { describe, expect, test } from "vitest";
import { pdfFileName } from "./pdf-file-name";

describe("pdfFileName", () => {
  test("names the file after the Resume Title", () => {
    expect(pdfFileName("Stripe backend v2")).toBe("Stripe backend v2.pdf");
  });

  test("removes the characters file systems forbid", () => {
    expect(pdfFileName('Stripe / v2: "final" <a|b>?*\\')).toBe("Stripe  v2 final ab.pdf");
  });

  test("trims spaces and dots left at the ends, which Windows doesn't allow", () => {
    expect(pdfFileName(" / Stripe v2. / ")).toBe("Stripe v2.pdf");
  });

  test('falls back to "Resume.pdf" when nothing is left of the title', () => {
    expect(pdfFileName("// ?")).toBe("Resume.pdf");
  });
});
