import { gql } from '@apollo/client';

export const PORTFOLIO_BALANCES = gql`
  query GetPortfolioBalances {
    portalPortfolioBalance {
      balance
      portfolioName
      portfolioId
      currentHoldings
      capitalInvested
      totalMgmtFee
      netProceedsFromSales
      netPosition
      netPositionPct
      profitAndLoss
      profitAndLossPct
      balancePending
      totalRefunds
      netContributions
      currentFeeModel
    }
  }
`;
