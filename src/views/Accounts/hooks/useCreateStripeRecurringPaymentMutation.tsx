import { ApolloError, useMutation } from '@apollo/client';
import { CREATE_STRIPE_RECURRING_PAYMENT_MUTATION } from '../graphql/createStripeRecurringPaymentMutation';

export interface StripePaymentResponse {
  clientSecret: string;
  id: string;
  subId: string;
}

export interface CreateStripeRecurringPaymentMutationResponse {
  execute: (request: RecurringPaymentRequest) => void;
  data: {
    createStripeRecurringPayment: StripePaymentResponse;
  };
  loading: boolean;
  error: ApolloError | undefined;
}

export interface RecurringPaymentRequest {
  currency: string;
  priceId: string;
  portfolioId: number;
  defaultPaymentMethod: string | null;
  amount: number;
  frequency: string;
}

export const useCreateStripeRecurringPaymentMutation = (): CreateStripeRecurringPaymentMutationResponse => {
  const [createStripeRecurringPayment, { error, loading, data }] = useMutation(
    CREATE_STRIPE_RECURRING_PAYMENT_MUTATION,
  );
  const execute = (request: RecurringPaymentRequest) =>
    createStripeRecurringPayment({
      variables: {
        stripeRecurringPayment: {
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
