import {
  ApolloError,
  ApolloQueryResult,
  DocumentNode,
  OperationVariables,
  QueryResult,
  useLazyQuery,
} from '@apollo/client';
import { ObjectType } from 'types/commonTypes';

interface HookResponse {
  executor: (
    request?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => Promise<QueryResult<unknown, OperationVariables>>;
  loading: boolean;
  data: unknown;
  error: ApolloError | undefined;
  refetch?: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<unknown>>;
  called?: boolean;
}

export const useLazyExecuteQuery = (gqlQuery: DocumentNode): HookResponse => {
  const [executeFn, { loading, error, data, refetch, called }] = useLazyQuery(gqlQuery);

  const executor = (request?: ObjectType, options?: ObjectType) => {
    if (request)
      return executeFn({
        variables: {
          ...request,
        },
        ...options,
      });
    return executeFn({ ...options });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return { executor, loading, error, data, refetch, called };
};
