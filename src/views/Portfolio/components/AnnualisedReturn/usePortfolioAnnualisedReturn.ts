import { ApolloError, useQuery } from '@apollo/client';
import { logError } from '../../../../components/LogError';
import { PORTFOLIO_ANNUALISED_RETURN } from './graphql';
import { AunualisedReturnType } from './types';

export interface UsePortfolioAnnualiseReturnHookResponse {
  portfolioAnnualiseReturn: AunualisedReturnType[];
  loading: boolean;
  error: ApolloError | undefined;
}

export const usePortfolioAnnualiseReturn = (): UsePortfolioAnnualiseReturnHookResponse => {
  const { data, loading, error } = useQuery(PORTFOLIO_ANNUALISED_RETURN);
  const portfolioAnnualiseReturn = data?.portalPortfolioAnnualisedReturn || [];

  if (error instanceof Error) {
    logError((error as Error).message);
  }
  return {
    portfolioAnnualiseReturn,
    loading,
    error,
  };
};
