import { gql } from '@apollo/client';

export const GET_EVENT_DETAILS = gql`
  query GetEventById($eventId: String!) {
    getDocumentById(id: $eventId) {
      ... on EventDetail {
        id
        type
        title
        price
        country
        priceCurrency
        dateTime
        locationShort
        mainImage
        locationFullAddress
        content
        eventbriteId
        eventbriteShow
      }
    }
  }
`;
