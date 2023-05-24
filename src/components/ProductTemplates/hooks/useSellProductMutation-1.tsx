import { ApolloError, useMutation } from '@apollo/client';
import { SELL_PRODUCT_MUTATION } from '../graphql/sellMutation';
import { ExecuteResponse, SellProductRequest } from '../types';

export interface SellProductMutationResponse {
  execute: (request: SellProductRequest) => void;
  data: ExecuteResponse;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useSellProductMutation = (): SellProductMutationResponse => {
  const [sellProduct, { error, loading, data }] = useMutation(SELL_PRODUCT_MUTATION);
  const execute = (request: SellProductRequest) =>
    sellProduct({
      variables: {
        portalSellWineRequest: {
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
