import { ApolloError, ApolloQueryResult, DocumentNode, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { logError } from '../../../components/LogError';
import { GQLQueryMetaData } from '../../../types/DomainTypes';

export interface UseGetDocumentProps {
  docType: string;
  gqlQueryNode: DocumentNode;
  documentProp: string;
  page?: number;
  pageSize?: number;
  docStatus?: string;
}

interface UseGetDocumnetsHookResponse {
  results: unknown[];
  metaData: GQLQueryMetaData;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (
    variables?:
      | Partial<{
          eventInput: {
            page: number;
            pageSize: number;
            docType: string;
            docStatus: string;
          };
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<unknown>>;
}

export const useGetDocuments = ({
  gqlQueryNode,
  documentProp,
  docType,
  page = 1,
  pageSize = 1000,
  docStatus = 'current',
}: UseGetDocumentProps): UseGetDocumnetsHookResponse => {
  const { data, loading, error, refetch } = useQuery(gqlQueryNode, {
    variables: {
      [documentProp]: {
        page,
        pageSize,
        docType,
        docStatus,
      },
    },
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
    results: response.results,
    metaData: response.metaData,
    loading,
    error,
    refetch,
  };
};
