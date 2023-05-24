import { gql } from '@apollo/client';

export const UPDATE_NOTIFICATION_ITEM = gql`
  mutation MarkNotificationsRead($request: MarkNotificationsReadRequest!) {
    markNotificationsRead(request: $request)
  }
`;
