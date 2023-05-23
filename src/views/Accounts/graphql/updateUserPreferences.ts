import { gql } from '@apollo/client';

export const UPDATE_USER_PREFERENCES = gql`
  mutation PortalUpdatePreferences($request: UpdatePreferencesInput!) {
    portalUpdatePreferences(request: $request) {
      currency
      language
    }
  }
`;
