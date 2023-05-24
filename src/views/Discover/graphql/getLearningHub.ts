import { gql } from '@apollo/client';

export const GET_LEARNING_HUB = gql`
  query GetLearningHubDocument($learningInput: DocumentQueryInput!) {
    getDocuments(input: $learningInput) {
      page
      resultPerPage
      resultSize
      totalResultsSize
      totalPages
      results {
        ... on LearningHub {
          id
          title
          contentType
          publishDate
          contentShort
          mainImage
        }
      }
    }
  }
`;
