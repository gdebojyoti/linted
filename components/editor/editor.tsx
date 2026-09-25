import type { Resume } from "@/lib/resume/types";
import { ContentPane } from "./content-pane/content-pane";
import { PreviewPane } from "./preview-pane/preview-pane";
import { TopBar } from "./top-bar/top-bar";

export function Editor({ resume }: { resume: Resume }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar resumeTitle={resume.metadata.title} />
      <div className="flex min-h-0 grow">
        <ContentPane sections={resume.content.sections} />
        <PreviewPane resume={resume} />
      </div>
    </div>
  );
}
