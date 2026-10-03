import { useId } from "react";
import { INPUT_CLASS } from "./input-class";

/**
 * A labelled single-line text input, styled as in the editor design. An error
 * shows underneath it and is read out with the field.
 *
 * NOTE: This may be replaced with shadcn/ui's Input (and Label) in the future.
 */
export function TextField({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  error,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  error?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  const errorId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={INPUT_CLASS}
      />
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
