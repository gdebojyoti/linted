import { linkHref } from "@/lib/format/link-href";

/**
 * The link rule: a link is saved exactly as typed when it starts with
 * http://, https:// or mailto: (see linkHref), and as empty otherwise.
 */
export function allowedLink(url: string): string {
  return linkHref(url) === null ? "" : url;
}
