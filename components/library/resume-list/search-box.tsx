import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Searching the Library by Resume Title. Esc empties it (the browser's own search box behaviour). */
export function SearchBox({ query, onQueryChange }: { query: string; onQueryChange: (query: string) => void }) {
  return (
    <label className="relative flex items-center">
      <Search className="pointer-events-none absolute left-2.5 size-3.75 text-ink-disabled" aria-hidden="true" />
      <Input
        type="search"
        aria-label="Search resumes by title"
        placeholder="Search by title"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className="h-9 w-70 rounded-md border-line-input bg-surface pr-3 pl-8.5 text-[13px] text-ink placeholder:text-ink-meta focus-visible:border-accent focus-visible:ring-accent-tint md:text-[13px]"
      />
    </label>
  );
}
