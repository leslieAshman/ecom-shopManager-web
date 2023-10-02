import {
  ApolloClient,
  ApolloLink,
  DefaultOptions,
  fromPromise,
  HttpLink,
  NextLink,
  NormalizedCacheObject,
  Operation,
  ServerParseError,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  getAccessToken,
  getRefreshToken,
  getUserToken,
  signOut,
  Tokens,
  updateAccessToken,
  updateRefreshToken,
  updateUserToken,
} from '../services/auth';
import { REFRESH_ACCESS_TOKEN } from '../views/Authentication/graphql/mutations/refreshAccessToken';
import { cache, isLoggedInVar } from './cache';
import resolvers from './mocks/graphql-resolvers';
import { logError } from '../components/LogError';
import { RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables } from '__generated__/graphql';
import moment from 'moment';

let isRefreshing = false;
let pendingRequestsQueue: Array<() => void> = [];

function addRequestsToQueue(func: () => void): void {
  pendingRequestsQueue.push(func);
}

function resolvePendingRequests(): void {
  pendingRequestsQueue.map((cb) => cb());
  pendingRequestsQueue = [];
}

function setIsRefreshing(refreshing: boolean): void {
  isRefreshing = refreshing;
}

// refresh access token with gql mutation solution courtesy of https://stackoverflow.com/a/62872754
// eslint-disable-next-line prefer-const
let client: ApolloClient<NormalizedCacheObject>;
async function refreshAccessToken() {
  return client
    .mutate<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>({
      mutation: REFRESH_ACCESS_TOKEN,
      variables: {
        input: {
          clientId: process.env.REACT_APP_CLIENT_ID!,
          refreshToken: getRefreshToken()!,
        },
      },
    })
    .then(({ data }) => {
      if (
        !data?.authRefreshAccessToken.accessToken ||
        !data.authRefreshAccessToken.refreshToken ||
        !data.authRefreshAccessToken.userToken
      ) {
        throw new Error('Missing tokens');
      }
      updateAccessToken(data.authRefreshAccessToken.accessToken);
      updateRefreshToken(data.authRefreshAccessToken.refreshToken);
      updateUserToken(data.authRefreshAccessToken.userToken);

      return data.authRefreshAccessToken as Tokens;
    })
    .catch((err) => {
      logError(err);
      throw new Error(err.message);
    });
}

const refreshOnError = (operation: Operation, forward: NextLink) => {
  if (!isRefreshing) {
    setIsRefreshing(true);
    return fromPromise(
      refreshAccessToken().catch((e) => {
        // eslint-disable-next-line no-console
        const errString = 'Failed to refresh the access token';
        logError(errString, e.message);
        setIsRefreshing(false);
        resolvePendingRequests();
        signOut();
        isLoggedInVar(false);
        window.location.replace(`${window.location.href}/login`);
        // eslint-disable-next-line no-useless-return
        return Promise.reject(new Error(errString));
      }),
    )
      .filter((value) => Boolean(value))
      .flatMap((data) => {
        setIsRefreshing(false);
        resolvePendingRequests();
        // We've already filtered out untruthy values here,
        // but we need to cast it to satisfy TypeScript.
        const { accessToken, userToken } = data as Tokens;

        const oldHeaders = operation.getContext().headers;
        // modify the operation context with a new token
        operation.setContext({
          headers: {
            ...oldHeaders,
            // authorization: `Bearer ${accessToken}`,
            // CdsUserJwt: userToken,
            // 'Ocp-Apim-Subscription-Key': process.env.REACT_APP_APIM_KEY,
          },
        });

        // retry the request, returning the new observable
        return forward(operation);
      });
  }
  // don't try to refresh the token as it's already being handled,
  // but instead add this request to the list so it can be
  // retried once the token has been refreshed.
  return fromPromise(
    new Promise<void>((resolve) => {
      addRequestsToQueue(() => resolve());
    }),
  ).flatMap(() => {
    return forward(operation);
  });
};

