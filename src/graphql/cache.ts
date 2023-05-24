import { InMemoryCache, makeVar } from '@apollo/client';
import { getAccessToken, getRefreshToken, getUserToken } from '../services/auth';

export const isLoggedInVar = makeVar<boolean>(Boolean(getUserToken()));
export const appIsWorkingVar = makeVar<boolean>(false);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
        appIsWorking: {
          read() {
            return appIsWorkingVar();
          },
        },
      },
    },
    WineVintageResult: {
      keyFields: ['defaultAssetId'],
    },
  },
});
