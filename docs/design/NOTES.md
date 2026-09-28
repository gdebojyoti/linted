# Design notes

`linted-editor-design/` is an export from Claude Design. Use it for the look of the editor and the Theme: colours, spacing, sizes and layout. Behaviour comes from the spec (#1), the tickets and the ADRs. Where the design disagrees with them, **the spec wins**. The differences are listed below, and the exported files themselves are left unchanged.

## Where the spec overrides the design

| # | The design shows | Build this instead |
|---|---|---|
| 1 | A US Letter page (612 × 792) | An **A4** page (#1, #15, #20) |
| 2 | Ghosted Sections: Empty or Disabled Sections shown as faded titles in the preview, with "Ghosted" tags in the Content pane | **None in v1.** The preview shows only Enabled, non-Empty Content (#1 "Out of Scope") |
| 3 | Moving Sections in the preview: handles, a move toolbar, Zone outlines, and the "Arrange sections in the preview" hint | **None in v1.** The Theme always uses its default Layout (ADR 0005, #1 "Out of Scope") |
| 4 | Drag handles on Entries and Bullets | **Simple controls** for reordering, with no drag-and-drop (#1, #24) |
| 5 | A rich-text Bullet editor with B / I / link buttons | Prose edited as **Markdown source**, rendered by the Prose renderer (ADR 0004, #16) |
| 6 | One "Month Year" text field per date, with no day | A **year, an optional month and an optional day** (#21, #23) |
| 7 | "Current — no end date, shown as 'Present'" on every Entry | **Per-type labels:** "I currently work here" (Experience), "I currently study here" (Education), "Ongoing" elsewhere (#1, #23) |
| 8 | Zones named `top`, `side`, `main` in the two-column board | **Our Zones:** `header`, `aside-left`, `main`, `aside-right`, `footer` (`ZONES` in `lib/resume/types.ts`) |
| 9 | Header links shown as the address (e.g. "github.com/asharao") | **As specced.** Each link has a label and a URL (#1, #18) |

## Agreed on top of the design

- The v1 Theme is called **Ledger**.
- v1 uses the **one-column** page (`PreviewPage.dc.html`). The two-column boards are reference for a later version.
- The header bar's **"Saved"** indicator and a disabled **"Duplicate — coming soon"** button are fine to keep.
- **Export PDF** stays disabled until Export works (#20).
- **A "…" menu appears only when it has more than one option.** A single action gets its own button. For example, a Custom Section's menu has Rename and Delete. A Default Section can't be deleted, so it gets just a rename button and no menu.
- **App accent: Amethyst** (`#9b59b6`), in place of the design's Pine green. This is the app only; a Theme's colours are its own.
- **Ledger accent: Pine green** (`#17784a`), as in the design, for the Theme's headings and links (about 5.5:1 on white). Set in the Theme's own variables (#15), separate from the app accent.
- **Font: Open Sans** for now for the app, in place of the design's Geist and Geist Mono. **Ledger uses Source Serif 4**, as in the design.

## The Library (`linted-library-design/`)

`linted-library-design/` is a second Claude Design export, for the Library at `/resume-builder` (#9). It uses the same tokens as the editor export, and everything above about colours and fonts applies to it too. Where we build something different:

| The design shows | Build this instead |
|---|---|
| Pine green buttons, logo and Resume sketches | **Amethyst**, like the rest of the app |
| Geist, and Geist Mono for the logo and grey meta lines | **Open Sans** everywhere |
| Buttons 38px (list) and 42px (empty state) tall | shadcn Button's **built-in sizes** only: `lg` (36px) for New resume in both places, the same height as the search box. The editor's top-bar buttons use `lg` too |
| A working search box | **Shown but disabled** |
| A Duplicate button and a "…" menu (Rename, Duplicate, Export PDF, Delete) on each row | **Both shown but disabled**, with no menu. Rename, Duplicate and Delete come in #11–#13 |
| "all sections empty" when nothing will show | **Always counts**, e.g. "0 of 6 sections" |
| Only the title opens a Resume | **The whole row** opens it |
| "Untitled resume" | **"Untitled Resume"**, the code's default |
| Two wordings of the browser-storage note | **One wording** in both places: "No account needed. Your resumes are saved in this browser only, so clearing site data or switching browser / device will not bring them with you." |

## The New resume dialog (`linted-new-resume-dialog/`)

`linted-new-resume-dialog/` is a third Claude Design export: the dialog that **New resume** opens in the Library, to name the Resume before it's created. The same dialog will later name a Duplicate. Its `Library.dc.html` is only the backdrop, the same design as in the Library export. Everything above about colours and fonts applies. Where we build something different:

| The design shows | Build this instead |
|---|---|
| A hand-built dialog | **shadcn's Dialog** (Base UI), styled to the design |
| Pine green Create button and focus ring | **Amethyst**, like the rest of the app |
| Geist, and Geist Mono for the footer hint | **Open Sans** everywhere |
| Two starting values to choose from (empty, or "Untitled resume" selected) | **"Untitled Resume" prefilled and selected**, so typing replaces it and Enter creates straight away |
| Hand-sized buttons | shadcn Button's **built-in sizes** (`lg`, 36px, as in the design) |
| The footer hint "Enter to create · Esc to close" | **"You can change all of this later."** Enter and Esc still work as the design describes |
| An error under the field when saving fails | **Not yet.** Failed saves are #49; until then a failed create behaves as it does today |
