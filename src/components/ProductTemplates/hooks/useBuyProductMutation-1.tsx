import { ApolloError, useMutation } from '@apollo/client';
import { BUY_PRODUCT_MUTATION } from '../graphql/buyMutation';
import { BuyProductRequest, ExecuteResponse } from '../types';

export interface BuyProductMutationResponse {
  execute: (request: BuyProductRequest) => void;
  data: ExecuteResponse;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useBuyProductMutation = (): BuyProductMutationResponse => {
  const [buyProduct, { error, loading, data }] = useMutation(BUY_PRODUCT_MUTATION);
  const execute = (request: BuyProductRequest) =>
    buyProduct({
      variables: {
        portalBuyWineRequest: {
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
