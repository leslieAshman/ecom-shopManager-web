import { gql } from '@apollo/client';

export const GET_BANK_TRANSFER_REF = gql`
  query paymentReferenceNumber {
    paymentReferenceNumber
  }
`;
