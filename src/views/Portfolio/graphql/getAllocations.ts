import { gql } from '@apollo/client';

export const PORTFOLIO_CURRENT_ALLOCATION = gql`
  query GetPortalAllocations {
    portalPortfolioCurrentAllocation {
      portalRegionPerformances {
        regionName
        currentHoldings
        totalPurchasePrice
        netPosition
        netPositionPct
      }
      portalPortfolioCurrentAllocation {
        tacticalAllocation
        regionName
        currentAllocation
        StrategicAllocation
      }
    }
  }
`;
