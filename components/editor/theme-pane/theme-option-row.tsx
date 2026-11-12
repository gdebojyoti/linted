import { useId } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ThemeOptionChoice<V extends string> = {
  value: V;
  label: string;
  /** A colour to show as a dot before the label, for an accent. */
  swatch?: string;
};

/**
 * One Theme Option: its name, then a card per choice, exactly one picked.
 * The choices are one Tab stop; arrow keys move between them, as in any
 * toggle group. Picking the card already picked keeps it picked.
 */
export function ThemeOptionRow<V extends string>({
  label,
  choices,
  value,
  onChange,
}: {
  label: string;
  choices: ThemeOptionChoice<V>[];
  value: V;
  onChange: (value: V) => void;
}) {
  const labelId = useId();
  return (
    <div className="flex items-start border-b border-line-soft py-2 last:border-b-0">
      <span id={labelId} className="flex h-10 w-35 shrink-0 items-center text-[13px] text-ink-muted">
        {label}
      </span>
      <ToggleGroup
        aria-labelledby={labelId}
        value={[value]}
        onValueChange={(picked) => {
          const next = picked[0] as V | undefined;
          if (next !== undefined) onChange(next);
        }}
        className="min-w-0 flex-1 flex-wrap"
      >
        {choices.map((choice) => (
          <ToggleGroupItem
            key={choice.value}
            value={choice.value}
            className="h-10 gap-2 rounded-lg border border-line bg-surface px-3.5 text-[12px] font-normal text-ink-muted hover:bg-surface-soft hover:text-ink-muted aria-pressed:border-accent aria-pressed:bg-surface aria-pressed:ring-3 aria-pressed:ring-accent-tint"
          >
            {choice.swatch && (
              <span aria-hidden="true" className="size-3.5 shrink-0 rounded-full" style={{ background: choice.swatch }} />
            )}
            {choice.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
