const SAFE_SCHEME = /^(https?|mailto):/i;

/**
 * The href for a stored link, or null when it must not become a link: only
 * links starting with http:, https: or mailto: are allowed, so `javascript:`
 * and scheme-less text ("github.com/maya") render as plain text.
 */
export function linkHref(url: string): string | null {
  const trimmed = url.trim();
  return SAFE_SCHEME.test(trimmed) ? trimmed : null;
}
