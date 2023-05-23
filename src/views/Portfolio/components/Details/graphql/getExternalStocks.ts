import { gql } from '@apollo/client';

export const GET_EXTERNAL_STOCKS = gql`
  query GetPortfolioExternalStock {
    portalExternalHoldings {
      lwin18
      wineName
      vintage
      region
      cultWinesAllocationRegion
      unit
      unitCount
      qty
      costPerUnit
      totalCost
      valuePerUnit
      totalValue
      changedPct
      netPosition
      location
      cashOffer
      createdDate
    }
  }
`;
