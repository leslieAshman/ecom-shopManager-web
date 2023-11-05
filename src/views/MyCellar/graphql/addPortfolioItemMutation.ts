import { gql } from '@apollo/client';

export const ADD_PORTFOLIO_ITEM_MUTATION = gql`
  mutation AddProducts($shopId: String!, $item: PortfolioItemInput, $selectedQueues: [String]) {
    addProducts(shopId: $shopId, item: $item, selectedQueues: $selectedQueues) {
      isSuccess
      message
      messageType
      result {
        title
        category
        pic
        serviceId
        avgWaitTime
        price
        isVisible
        isAvailable
        showPrice
        showDetails
        shopId
      }
    }
  }
`;
