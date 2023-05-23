import { gql } from '@apollo/client';

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation AuthChangePassword($changePasswordInput: AuthChangePasswordInput!) {
    authChangePassword(changePasswordInput: $changePasswordInput) {
      wasPasswordChanged
    }
  }
`;
