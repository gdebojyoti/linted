# PDF Export via browser print

Export uses the browser's print-to-PDF on the same HTML/CSS that renders the preview, so the preview and the PDF can never drift apart and a Theme is just HTML and CSS. We accept weaker control over page breaks for now. A client-side PDF library (e.g. react-pdf) is the likely v2 replacement; a server-side headless browser was rejected to avoid running and paying for a backend.

## Consequences

- Themes must be authored with print CSS (`@page`, `break-inside`, etc.) in mind.
- Moving to a PDF library later means re-implementing every Theme in that library's primitives. Keep Theme count small until that decision is revisited.
