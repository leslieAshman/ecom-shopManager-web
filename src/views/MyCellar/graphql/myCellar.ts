import { gql } from '@apollo/client';

export const GET_MY_CELLAR = gql`
  query GetMyCellar {
    portalMyCellar {
      rotationNumber
      stockId
      holdingId
      portfolioId
      lwin18
      wineName
      vintage
      region
      imageFileName
      cultWinesAllocationRegion
      dealDate
      dealRef
      dealCCY
      unit
      unitCount
      qty
      status
      location
    }
  }
`;
