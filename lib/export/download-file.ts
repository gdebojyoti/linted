/**
 * Saves a file the app made, as if the user had clicked a download link to
 * it. The link is added to the page while it's clicked, as Firefox needs.
 *
 * The file's URL is released a while later, not at once: Safari can still be
 * reading it after the click returns.
 */
export function downloadFile(file: Blob, name: string): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
