# Section placement lives in the Layout, not in Content

Supersedes ADR 0003. Themes can have several Zones (e.g. sidebar and main), which a single ordered list of Sections cannot describe. So where Sections appear on the page is stored as a Layout in Theme Settings: for each Zone, an ordered list of Section ids. The user rearranges Sections in the preview, not in the editor. The editor lists Sections in a fixed order: the Default Sections first, then Custom Sections in the order they were added. The order of `content.sections` only drives the editor.

## Considered Options

- **Content order drives placement (ADR 0003's direction).** Rejected: one list can't say which Zone a Section belongs to, and dragging in the editor would mean something different in every Theme.
- **Fixed ids for Default Sections (e.g. `"experience"`).** Rejected: a Theme's default Layout places Sections by type instead, and every Section keeps a generated id. That leaves room to let users repeat Default Sections later.
- **Remember one Layout per Theme.** Rejected for now: switching Theme simply resets the Layout to the new Theme's default.

## Consequences

- Layout is not a source of truth for Content. The renderer must tolerate the two disagreeing. A Section missing from the Layout (e.g. a newly added Custom Section) goes where the Theme's default puts its type. An id in the Layout that no longer exists is ignored.
- Deleting a Custom Section should also remove its id from the Layout, as tidying rather than for correctness.
- An unset Layout means the Theme's default. Resumes saved before reordering exists therefore need no migration.
- A Pinned Section is always first in its Zone, and the Layout can't place anything above it.
- The preview shows Ghosted Sections, but Export must leave them out. Because Export prints the preview's HTML (ADR 0001), Ghosted Sections must be excluded from print output.
