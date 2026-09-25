import type { Rendered } from "@/lib/resume/renderable-view";
import type { Bullet } from "@/lib/resume/types";
import styles from "./ledger.module.css";

// Prose shows as its Markdown source until the Prose renderer (#16).
export function BulletList({ bullets }: { bullets: Rendered<Bullet>[] }) {
  if (bullets.length === 0) return null;
  return (
    <ul className={styles.bullets}>
      {bullets.map((bullet) => (
        <li key={bullet.id}>
          {bullet.text}
          <BulletList bullets={bullet.children} />
        </li>
      ))}
    </ul>
  );
}