/**
 * Catches any errors in the graphql chain, checks if they are due to the user
 * being unauthenticated. If so, attempts to refresh the user's access token.
 * If that fails, it'll set the app to guest user mode. If we can successfully
 * refresh the access token, then both the access and refresh token which we store
 * are updated with the new ones, and the link completes (which results in a retry of the original request).
 *
 * ⚠️ Fairly complicated function for a fairly complicated set of behaviours. This function limits one refresh
 * request at a time, and creates a queue for any pending requests, which are completed once the refresh token request completes.
 *
 * See this https://www.apollographql.com/docs/react/data/error-handling/#on-graphql-errors
 * and this https://www.apollographql.com/docs/apollo-server/data/errors/#unauthenticated for more info.
 * See this SO post for more information on using a queue system for requests ->
 * https://stackoverflow.com/questions/50965347/how-to-execute-an-async-fetch-request-and-then-retry-last-failed-request/51321068#51321068
 */
let refreshTokenCount = 1;
//const refreshTokenOnnetworkError = toInternalId('Failed to fetch');
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    // eslint-disable-next-line no-restricted-syntax
    for (const err of graphQLErrors) {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED': {
          if (isLoggedInVar()) {
            refreshTokenCount = refreshTokenCount + 1;
            if (refreshTokenCount % 2 === 0) return refreshOnError(operation, forward);
            else {
              signOut();
              isLoggedInVar(false);
              window.location.replace(`${window.location.href}/login`);
            }
          }
          return;
        }

        default: {
          // For any other gql error, let it pass through
          // eslint-disable-next-line consistent-return
          return;
        }
      }
    }
  }
  if (networkError) {
    if (networkError) {
      const { statusCode } = networkError as ServerParseError;
      if (statusCode === 401 || statusCode === 403) {
        // refreshOnError(operation, forward);
      }
      // if you would also like to retry automatically on
      // network errors, recommend that you use
      // apollo-link-retry
    }

    // if (toInternalId(networkError.message) === refreshTokenOnnetworkError) {
    //   if (isLoggedInVar()) {
    //     refreshTokenCount = refreshTokenCount + 1;
    //     if (refreshTokenCount % 2 === 0) return refreshOnError(operation, forward);
    //     else {
    //       signOut();
    //       isLoggedInVar(false);
    //       window.location.replace(`${window.location.href}/login`);
    //     }
    //   }

    //   return;
    // }
    logError(`[Network error]: ${JSON.stringify(networkError, null, 2)}`);
    // if you would also like to retry automatically on
    // network errors, recommend that you use
    // apollo-link-retry
  }

  // For any other error, let it pass through
  // eslint-disable-next-line no-useless-return, consistent-return
  return;
});

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();
  const userToken = getUserToken();
  console.log('accessToken', accessToken, userToken);
  if (!userToken) {
    return {
      headers: {
        ...headers,
        'x-isapp': false,
        'x-day': moment().format('YYYY-MM-DD HH:mm:ss'),

        // 'Ocp-Apim-Subscription-Key': process.env.REACT_APP_APIM_KEY
      },
    };
  }

  return {
    headers: {
      ...headers,
      'x-isapp': false,
      'x-day': moment().format('YYYY-MM-DD HH:mm:ss'),
      authorization: `Bearer ${userToken}`,
      'x-access-token': `Bearer ${userToken}`,
      // CdsUserJwt: userToken,
      // 'Ocp-Apim-Subscription-Key': process.env.REACT_APP_APIM_KEY,
    },
  };
});

export const defaultOptions: DefaultOptions = {
  mutate: {
    // It's imperative that we set this errorPolicy to 'all',
    // as this ensures we catch network and gql errors. Without this
    // errors such as 500 Internal Server Error do not get caught and assigned to
    // the error property returned by the mutation.
    // https://www.apollographql.com/docs/react/data/error-handling/#setting-an-error-policy
    errorPolicy: 'all',
  },
  query: {
    errorPolicy: 'all',
  },
};

// github.com/apollographql/apollo-client/issues/84#issuecomment-763833895
// Insecure GraphQL endpoint does not need JWT and for user to be logged in to call it
const insecureGraphQL = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL_INSECURE });
const secureGraphQL = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL });
console.log('secureGraphQL', process.env.REACT_APP_GRAPHQL_URL, process.env.REACT_APP_GRAPHQL_URL_INSECURE);
const graphqlEndpoints = ApolloLink.split(
  (operation) => operation.getContext().serviceName === 'insecure',
  insecureGraphQL,
  secureGraphQL,
);
const link = ApolloLink.from([errorLink, authLink, graphqlEndpoints]);
// eslint-disable-next-line prefer-const
client = new ApolloClient({
  link,
  cache,
  defaultOptions,
  resolvers,
});

export default client;
