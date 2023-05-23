import { gql } from '@apollo/client';

export const GET_PAYMENT_CARDS = gql`
  query GetPaymentCards($currency: String!) {
    customerCards(currency: $currency) {
      id
      brand
      country
      expMonth
      expYear
      last4
      funding
      billingAddress {
        city
        country
        line1
        line2
        postalCode
        state
      }
    }
  }
`;
