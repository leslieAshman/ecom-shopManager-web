import { gql } from '@apollo/client';

export const GET_USER_PREFERENCES = gql`
  query GetUserPreferences {
    portalClientPreferences {
      currency
      language
    }
  }
`;
