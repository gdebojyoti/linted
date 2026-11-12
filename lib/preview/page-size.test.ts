import { describe, expect, test } from "vitest";
import { previewPageSize } from "./page-size";

/** An A4 page as a PDF measures it, in pt. */
const A4 = { width: 595.28, height: 841.89 };

describe("previewPageSize", () => {
  test("a pane wider than the page shows it at real size: A4 is 210 x 297 mm, at 96 CSS px per inch", () => {
    const size = previewPageSize(A4, { paneWidth: 1200, pixelRatio: 1 });

    expect(size.width).toBeCloseTo(793.7, 1);
    expect(size.height).toBeCloseTo(1122.5, 1);
  });

  test("a narrower pane fits the page to its width, keeping the page's proportions", () => {
    const size = previewPageSize(A4, { paneWidth: 500, pixelRatio: 1 });

    expect(size.width).toBe(500);
    expect(size.height).toBeCloseTo(707.1, 1);
  });

  test("the canvas has the screen's pixel ratio times the CSS pixels, so it stays sharp", () => {
    const size = previewPageSize(A4, { paneWidth: 500, pixelRatio: 2 });

    expect(size.canvas).toEqual({ width: 1000, height: 1414 });
    // pdf.js draws at `scale` canvas pixels per pt: 1000 px across 595.28 pt.
    expect(size.scale).toBeCloseTo(1.68, 2);
  });
});
