/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const SUBMIT_ONE_TIME_PASSCODE = gql`
  mutation SubmitOneTimePasscode($code: String!, $email: String!, $token: String!, $password: String!) {
    activationCodeSubmit(code: $code, email: $email, token: $token, password: $password) {
      result {
        id
        email
        createdDate
      }
      userToken
      isSuccess
      message
      messageType
    }
  }
`;
