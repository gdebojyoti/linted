import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { debounce } from "./debounce";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("debounce", () => {
  test("calls once, with the last arguments, after the wait", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced("a");
    debounced("b");
    vi.advanceTimersByTime(499);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledExactlyOnceWith("b");
  });

  test("each call restarts the wait", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced("a");
    vi.advanceTimersByTime(400);
    debounced("b");
    vi.advanceTimersByTime(400);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledExactlyOnceWith("b");
  });

  test("flush runs the waiting call at once, and only once", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced("a");
    debounced.flush();
    expect(fn).toHaveBeenCalledExactlyOnceWith("a");

    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledOnce();
  });

  test("flush does nothing when no call is waiting", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced.flush();
    debounced("a");
    vi.advanceTimersByTime(500);
    debounced.flush();

    expect(fn).toHaveBeenCalledOnce();
  });
});
