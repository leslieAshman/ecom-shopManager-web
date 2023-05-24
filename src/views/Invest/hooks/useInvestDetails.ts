import { ApolloError, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { logError } from '../../../components/LogError';
import { GET_INVEST_DETAILS } from '../graphql/getInvestDetails';
import { InvestOfferDetails, InvestOfferSection } from '../types';

interface UseInvestDetailsReturnHookResponse {
  sections: InvestOfferSection[];
  metaData: Exclude<InvestOfferDetails, 'sections'>;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useInvestDetails = (id: string): UseInvestDetailsReturnHookResponse => {
  const { data, loading, error } = useQuery(GET_INVEST_DETAILS, { variables: { offerId: id } });

  const response = useMemo(() => {
    const { sections, ...metaData } = data?.getDocumentById || { sections: [] };
    return {
      sections,
      metaData,
    };
  }, [data]);

  if (error instanceof Error) {
    logError((error as Error).message);
  }
  return {
    sections: response.sections,
    metaData: response.metaData,
    loading,
    error,
  };
};
