import { gql } from '@apollo/client';

export const DELETE_PORTFOLIO_ITEM_MUTATION = gql`
  mutation DeleteProducts($shopId: String!, $serviceId: String!) {
    deleteProducts(shopId: $shopId, serviceId: $serviceId) {
      isSuccess
      message
      messageType
    }
  }
`;
