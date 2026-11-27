# Linted — multiple Positions per Experience Entry (design reference)

Exported from the Linted design canvas. These are design specs, not production code. Build from them; don't import them.

**The problem:** an Experience Entry holds one company and one role. A promotion at the same company currently means duplicating the company across several Entries.

**The direction:** an Entry holds the company, and one or more **Positions** hold the roles.

| File | Canvas name | What it is |
|---|---|---|
| `ExperiencePositions.dc.html` | A — Experience with Positions | The Experience Section of the Content tab only (640px wide). It has no top bar and no preview. |
| `PreviewTwoColPositions1.dc.html` | B1 — company heading, roles stacked | Margin (2-col) page rendering, option 1 |
| `PreviewTwoColPositions2.dc.html` | B2 — timeline rail | Margin page rendering, option 2 |
| `PreviewTwoColPositions3.dc.html` | B3 — latest role first | Margin page rendering, option 3 |

No rendering option has been chosen yet; B1–B3 are there to compare.

## Reading the files

- Markup is plain HTML with inline styles inside `<x-dc>`.
- `{{name}}` holes are values computed in `renderVals()` at the bottom of each file.
- `<sc-if value>` = conditional render.
- The B files are static. Their sample content matches the 2-col page used elsewhere (Asha Rao), except that Parcelwise now has two Positions.

## Data model

- **Entry** (one per company): Company, Location, Enabled, and a list of Positions. Location belongs to the company, not to each Position.
- **Position:** Role, Start, End, Current ("I currently work here"), Enabled, and its own Bullets. The two levels of Bullets work as they do today.
- **Entry date range:** worked out from its Positions (earliest Start to latest End, or "Present" if any Position is Current). It isn't stored or typed.
- **Migration:** an existing Entry becomes an Entry with one Position. Nothing is lost.

> **Note: save Positions in display order.**
> Sort Positions newest first **when saving** (on add, and whenever a Position's dates change), not only when rendering. The saved array must always match what the user sees.
> Why: if drag handles for manual reordering are added later, they just reorder the same array, so existing resumes keep their order. If sorting happened only at render time, switching to a manual order later would show existing resumes in insertion order, and some would change visibly.
> Later, if manual ordering is added: an optional per-Entry flag such as `positionsOrder: "auto" | "manual"` lets a manual drag stop auto-sorting from overwriting the user's order. A missing flag means `"auto"`, so it needs no migration. The localStorage schema version stays available for any one-time migration.

## Content tab: `ExperiencePositions.dc.html`

- **One Entry and one Position open at a time.** Unticking a checkbox greys out everything nested under it.
- **Entry with one Position** (Kitefin): looks exactly like today's form (Company, Role, Location, Start, End, Current, Bullets), plus an **"Add position"** button at the bottom. A hint next to it reads "Promoted, or changed roles at the same company?" Most users never see more than this.
- **Entry with two or more Positions** (Parcelwise):
  - **Collapsed row:** "Parcelwise Staff Engineer +1", showing the latest role and how many more there are. The "Current" tag shows if any Position is current; otherwise the derived date range shows.
  - **Entry body:** Company and Location at the top, then a "Positions · newest first" list, then "Add position".
  - **Each Position** is a small card: Enabled checkbox, Role, then the "Current" tag or its dates, then trash and chevron. Expanded, it shows Role, Start, End (disabled while Current is ticked), "I currently work here" and Bullets.
  - Positions have **no drag handles**, because they sort by date (see the note above).
- Field, Bullet and button styles match the current Content tab.

## Resume rendering (Margin theme)

A single-position Entry (Kitefin) renders exactly as today: "Role, Company", then "Location · dates", then bullets.

For a multi-position Entry:

1. **B1, company heading with roles stacked:** "Company" in bold, with "Location · overall range" on the right. Each Position follows as an italic role with its own dates on the right, then its bullets.
2. **B2, timeline rail:** the same as B1, but Positions are indented beside a 0.75px rule. Each has a 5px dot: filled in the accent colour for the current role, outlined for earlier ones.
3. **B3, latest role first:** the first line uses today's format for the latest Position ("Role, Company", then "Location · that role's dates"). Earlier Positions follow as muted bold role lines with their own dates and bullets. The company's overall range isn't shown.

The content needs about 600px of the 792px page height in all three, so the page size is unchanged.

## Open questions

- Which rendering (B1, B2 or B3) to use. Ledger (one column) will need its own version once one is chosen.
- Education has the same issue (several degrees from one school). It's not designed yet.
- `CONTEXT.md` needs the new term **Position**, and the data change probably deserves an ADR.

Vocabulary follows `CONTEXT.md` (Entry, Bullet, Current, Enabled, Section).
