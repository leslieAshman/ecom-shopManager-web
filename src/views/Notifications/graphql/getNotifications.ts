import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query UserNotifications($from: Int!, $pageSize: Int!) {
    userNotifications(from: $from, pageSize: $pageSize) {
      total
      pageSize
      from
      totalPages
      unreadCount
      results {
        id
        category
        type
        summary
        description
        isRead
        createdDateTime
        updatedDateTime
      }
    }
  }
`;
