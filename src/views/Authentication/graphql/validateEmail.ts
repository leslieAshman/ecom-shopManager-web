import { gql } from '@apollo/client';

export const VALIDATE_EMAIL = gql`
  query ValidateEmail($email: String!) {
    validateEmail(email: $email) {
      isSuccess
      messageType
      message
    }
  }
`;
