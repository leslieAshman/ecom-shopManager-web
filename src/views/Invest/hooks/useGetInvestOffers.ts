import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { logError } from '../../../components/LogError';
import { GET_INVEST_OFFERS } from '../graphql/GetInvestOffers';
import { UseInvestOffersReturnHookResponse } from '../types';

export const useGetInvestOffers = (type: string): UseInvestOffersReturnHookResponse => {
  const offerInput = {
    page: 1,
    pageSize: 999,
    docType: 'cwi_portal_offer',
    docStatus: type,
  };

  const { data, loading, error, refetch } = useQuery(GET_INVEST_OFFERS, {
    variables: { offerInput },
  });

  const response = useMemo(() => {
    const { results, ...metaData } = data?.getDocuments || { results: [] };
    return {
      results,
      metaData,
    };
  }, [data]);

  if (error instanceof Error) {
    logError((error as Error).message);
  }
  return {
    offers: response.results,
    metaData: response.metaData,
    loading,
    error,
    refetch: () =>
      refetch({
        offerInput,
      }),
  };
};
