import { gql } from '@apollo/client';

export const CANCEL_STRIPE_SUBSCRIPTION_PAYMENT_MUTATION = gql`
  mutation CancelStripeRecurringPayment($recurringPaymentId: String!) {
    cancelStripeRecurringPayment(recurringPaymentId: $recurringPaymentId) {
      subscriptionId
      hasCancelled
    }
  }
`;
