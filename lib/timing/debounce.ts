export type Debounced<Args extends unknown[]> = {
  (...args: Args): void;
  /** Runs the waiting call now, if there is one. */
  flush(): void;
};

/**
 * `fn`, delayed until `wait` ms pass without another call. Only the last
 * call's arguments are used. `flush` runs a waiting call at once, e.g. before
 * the page goes away, so it isn't lost.
 */
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, wait: number): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let waiting: Args | undefined;

  function run() {
    const args = waiting;
    if (args === undefined) return;
    clearTimeout(timer);
    waiting = undefined;
    fn(...args);
  }

  function debounced(...args: Args) {
    waiting = args;
    clearTimeout(timer);
    timer = setTimeout(run, wait);
  }

  debounced.flush = run;

  return debounced;
}
