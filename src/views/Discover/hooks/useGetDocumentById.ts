import { ApolloError, DocumentNode, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { logError } from '../../../components/LogError';

interface HookResponse {
  result: unknown;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useDocumentById = (request: Record<string, unknown>, gqlQuery: DocumentNode): HookResponse => {
  const { data, loading, error } = useQuery(gqlQuery, { variables: { ...request } });
  const result = useMemo(() => data?.getDocumentById, [data]);

  if (error instanceof Error) {
    logError((error as Error).message);
  }
  return {
    result,
    loading,
    error,
  };
};
