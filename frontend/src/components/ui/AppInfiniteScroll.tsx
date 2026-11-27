import { useEffect, useRef } from "react";

export type AppInfiniteScrollProps = {
  children: React.ReactNode;
  /** Whether there are more pages. Loading stops when it's false. */
  hasNextPage: boolean;
  /**
   * Called when the end of the list is within `threshold` px of the viewport, and again after each
   * render while it still is, so pages keep loading until the list fills the screen.
   */
  onLoadMore: () => void;
  /** Set while a page is loading, so a re-render during the load doesn't request the same page again. */
  loading?: boolean;
  /** How close, in px, the end of the list must get to the bottom of the viewport before loading starts. Defaults to 100. */
  threshold?: number;
};

/**
 * Renders its children, and calls `onLoadMore` when the end of them scrolls near the viewport.
 *
 * @example
 * ```tsx
 * <AppInfiniteScroll hasNextPage={page < lastPage} loading={loading} onLoadMore={() => loadPage(page + 1)}>
 *   {items.map((item) => <Row key={item.id} item={item} />)}
 * </AppInfiniteScroll>
 * ```
 */
export default function AppInfiniteScroll({
  children,
  hasNextPage,
  onLoadMore,
  loading = false,
  threshold = 100,
}: AppInfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Runs after every render with a new observer, because an observer's first report is where the
  // sentinel is now. One long-lived observer only reports when the sentinel enters or leaves the
  // viewport, so if a loaded page didn't push the sentinel out of view, loading would stall.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onLoadMore();
      },
      { rootMargin: `0px 0px ${threshold}px 0px` },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  });

  return (
    <>
      {children}
      <div ref={sentinelRef} />
    </>
  );
}
