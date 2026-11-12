import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { rebuilder } from "./rebuilder";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("rebuilder", () => {
  test("builds the last request once the wait has passed, and hands the result on", async () => {
    const build = vi.fn(async (input: string) => `built ${input}`);
    const onBuilt = vi.fn();
    const builds = rebuilder({ build, wait: 300, onBuilt });

    builds.request("a");
    builds.request("b");
    await vi.advanceTimersByTimeAsync(299);
    expect(build).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(build).toHaveBeenCalledExactlyOnceWith("b");
    expect(onBuilt).toHaveBeenCalledExactlyOnceWith("built b");
  });

  test("with firstAtOnce, builds the first request without waiting, and later ones once they pause", async () => {
    const build = vi.fn(async (input: string) => `built ${input}`);
    const onBuilt = vi.fn();
    const builds = rebuilder({ build, wait: 300, onBuilt, firstAtOnce: true });

    builds.request("a");
    await vi.advanceTimersByTimeAsync(0);
    expect(onBuilt).toHaveBeenCalledExactlyOnceWith("built a");

    builds.request("b");
    await vi.advanceTimersByTimeAsync(299);
    expect(build).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1);
    expect(onBuilt).toHaveBeenLastCalledWith("built b");
  });

  test("builds one at a time, and drops a build that a newer request has made stale", async () => {
    const pending = new Map<string, (output: string) => void>();
    const build = vi.fn((input: string) => new Promise<string>((resolve) => pending.set(input, resolve)));
    const onBuilt = vi.fn();
    const builds = rebuilder({ build, wait: 300, onBuilt });

    builds.request("a");
    await vi.advanceTimersByTimeAsync(300);
    builds.request("b");
    await vi.advanceTimersByTimeAsync(300);
    expect(build).toHaveBeenCalledExactlyOnceWith("a");

    pending.get("a")!("built a");
    await vi.advanceTimersByTimeAsync(0);
    expect(onBuilt).not.toHaveBeenCalled();
    expect(build).toHaveBeenLastCalledWith("b");

    pending.get("b")!("built b");
    await vi.advanceTimersByTimeAsync(0);
    expect(onBuilt).toHaveBeenCalledExactlyOnceWith("built b");
  });

  test("now() builds the last request without waiting, once, and gives back its result", async () => {
    const build = vi.fn(async (input: string) => `built ${input}`);
    const onBuilt = vi.fn();
    const builds = rebuilder({ build, wait: 300, onBuilt });

    builds.request("a");
    await expect(builds.now()).resolves.toBe("built a");
    await expect(builds.now()).resolves.toBe("built a");
    await vi.advanceTimersByTimeAsync(300);

    expect(build).toHaveBeenCalledExactlyOnceWith("a");
    expect(onBuilt).toHaveBeenCalledExactlyOnceWith("built a");
  });

  test("now() gives back the newest request's build when one is already running", async () => {
    let finish: (output: string) => void = () => {};
    const build = vi.fn(() => new Promise<string>((resolve) => (finish = resolve)));
    const builds = rebuilder({ build, wait: 300, onBuilt: () => {} });

    builds.request("a");
    await vi.advanceTimersByTimeAsync(300);
    const exported = builds.now();
    finish("built a");

    await expect(exported).resolves.toBe("built a");
    expect(build).toHaveBeenCalledOnce();
  });

  test("hands on the newest request's failed build, and keeps building after it", async () => {
    const failure = new Error("no font");
    const build = vi.fn(async (input: string) => {
      if (input === "a") throw failure;
      return `built ${input}`;
    });
    const onBuilt = vi.fn();
    const onFailed = vi.fn();
    const builds = rebuilder({ build, wait: 300, onBuilt, onFailed });

    builds.request("a");
    await vi.advanceTimersByTimeAsync(300);
    expect(onFailed).toHaveBeenCalledExactlyOnceWith(failure);

    builds.request("b");
    await vi.advanceTimersByTimeAsync(300);
    expect(onBuilt).toHaveBeenCalledExactlyOnceWith("built b");
  });

  test("now() tries again after the newest request's build failed", async () => {
    let fail = true;
    const build = vi.fn(async (input: string) => {
      if (fail) throw new Error("no font");
      return `built ${input}`;
    });
    const builds = rebuilder({ build, wait: 300, onBuilt: () => {} });

    builds.request("a");
    await expect(builds.now()).rejects.toThrow("no font");
    fail = false;

    await expect(builds.now()).resolves.toBe("built a");
  });
});
