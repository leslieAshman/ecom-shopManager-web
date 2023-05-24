import { ApolloError, useMutation } from '@apollo/client';
import { ExecuteResponse } from '../../../components/ProductTemplates/types';
import { INVEST_NOW_MUTATION } from '../graphql/investMutation';
import { InvestNowRequest } from '../types';

export interface BuyProductMutationResponse {
  execute: (request: InvestNowRequest) => void;
  data: ExecuteResponse;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useInvestNowMutation = (): BuyProductMutationResponse => {
  const [investNow, { error, loading, data }] = useMutation(INVEST_NOW_MUTATION);
  const execute = (request: InvestNowRequest) =>
    investNow({
      variables: {
        portalInvestNowRequest: {
          ...request,
        },
      },
    });

  return {
    execute,
    error,
    loading,
    data,
  };
};
