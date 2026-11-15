import { Document, Page, View } from "@react-pdf/renderer";
import type { RenderedSection } from "@/lib/resume/renderable-view";
import type { ResolvedThemeOptions } from "@/lib/resume/theme-options";
import type { PlacedSections } from "@/lib/theme/place-sections";
import { registerFonts } from "@/themes/fonts/fonts";
import { MarginSection } from "./margin-section";
import { marginLook, MarginLookContext } from "./look";
import { styles } from "./styles";

registerFonts();

/**
 * Margin drawn with react-pdf (ADR 0006): an A4 PDF of the Sections it is
 * given, already filtered and placed into its Zones, in the Resume's Theme
 * Options. The `header` Zone runs across the top of page 1, then the sidebar
 * (`aside-left`) and `main` sit side by side, each carrying on onto later
 * pages in its own place. When either column has nothing to draw, the other
 * takes the full width (docs/design/NOTES.md, the Margin page; #105).
 */
export function MarginDocument({ zones, options }: { zones: PlacedSections; options: ResolvedThemeOptions }) {
  const look = marginLook(options);
  const headerZone = zones.header;
  const sidebar = zones["aside-left"];
  const main = zones.main;
  const belowHeaderZone = headerZone.length > 0 ? look.spaceBetweenSections : 0;

  /** A Zone's Sections, the first `spaceBefore` pt below what's above it. */
  const draw = (sections: RenderedSection[], spaceBefore = 0) =>
    sections.map((section, i) => (
      <MarginSection
        key={section.id}
        section={section}
        spaceBefore={i === 0 ? spaceBefore : look.spaceBetweenSections}
      />
    ));

  return (
    <MarginLookContext value={look}>
      <Document>
        <Page size="A4" style={[styles.page, { fontFamily: look.fontFamily, lineHeight: look.lineHeight }]}>
          {draw(headerZone)}
          {sidebar.length > 0 && main.length > 0 ? (
            <View style={[styles.columns, { marginTop: belowHeaderZone }]}>
              <View style={styles.sidebar}>{draw(sidebar)}</View>
              <View style={styles.main}>{draw(main)}</View>
            </View>
          ) : (
            draw(sidebar.length > 0 ? sidebar : main, belowHeaderZone)
          )}
        </Page>
      </Document>
    </MarginLookContext>
  );
}
