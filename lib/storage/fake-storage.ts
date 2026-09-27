/**
 * A stand-in for the browser's localStorage, for tests (Node has none).
 * Like the real one, it holds only strings and returns null for missing keys.
 */
export function fakeStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));

  return {
    get length() {
      return items.size;
    },
    key(index: number) {
      return [...items.keys()][index] ?? null;
    },
    getItem(key: string) {
      return items.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      items.set(key, String(value));
    },
    removeItem(key: string) {
      items.delete(key);
    },
  };
}
