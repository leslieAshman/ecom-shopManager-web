import { ApolloError, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_RECURRING_PRICES } from '../graphql/getRecurringPaymentPrices';
import { RecurringPaymentPrices } from '../types';

interface HookResponse {
  recurringPaymentPrices: RecurringPaymentPrices[];
  loading: boolean;
  error: ApolloError | undefined;
}

export const useGetRecurringPrices = (currency: string): HookResponse => {
  const { data, loading, error } = useQuery(GET_RECURRING_PRICES, { variables: { currency } });
  const recurringPaymentPrices = useMemo(() => data?.recurringPaymentPrices, [data]);
  return { recurringPaymentPrices, loading, error };
};
