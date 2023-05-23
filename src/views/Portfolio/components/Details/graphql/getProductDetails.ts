import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: String!) {
    portalHoldingDetails(id: $id) {
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
      imageFileName
      mgmtFeePerUnit
      totalMgmtFee
      costWithMgmtFeePerUnit
      totalCostWithMgmtFee
      holdingStocks {
        rotationNumber
        status
        location
      }
      historicMarketPrices {
        date
        marketPrice
      }
    }
  }
`;
