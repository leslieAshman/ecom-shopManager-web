import { gql } from '@apollo/client';

export const GET_INVEST_OFFERS = gql`
  query GetInvestOffers($offerInput: DocumentQueryInput!) {
    getDocuments(input: $offerInput) {
      page
      resultPerPage
      resultSize
      totalResultsSize
      totalPages
      results {
        ... on InvestOffer {
          id
          name
          subtitle
          priceGbp
          unitSize
          region
          type
          expiryDate
          mainImage
        }
      }
    }
  }
`;
