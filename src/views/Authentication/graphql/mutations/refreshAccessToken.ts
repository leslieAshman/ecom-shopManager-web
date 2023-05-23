import { gql } from '@apollo/client';

export const REFRESH_ACCESS_TOKEN = gql`
  mutation RefreshAccessToken($input: AuthRefreshAccessTokenRequestInput!) {
    authRefreshAccessToken(refreshAccessTokenRequestInput: $input) {
      accessToken
      refreshToken
      userToken
    }
  }
`;
