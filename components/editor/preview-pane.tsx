// The preview area belongs to the app; everything inside the page belongs to
// the Theme (#15). The page itself stays at its real A4 size, so the preview
// and the printed PDF share one layout; only the wrapper shrinks it on screen.

export function PreviewPane() {
  return (
    <main className="flex min-w-0 grow flex-col bg-preview">
      <div className="flex h-11 shrink-0 items-center border-b border-line bg-app px-5">
        <span className="text-[13px] font-semibold">Preview</span>
      </div>
      <div className="flex grow justify-center overflow-auto p-6">
        <div className="h-fit shrink-0 shadow-page [zoom:0.75]">
          <div aria-label="Resume page" className="h-[297mm] w-[210mm] bg-white" />
        </div>
      </div>
    </main>
  );
}
