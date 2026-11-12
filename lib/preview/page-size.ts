/** CSS px per PDF pt: CSS has 96 px to the inch, PDF 72 pt. */
const CSS_PX_PER_PT = 96 / 72;

type Size = { width: number; height: number };

export type PreviewPageSize = Size & {
  /** The canvas it's drawn on, in device pixels, so it stays sharp on high-density screens. */
  canvas: Size;
  /** Canvas pixels per pt, as pdf.js's `getViewport({ scale })` takes it. */
  scale: number;
};

/**
 * How big the preview draws a PDF page, given in pt: as wide as the pane, in
 * CSS px, but never bigger than its real size, so a wide pane shows the page
 * as it will print rather than blown up.
 */
export function previewPageSize(
  page: Size,
  { paneWidth, pixelRatio }: { paneWidth: number; pixelRatio: number },
): PreviewPageSize {
  const width = Math.min(page.width * CSS_PX_PER_PT, paneWidth);
  const height = (width * page.height) / page.width;
  const canvas = { width: Math.round(width * pixelRatio), height: Math.round(height * pixelRatio) };
  return { width, height, canvas, scale: canvas.width / page.width };
}
