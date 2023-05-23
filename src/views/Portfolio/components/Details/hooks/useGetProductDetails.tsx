import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { logError } from '../../../../../components/LogError';
import { Product } from '../../../../../types/productType';
import { GET_PRODUCT_DETAILS } from '../graphql/getProductDetails';

interface UseGetProductHookResponse {
  productDetails: Product;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
}

export const useGetProductDetails = (id: string): UseGetProductHookResponse => {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT_DETAILS, { variables: { id } });
  const productDetails = useMemo(() => data?.portalHoldingDetails, [data]);

  if (error instanceof Error) {
    logError((error as Error).message);
  }
  return {
    productDetails,
    loading,
    error,
    refetch,
  };
};
