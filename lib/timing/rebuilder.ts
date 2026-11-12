type Options<In, Out> = {
  build: (input: In) => Promise<Out>;
  /** How long requests must pause before the last one is built, in ms. */
  wait: number;
  /** Gets each build that is still for the newest request when it finishes. */
  onBuilt: (output: Out) => void;
  /** Gets the newest request's build when it fails. */
  onFailed?: (error: unknown) => void;
  /** Build the very first request without waiting, as the preview shows its first PDF as soon as it can. */
  firstAtOnce?: boolean;
};

/** A request, and its build once started. A new object each time, so a stale one is told apart even with the same input. */
type Request<In, Out> = { input: In; output?: Promise<Out> };

/**
 * Builds the last of a run of requests once they pause, as the preview's PDF
 * is rebuilt once typing pauses. Builds run one at a time, and a build that a
 * newer request has made stale is dropped, never handed on. `now` builds the
 * newest request at once, or gives back its build if one has started, as
 * Export needs the up-to-date file.
 */
export function rebuilder<In, Out>({ build, wait, onBuilt, onFailed, firstAtOnce = false }: Options<In, Out>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let latest: Request<In, Out> | null = null;
  /** Settles when the build running now does, so the next one waits for it. */
  let queue: Promise<unknown> = Promise.resolve();

  function run(request: Request<In, Out>): Promise<Out> {
    if (request.output) return request.output;
    const output = queue.then(() => build(request.input));
    request.output = output;
    queue = output.catch(() => {});
    output.then(
      (built) => latest === request && onBuilt(built),
      (error: unknown) => {
        // Forgotten, so the next now() tries again.
        request.output = undefined;
        if (latest === request) onFailed?.(error);
      },
    );
    return output;
  }

  return {
    request(input: In) {
      const first = latest === null;
      const request: Request<In, Out> = { input };
      latest = request;
      clearTimeout(timer);
      if (first && firstAtOnce) run(request).catch(() => {}); // onFailed has it
      else timer = setTimeout(() => run(request), wait);
    },
    /** The newest request's build. Fails if nothing was requested, or if the build fails. */
    now(): Promise<Out> {
      if (!latest) return Promise.reject(new Error("Nothing has been requested"));
      clearTimeout(timer);
      return run(latest);
    },
  };
}
