import { StyleSheet } from "@react-pdf/renderer";

/*
 * Ledger's look (docs/design/linted-editor-design/), apart from what the
 * Theme Options change, which is in ./look.ts. The design is drawn on a
 * 612 x 792 page, so its px values are used as pt, on an A4 page.
 * react-pdf's lengths are in pt.
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

/** How far each level of Bullets is indented, in pt. */
export const BULLET_INDENT = 14;

const BULLET_DOT = 3.4;

export const styles = StyleSheet.create({
  page: {
    paddingTop: 46,
    paddingHorizontal: 48,
    paddingBottom: 42,
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
  // No gap: an Entry's pieces sit straight in here (see EntryBlock), so the
  // space between them is set on each piece.
  entries: {
    flexDirection: "column",
  },
  // An Entry's lines and first Bullet, which stay together on one page.
  entryHead: {
    flexDirection: "column",
    gap: 3,
  },
  // Space above every Entry's head but the first.
  laterEntry: {
    marginTop: 8,
  },

  // A line with the main facts on the left and dates or results on the right.
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
  },
  lineMain: {
    flexShrink: 1,
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
  // Space above every Bullet of an Entry after its first.
  bulletAfterFirst: {
    marginTop: 2,
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

  // Skills

  skills: {
    flexDirection: "column",
    gap: 2,
  },
  skillsEntry: {
    flexDirection: "row",
    gap: 10,
  },
  skillsLabel: {
    flexShrink: 0,
    width: 88,
    fontWeight: 600,
  },
  skillsList: {
    flexShrink: 1,
  },
});
