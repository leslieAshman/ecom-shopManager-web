import { gql } from '@apollo/client';

export const GET_EVENTS_AND_EXPERIENCES = gql`
  query GetEventDocuments($eventInput: DocumentQueryInput!) {
    getDocuments(input: $eventInput) {
      page
      resultPerPage
      resultSize
      totalResultsSize
      totalPages
      results {
        ... on Event {
          id
          title
          country
          priceCurrency
          price
          dateTime
          type
          mainImage
          locationShort
        }
      }
    }
  }
`;
