/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const LOGIN = gql`
  query Login($userCredentials: LoginInput!) {
    login(userCredentials: $userCredentials) {
      isSuccess
      message
      userToken
      messageType
      result {
        email
        id
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($email: String!) {
    getUser(email: $email) {
      email
      createdDate
      id
      name
      createdDate
    }
  }
`;
