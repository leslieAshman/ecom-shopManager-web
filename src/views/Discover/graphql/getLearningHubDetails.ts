import { gql } from '@apollo/client';

export const GET_LEARNING_HUB_DETAILS = gql`
  query GetLearningHubById($learningId: String!) {
    getDocumentById(id: $learningId) {
      ... on LearningHubDetail {
        id
        title
        contentType
        publishDate
        contentType
        contentShort
        contentLong
        mainImage
        videoUrl
      }
    }
  }
`;
