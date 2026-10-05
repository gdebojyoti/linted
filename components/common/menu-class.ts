import { cn } from "@/lib/utils";

/** A "…" menu's popup, as in the Library design. */
export const MENU_CONTENT_CLASS = "w-50 rounded-lg p-1 shadow-[0_8px_24px_rgb(0_0_0/0.12)] ring-1 ring-line-input";

/** Its items, with the app's grey highlight rather than shadcn's accent. */
export const MENU_ITEM_CLASS =
  "h-8.5 gap-2 rounded-[5px] px-2.5 text-[13px] text-ink focus:bg-subtle focus:text-ink [&_svg]:size-3.5";

/** A red item that deletes something, after a divider. */
export const MENU_DANGER_ITEM_CLASS = cn(MENU_ITEM_CLASS, "text-danger focus:text-danger");
