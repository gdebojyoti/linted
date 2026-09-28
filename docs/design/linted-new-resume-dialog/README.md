# Linted — New resume dialog (design reference)

Exported from the "Secondary screens" group of the Linted design canvas: **New resume dialog A — title only**. These are design specs, not production code. Build from them; don't import them.

| File | What it is |
|---|---|
| `NewResumeTitle.dc.html` | The dialog, drawn over the Library with a dimmed overlay |
| `Library.dc.html` | Backdrop only: Library A, imported by the dialog file with its row menu closed (`openMenu = -1`). Same design as in the Library export |
| `tokens.css` | Colours, type, spacing, radii and shadows (same tokens as the other exports) |

## Reading the files

- Markup is plain HTML with inline styles inside `<x-dc>`.
- `<dc-import name="Library">` renders `Library.dc.html` as the page behind the dialog.
- The dialog markup starts at `role="dialog"`. Everything above it is the overlay.

## Spec

- **Size:** 460px wide, 12px radius, white. Overlay `rgba(26, 26, 24, 0.38)`. Shadow `0 24px 64px rgba(0,0,0,.22)` plus a 1px hairline.
- **Header:** "New resume" (18px, 600) and a close button (32px, `aria-label="Close"`).
- **Body:**
  - Label "Resume title" (13px, 500) wrapping a 40px text input.
  - The focus state is shown: 1px accent border plus a 3px `--accent-tint` ring.
  - Helper text below: "Only you see this. It tells your resumes apart; it isn't the name printed on the page."
- **Footer:** `#FAFAF8` strip with a top hairline, holding the hint "Enter to create · Esc to close" (Geist Mono 11.5px), then **Cancel** (secondary) and **Create resume** (primary).

## Behaviour to port

- **Opens from:** the "New resume" button in the Library header and in the empty state.
- **Accessibility:** `role="dialog"`, `aria-modal="true"`, labelled by the heading. Focus the title input on open, trap focus inside the dialog, and return focus to the button that opened it on close.
- **Title rule (`CONTEXT.md` › Resume Title):**
  - The title must be non-empty after trimming. It need not be unique.
  - Disable **Create resume**, and ignore Enter, while it's empty.
  - The sample value in the design is "Backend — payments v3". The canvas doesn't decide the starting value, so pick one of:
    - start empty and focused, or
    - prefill "Untitled resume" with the text selected, so Enter creates straight away.
- **Keys:** Enter creates. Esc, the close button, Cancel and a click on the overlay all dismiss without creating.
- **On create:**
  - Make a new Resume with its six Default Sections (Header, Summary, Experience, Projects, Skills, Education), all Empty.
  - Default Theme Settings (Ledger, unset Layout, per ADR 0005). Metadata: the title, and created and last-edited times set to now.
  - Save through the persistence module (ADR 0002), then open the new Resume in the editor. It will be first in the Library, since the Library sorts by last edited.
- **Storage failure:** if the save fails (for example because localStorage is full), keep the dialog open and show an error under the input rather than navigating.

Vocabulary follows `CONTEXT.md`.
