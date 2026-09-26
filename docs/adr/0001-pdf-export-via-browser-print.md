# PDF Export via browser print

Export uses the browser's print-to-PDF on the same HTML/CSS that renders the preview, so the preview and the PDF can never drift apart and a Theme is just HTML and CSS. We accept weaker control over page breaks for now. A client-side PDF library (e.g. react-pdf) is the likely v2 replacement; a server-side headless browser was rejected to avoid running and paying for a backend.

## Consequences

- Themes must be authored with print CSS (`@page`, `break-inside`, etc.) in mind.
- Moving to a PDF library later means re-implementing every Theme in that library's primitives. Keep Theme count small until that decision is revisited.

## Known limitation: the print destination (found 2026-09-26)

A Resume's text must be selectable, because applicant tracking systems parse it. Print export can't guarantee that:

- The page can't choose or read the print destination. Chrome starts on the system's default printer and then remembers the user's last choice. On many Windows machines that default is **Microsoft Print to PDF**.
- Chrome's own **Save as PDF** writes real text. Microsoft Print to PDF is a printer driver, and web fonts reach it as drawn shapes, so the PDF looks right but has no text. Nothing tells the user or the app.
- Static font files (see Ledger's font) fixed text for Save as PDF only. They don't help with the printer-driver route.

The only mitigation that keeps the print dialog is telling users to pick Save as PDF, which many won't read. This makes the v2 move more pressing: the app should produce the PDF file itself and download it, with no print dialog.

## Options considered for v2

Two groups of approaches match the preview. Either one engine lays out the same HTML/CSS for both, or the PDF is the source of truth and the preview shows that PDF.

Client side:

- **html2pdf.js / html2canvas + jsPDF**: rejected. Pages are screenshots, so there's no selectable text.
- **jsPDF `.html()`**: rejected. It supports too little CSS to match the preview.
- **pdfmake / pdf-lib**: low-level builders that position everything by hand. Too much work for Themes.
- **@react-pdf/renderer**: real text and embedded fonts, its own flexbox layout (Yoga, a subset of CSS), and good page-break control (`wrap`, `minPresenceAhead`, fixed elements). Themes are rewritten in its `<View>`/`<Text>` primitives.
- **Typst via WASM (typst.ts)**: the best typography. But Themes become templates in a second language, and the bundle is several MB.
- **Paged.js**: not a PDF generator. It paginates HTML in the preview and still prints through the dialog, so it doesn't fix the destination problem.

Server side:

- **Playwright / Puppeteer `page.pdf()`, Gotenberg, Cloudflare Browser Rendering**: Chromium renders the same HTML/CSS as the preview. That keeps Themes as HTML/CSS and removes the print dialog. Rejected for the same reasons as before: a backend to run and pay for, cold starts, and Resume data leaving the device, which goes against ADR 0002's localStorage model.
- **WeasyPrint, Prince/DocRaptor**: strong paged-media support. But they don't use the preview's engine, so the output drifts from the preview, and they still need a server.

## Direction

After v1, replace print export with **@react-pdf/renderer**, generated in the browser and downloaded as a file.

- The preview should render that same PDF (react-pdf's viewer, or pdf.js), debounced while the user edits. Keeping an HTML preview beside a react-pdf export would mean two renderers that drift apart.
- The preview then stops being live HTML, so any interaction inside the preview goes away.
- Register fonts explicitly as static (non-variable) files.
- Expect a bundle cost of roughly 500 KB or more.
- Every Theme gets rewritten, so keep the Theme count at one (Ledger) for as long as possible.

Record the switch as a new ADR that supersedes this one.
