/* eslint-disable no-restricted-imports */
import { gql } from '@apollo/client';

export const PORTFOLIO_PERFORMANCE_OVER_TIME = gql`
  query PortalPortfolioPerformanceOverTime($portfolioId: Int) {
    portalPortfolioPerformanceOverTime(portfolioId: $portfolioId) {
      date
      currentHoldings
      netContributions
    }
  }
`;
