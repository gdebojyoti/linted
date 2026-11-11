import { Pin } from "lucide-react";
import { Badge } from "@/components/common/badge";
import { layoutTag } from "@/lib/resume/layout";
import type { Section } from "@/lib/resume/types";

/** A Pinned Section (the Header) in the Layout tab: always first in its Zone, so it has no handle or arrows. */
export function PinnedRow({ section }: { section: Section }) {
  const tag = layoutTag(section);
  return (
    <li className="flex h-10 items-center gap-2.5 rounded-md bg-app px-3 text-ink-muted">
      <Pin aria-hidden="true" className="size-3.5" />
      <span className="text-[13.5px] font-medium text-ink">{section.title}</span>
      {tag && <Badge>{tag}</Badge>}
      <span className="grow" />
      <span className="text-[11px]">Pinned · always first</span>
    </li>
  );
}
