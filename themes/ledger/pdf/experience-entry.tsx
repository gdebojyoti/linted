import { View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/format/date-range";
import { positionsDateRange } from "@/lib/resume/position-dates";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { ExperienceEntry as StoredExperienceEntry } from "@/lib/resume/types";
import { joinMeta } from "@/themes/ledger/join-meta";
import { EntryBlock } from "./entry-block";
import { EntryLine } from "./entry-line";
import { SPACE_BETWEEN_POSITIONS, styles } from "./styles";

const NO_DATES = { start: null, current: false, end: null } as const;

/**
 * With one Position (or none) to draw, as before Positions existed:
 *
 *   "Senior Backend Engineer, Paystream        London · Mar 2022 – Present"
 *
 * With more (docs/design/linted-multi-position-design/, B1), the company and
 * its overall range, then each Position's role in italic with its own dates,
 * then its Bullets:
 *
 *   "Parcelwise                          Bengaluru · Mar 2022 – Present"
 *   "Staff Engineer                               Feb 2025 – Present"
 *
 * The company line stays on one page with the first role and its first
 * Bullet; each later role stays with its own first Bullet.
 */
export function ExperienceEntry({
  entry,
  heading,
  spaceAfter,
}: {
  entry: Rendered<StoredExperienceEntry>;
  heading?: ReactNode;
  spaceAfter: number;
}) {
  const { positions } = entry;

  if (positions.length <= 1) {
    const position = positions[0];
    return (
      <EntryBlock
        heading={heading}
        spaceAfter={spaceAfter}
        lines={
          <EntryLine
            strong={position?.role ?? ""}
            rest={entry.company}
            separator=", "
            meta={joinMeta(entry.location, formatDateRange(position?.dates ?? NO_DATES))}
          />
        }
        bullets={position?.bullets ?? []}
      />
    );
  }

  const companyLine = (
    <View style={styles.companyLine}>
      <EntryLine strong={entry.company} meta={joinMeta(entry.location, formatDateRange(positionsDateRange(positions)))} />
    </View>
  );
  return (
    <>
      {positions.map((position, i) => (
        <EntryBlock
          key={position.id}
          heading={i === 0 ? heading : undefined}
          spaceAfter={i < positions.length - 1 ? SPACE_BETWEEN_POSITIONS : spaceAfter}
          lines={
            <>
              {i === 0 && companyLine}
              <EntryLine strong={position.role} emphasis="italic" meta={formatDateRange(position.dates)} />
            </>
          }
          bullets={position.bullets}
        />
      ))}
    </>
  );
}
