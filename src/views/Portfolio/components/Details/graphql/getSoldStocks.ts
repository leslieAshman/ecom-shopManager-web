import { gql } from '@apollo/client';

export const GET_SOLD_STOCKS = gql`
  query GetSoldStocks {
    portalSoldHoldings {
      lwin18
      wineName
      vintage
      region
      cultWinesAllocationRegion
      dealDate
      dealRef
      unit
      unitCount
      qtySold
      status
      soldDate
      costPerUnit
      totalCost
      soldPricePerUnit
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
    }
  }
`;
