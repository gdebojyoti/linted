import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Searching the Library by Resume Title. Esc empties it (the browser's own
 * search box behaviour). Full width and taller on mobile.
 */
export function SearchBox({ query, onQueryChange }: { query: string; onQueryChange: (query: string) => void }) {
  return (
    <label className="relative flex items-center">
      <Search
        className="pointer-events-none absolute left-3 size-4 text-ink-disabled md:left-2.5 md:size-3.75"
        aria-hidden="true"
      />
      <Input
        type="search"
        aria-label="Search resumes by title"
        placeholder="Search by title"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        // 16px text on mobile, so iOS doesn't zoom in when it's focused.
        className="h-11 w-full rounded-lg border-line-input bg-surface pr-3 pl-9.5 text-base text-ink placeholder:text-ink-meta focus-visible:border-accent focus-visible:ring-accent-tint md:h-9 md:w-70 md:rounded-md md:pl-8.5 md:text-[13px]"
      />
    </label>
  );
}
