import { useEffect, useRef } from "react";

type InfiniteScrollProps = {
  children: React.ReactNode;
  hasNextPage: boolean;
  onLoadMore: () => void;
  threshold?: number;
};

export default function InfiniteScroll({ children, hasNextPage, onLoadMore, threshold = 100 }: InfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasNextPageRef = useRef(hasNextPage);
  const onLoadMoreRef = useRef(onLoadMore);

  // Keep refs current on every render without re-creating the observer
  hasNextPageRef.current = hasNextPage;
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPageRef.current) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin: `0px 0px ${threshold}px 0px` },
    );
    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [threshold]);

  return (
    <>
      {children}
      <div ref={containerRef} />
    </>
  );
}
