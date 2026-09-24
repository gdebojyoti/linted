# Prose is stored as Markdown text

Prose fields (Summaries, Bullets) are stored as Markdown source strings supporting only bold, italic and links; any other Markdown syntax renders as literal text. We chose this over storing a rich-text editor's document model (e.g. TipTap/Lexical JSON) because it keeps stored Resumes portable and editor-agnostic, and maps directly to future plain-text/ATS output. Supporting more formatting later means widening the renderer, not migrating data.
