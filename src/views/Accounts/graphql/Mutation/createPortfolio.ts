import { gql } from '@apollo/client';

export const CREATE_PORTFOLIO_MUTATION = gql`
  mutation Mutation($createShopInput: CreateShopInput!) {
    shops(createShopInput: $createShopInput) {
      email
      logo {
        createdDate
        pic
      }
      name
      isAgreementSigned
      city
      country
      area
      address
      website
      phoneNo
      owner
    }
  }
`;
