import { Skeleton } from "@/components/ui/skeleton";
import { ContentPaneFrame } from "./content-pane-frame";

/** Title widths for the six Default Sections every Resume has, so the rows look like them. */
const TITLE_WIDTHS = ["w-14", "w-18", "w-22", "w-17", "w-12", "w-21"];

/**
 * The Content pane while the Resume is read: one row for each Default
 * Section, shaped like the real ones. Screen readers hear "Loading resume…".
 */
export function ContentPaneSkeleton() {
  return (
    <ContentPaneFrame>
      <div className="flex grow flex-col gap-2 px-6 pt-4 pb-8">
        <p role="status" className="sr-only">
          Loading resume…
        </p>
        <ul aria-hidden="true" className="flex flex-col gap-2">
          {TITLE_WIDTHS.map((width) => (
            <li key={width} className="flex min-h-12 items-center gap-2.5 rounded-lg border border-line pr-2 pl-3">
              <Skeleton className="size-4 rounded-sm" />
              <Skeleton className={`h-3.5 ${width}`} />
            </li>
          ))}
        </ul>
      </div>
    </ContentPaneFrame>
  );
}
