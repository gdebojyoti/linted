// Copied from Ledger (themes/ledger/pdf/styles.ts), so each Theme stays independent.
// Changed for Margin: the sidebar and main column, Skills with the label above
// its list, Education's stacked lines, and an Entry's dates moving below
// its main line when they don't fit beside it.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

import { StyleSheet } from "@react-pdf/renderer";

/*
 * Margin's look (docs/design/linted-editor-tabs-design/PreviewTwoCol.dc.html),
 * apart from what the Theme Options change, which is in ./look.ts. The design
 * is drawn on a 612 x 792 page, so its px values are used as pt, on an A4
 * page. react-pdf's lengths are in pt.
 */

export const colors = {
  ink: "#1f1f1d",
  inkMuted: "#45453f",
  rule: "#d6d6d0",
};

/** The size of body text, in pt. */
export const BODY_SIZE = 9.5;
const META_SIZE = 8.75;
const SECTION_TITLE_SIZE = 8.55;

/** Space between a Summary's paragraphs, in pt. */
export const SPACE_BETWEEN_PARAGRAPHS = 5;

/** Space between Entries, in pt. */
export const SPACE_BETWEEN_ENTRIES = 8;

/** Space between an Experience Entry's Positions, in pt. */
export const SPACE_BETWEEN_POSITIONS = 6;

/** Space between an Entry's Bullets, in pt. */
export const SPACE_BETWEEN_BULLETS = 2;

/** The page's bottom margin, in pt: nothing is drawn below it. */
export const PAGE_BOTTOM_MARGIN = 42;

/** How far each level of Bullets is indented, in pt. */
export const BULLET_INDENT = 14;

const BULLET_DOT = 3.4;

const PAGE_SIDE_MARGIN = 48;

/** A4's width, in pt. */
const A4_WIDTH = 595.28;

const SIDEBAR_WIDTH = 164;
const SPACE_BETWEEN_COLUMNS = 28;

/** What's left of the page for `main` beside the sidebar: about 307pt. */
const MAIN_WIDTH = A4_WIDTH - 2 * PAGE_SIDE_MARGIN - SIDEBAR_WIDTH - SPACE_BETWEEN_COLUMNS;

export const styles = StyleSheet.create({
  page: {
    paddingTop: 46,
    paddingHorizontal: PAGE_SIDE_MARGIN,
    paddingBottom: PAGE_BOTTOM_MARGIN,
    backgroundColor: "#ffffff",
    color: colors.ink,
    fontSize: BODY_SIZE,
    // No "fi", "ff" or "ft" ligatures: some PDF readers, such as applicant
    // tracking systems, read a ligature as one letter ("trafc").
    fontFeatureSettings: { liga: false },
  },
  muted: {
    color: colors.inkMuted,
  },
  strong: {
    fontWeight: 600,
  },
  italic: {
    fontStyle: "italic",
  },
  link: {
    textDecoration: "none",
  },

  // Columns

  // The sidebar and `main` side by side, each carrying on onto later pages
  // in its own place (docs/design/NOTES.md, the Margin page).
  columns: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  sidebar: {
    flexDirection: "column",
    flexShrink: 0,
    width: SIDEBAR_WIDTH,
  },
  // A fixed width pushed to the right, not a flex-grown one: once the sidebar
  // ends, react-pdf would otherwise draw `main` at the left edge of later
  // pages, at its narrow width.
  main: {
    flexDirection: "column",
    flexShrink: 0,
    width: MAIN_WIDTH,
    marginLeft: "auto",
  },

  // Header

  header: {
    flexDirection: "column",
    gap: 4,
  },
  name: {
    fontSize: 22.8,
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: 22.8 * -0.01,
  },
  headline: {
    fontSize: 10.6,
    color: colors.inkMuted,
  },
  contacts: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 2,
    columnGap: 12,
    marginTop: 3,
    fontSize: META_SIZE,
    color: colors.inkMuted,
  },

  // Sections

  // 5pt under the title, plus the 3pt gap in an Entry's head before its line.
  sectionTitle: {
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: colors.rule,
    borderBottomStyle: "solid",
    fontSize: SECTION_TITLE_SIZE,
    fontWeight: 600,
    letterSpacing: SECTION_TITLE_SIZE * 0.12,
    textTransform: "uppercase",
  },
  // No gap: an Entry's pieces sit straight in here (see EntryBlock), and
  // each sets the space below it.
  entries: {
    flexDirection: "column",
  },
  // An Entry's lines and first Bullet, which stay together on one page.
  entryHead: {
    flexDirection: "column",
    gap: 3,
  },

  // A line with the main facts on the left and dates or results on the
  // right, which move below the main facts when they don't fit beside them.
  line: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "baseline",
    columnGap: 12,
  },
  lineMain: {
    flexShrink: 1,
  },
  // A multi-Position Entry's company line: 4pt above the first role, 1pt
  // more than the Entry head's gap.
  companyLine: {
    marginBottom: 1,
  },
  meta: {
    flexShrink: 0,
    fontSize: META_SIZE,
    color: colors.inkMuted,
  },

  // Bullets

  bullet: {
    flexDirection: "row",
  },
  // The marker sits in the indent, like a list marker on the web.
  bulletMarker: {
    flexShrink: 0,
    width: BULLET_INDENT,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 5.5,
    paddingBottom: 1.4,
  },
  bulletDot: {
    width: BULLET_DOT,
    height: BULLET_DOT,
    borderRadius: BULLET_DOT / 2,
    backgroundColor: colors.ink,
  },
  bulletDotHollow: {
    width: BULLET_DOT,
    height: BULLET_DOT,
    borderRadius: BULLET_DOT / 2,
    borderWidth: 0.6,
    borderColor: colors.ink,
    borderStyle: "solid",
  },
  // Takes the rest of the row, so long lines wrap at the margin.
  bulletText: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  // Skills: each label above its list, so they fit the sidebar.

  skills: {
    flexDirection: "column",
    gap: 6,
  },
  skillsEntry: {
    flexDirection: "column",
    gap: 1,
  },
  skillsLabel: {
    fontWeight: 600,
  },

  // Education: the school, the degree, then the place, years and results.

  educationLines: {
    flexDirection: "column",
    gap: 1,
  },
});
