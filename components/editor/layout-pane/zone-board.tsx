import type { ReactNode } from "react";
import type { ZoneArrangement } from "@/lib/resume/layout";
import type { Layout, Zone } from "@/lib/resume/types";
import { ZoneBox } from "./zone-box";
import { ZONE_WORDS, type ZonePlace } from "./zone-words";

/**
 * The Layout tab's Zones as the page has them (`EditorTabLayout.dc.html`):
 * the top Zone across the full width, then the sidebar beside main. The two
 * columns share the width as in the design; when the pane is too narrow for
 * that (below about 520px), the sidebar sits above main.
 *
 * `item` draws a Section's row (a chip, or the Pinned Header). Each box takes
 * drops at its end, as `accepts` and `onDrop` say for its Zone.
 */
export function ZoneBoard({
  arrangement,
  layout,
  item,
  accepts,
  onDrop,
}: {
  arrangement: Extract<ZoneArrangement, { kind: "top-sidebar-main" }>;
  layout: Layout;
  item: (sectionId: string) => ReactNode;
  accepts: (zone: Zone, sourceId: string) => boolean;
  onDrop: (zone: Zone, sourceId: string) => void;
}) {
  const box = (place: ZonePlace, className?: string) => {
    const zone = arrangement[place];
    return (
      <ZoneBox
        label={ZONE_WORDS[place].label}
        name={ZONE_WORDS[place].name}
        accepts={(sourceId) => accepts(zone, sourceId)}
        onDrop={(sourceId) => onDrop(zone, sourceId)}
        className={className}
      >
        {(layout[zone] ?? []).map(item)}
      </ZoneBox>
    );
  };
  return (
    <div className="group/board @container flex flex-col gap-3">
      {box("top")}
      <div className="grid gap-3 @md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {box("sidebar", "@md:min-h-55")}
        {box("main", "@md:min-h-55")}
      </div>
    </div>
  );
}
