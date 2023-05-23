import { ApolloError, DocumentNode, useMutation } from '@apollo/client';

export interface MutationResponse {
  executor: (request: Record<string, unknown>, options?: Record<string, unknown>) => void;
  data: unknown;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useExecuteMutation = (gqlQuery: DocumentNode): MutationResponse => {
  const [executorFn, { error, loading, data }] = useMutation(gqlQuery);
  const executor = (request: Record<string, unknown>, options?: Record<string, unknown>) =>
    executorFn({
      variables: {
        ...request,
      },
      ...options,
    });

  return {
    executor,
    error,
    loading,
    data,
  };
};
