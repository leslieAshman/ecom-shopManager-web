  export type RecentSearch =
  | {
      id: string;
      value: string;
      url: string;
      variant: 'region' | 'search' | 'appellation' | 'producer';
    }
  | {
      id: string;
      value: string;
      url: string;
      variant: 'wine';
      suggestion: string;
    };
