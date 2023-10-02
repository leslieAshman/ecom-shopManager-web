/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const PORTFOLIO_CASH_BALANCE = gql`
  query GetCashBalance {
    portalCashBalance {
      todayInvestment
      balances {
        portfolioName
        portfolioId
        balance
      }
    }
  }
`;
