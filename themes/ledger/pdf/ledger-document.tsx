import { Document, Page } from "@react-pdf/renderer";
import type { ResolvedThemeOptions } from "@/lib/resume/theme-options";
import type { PlacedSections } from "@/lib/theme/place-sections";
import { LEDGER_ZONES } from "@/themes/ledger/zones";
import { registerLedgerFonts } from "./fonts";
import { LedgerSection } from "./ledger-section";
import { ledgerLook, LedgerLookContext } from "./look";
import { styles } from "./styles";

registerLedgerFonts();

/**
 * Ledger drawn with react-pdf (ADR 0006): an A4 PDF of the Sections it is
 * given, already filtered and placed into its Zones, in the Resume's Theme
 * Options (#89). A long Resume flows onto more pages, each with the same
 * margins.
 */
export function LedgerDocument({ zones, options }: { zones: PlacedSections; options: ResolvedThemeOptions }) {
  const look = ledgerLook(options);
  return (
    <LedgerLookContext value={look}>
      <Document>
        <Page size="A4" style={[styles.page, { fontFamily: look.fontFamily, lineHeight: look.lineHeight }]}>
          {LEDGER_ZONES.flatMap((zone) => zones[zone]).map((section, i) => (
            <LedgerSection
              key={section.id}
              section={section}
              spaceBefore={i === 0 ? 0 : look.spaceBetweenSections}
            />
          ))}
        </Page>
      </Document>
    </LedgerLookContext>
  );
}
