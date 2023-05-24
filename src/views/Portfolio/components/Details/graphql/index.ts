import { gql } from '@apollo/client';

export const PORTFOLIO_CURRENT_HOLDINGS = gql`
  query GetPortfolioCurrentHoldings {
    portalCurrentHoldings {
      id
      portfolioId
      lwin18
      wineName
      vintage
      region
      cultWinesAllocationRegion
      dealDate
      dealRef
      dealCCY
      unit
      unitCount
      imageFileName
      qty
      qtyForSale
      priceForSale
      costPerUnit
      totalCost
      valuePerUnit
      valuePerBottle
      totalValue
      changedPct
      netPosition
      netPositionPerUnit
      profitAndLoss
      profitAndLossPerUnit
      mgmtFeePerUnit
      totalMgmtFee
      costWithMgmtFeePerUnit
      totalCostWithMgmtFee
      historicMarketPrices {
        date
        marketPrice
      }
    }
  }
`;
