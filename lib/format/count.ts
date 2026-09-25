/** "1 entry", "3 entries". */
export function formatCount(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
