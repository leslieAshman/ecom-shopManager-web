import { useCallback, useEffect, useRef } from 'react';

interface UseFadeInOnScrollProps {
  isLoading: boolean;
  processIntersectionObserverEntry?: (entry: IntersectionObserverEntry) => void;
  IntersectionObserverOptions?: Record<string, unknown>;
}

const fadeOnScrollClassName = 'transition-opacity ease-in-out delay-150 duration-300';

const useFadeInOnScroll = (config: UseFadeInOnScrollProps) => {
  const intObserver = useRef<IntersectionObserver>();
  const { isLoading, processIntersectionObserverEntry, IntersectionObserverOptions } = config;
  const isItemVisible = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => {
      if (isLoading || !item) return;
      if (item) intObserver.current?.observe(item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading],
  );

  useEffect(() => {
    if (intObserver.current) intObserver.current.disconnect();
    intObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('visible', entry.isIntersecting);
          entry.target.classList.toggle('opacity-100', entry.isIntersecting);
          entry.target.classList.toggle('invisible', !entry.isIntersecting);
          entry.target.classList.toggle('opacity-0', !entry.isIntersecting);

          if (processIntersectionObserverEntry) processIntersectionObserverEntry(entry);
        });
      },
      {
        threshold: 0,
        rootMargin: '100px',
        ...(IntersectionObserverOptions || {}),
      },
    );
  }, [processIntersectionObserverEntry, IntersectionObserverOptions]);
  return { isItemVisible, fadeOnScrollClassName };
};

export default useFadeInOnScroll;
