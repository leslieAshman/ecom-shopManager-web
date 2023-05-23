/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const GENERATE_PASSCODE = gql`
  query GeneratePasscode($email: String!) {
    getPassCode(email: $email) {
      isSuccess
      messageType
      message
    }
  }
`;

export const GET_VERIFICATION_TOKEN = gql`
  query GetVerificationToken($email: String!) {
    getVerificationToken(email: $email) {
      isSuccess
      messageType
      message
    }
  }
`;
