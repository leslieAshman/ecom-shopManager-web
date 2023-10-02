import { ApolloError, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { logError } from '../../../../../components/LogError';
import { PortfolioBalance } from '../../../../../types/DomainTypes';
import { PORTFOLIO_BALANCES } from '_____AAAAA__TODELETE/getPortfolioBalances';

interface UsePortfolioBalancesReturnHookResponse {
  portfolioBalances: PortfolioBalance[];
  loading: boolean;
  error: ApolloError | undefined;
}

export const usePortfolioBalances = (): UsePortfolioBalancesReturnHookResponse => {
  const { data, loading, error } = useQuery(PORTFOLIO_BALANCES);
  const portfolioBalances = useMemo(
    () =>
      (data?.portalPortfolioBalance || []).map((x: PortfolioBalance) => ({ ...x, portfolioId: x.portfolioId || '' })),
    [data],
  );

  if (error instanceof Error) {
    logError((error as Error).message);
  }
  return {
    portfolioBalances,
    loading,
    error,
  };
};
