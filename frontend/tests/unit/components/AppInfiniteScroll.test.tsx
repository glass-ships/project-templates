import { render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppInfiniteScroll from "@/components/ui/AppInfiniteScroll";

/** whether the sentinel is in view; read by FakeObserver like a real observer reads the layout */
let inView = false;

/** jsdom has no IntersectionObserver. Like the real one, this reports the current state once observe() is called. */
class FakeObserver {
  static instances: FakeObserver[] = [];
  disconnected = false;

  constructor(
    private callback: (entries: Partial<IntersectionObserverEntry>[]) => void,
    public options: IntersectionObserverInit,
  ) {
    FakeObserver.instances.push(this);
  }

  observe() {
    queueMicrotask(() => {
      if (!this.disconnected) this.callback([{ isIntersecting: inView }]);
    });
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true;
  }
}

/** list that adds a page each time AppInfiniteScroll asks for more, up to `pages` */
function List({
  pages,
  loading = false,
  onLoadMore = () => {},
}: {
  pages: number;
  loading?: boolean;
  onLoadMore?: () => void;
}) {
  const [count, setCount] = useState(1);
  return (
    <AppInfiniteScroll
      hasNextPage={count < pages}
      loading={loading}
      onLoadMore={() => {
        onLoadMore();
        setCount((c) => c + 1);
      }}
    >
      {Array.from({ length: count }, (_, i) => `page ${i + 1}`).map((label) => (
        <p key={label}>{label}</p>
      ))}
    </AppInfiniteScroll>
  );
}

describe("AppInfiniteScroll", () => {
  beforeEach(() => {
    inView = false;
    FakeObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders its children", () => {
    render(<List pages={1} />);

    expect(screen.getByText("page 1")).toBeInTheDocument();
  });

  it("keeps loading while the end of the list stays in view, until there are no more pages", async () => {
    inView = true;
    render(<List pages={3} />);

    await waitFor(() => expect(screen.getByText("page 3")).toBeInTheDocument());
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.queryByText("page 4")).toBeNull();
  });

  it("doesn't load while the end of the list is out of view", async () => {
    const onLoadMore = vi.fn();
    render(<List pages={3} onLoadMore={onLoadMore} />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("doesn't load while loading is set", async () => {
    inView = true;
    const onLoadMore = vi.fn();
    render(<List pages={3} loading onLoadMore={onLoadMore} />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onLoadMore).not.toHaveBeenCalled();
    expect(FakeObserver.instances).toHaveLength(0);
  });

  it("starts loading early by the threshold", () => {
    render(
      <AppInfiniteScroll hasNextPage onLoadMore={() => {}} threshold={250}>
        content
      </AppInfiniteScroll>,
    );

    expect(FakeObserver.instances[0].options.rootMargin).toBe("0px 0px 250px 0px");
  });

  it("disconnects its observer on unmount", () => {
    const { unmount } = render(
      <AppInfiniteScroll hasNextPage onLoadMore={() => {}}>
        content
      </AppInfiniteScroll>,
    );

    unmount();

    expect(FakeObserver.instances.every((o) => o.disconnected)).toBe(true);
  });
});
