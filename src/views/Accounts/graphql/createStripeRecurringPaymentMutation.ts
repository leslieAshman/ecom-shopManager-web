import { gql } from '@apollo/client';

export const CREATE_STRIPE_RECURRING_PAYMENT_MUTATION = gql`
  mutation CreateStripeRecurringPayment($stripeRecurringPayment: StripeRecurringPaymentInput!) {
    createStripeRecurringPayment(stripeRecurringPayment: $stripeRecurringPayment) {
      id
      subId
      clientSecret
    }
  }
`;
