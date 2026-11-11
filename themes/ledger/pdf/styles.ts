import { StyleSheet } from "@react-pdf/renderer";
import { LEDGER_FONT_FAMILY } from "./fonts";

/*
 * Ledger's look, the same as the HTML Ledger (../ledger.module.css). The
 * design is drawn on a 612 x 792 page, so its px values are used as pt, on an
 * A4 page. react-pdf's lengths are in pt.
 */

export const colors = {
  ink: "#1f1f1d",
  inkMuted: "#45453f",
  rule: "#d6d6d0",
  /** Pine green (docs/design/NOTES.md), for headings and links. */
  accent: "#17784a",
};

const BODY_SIZE = 9.5;
const META_SIZE = 8.75;
const SECTION_TITLE_SIZE = 8.55;

/** The height of one line of body text, in pt. */
const BODY_LINE_HEIGHT = BODY_SIZE * 1.42;

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
    fontFamily: LEDGER_FONT_FAMILY,
    fontSize: BODY_SIZE,
    lineHeight: 1.42,
    // No "fi", "ff" or "ft" ligatures: some PDF readers, such as applicant
    // tracking systems, read a ligature as one letter ("trafc").
    fontFeatureSettings: { liga: false },
  },
  zones: {
    flexDirection: "column",
    gap: 14,
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
    color: colors.accent,
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

  // Each Section's title is drawn by its first Entry (see LedgerSection).
  sectionTitle: {
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: colors.rule,
    borderBottomStyle: "solid",
    color: colors.accent,
    fontSize: SECTION_TITLE_SIZE,
    fontWeight: 600,
    letterSpacing: SECTION_TITLE_SIZE * 0.12,
    textTransform: "uppercase",
  },
  summary: {
    flexDirection: "column",
    gap: 5,
  },
  entries: {
    flexDirection: "column",
    gap: 8,
  },
  // An Entry's lines and first Bullet, which stay together on one page.
  entryHead: {
    flexDirection: "column",
    gap: 3,
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

  bulletsAfterFirst: {
    flexDirection: "column",
    gap: 2,
    marginTop: 2,
  },
  bullet: {
    flexDirection: "row",
  },
  // The marker sits in the indent, like a list marker on the web.
  bulletMarker: {
    flexShrink: 0,
    width: BULLET_INDENT,
    height: BODY_LINE_HEIGHT,
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
