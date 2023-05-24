import { gql } from '@apollo/client';

export const GET_RM_DETAILS = gql`
  query GetRMDocument {
    getCustomerRM {
      id
      name
      photo
    }
  }
`;
