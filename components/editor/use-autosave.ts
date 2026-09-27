import { useEffect, useState } from "react";
import { browserLibrary as library } from "@/lib/resume/browser-library";
import type { Resume } from "@/lib/resume/types";
import { debounce } from "@/lib/timing/debounce";

/** How long typing must pause before the Resume is saved. */
const SAVE_DELAY_MS = 500;

function save(resume: Resume) {
  // Telling the user a save failed is #49.
  library.save(resume).catch((error: unknown) => console.error("Saving the Resume failed", error));
}

/**
 * Saves the Resume whenever it changes, once typing pauses. The Resume it
 * started with is already saved, so that one isn't saved again.
 *
 * A waiting save is made at once when the tab is hidden (the last moment a
 * closing tab is sure to run code) and when the editor goes away, e.g. on
 * leaving for the Library. localStorage writes synchronously, so the save is
 * done before either finishes.
 */
export function useAutosave(resume: Resume, initialResume: Resume) {
  const [saveLater] = useState(() => debounce(save, SAVE_DELAY_MS));

  useEffect(() => {
    if (resume !== initialResume) saveLater(resume);
  }, [resume, initialResume, saveLater]);

  useEffect(() => {
    function saveIfHidden() {
      if (document.visibilityState === "hidden") saveLater.flush();
    }
    document.addEventListener("visibilitychange", saveIfHidden);
    return () => {
      document.removeEventListener("visibilitychange", saveIfHidden);
      saveLater.flush();
    };
  }, [saveLater]);
}
