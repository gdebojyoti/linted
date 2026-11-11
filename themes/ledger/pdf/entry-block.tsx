import { View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { Bullet } from "@/lib/resume/types";
import { BulletRow } from "./bullet-row";
import { styles } from "./styles";

/**
 * An Entry: its lines, then its Bullets. The lines, the first Bullet and any
 * `heading` (the Section's title) stay on one page. A page can break between
 * later Bullets.
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
    <View>
      <View style={styles.entryHead} wrap={false}>
        {heading}
        {lines}
        {first && <BulletRow bullet={first.bullet} depth={first.depth} />}
      </View>
      {rest.length > 0 && (
        <View style={styles.bulletsAfterFirst}>
          {rest.map(({ bullet, depth }) => (
            <BulletRow key={bullet.id} bullet={bullet} depth={depth} />
          ))}
        </View>
      )}
    </View>
  );
}

/** Each Bullet followed by its children, in reading order. */
function rows(
  bullets: Rendered<Bullet>[],
  depth: number,
): { bullet: Rendered<Bullet>; depth: number }[] {
  return bullets.flatMap((bullet) => [{ bullet, depth }, ...rows(bullet.children, depth + 1)]);
}
