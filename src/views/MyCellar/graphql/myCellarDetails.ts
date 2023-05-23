import { gql } from '@apollo/client';

export const GET_MY_CELLAR_DETAILS = gql`
  query GetmyCelllarWineDetails($stockId: String!) {
    portalMyCellarWineDetails(stockId: $stockId) {
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
      imageFileName
      unitCount
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
      rotationNumber
      status
      location
      historicMarketPrices {
        date
        marketPrice
      }
    }
  }
`;
