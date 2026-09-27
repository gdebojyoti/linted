# Linted — Resume Library (design reference)

Exported from the "Resume Library" group of the Linted design canvas. These are design specs, not production code. Build from them; don't import them.

| File | What it is |
|---|---|
| `LibraryEmpty.dc.html` | Library, empty state (first run): illustration, one line of copy, "New resume", browser-storage note |
| `Library.dc.html` | Library A, list: header, search, "New resume", table of Resumes (title, meta, last edited, created, Duplicate, "…" menu), browser-storage note |
| `tokens.css` | Colours, type, spacing, radii and shadows (same tokens as the editor export) |

## Reading the files

- Markup is plain HTML with inline styles inside `<x-dc>`.
- `{{name}}` holes are values computed in the `renderVals()` method at the bottom of each file.
- `<sc-if value>` = conditional render; `<sc-for list as>` = `.map()`.
- Sample rows in `Library.dc.html` (titles, dates, "6 of 7 sections") are placeholder data.

## Behaviour to port

- The Library lists every Resume, **most recently edited first** (`CONTEXT.md` › Library). The "Last edited" column header shows that order; it isn't a sortable control.
- Row click (title) opens the Resume in the editor.
- Row actions: **Duplicate** (icon button), and a "…" menu with Rename, Duplicate, Export PDF and Delete resume. Only one menu is open at a time (`open` index in `renderVals()`); the design shows row 2's menu open.
- Meta line: `<Theme> · <n> of <m> sections`, where n counts Sections that are Enabled and not Empty. "all sections empty" when n is 0.
- Search filters by Resume Title.
- Show `LibraryEmpty` when the Library has no Resumes.
- Resumes live in localStorage (ADR 0002), so data loads after hydration: render a skeleton or nothing on the server, then the list or the empty state in the browser. The storage note is there because clearing site data deletes Resumes.

Vocabulary follows `CONTEXT.md`.
