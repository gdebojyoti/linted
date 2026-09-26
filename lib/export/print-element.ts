/**
 * Opens the browser's print dialog for one element on its own, where the user
 * can choose "Save as PDF" (ADR 0001). The element is copied into a hidden
 * frame with this page's stylesheets, so nothing else on the page is printed
 * and the page's own layout (such as the editor's scrolling panes) can't cut
 * it short. The dialog opens once the styles and fonts have loaded, so the PDF
 * never uses a fallback font.
 *
 * `title` names the printed document, which browsers suggest as the PDF's
 * file name.
 */
export async function printElement(element: HTMLElement, { title }: { title: string }): Promise<void> {
  const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')]
    .map((node) => node.outerHTML)
    .join("");

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  // A srcdoc frame resolves links against this page, so relative stylesheet
  // and font URLs still work. Its load event waits for the stylesheets.
  frame.srcdoc =
    "<!doctype html><html><head><meta charset='utf-8'>" +
    styles +
    "<style>html, body { margin: 0; padding: 0; background: #fff; }</style>" +
    "</head><body>" +
    element.outerHTML +
    "</body></html>";

  const frameLoaded = new Promise((resolve) => frame.addEventListener("load", resolve, { once: true }));
  document.body.append(frame);
  await frameLoaded;

  const frameWindow = frame.contentWindow;
  const doc = frame.contentDocument;
  if (!frameWindow || !doc) {
    frame.remove();
    return;
  }

  // Fonts set on the page's <html> (next/font's variables) must apply in the frame too.
  doc.documentElement.lang = document.documentElement.lang;
  doc.documentElement.className = document.documentElement.className;
  doc.title = title;
  await doc.fonts.ready;

  // Browsers take the suggested file name from the top-level page's title in
  // some cases and the frame's in others, so both carry it while printing.
  const pageTitle = document.title;
  document.title = title;
  frameWindow.addEventListener("afterprint", () => {
    document.title = pageTitle;
    frame.remove();
  });

  frameWindow.focus();
  frameWindow.print();
}
