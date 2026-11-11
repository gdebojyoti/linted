import { Document, Page } from "@react-pdf/renderer";
import type { PlacedSections } from "@/lib/theme/place-sections";
import { LEDGER_ZONES } from "@/themes/ledger/zones";
import { registerLedgerFonts } from "./fonts";
import { LedgerSection } from "./ledger-section";
import { SPACE_BETWEEN_SECTIONS, styles } from "./styles";

registerLedgerFonts();

/**
 * Ledger drawn with react-pdf (ADR 0006): an A4 PDF of the Sections it is
 * given, already filtered and placed into its Zones. A long Resume flows onto
 * more pages, each with the same margins.
 */
export function LedgerDocument({ zones }: { zones: PlacedSections }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {LEDGER_ZONES.flatMap((zone) => zones[zone]).map((section, i) => (
          <LedgerSection
            key={section.id}
            section={section}
            spaceBefore={i === 0 ? 0 : SPACE_BETWEEN_SECTIONS}
          />
        ))}
      </Page>
    </Document>
  );
}
