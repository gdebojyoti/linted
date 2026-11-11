import { View } from "@react-pdf/renderer";
import { styles } from "./styles";

/**
 * The dot before a Bullet: filled at the top level and hollow when nested,
 * like the web's disc and circle. Drawn as a shape, not a character, so it
 * never depends on the font having one.
 */
export function BulletMarker({ hollow }: { hollow: boolean }) {
  return (
    <View style={styles.bulletMarker}>
      <View style={hollow ? styles.bulletDotHollow : styles.bulletDot} />
    </View>
  );
}
