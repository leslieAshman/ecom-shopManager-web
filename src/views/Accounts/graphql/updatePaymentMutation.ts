import { gql } from '@apollo/client';

export const UPDATE_STRIPE_SUBSCRIPTION_PAYMENT_MUTATION = gql`
  mutation UpdateStripeRecurringPayment($request: UpdateStripeRecurringPaymentInput!) {
    updateStripeRecurringPayment(request: $request) {
      subscriptionId
      hasUpdated
    }
  }
`;
