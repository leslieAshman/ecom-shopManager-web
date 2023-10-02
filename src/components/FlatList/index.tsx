import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { ObjectType } from 'types/commonTypes';
import { getUUID } from 'utils';
import useFadeInOnScroll from 'views/hooks/useFadeInOnScroll';
import useInfiniteScroll from 'views/hooks/useInfiniteScroll';

interface FlatListProps {
  data: ObjectType[];
  onItemClick?: (row: ObjectType) => void;
  itemRendered: (dataItem: ObjectType, index: number) => ReactNode;
  containerClassName?: string;
}

const FlatList: FC<FlatListProps> = ({ data, itemRendered, containerClassName }) => {
  const { isLoading, results, lastItemRef } = useInfiniteScroll(data);
  const processIntersectionObserverEntry = useCallback((entry: IntersectionObserverEntry) => {
    entry.target.classList.toggle('flex', entry.isIntersecting);
    (entry.target.firstChild as HTMLElement).classList.toggle('flex', entry.isIntersecting);
    (entry.target.firstChild as HTMLElement).classList.toggle('hidden', !entry.isIntersecting);
  }, []);
  const { isItemVisible, fadeOnScrollClassName } = useFadeInOnScroll({ isLoading, processIntersectionObserverEntry });

  const Renderer = useMemo(
    () => (row: ObjectType, index: number) => {
      return itemRendered(row, index);
    },
    [itemRendered],
  );

  return (
    <div className={containerClassName ?? ''}>
      {results &&
        results.length > 0 &&
        results.map((row: ObjectType, index: number) => {
          const uid = getUUID().toString();
          let lastElemRefOption = { ref: isItemVisible };
          if (results.length === index + 1) {
            lastElemRefOption = { ref: lastItemRef };
          }
          return (
            <div key={`${row?.id ?? uid}`} {...lastElemRefOption}>
              {Renderer(row, index)}
            </div>
          );
        })}
    </div>
  );
};

export default FlatList;
