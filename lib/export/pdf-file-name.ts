/** Characters Windows, macOS or Linux don't allow in a file name. */
const FORBIDDEN = /[/\\:*?"<>|]/g;

/** Spaces and dots at either end: Windows drops them at the end, and a leading dot hides the file elsewhere. */
const ENDS = /^[\s.]+|[\s.]+$/g;

/**
 * The name of the PDF file Export downloads: the Resume Title, without the
 * characters file systems forbid, so every browser saves it under the same
 * name. A title with nothing left becomes "Resume".
 */
export function pdfFileName(title: string): string {
  const name = title.replace(FORBIDDEN, "").replace(ENDS, "");
  return `${name || "Resume"}.pdf`;
}
