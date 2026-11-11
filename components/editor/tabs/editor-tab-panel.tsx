import type { ReactNode } from "react";
import { TabsContent } from "@/components/ui/tabs";
import type { EditorTab } from "./editor-tab";

/**
 * One tab's panel in the left pane. Kept mounted while another tab is shown,
 * so coming back finds it as it was (which Section is open, for example).
 */
export function EditorTabPanel({ value, children }: { value: EditorTab; children: ReactNode }) {
  return (
    <TabsContent
      value={value}
      keepMounted
      className="flex min-h-0 flex-col text-base focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
    >
      {children}
    </TabsContent>
  );
}
