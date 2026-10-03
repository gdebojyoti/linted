import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * A list to pick one part of a date from (its month or day), styled like the
 * editor's inputs. The first option clears the part; while nothing is picked
 * the field shows `placeholder` in grey. Options get the app's grey highlight
 * rather than shadcn's accent.
 */
export function DatePartSelect({
  label,
  placeholder,
  noneLabel,
  value,
  options,
  onChange,
  disabled,
  invalid,
  describedBy,
}: {
  /** Names the field for screen readers, e.g. "Start month". */
  label: string;
  placeholder: string;
  /** The option that clears the part, e.g. "No month". */
  noneLabel: string;
  value: number | null;
  options: { value: number; label: string }[];
  onChange: (value: number | null) => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  const shown = (picked: number | null) =>
    picked === null ? (
      <span className="text-ink-meta">{placeholder}</span>
    ) : (
      (options.find((option) => option.value === picked)?.label ?? `${picked}`)
    );

  return (
    <Select<number | null> value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="h-9 w-full rounded-sm border-line-input bg-surface pl-2.5 text-[13px] text-ink focus-visible:border-accent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-accent-tint aria-invalid:border-danger aria-invalid:ring-0 data-[size=default]:h-9"
      >
        <SelectValue>{shown}</SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-lg p-1 shadow-[0_8px_24px_rgb(0_0_0/0.12)] ring-1 ring-line-input">
        {[{ value: null, label: noneLabel }, ...options].map((option) => (
          <SelectItem
            key={option.value ?? "none"}
            value={option.value}
            className="h-8 rounded-[5px] pl-2.5 text-[13px] text-ink focus:bg-subtle focus:text-ink"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
