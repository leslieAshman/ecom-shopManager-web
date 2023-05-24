import { useState, useEffect, useRef, useCallback } from 'react';
import { logError } from '../../components/LogError';

const useInfiniteScroll = <T,>(data: T[], numItemsPerPage = 20, fetchMoreRef = -1) => {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);
  const originalData = useRef<T[]>([]);

  const fetchData = (): Promise<T[]> => {
    return new Promise((resolve) => {
      if (!originalData.current || originalData.current.length === 0) resolve([] as T[]);
      else {
        const fetchItems = originalData.current.splice(0, numItemsPerPage);
        resolve(fetchItems);
      }
    });
  };

  const process = (prevResults?: T[]) => {
    setIsLoading(true);
    setIsError(false);
    setError({});
    const controller = new AbortController();
    const { signal } = controller;
    fetchData()
      .then((response) => {
        setResults((prev) => [...(prevResults || prev), ...response]);
        setHasNextPage(Boolean(originalData.current.length));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (signal.aborted) return;
        setIsError(true);
        setError({ message: e.message });
      });
    return controller;
  };

  const intObserver = useRef<IntersectionObserver>();
  const lastItemRef = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => {
      if (isLoading) return;
      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          process();
          //setFetchMoreRef(new Date().getTime());
        }
      });
      if (item) intObserver.current.observe(item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, hasNextPage],
  );

  useEffect(() => {
    if (fetchMoreRef !== -1) {
      const abortController = process();
      return () => abortController.abort();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMoreRef]);

  useEffect(() => {
    originalData.current = [...data];

    setResults([]);
    process([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isError) {
    logError(error);
  }

  return { isLoading, isError, error, results, hasNextPage, lastItemRef };
};

export default useInfiniteScroll;
