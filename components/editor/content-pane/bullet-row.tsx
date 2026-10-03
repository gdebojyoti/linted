import { IndentDecrease, IndentIncrease } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { brokenLinks } from "@/lib/prose/parse-prose";
import type { BulletLine } from "@/lib/resume/bullet-lines";
import { BrokenLinksMessage } from "./broken-links-message";
import { DeleteEntryButton } from "./delete-entry-button";

/**
 * One Bullet: its Enabled checkbox, its Prose typed as Markdown (ADR 0004)
 * in a field that grows with its text, and its actions. A child Bullet sits
 * indented behind a rule. Screen readers hear "Bullet 1", "Bullet 1.1"…
 *
 * Its text is grey while it won't be shown: when it's Disabled, or its
 * parent is. The one indent button nests a top-level Bullet (not the first,
 * which has nothing above it) or un-nests a child; staying the same button
 * keeps focus on it as the Bullet moves.
 */
export function BulletRow({
  line,
  hintId,
  onTextChange,
  onEnabledChange,
  onNest,
  onUnnest,
  onDelete,
  autoFocus,
}: {
  line: BulletLine;
  /** The formatting hint every Bullet's field points at. */
  hintId: string;
  onTextChange: (text: string) => void;
  onEnabledChange: (enabled: boolean) => void;
  onNest: () => void;
  onUnnest: () => void;
  onDelete: () => void;
  autoFocus?: boolean;
}) {
  const errorId = useId();
  const { bullet, number, nested, canNest, parentEnabled } = line;
  const name = `Bullet ${number}`;
  const broken = brokenLinks(bullet.text);
  const shown = bullet.enabled && parentEnabled;

  return (
    <li className={nested ? "ml-6.5 border-l border-line py-1 pl-2.5" : "py-1"}>
      <div className="flex items-start gap-2">
        <div className="flex h-9 shrink-0 items-center">
          <Checkbox
            checked={bullet.enabled}
            onCheckedChange={(enabled) => onEnabledChange(enabled)}
            aria-label={`${name} enabled`}
          />
        </div>
        <div className="flex min-w-0 grow flex-col gap-1.5">
          <Textarea
            aria-label={name}
            value={bullet.text}
            onChange={(event) => onTextChange(event.target.value)}
            autoFocus={autoFocus}
            aria-invalid={broken.length > 0 || undefined}
            aria-describedby={broken.length > 0 ? `${errorId} ${hintId}` : hintId}
            className={`min-h-9 py-1.5 text-[13px] md:text-[13px] supports-[field-sizing:content]:resize-none ${shown ? "" : "text-ink-disabled"}`}
          />
          <BrokenLinksMessage id={errorId} links={broken} />
        </div>
        <div className="flex h-9 shrink-0 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={nested ? onUnnest : onNest}
            disabled={!nested && !canNest}
            aria-label={nested ? `Un-nest ${name}` : `Nest ${name}`}
          >
            {nested ? <IndentDecrease aria-hidden="true" /> : <IndentIncrease aria-hidden="true" />}
          </Button>
          <DeleteEntryButton label={`Delete ${name}`} onClick={onDelete} />
        </div>
      </div>
    </li>
  );
}
