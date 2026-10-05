import type { ReactNode } from "react";

/**
 * The editor's screen: the top bar, and under it the panes or a note in
 * their place. Loading, the editor itself and its error screens all use it,
 * so the layout never jumps from one to the next.
 */
export function EditorFrame({ topBar, children }: { topBar: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {topBar}
      <div className="flex min-h-0 grow">{children}</div>
    </div>
  );
}
