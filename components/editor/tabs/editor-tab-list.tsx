import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EDITOR_TABS } from "./editor-tab";

/**
 * Content · Layout · Theme, as a segmented control in the top bar. Must sit
 * inside the editor's Tabs, which pairs each tab with its panel in the left
 * pane. Arrow keys, Home and End move between the tabs.
 */
export function EditorTabList() {
  return (
    <TabsList aria-label="Editor panels" className="h-auto gap-0.5 rounded-lg bg-segment p-0.75">
      {EDITOR_TABS.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="h-7.5 flex-none rounded-sm px-4 text-[13px] font-medium text-ink-muted hover:text-ink data-active:text-ink"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
