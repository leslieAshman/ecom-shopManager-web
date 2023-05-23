import { ApolloError, useMutation } from '@apollo/client';
import { CREATE_STRIPE_PAYMENT_MUTATION } from '../graphql/stripePaymentMutation';

export interface StripePaymentResponse {
  clientSecret: string;
  id: string;
  paymentIntentId: string;
}

export interface CreateStripePaymentMutationResponse {
  execute: (request: CreateStripePaymentRequest) => void;
  data: {
    createStripePayment: StripePaymentResponse;
  };
  loading: boolean;
  error: ApolloError | undefined;
}

export interface CreateStripePaymentRequest {
  amount: number;
  portfolioId: number;
  currency?: string;
}

export const useCreateStripePaymentMutation = (): CreateStripePaymentMutationResponse => {
  const [createStripePayment, { error, loading, data }] = useMutation(CREATE_STRIPE_PAYMENT_MUTATION);
  const execute = (request: CreateStripePaymentRequest) =>
    createStripePayment({
      variables: {
        stripePayment: {
          ...request,
        },
      },
    });

  return {
    execute,
    error,
    loading,
    data,
  };
};
