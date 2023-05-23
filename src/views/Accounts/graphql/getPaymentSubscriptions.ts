import { gql } from '@apollo/client';

export const GET_PAYMENT_SUBSCRIPTIONS = gql`
  query GetPaymentSubscriptions {
    recurringPayments {
      id
      currency
      amount
      status
      portfolioId
      portfolioName
      frequency
      priceId
      paymentMethodId
    }
  }
`;
