import { gql } from '@apollo/client';

export const DELETE_PORTFOLIO_MUTATION = gql`
  mutation DeleteShop($shopId: String!) {
    deleteShop(shopId: $shopId) {
      isSuccess
    }
  }
`;
