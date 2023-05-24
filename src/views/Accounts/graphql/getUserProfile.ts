import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query HubSpotQuery($email: String!) {
    getCustomer(email: $email) {
      id
      firstName
      lastName
      email
      dateOfBirth
      city
      country
      state
      postCode
      addressline1
      addressline2
      addressline3
    }
  }
`;
