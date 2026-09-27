import { useEffect, useState } from "react";
import type { Theme } from "@/themes/theme";
import { themeFor } from "@/themes/theme-for";

/** The Theme with this id, or null while it loads. */
export function useTheme(themeId: string): Theme | null {
  const [loaded, setLoaded] = useState<{ id: string; theme: Theme } | null>(null);

  useEffect(() => {
    let current = true;
    themeFor(themeId).then((theme) => current && setLoaded({ id: themeId, theme }));
    return () => {
      current = false;
    };
  }, [themeId]);

  // A Theme loaded for another id is never shown.
  return loaded?.id === themeId ? loaded.theme : null;
}
