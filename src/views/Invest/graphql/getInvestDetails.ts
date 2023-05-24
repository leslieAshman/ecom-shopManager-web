import { gql } from '@apollo/client';

export const GET_INVEST_DETAILS = gql`
  query GetInvestOfferDetails($offerId: String!) {
    getDocumentById(id: $offerId) {
      ... on InvestOfferDetail {
        id
        name
        subtitle
        priceGbp
        unitSize
        region
        type
        expiryDate
        mainImage
        sections {
          title
          content
        }
        disclaimer
      }
    }
  }
`;
