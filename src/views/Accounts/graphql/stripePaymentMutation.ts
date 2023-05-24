import { gql } from '@apollo/client';

export const CREATE_STRIPE_PAYMENT_MUTATION = gql`
  mutation CreateStripePayment($stripePayment: StripePaymentInput!) {
    createStripePayment(stripePayment: $stripePayment) {
      id
      paymentIntentId
      clientSecret
    }
  }
`;
