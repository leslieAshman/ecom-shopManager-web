/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($userCredentials: RegisterInput!) {
    changePassword(userCredentials: $userCredentials) {
      isSuccess
      message
      messageType
    }
  }
`;
