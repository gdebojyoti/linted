// A labelled single-line text input, styled as in the editor design.
//
// NOTE: This may be replaced with shadcn/ui's Input (and Label) in the future.

export function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-ink-muted">
      {label}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-sm border border-line-input bg-surface px-2.5 text-[13px] font-normal text-ink focus:border-accent focus:outline-2 focus:outline-accent-tint"
      />
    </label>
  );
}
