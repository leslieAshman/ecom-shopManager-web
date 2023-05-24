import { gql } from '@apollo/client';

export const CONTACT_RELATION_MANAGER_MUTATION = gql`
  mutation PortalContactRelationshipManger($request: ContactRmInput!) {
    portalContactRelationshipManger(request: $request) {
      errorMessage
      isSuccess
    }
  }
`;
