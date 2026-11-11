# Linted — editor with Content · Layout · Theme tabs (design reference)

Exported from the "Editor with Content · Layout · Theme tabs" group of the Linted design canvas. This replaces the earlier `linted-editor-tabs-design` export.

These are design specs, not production code. Build from them; don't import them.

| File | What it is |
|---|---|
| `EditorTabContent.dc.html` | Content tab: the Section / Entry / Bullet form, and the preview |
| `EditorTabLayout.dc.html` | Layout tab: zone diagram for the current Theme, with movable Section chips, and the preview |
| `EditorTabTheme.dc.html` | Theme tab: theme picker and customisation (accent, typeface, density), and the preview |
| `PreviewTwoCol.dc.html` | Page component for the two-column **Margin** theme, used by all three tabs |
| `ResumePage.dc.html` | Page component for the one-column **Ledger** theme, used by the Theme tab when Ledger is picked |
| `tokens.css` | Colours, type, spacing, radii and shadows |

## Reading the files

- Markup is plain HTML with inline styles inside `<x-dc>`.
- `{{name}}` holes are values computed in `renderVals()` at the bottom of each file.
- `<sc-if value>` = conditional render. `<sc-for list as>` = `.map()`.
- `<dc-import name="X" prop="…">` renders `X.dc.html` with those props.
- The tab pills are plain links between the three files. In the app they are one route with three panels.
- Sample content (Asha Rao, Parcelwise, …) is placeholder data.

## Shared shell (all three tabs)

- **Top bar (56px):**
  - Left: logo, then the breadcrumb (Resumes / Resume Title, with a rename button).
  - Centre: the tab pills **Content · Layout · Theme**, as a segmented control. Use `role="tablist"` / `role="tab"` / `aria-selected`.
  - Right: "Saved" status, **Duplicate** (disabled in v1) and **Export PDF**.
- **Left pane** (640px) holds the active tab's panel. There's no heading or subheading strip; the active pill is the heading.
- **Right pane:** a "Preview" toolbar showing the theme name, then the 612 × 792 page.

## The preview is the export

On every tab the preview uses `mode="render"`: exactly what gets exported. It has:

- no drag handles, pin, zone outlines or selection outlines;
- no Empty or Disabled Sections (they aren't shown at all, not even faded).

Note: `CONTEXT.md` still describes Ghosted Sections in the preview and Layout changed "in the preview". Both now happen in the Layout tab, so update those entries.

## Content tab

- Same form as Editor A:
  - Sections in a fixed order, Default Sections first.
  - Enabled checkboxes, where a Disabled parent greys its children out.
  - Entry fields, the **Current** checkbox, Bullets nested up to two levels, the Prose toolbar, and the Custom section menu (Rename / Delete).
  - "Add custom section" at the bottom.
- There's no Section count in this pane.

## Layout tab

- **Zone diagram** for the current Theme (Margin):
  - **Top · full width:** the Header (pinned, can't be moved) and Summary.
  - **Sidebar · narrow:** Skills and Education.
  - **Main:** Experience, Projects and Talks.
- **Section chips:**
  - Each chip has a drag handle and the Section title, and every chip looks and behaves the same.
  - An Empty or Disabled Section gets a small tag ("Empty" or "Disabled") and nothing else. It is not faded and stays fully draggable.
  - Clicking the handle selects a chip. The selected chip gets an accent border, a lifted shadow and four arrow buttons.
  - **Move rules** (`act()` in the script):
    - Up and down move within a zone.
    - Left moves from Main to the Sidebar; right moves from the Sidebar to Main.
    - Up from the top of a column moves the Section to the end of Top. Down from the end of Top moves it to the start of Main.
    - The Header never moves.
  - Build real drag-and-drop with the same rules, and keep the arrows as the keyboard path.
- **Zone outlines** turn accent-coloured while a chip is selected.
- **"Reset to theme default"** is a text button at the top-right of the diagram. It restores the Theme's default Layout.
- **Footer note:** how to move Sections, that Empty and Disabled Sections can be placed but won't print, and that switching Theme resets the Layout.
- **Preview:** gets the current `layout`, so it updates as Sections move.
- **Data:** Layout is part of Theme Settings (ADR 0005), stored as `{ zoneId: sectionId[] }`.

## Theme tab

- **Theme cards:** **Ledger** (one column) and **Margin** (two columns), each with a mini page diagram. The selected card gets an accent border, a ring and a check badge.
  - Note below them: "Switching theme resets your Layout and customizations to the new theme's defaults. Your content never changes."
  - Picking a different theme resets accent, typeface and density to their defaults. Picking the current theme does nothing.
- **Customize ‹theme›** (stored per Resume in Theme Settings). All three options are single-select and use the same card button:
  - Height 40px, `padding: 0 14px`, the width follows its content, 8px gap inside, 8px gap between cards.
  - Unselected: 1px `--line` border. Selected: 1px `--accent` border plus a 3px `--accent-tint` ring. Use `aria-pressed`.
  - **Accent:** nine options (Pine, Cobalt, Ink, Rust, Plum, Teal, Wine, Slate, Ochre). Each card is a 14px colour dot plus the name. The row wraps, and the "Accent" label stays level with the first line.
  - **Typeface:** Serif (Source Serif 4), Sans (IBM Plex Sans) or Classic (EB Garamond). Each card is "Aa" in that font plus the name.
  - **Density:** Comfortable (default) or Compact, as text-only cards.
- **Density, as rendered:**
  - Comfortable: line-height 1.42, 14px between Sections, and on Margin 30px between the top zone and the columns.
  - Compact: line-height 1.32, 9px between Sections, and on Margin 20px.
- **Preview:** Margin renders through `PreviewTwoCol` and Ledger through `ResumePage`. Both take `accent`, `font` and `density`.
- There is no page size option.

## Known gaps in the mock-ups

- **Education layout:** `ResumePage` (Ledger) still shows Education on one line. `PreviewTwoCol` shows the newer school / degree / discipline / years / GPA layout. Use the newer one.
- **Drag-and-drop:** drawn as an affordance only (handles, lifted chip). The working interaction in the mock-up is the arrow buttons.
- **Disabled tag:** the sample data only has an Empty Section, so the "Disabled" tag isn't shown, but it uses the same style.

Vocabulary follows `CONTEXT.md`.
