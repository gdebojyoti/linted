import type { Rendered } from "@/lib/resume/renderable-view";
import type { Bullet } from "@/lib/resume/types";
import { parseProse } from "@/lib/prose/parse-prose";
import styles from "./ledger.module.css";
import { ProseText } from "./prose-text";

export function BulletList({ bullets }: { bullets: Rendered<Bullet>[] }) {
  if (bullets.length === 0) return null;
  return (
    <ul className={styles.bullets}>
      {bullets.map((bullet) => (
        <li key={bullet.id}>
          <ProseText nodes={parseProse(bullet.text)} />
          <BulletList bullets={bullet.children} />
        </li>
      ))}
    </ul>
  );
}
