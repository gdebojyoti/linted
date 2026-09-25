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
- **A "…" menu appears only when it has more than one option.** A single action gets its own button. For example, a Custom Section's menu has Rename and Delete. A Default Section can't be deleted, so it gets just a rename button and no menu.
- **Fonts are to be decided.** Don't take them from the design files.
