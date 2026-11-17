import { Notice } from "@/components/common/notice";

/** In place of the list when no Resume Title contains the search. */
export function NoMatches({ query }: { query: string }) {
  return (
    <div className="flex justify-center py-20">
      <Notice title="No matching resumes">
        No resume title contains &ldquo;{query.trim()}&rdquo;.
      </Notice>
    </div>
  );
}
