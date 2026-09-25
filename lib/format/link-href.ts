const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const SAFE_SCHEME = /^(https?|mailto):/i;

/**
 * The href for a user-typed link, or null when it must not become a link.
 * Only http(s) and mailto are allowed, so `javascript:` and the like render
 * as text; a link typed without a scheme ("github.com/maya") gets https.
 */
export function linkHref(url: string): string | null {
  const trimmed = url.trim();
  if (trimmed === "") return null;
  if (!SCHEME.test(trimmed)) return `https://${trimmed}`;
  return SAFE_SCHEME.test(trimmed) ? trimmed : null;
}
