import { gql } from '@apollo/client';

export const GET_RECURRING_PRICES = gql`
  query RecurringPaymentPrices($currency: String!) {
    recurringPaymentPrices(currency: $currency) {
      id
      nickName
      product
      currency
      unitAmount
      recurringInterval
      recurringIntervalCount
    }
  }
`;
