import { brokenLinkMessage } from "@/lib/prose/broken-link-message";

/**
 * Under a Prose field: one line for each link in it that can't become a
 * link, naming it as typed. Renders nothing when there are none. The field
 * points at it with aria-describedby, so `id` is required.
 */
export function BrokenLinksMessage({ id, links }: { id: string; links: string[] }) {
  if (links.length === 0) return null;
  return (
    <div id={id} className="flex flex-col gap-0.5 text-xs text-danger">
      {links.map((link, i) => (
        <p key={i} className="break-words">
          {brokenLinkMessage(link)}
        </p>
      ))}
    </div>
  );
}
