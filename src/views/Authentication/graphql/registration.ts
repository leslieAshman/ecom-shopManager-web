/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($userCredentials: RegisterInput!) {
    registerUser(userCredentials: $userCredentials) {
      isSuccess
      message
      messageType
    }
  }
`;
