import { View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { Bullet } from "@/lib/resume/types";
import { BulletRow } from "./bullet-row";
import { styles } from "./styles";

/**
 * An Entry: its lines, then its Bullets. The lines, the first Bullet and any
 * `heading` (the Section's title, given to the first Entry only) stay on one
 * page. A page can break between later Bullets.
 *
 * It's a fragment, not a View: each piece that stays on one page sits
 * straight in the Section's View. Inside a wrapper, a piece that doesn't fit
 * at the bottom of a page can be drawn past the margin, because react-pdf
 * then only looks at what comes before it in the wrapper (#100).
 */
export function EntryBlock({
  heading,
  lines,
  bullets,
}: {
  heading?: ReactNode;
  lines: ReactNode;
  bullets: Rendered<Bullet>[];
}) {
  const [first, ...rest] = rows(bullets, 0);
  return (
    <>
      <View style={heading ? styles.entryHead : [styles.entryHead, styles.laterEntry]} wrap={false}>
        {heading}
        {lines}
        {first && <BulletRow bullet={first.bullet} depth={first.depth} />}
      </View>
      {rest.map(({ bullet, depth }) => (
        <BulletRow key={bullet.id} bullet={bullet} depth={depth} afterFirst />
      ))}
    </>
  );
}

/** Each Bullet followed by its children, in reading order. */
function rows(
  bullets: Rendered<Bullet>[],
  depth: number,
): { bullet: Rendered<Bullet>; depth: number }[] {
  return bullets.flatMap((bullet) => [{ bullet, depth }, ...rows(bullet.children, depth + 1)]);
}
