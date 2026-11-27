# Design notes

`linted-editor-design/` is an export from Claude Design. Use it for the look of the editor and the Theme: colours, spacing, sizes and layout. Behaviour comes from the spec (#1), the tickets and the ADRs. Where the design disagrees with them, **the spec wins**. The differences are listed below, and the exported files themselves are left unchanged.

## Where the spec overrides the design

| # | The design shows | Build this instead |
|---|---|---|
| 1 | A US Letter page (612 × 792) | An **A4** page (#1, #15, #20) |
| 2 | Ghosted Sections: Empty or Disabled Sections shown as faded titles in the preview, with "Ghosted" tags in the Content pane | **None in v1.** The preview shows only Enabled, non-Empty Content (#1 "Out of Scope") |
| 3 | Moving Sections in the preview: handles, a move toolbar, Zone outlines, and the "Arrange sections in the preview" hint | **None in v1.** The Theme always uses its default Layout (ADR 0005, #1 "Out of Scope") |
| 4 | Drag handles on Entries and Bullets | **No reordering in v1.** In v2, Entries are dragged by a grip at the start of their card or row, within their Section, with the Layout tab's 2px Amethyst drop marker, and moved with up and down arrows that show while the pointer is over the Entry or focus is in it (#91). Bullets are moved the same way within their Entry, by a grip before their checkbox and arrows before their indent button, keeping their level (#92) |
| 5 | A rich-text Bullet editor with B / I / link buttons, and the hint "Tab to nest · 2 levels max" | Prose edited as **Markdown source**, rendered by the Prose renderer (ADR 0004, #16). The hint shows the Markdown instead, and each Bullet has a **nest / un-nest button** next to its delete button (#24). Tab to nest is an idea for later (#62) |
| 6 | One "Month Year" text field per date, with no day, and Start – End side by side | A **year, an optional month and an optional day** (#21, #23): a typed year, then month and day lists (shadcn's Select). Start and End are **stacked**, as six fields don't fit on one line |
| 7 | "Current — no end date, shown as 'Present'" on every Entry | **Per-type labels:** "I currently work here" (Experience), "I currently study here" (Education), "Ongoing" elsewhere (#1, #23), each followed by the grey hint "— shown as 'Present'" |
| 8 | Zones named `top`, `side`, `main` in the two-column board | **Our Zones:** `header`, `aside-left`, `main`, `aside-right`, `footer` (`ZONES` in `lib/resume/types.ts`) |
| 9 | Header links shown as the address (e.g. "github.com/asharao") | **As specced.** Each link has a label and a URL (#1, #18) |
| 10 | A greyed-out End field reading "Present" while the Entry is Current | The End fields are **hidden** while it's Current (#23) |
| 11 | An Entry card with no delete button, a green "Current" tag, and its fields indented 44px | A **delete button** on the card's header line, next to the chevron; the app's grey **Badge** for "Current"; fields indented **12px**, so the date and Bullet rows fit the Content pane at its narrowest. Cards start **closed**, except a newly added one (#25) |
| 12 | A "…" menu on a Custom Section, with Rename section and Delete section | **No menu.** A **pencil** next to the title, as on every Section but the Header, and a **delete button** next to the chevron, as on Entry cards. Deleting asks first only when the Section has something filled in (#31) |

## Agreed on top of the design

- The v1 Theme is called **Ledger**.
- v1 uses the **one-column** page (`PreviewPage.dc.html`). The two-column boards are reference for a later version.
- The header bar's **"Saved"** indicator is fine to keep. Its **Duplicate** button works (#12): it opens the same dialog as the Library's Duplicate. The **"Rename resume"** pencil next to the title works (#11), and so does clicking the title: it's renamed in place, with Enter or clicking away to save and Esc to cancel.
- **Export PDF** stays disabled until Export works (#20).
- **A "…" menu appears only when it has more than one option.** A single action gets its own button. For example, a Resume row in the Library has a menu (Rename, Duplicate, Delete), but a Section has none: it gets a rename button, and a Custom Section a delete button too.
- **App accent: Amethyst** (`#9b59b6`), in place of the design's Pine green. This is the app only; a Theme's colours are its own.
- **Ledger accent: Pine green** (`#17784a`), as in the design, for the Theme's headings and links (about 5.5:1 on white). Set in the Theme's own variables (#15), separate from the app accent.
- **Font: Open Sans** for now for the app, in place of the design's Geist and Geist Mono. **Ledger uses Source Serif 4**, as in the design.

## The Library (`linted-library-design/`)

`linted-library-design/` is a second Claude Design export, for the Library at `/resume-builder` (#9). It uses the same tokens as the editor export, and everything above about colours and fonts applies to it too. Where we build something different:

| The design shows | Build this instead |
|---|---|
| Pine green buttons, logo and Resume sketches | **Amethyst**, like the rest of the app |
| Geist, and Geist Mono for the logo and grey meta lines | **Open Sans** everywhere |
| Buttons 38px (list) and 42px (empty state) tall | Button's **set sizes** only, not hand-sized: `lg` (36px) for New resume in both places on desktop (mobile uses `xl`, below), the same height as the search box. The editor's top-bar buttons use `lg` too |
| A working search box, with no state for "nothing matches" | **It works** (v2, #79): shadcn's **Input**, styled to the design. It filters as you type, ignoring case and spaces at the ends, and the count line reads e.g. "2 of 5 resumes" while it filters. When nothing matches, a centred **Notice**, "No matching resumes", replaces the list |
| A Duplicate button and a "…" menu (Rename, Duplicate, Export PDF, Delete) on each row | The **"…" menu holds Rename (#11), Duplicate (#12) and, after a divider, a red "Delete resume" (#13)**. Rename and Duplicate open the title dialog below. There's **no separate Duplicate button** on the row, and Export PDF isn't in the menu |
| "all sections empty" when nothing will show | **Always counts**, e.g. "0 of 6 sections" |
| Only the title opens a Resume | **The whole row** opens it |
| "Untitled resume" | **"Untitled Resume"**, the code's default |
| Two wordings of the browser-storage note | **One wording** in both places: "No account needed. Your resumes are saved in this browser only, so clearing site data or switching browser / device will not bring them with you." |

### Mobile and the footer (updated export)

The export was updated with three mobile screens (`LibraryMobileEmpty`, `LibraryMobile`, and `LibraryMobileSheet` with its actions sheet) and a new footer on every screen. Everything in the table above applies to mobile too. The mobile layout is used below Tailwind's `md` breakpoint (768px). The footer is built as designed: its copy, the `#8F8F88` grey and the plain accent link. Where we build something different:

| The design shows | Build this instead |
|---|---|
| A plain storage note under New resume when there are no Resumes | **Boxed**, as on desktop |
| A header with the logo only | The logo and **"Saved in this browser"** on the right, as on desktop. No divider or "Library" |
| 48px New resume and Cancel buttons | **As designed**, with our own Button size **`xl`** (48px), added to shadcn's. From `md` up, New resume is `lg` (36px), as before |
| A sticky New resume bar with 16px padding | **12px** above and below the button, 16px at the sides |
| A hand-built actions sheet | shadcn's **Drawer**, styled to the design |
| Rename, Duplicate, Export PDF and Delete resume in the sheet, with no divider | **As in the "…" menu**: Rename and Duplicate, a divider, then a red Delete resume. No Export PDF |
| "all empty" on a row | **Always counts**, e.g. "0 of 6 sections" |
| Only the title opens a Resume | **The whole row** opens it, as on desktop |
| A second wording of the storage note | **The one wording** above |

## The New resume dialog (`linted-new-resume-dialog/`)

`linted-new-resume-dialog/` is a third Claude Design export: the dialog that **New resume** opens in the Library, to name the Resume before it's created. The same dialog names a Duplicate (#12): headed "Duplicate resume", with a **Duplicate** button, starting from "<title> (copy)" selected. It also renames a Resume from the Library (#11): headed "Rename resume", with a **Rename** button, starting from the current title selected, and no footer hint. Its `Library.dc.html` is only the backdrop, the same design as in the Library export. Everything above about colours and fonts applies. Where we build something different:

| The design shows | Build this instead |
|---|---|
| A hand-built dialog | **shadcn's Dialog** (Base UI), styled to the design |
| Pine green Create button and focus ring | **Amethyst**, like the rest of the app |
| Geist, and Geist Mono for the footer hint | **Open Sans** everywhere |
| Two starting values to choose from (empty, or "Untitled resume" selected) | **"Untitled Resume" prefilled and selected**, so typing replaces it and Enter creates straight away |
| Hand-sized buttons | shadcn Button's **built-in sizes** (`lg`, 36px, as in the design) |
| The footer hint "Enter to create · Esc to close" | **"You can change the title later."** Enter and Esc still work as the design describes |
| An error under the field when saving fails | **Not yet.** Failed saves are #49; until then a failed create behaves as it does today |

## The editor with Content · Layout · Theme tabs (`linted-editor-tabs-design/`)

`linted-editor-tabs-design/` is a fourth Claude Design export: the editor split into three tabs. **Content** is the form, **Layout** arranges Sections in a zone diagram, and **Theme** picks and customises the Theme. In every tab the preview shows exactly what Export produces. It replaces the earlier export's direction of arranging Sections in the preview (rows 2 and 3 of the first table) and Ghosted Sections in the preview (ADR 0006). Everything above about colours and fonts applies, and so do the Content pane rows of the first table (5, 6, 7, 10, 11 and 12). Where we build something different:

| The design shows | Build this instead |
|---|---|
| Pine green tabs, chips, selection rings and buttons | **Amethyst**, like the rest of the app. Pine stays only as Ledger's default accent, inside the Theme |
| Geist, and Geist Mono for zone labels, tags and the preview toolbar | **Open Sans** everywhere in the app |
| A disabled **Duplicate** button ("disabled in v1") | **It works** (#12), as today |
| A US Letter page (612 × 792) | An **A4** page, as today. The app has no page size option |
| Zones named `top`, `side`, `main` | **Our Zones** (`ZONES` in `lib/resume/types.ts`): `top` is `header`, `side` is `aside-left` |
| A Layout tab with Margin's zone diagram only | **Ledger's Layout tab is a single list**: the Header Pinned first, then every other Section |
| Four arrows on a selected chip, moving between Top, Sidebar and Main, with left and right dimmed where they can't move it | **Ledger: up and down only, within a Zone** (#87). **Margin** (#108): left and right **show only where they can move the chip**, left in Main and right in the Sidebar, and are hidden elsewhere. As in the design, left and right put the chip at the end of the other column, up from the top of a column goes to the end of Top, and down from the end of Top to the start of Main |
| Clicking a chip's handle selects it, and only the selected chip shows its arrows | **No selecting.** A chip's arrows show while the pointer is over it or focus is in it, and they are ordinary Tab stops. The whole chip can be dragged, not just its grip (#88). After an arrow moves a chip into another Zone, focus follows it to the same arrow, or after left or right to the arrow that moves it back (#108) |
| A 250px Sidebar box beside Main | The Sidebar and Main boxes **share the width** in about the design's proportions, and chip titles wrap. When the pane is narrower than about 520px, the Sidebar box sits **above** Main (#108) |
| No drop marker | **A 2px Amethyst line** in the gap where a dragged chip will land, shown only where a drop would move it (#88) |
| "Empty" and "Disabled" chip tags as filled grey pills | The app's grey **Badge**, as for "Current" |
| Footer note: "Drag sections between zones, or select one and use the arrows. Empty and disabled sections can be placed too; they won't print. Switching theme resets this layout to the new theme's default." | **"Drag a section to move it, or point to it or Tab to it and use its arrows. Empty and disabled sections can be placed too; they won't appear in your resume. Switching theme resets this layout to the new theme's default."** (#107) |
| Theme cards for Ledger and Margin | **As designed** (#107), as a single-select **Toggle Group** like the Theme Options: arrow keys move between the cards. Picking a card switches straight away, with no confirmation. The mini page diagrams draw Section titles in the Resume's accent; the ring and check badge are Amethyst. Margin's page and defaults are settled in its own section below |
| A 640px left pane beside the preview, at desktop width only | **Desktop only for now.** A mobile layout comes later |

## The Margin page (`linted-editor-tabs-design/PreviewTwoCol.dc.html`)

**Margin** is the second Theme: the `header` Zone across the full width, then the sidebar (`aside-left`) on the left beside `main`. Its look comes from `PreviewTwoCol`: a 164px sidebar and 28px between the sidebar and `main`, both used as pt, as Ledger does. Line height and the space between Sections follow Density as in Ledger (1.42 and 14pt, or 1.32 and 9pt). Decided in #105. **The space below the `header` Zone is the space between Sections**, not the design's 30px or 20px, so Sections are spaced alike in one column or two (#107).

**Zones and defaults:**

- **Zones:** `header` (full width), `aside-left` (the sidebar) and `main`.
- **Default Layout**, as in the design: the Header (Pinned) and Summary in `header`; Skills and Education in `aside-left`; Experience, Projects and Custom Sections in `main`.
- **Default Theme Options:** Pine, Serif (Source Serif 4) and Comfortable, the same as Ledger's.

**Across pages** (checked with a throwaway react-pdf `<Document>`; findings on #105):

- The `header` Zone starts on page 1 and isn't repeated; if it's ever longer than a page, it breaks like Ledger. When it draws nothing, the sidebar and `main` start at the top margin, with no gap above them.
- The sidebar and `main` each carry on onto later pages **in their own place**: the sidebar on the left, `main` on the right. Where one has ended, its place is left white. Neither widens on a later page: react-pdf can't change a View's width from one page to the next.
- `main` has a **fixed width pushed to the right** (`marginLeft: "auto"`), not a flex-grown width. In a plain flex row, once the sidebar ends react-pdf moves `main` to the left edge on the next page at its narrow width, leaving the right of the page empty.
- When the sidebar has **nothing to draw** (every Section in `aside-left` is Empty or Disabled, or none is there), `main` takes the full width. When `main` has nothing to draw, the sidebar takes the full width. Either way the page reads as one column.
- Inside the sidebar and `main`, Ledger's rules hold: a Section's title stays on one page with its first Entry's lines and first Bullet, each piece that stays on one page sits straight in its Section's View (#100), and each Entry and Bullet sets the space below it, never above.

Where we build something different from `PreviewTwoCol`:

| The design shows | Build this instead |
|---|---|
| A US Letter page (612 × 792), cut off at the bottom | An **A4** page, so `main` is about 307pt wide, not 324. A long Resume **flows onto more pages**, as above |
| Zones named `top`, `side`, `main` | **Our Zones**: `top` is `header`, `side` is `aside-left` |
| A grip, a pin, a move toolbar, Zone and selection outlines, and Ghosted Sections with "Empty" and "Disabled" tags | **None.** The preview is the Export (ADR 0006); Sections are arranged in the Layout tab |
| Skills and Education only ever in the sidebar | **Any Section but the Header in any Zone, drawn the same way in each.** Each uses a form that fits the 164pt sidebar: Skills with the label above its list, as in the design, and an Entry's dates moving below its main line when they don't fit beside it (the design's wrapping line) |
| A "Talks" Section | An example of a **Custom Section** |
| Header links shown as the address (e.g. "github.com/asharao") | **As in Ledger** (row 9 of the first table): each link shows its label, or its URL when it has no label |
| Pine green and Source Serif 4 only | Margin's **defaults**. Its accent, typeface and density come from its Theme Options, as Ledger's do |

## Positions in an Experience Entry (`linted-multi-position-design/`)

`linted-multi-position-design/` is a fifth Claude Design export. An Experience Entry holds the company (Company, Location, Enabled) and one or more **Positions**, each with its own Role, Start, End, Current, Enabled and Bullets. Its own `README.md` describes the files and the data model. Everything above about colours and fonts applies, and so do the Content pane rows of the first table (6, 7, 10 and 11). Where we build something different, or the export leaves it open:

| The design shows | Build this instead |
|---|---|
| Three page options, B1 to B3, none chosen | **B1** (`PreviewTwoColPositions1`): the company in bold with "Location · overall range" on the right, then each Position as an italic role with its own dates, then its Bullets. In **Margin and Ledger** both |
| Positions sorted newest first automatically, when saving | **Never sorted automatically.** Positions stay in the order they're saved, and the form, the preview and the Export all show that order. "Add position" adds one **at the bottom**. When the list is out of date order, a **"Sort by date"** button shows, with lucide's `ArrowDownUp` icon and the note "These positions aren't in date order. Sort them so the most recent one is at the top." Clicking it sorts and saves the list, and the button goes away. It sits at the bottom of the list, just above "Add position", with the note **to its right**, as "Add position" has its hint |
| "Positions · newest first" above the list | **"Positions"** only; the "newest first" label is dropped |
| The closed card of a multi-Position Entry: the latest role and "+1" | **A count instead**: "Parcelwise · 2 positions" |
| The End fields disabled while Current is ticked | **Hidden**, as everywhere (row 10) |
| An outlined "Current" tag | The app's grey **Badge**, as everywhere (row 11) |

**Out of date order** means an Enabled Position sits above another Enabled Position with a later start, or an Enabled Position with no start sits above one with a start. Disabled Positions don't count. Positions with the same start, or both with none, are never out of order, and sorting keeps them in their current order. Dates are compared with a **missing month or day counting as the earliest**: "2022" ties with "Jan 2022" and goes below "Mar 2022". Sorting puts the newest start at the top and Positions with no start at the bottom, and **sorts Disabled Positions with the rest**, though they never make the button show.

**The closed card's header line** counts only Enabled Positions: "2 positions" when two or more are Enabled, the role when only one is, and just the company when none is; then "Current" or the overall range from them. A Position card whose role is blank reads **"New position"** in grey, as an Entry card reads "New entry".

**The Entry's overall range** (B1's company line) comes from its Enabled Positions that have dates; it isn't stored. The start is the earliest Start, and the end the latest End, or **"Present"** when any of them is Current. When two dates tie as far as both go, the vaguer one is shown: "2022" and "Mar 2022" start at **2022**; "Mar 2022" and "2023" start at **Mar 2022**; "Jan 2025" and "2025" end at **2025**.

**What's drawn:** an Entry with its company filled in is always drawn, as today. A Position is drawn when it's Enabled and has a role, dates or a Bullet. When an Entry has **one or no Positions to draw**, it uses today's layout ("Role, Company", then "Location · dates"); with none, that's the company and location only.

**Existing Resumes** are converted when they're read: each Experience Entry becomes an Entry with one Position, keeping its role, dates and Bullets. `SCHEMA_VERSION` stays 1.

**The last Position can't be deleted.** An Entry with one Position shows the single-Position form (Company, Role, Location, dates, Bullets, then "Add position" with the hint "Promoted, or changed roles at the same company?"), with no Position card and so no delete button. Deleting down to one Position brings that form back, and **Enables** that Position if it was Disabled, since the form has no checkbox for it.

## The delete confirmation (no design yet)

"Delete resume" in a row's "…" menu (#13) asks first, in shadcn's **Alert Dialog** styled like the title dialog: same width, radius, shadow and footer strip. It reads "Delete resume?" and "“<title>” will be deleted from this browser. This can't be undone.", with **Cancel** and a red **Delete resume** button. Focus starts on Cancel, and clicking outside doesn't close it. Replace this with a Claude Design export when there is one.
