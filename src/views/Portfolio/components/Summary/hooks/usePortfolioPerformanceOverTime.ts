import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { logError } from '../../../../../components/LogError';
import { PORTFOLIO_PERFORMANCE_OVER_TIME } from '../graphql/portfolioPerformanceOverTime';
import { PerformanceOverTime } from '../../../types';

export interface UsePortfolioPerformanceOverTimeResponse {
  portfolioPerformanceOverTime: PerformanceOverTime[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (
    variables?:
      | Partial<{
          portfolioId: number;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
}

export const usePortfolioPerformanceOverTime = (
  portfolioId: number | undefined,
): UsePortfolioPerformanceOverTimeResponse => {
  const { data, loading, error, refetch } = useQuery(PORTFOLIO_PERFORMANCE_OVER_TIME, {
    variables: { portfolioId },
  });
  if (error instanceof Error) {
    logError((error as Error).message);
  }
  const portfolioPerformanceOverTime = useMemo(() => data?.portalPortfolioPerformanceOverTime || [], [data]);
  return { portfolioPerformanceOverTime, loading, error, refetch };
};
