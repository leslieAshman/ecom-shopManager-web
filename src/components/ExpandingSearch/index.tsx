import React, { useEffect, useState } from 'react';
import { uniqueItems } from '../../utils';
import { SearchIcon } from '../../assets/icons';
import useDebounce from './useDebounce';

interface ExpandingSearchProp<T> {
  query?: string;
  data: T[];
  props: (keyof T | string)[];
  uniqueIdRef: keyof T | null;
  onSearch: (result: T[], query?: string) => void;
  className?: string;
  placeholder?: string;
  debounce?: number;
  customFindFn?: (data: T[], value: string) => T[];
}

export const processSearch = <TType,>(
  data: TType[],
  props: (keyof TType | string)[],
  value: string,
  uniqueIdProp: keyof TType | null,
  customFind?: (datasource: TType[], value: string) => TType[],
) => {
  if (!data || data.length === 0) return [];
  let results: TType[] = [];
  if (value.length > 0) {
    if (customFind) {
      results = customFind(data, value);
    }
    props.forEach((prop) => {
      if (Object.keys(data[0] as Record<string, unknown>).includes(prop as string)) {
        const filterResults = [...data].filter((x) =>
          `${x[prop as keyof TType]}`.toLowerCase().includes(value.toLowerCase()),
        );
        results = [...results, ...filterResults];
      }
    });
  } else results = [...data];

  return uniqueIdProp ? uniqueItems(results, uniqueIdProp) : results;
};

const ExpandingSearch = <T,>({
  data,
  props,
  uniqueIdRef,
  onSearch,
  className,
  placeholder,
  query = '',
  debounce = 300,
  customFindFn,
}: ExpandingSearchProp<T>) => {
  const [inputValue, setInputValue] = useState(query);
  const debouncedFunction = useDebounce(onSearch, debounce);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedFunction(processSearch(data, props, value, uniqueIdRef, customFindFn), value);
  };

  useEffect(() => {
    if (inputValue !== query) setInputValue(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return (
    <div className="relative ">
      <input
        type="search"
        value={inputValue}
        placeholder={placeholder || ''}
        onChange={onInputChange}
        className={`peer cursor-pointer relative z-10 h-12 w-12 rounded-lg bg-transparent  pl-12 outline-none focus:w-full focus:cursor-text focus:border focus:border-gray-300 focus:pl-16 focus:pr-4 ${
          className || ''
        }`.trim()}
      />
      <SearchIcon className="absolute inset-y-0 my-auto w-12  peer-focus:z-10 border-r border-transparent  px-3.5 peer-focus:border-gray-300 " />
    </div>
  );
};

export default ExpandingSearch;
