import { Check } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { THEME_CARDS } from "@/lib/theme/theme-cards";
import { themeName } from "@/lib/theme/theme-name";
import { MiniPage } from "./mini-page";

/**
 * The Theme cards (#107): one per Theme, exactly one picked, ringed with a
 * check badge. The cards are one Tab stop; arrow keys move between them, as
 * in any toggle group. Picking the card already picked keeps it picked.
 */
export function ThemePicker({
  themeId,
  accent,
  onPick,
}: {
  themeId: string;
  /** The colour the mini page diagrams draw Section titles in. */
  accent: string;
  onPick: (themeId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <ToggleGroup
        aria-label="Theme"
        value={[themeId]}
        onValueChange={(picked) => {
          const next = picked[0] as string | undefined;
          if (next !== undefined) onPick(next);
        }}
        spacing={3}
        className="grid w-full grid-cols-2"
      >
        {THEME_CARDS.map((card) => (
          <ToggleGroupItem
            key={card.id}
            value={card.id}
            className="h-auto self-stretch justify-start gap-3.5 rounded-xl border border-line bg-surface p-3.5 text-left font-normal whitespace-normal hover:bg-surface-soft aria-pressed:border-accent aria-pressed:bg-surface aria-pressed:ring-3 aria-pressed:ring-accent-tint"
          >
            <MiniPage columns={card.columns} accent={accent} />
            <span className="flex grow flex-col gap-0.75">
              <span className="text-[14px] font-semibold text-ink">{themeName(card.id)}</span>
              <span className="text-[12.5px] text-ink-muted">{card.description}</span>
            </span>
            {card.id === themeId && (
              <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <Check strokeWidth={3} className="size-2.75" />
              </span>
            )}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="text-[12.5px] leading-normal text-ink-muted">
        Switching theme resets your Layout and customizations to the new theme&apos;s defaults. Your content never changes.
      </p>
    </div>
  );
}
