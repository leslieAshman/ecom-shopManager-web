/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const RESET_PASSWORD_QUERY = gql`
  query ResetPasswordQuery($email: String!, $clientId: String!) {
    resetPassword(email: $email, clientId: $clientId) {
      isSuccess
      message
    }
  }
`;
