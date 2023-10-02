/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const GET_PORTFOLIOS = gql`
  query GetPortfolios($portfolioId: String) {
    portfolios(portfolioId: $portfolioId) {
      isSuccess
      message
      messageType
      result {
        _id
        name
        owner
        area
        info
        logo {
          createdDate
          pic
        }
        isOnline
        shopId
        address
        postcode
        phoneNo
        isAgreementSigned
        hashTags
        categories {
          title
        }
      }
    }
  }
`;
