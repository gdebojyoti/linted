/**
 * What the editor says about a link that can't become a link (see
 * brokenLinks), naming it as typed.
 */
export function brokenLinkMessage(source: string): string {
  return `${source} isn't a link: its address must start with https://, http:// or mailto:.`;
}
