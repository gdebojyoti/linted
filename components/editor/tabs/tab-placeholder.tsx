import type { ReactNode } from "react";
import { Notice } from "@/components/common/notice";

/** Stands in for a tab's panel until that tab is built (Layout and Theme have their own tickets). */
export function TabPlaceholder({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-6 pt-32">
      <Notice title={title}>{children}</Notice>
    </div>
  );
}
