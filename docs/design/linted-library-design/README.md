# Linted — Resume Library (design reference)

Exported from the "Resume Library" group of the Linted design canvas. Replaces the earlier `linted-library-design` export (which had only the two desktop screens).

These are design specs, not production code. Build from them; don't import them.

| File | Viewport | What it is |
|---|---|---|
| `LibraryEmpty.dc.html` | Desktop 1440 × 940 | First run: no Resumes yet |
| `Library.dc.html` | Desktop 1440 × 940 | Library list, with one row's "…" menu open (`openMenu` prop, default `1`) |
| `LibraryMobileEmpty.dc.html` | Mobile 390 × 844 | First run on mobile |
| `LibraryMobile.dc.html` | Mobile 390 × 844 | Library list on mobile; the actions bottom sheet lives in this file (`sheet` prop) |
| `LibraryMobileSheet.dc.html` | Mobile 390 × 844 | Wrapper that renders `LibraryMobile` with the sheet open |
| `tokens.css` | | Colours, type, spacing and sizes used by these screens |

## Reading the files

- Markup is plain HTML with inline styles inside `<x-dc>`.
- `{{name}}` holes are values computed in `renderVals()` at the bottom of each file.
- `<sc-if value>` = conditional render. `<sc-for list as>` = `.map()`.
- `<dc-import name="X" prop="…">` renders `X.dc.html` with those props.
- Row links point at `Main.dc.html` (the editor). It isn't in this export; in the app, a row opens that Resume in the editor.
- Sample titles and dates are placeholder data.

## Shared

- **Storage:** Resumes live in this browser only (localStorage, ADR 0002). Every screen says so in plain words; there's no account.
- **Footer** (all four screens, same content and style):
  - "Linted is built by one person. If it helped, [leave a tip](https://pages.razorpay.com/debojyotighosh)." Only "leave a tip" is the link; the full stop sits outside it. Opens in a new tab (`rel="noopener"`).
  - "Crafted with 🩷 in Durgapur, India"
  - 12.5px, line-height 1.5, `--text-faint` (#8F8F88), centred, no gap between the two lines. Link in `--accent`.
- **Primary button:** Pine fill, white text, no shadow.

## Desktop

- **Top bar (56px):** logo, divider, "Library", and "Saved in this browser" on the right.
- **Empty:** illustration, "No resumes yet", one line of copy, "New resume" button (42px), and a bordered storage note. Footer pinned to the bottom of the page.
- **List:**
  - Header row: "Library" (26px), count line in mono, search (280 × 38) and "New resume" (38px).
  - Table card: columns Resume title · Last edited (sorted, descending) · Created · actions. Rows are 60px min.
  - Row actions: Duplicate icon button and "…" (both 34 × 34). The "…" menu has Rename, Duplicate, Export PDF, a divider, then Delete resume in `--danger`.
  - Storage note below the table, no border or background.
  - Footer pinned to the bottom of the page.

## Mobile

- **Spacing rule:** one 16px outer gutter everywhere (header, list, sticky bar, sheet). Gaps come from the 8 / 16 scale.
- **Header (56px):** logo only.
- **Empty:** same content as desktop, centred. "New resume" is 48px tall and hugs its label (not full width). Footer pinned to the bottom of the screen with `16px 16px 24px` padding.
- **List:**
  - Title (24px) and count line, search input (44px tall, 16px font so iOS doesn't zoom), then the list card.
  - Rows: 72px min; title, then "Edited … · N of M sections". A 44 × 44 "…" button opens the actions sheet.
  - Storage note, then the footer, both inside the scrolling area. 16px bottom padding below the footer.
  - **Sticky bottom bar:** white, top border, 16px padding, full-width "New resume" (48px). No shadow. No safe-area inset in the design.
- **Actions sheet** (shadcn `Drawer` is the intended base):
  - Scrim `rgba(26, 26, 24, 0.38)`; tapping it closes the sheet.
  - Sheet: white, 16px top radius, padding `8px 0 16px`.
  - Handle 36 × 4, 8px below it.
  - Header: Resume Title (15px, 600) and "Edited …", padding `0 16px 16px`, bottom border, 8px below.
  - Actions: Rename, Duplicate, Export PDF, Delete resume (in `--danger`). Each row 52px, `padding: 0 16px`, 18px icon, 12px icon gap. No divider above Delete.
  - Cancel: 48px outlined button, `margin: 16px 16px 0`.

## Open questions

- Button heights vary across the app (34 / 36 / 38 / 42 / 48). A 3-step scale (28 / 36 / 48) was suggested but not yet applied.
- The actions sheet was flagged as "not quite right". Ideas discussed: drop Cancel (swipe or scrim closes it), or make it a quiet text row; mute the icons.

Vocabulary follows `CONTEXT.md` (Resume, Library, Resume Title, Duplicate, Export).
