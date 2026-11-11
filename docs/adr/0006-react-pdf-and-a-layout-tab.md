# react-pdf for the preview and Export, and Sections arranged in a Layout tab

Supersedes ADR 0001, and the parts of ADR 0005 about arranging and Ghosting Sections in the preview. Export moves from the browser's print dialog to **@react-pdf/renderer**: the app builds the PDF in the browser and downloads it as a file. The preview shows that same PDF, so it is exactly what Export produces. A drawn PDF has no element per Section to put drag handles on, so the user arranges Sections in a separate **Layout tab** instead of on the page. The editor has three tabs, Content, Layout and Theme, beside one preview (`docs/design/linted-editor-tabs-design/`).

## Considered Options

- **Keep printing HTML (ADR 0001).** Rejected: the page can't choose the print destination, and printer drivers such as Microsoft Print to PDF write the text as shapes, so the PDF has no selectable text.
- **Keep an HTML preview and use react-pdf only for Export.** Rejected: two renderers drift apart.
- **Draw the PDF and lay drag controls over it** (pdf.js on a canvas, with handles over each Section). Rejected: it needs each Section's position on the page, which react-pdf isn't known to expose through a supported API.
- **An arrange mode that swaps the preview for an HTML outline.** Rejected in favour of a Layout tab: the same idea, but arranging gets a panel of its own and the preview never changes what it shows.

## Decision

- **One PDF for both.** The preview and Export use the same react-pdf output, so the preview is exactly the Export. It shows no handles, outlines or Ghosted Sections.
- **The Layout tab** shows the Theme's Zones, with a chip per Section. The user drags chips, or selects one and moves it with arrow buttons (the keyboard path). Empty and Disabled Sections appear there as chips tagged "Empty" or "Disabled", so they can still be placed, and never in the preview. Ledger, with one column, shows a single list with the Header Pinned first.
- **Showing the PDF, in two steps.** First, an iframe showing the PDF file the app made, in the browser's own PDF viewer. Then **pdf.js**, drawing the pages on a canvas, which looks the same in every browser, works on phones, and can swap pages without a flicker or a jump back to the top. The preview component takes the finished PDF file, so the swap touches only that component.
- **Themes are written in react-pdf's primitives** (`<Document>`, `<Page>`, `<View>`, `<Text>`), with fonts registered as static files, including real italics.

## Consequences

- Ledger is rewritten in react-pdf before any second Theme is built.
- The preview updates a moment after an edit, not at once, because the PDF is rebuilt after a short pause. The Layout tab responds at once, so moving a Section still feels immediate.
- Until pdf.js replaces the iframe, the preview looks different in each browser, may flicker or jump to the top when it updates, and doesn't work on most phones. Export works everywhere.
- Bundle size grows: react-pdf is roughly 500 KB or more, and pdf.js adds its own library and worker.
- Selecting a chip in the Layout tab doesn't change the preview; only moving one does.
- ADR 0005's consequence that Ghosted Sections must be left out of print output no longer applies: nothing is Ghosted in the preview, and nothing is printed.
- Still to check, in the first build tickets: how long react-pdf takes to rebuild a Resume on a mid-range phone, and how iOS Safari handles the downloaded file.
