import { Search } from "lucide-react";

/** Searching by Resume Title. Shown but disabled until search is built. */
export function SearchBox() {
  return (
    <label className="relative flex items-center">
      <Search
        className="pointer-events-none absolute left-2.5 size-3.75 text-ink-disabled"
        aria-hidden="true"
      />
      <input
        type="search"
        aria-label="Search resumes by title"
        placeholder="Search by title"
        disabled
        className="h-9 w-70 rounded-md border border-line-input bg-surface pr-3 pl-8.5 text-[13px] text-ink placeholder:text-ink-meta disabled:cursor-not-allowed disabled:bg-app"
      />
    </label>
  );
}
