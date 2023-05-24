import { ApolloError, ApolloQueryResult, DocumentNode, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { logError } from '../../components/LogError';

interface HookResponse<T> {
  results: unknown;
  loading: boolean;
  refetch: () => Promise<ApolloQueryResult<T>>;
  error: ApolloError | undefined;
  data?: unknown;
}

export const useExecuteQuery = <T>(
  resultProp: string,
  gqlQuery: DocumentNode,
  queryOption?: Record<string, unknown>,
): HookResponse<T> => {
  const { data, loading, refetch, error } = useQuery(gqlQuery, queryOption);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = useMemo(() => (data || { [resultProp]: [] })[resultProp], [data]);
  if (error) {
    logError(error);
  }
  return { results, loading, refetch, error, data };
};
