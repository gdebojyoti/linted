import { useId, useRef, useState } from "react";
import { bulletLines } from "@/lib/resume/bullet-lines";
import {
  addBullet,
  deleteBullet,
  nestBullet,
  setBulletEnabled,
  unnestBullet,
  updateBullet,
} from "@/lib/resume/bullets";
import type { Bullet, ResumeEdit } from "@/lib/resume/types";
import { AddEntryButton } from "./add-entry-button";
import { BulletRow } from "./bullet-row";

/**
 * An Entry's Bullets, for every Section whose Entries have them. They're
 * listed as one list in reading order, children indented under their
 * parent, so nesting and un-nesting never move a row and the user keeps
 * their place. Bullets go two levels deep: a child Bullet can only be
 * un-nested. There's no reordering in v1.
 *
 * A new Bullet gets focus, and after a delete focus moves to the add
 * button. Deleting a Bullet deletes its children too, straight away.
 */
export function BulletsFields({
  entryId,
  bullets,
  onEdit,
}: {
  entryId: string;
  bullets: Bullet[];
  onEdit: (edit: ResumeEdit) => void;
}) {
  const labelId = useId();
  const hintId = useId();
  const [addedId, setAddedId] = useState<string | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  function add() {
    const id = crypto.randomUUID();
    onEdit((resume) => addBullet(resume, entryId, { newId: () => id }));
    setAddedId(id);
  }

  function remove(bulletId: string) {
    onEdit((resume) => deleteBullet(resume, bulletId));
    addButtonRef.current?.focus();
  }

  const lines = bulletLines(bullets);

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span id={labelId} className="text-xs font-medium text-ink-muted">
          Bullets
        </span>
        <span className="grow" />
        <span id={hintId} className="text-[11px] text-ink-meta">
          **bold** · *italic* · [text](https://…)
        </span>
      </div>
      {lines.length > 0 && (
        <ul className="flex flex-col">
          {lines.map((line) => {
            const bulletId = line.bullet.id;
            return (
              <BulletRow
                key={bulletId}
                line={line}
                hintId={hintId}
                onTextChange={(text) => onEdit((r) => updateBullet(r, bulletId, text))}
                onEnabledChange={(enabled) => onEdit((r) => setBulletEnabled(r, bulletId, enabled))}
                onNest={() => onEdit((r) => nestBullet(r, bulletId))}
                onUnnest={() => onEdit((r) => unnestBullet(r, bulletId))}
                onDelete={() => remove(bulletId)}
                autoFocus={bulletId === addedId}
              />
            );
          })}
        </ul>
      )}
      <AddEntryButton ref={addButtonRef} onClick={add}>
        Add bullet
      </AddEntryButton>
    </div>
  );
}
