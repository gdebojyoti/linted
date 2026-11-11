import { Text, View } from "@react-pdf/renderer";
import { parseProse } from "@/lib/prose/parse-prose";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { Bullet } from "@/lib/resume/types";
import { BulletMarker } from "./bullet-marker";
import { ProseText } from "./prose-text";
import { BULLET_INDENT, styles } from "./styles";

/** One Bullet, indented by its depth, never split across pages. */
export function BulletRow({ bullet, depth }: { bullet: Rendered<Bullet>; depth: number }) {
  return (
    <View style={[styles.bullet, { paddingLeft: depth * BULLET_INDENT }]} wrap={false}>
      <BulletMarker hollow={depth > 0} />
      <Text style={styles.bulletText}>
        <ProseText nodes={parseProse(bullet.text)} />
      </Text>
    </View>
  );
}
