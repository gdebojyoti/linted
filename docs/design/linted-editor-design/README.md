# Linted — desktop editor (design reference)

Exported from the "Linted — desktop editor" canvas. These are design specs, not production code. Build from them; don't import them.

| File | What it is |
|---|---|
| `Main.dc.html` | Editor A: header bar, Content pane (Sections, Entries, Bullets, Enabled toggles), preview pane |
| `PreviewPage.dc.html` | One-column preview with Layout controls (handles, move toolbar, Ghosted Sections) |
| `PreviewTwoCol.dc.html` | Two-column preview; `mode` = `default` \| `active` \| `render` |
| `PreviewTwoColActive.dc.html` / `PreviewTwoColRender.dc.html` | Thin wrappers that show the `active` and `render` states |
| `tokens.css` | Colours, type, spacing, radii and shadows used across the boards |

## Reading the files

- Markup is plain HTML with inline styles inside `<x-dc>`.
- `{{name}}` holes are values computed in the `renderVals()` method at the bottom of each file.
- `<sc-if value>` = conditional render; `<sc-for list as>` = `.map()`. `<dc-import name="X">` = render component `X.dc.html`.
- Behaviour to port lives in `renderVals()`:
  - **Enabled**: a Disabled parent greys out/hides its children without changing their own state (`eff()` in `Main.dc.html`).
  - **Ghosted**: a Section that is Empty or Disabled renders its title only, faded, with a tag. It is never exported (`render` mode drops it).
  - **Layout**: `order` (one column) or `{ top, side, main }` (two columns). `act()` in `PreviewTwoCol` has the move rules: up/down within a Zone, left/right between the side and main Zones, up from the top of a column → end of `top`, down from the end of `top` → start of `main`. The Header is Pinned and never moves.
  - **Drag state**: at rest every handle and the pin show, and there are no Zone outlines. While dragging, only the dragged Section's handle shows, the pin hides, the Zone outlines show and the Section is lifted.
- Sample content (Asha Rao, Parcelwise, …) is placeholder data.

Vocabulary follows `CONTEXT.md`.
