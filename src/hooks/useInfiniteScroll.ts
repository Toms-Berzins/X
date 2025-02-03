import { useEffect, useCallback, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useInfiniteScroll = (
  onLoadMore: () => Promise<void>,
  {
    threshold = 1.0,
    rootMargin = '100px',
    enabled = true,
  }: UseInfiniteScrollOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && enabled) {
        try {
          setIsLoading(true);
          await onLoadMore();
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onLoadMore, isLoading, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, threshold, rootMargin, enabled]);

  const setTarget = useCallback((element: HTMLDivElement | null) => {
    if (targetRef.current && observerRef.current) {
      observerRef.current.unobserve(targetRef.current);
    }

    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }

    targetRef.current = element;
  }, []);

  return {
    ref: setTarget,
    isLoading,
  };
};

// Example usage:
/*
const MyList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const newItems = await fetchMoreItems();
    setItems(prev => [...prev, ...newItems]);
    setHasMore(newItems.length > 0);
  };

  const { ref, isLoading } = useInfiniteScroll(loadMore, {
    enabled: hasMore,
  });

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
      {hasMore && <div ref={ref}>{isLoading ? 'Loading...' : ''}</div>}
    </div>
  );
};
*/
