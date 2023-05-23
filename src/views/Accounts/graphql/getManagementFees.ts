import { gql } from '@apollo/client';

export const GET_MGMT_FEES = gql`
  query ManagementFeesQuery {
    portalManagementFees {
      id
      accountHolderName
      vintradeAccountHolderId
      clientName
      vintradeClientId
      valuationDate
      feeType
      portfolioValue
      offsetValue
      feeAmount
      appliedPct
      invoiceNumber
      invoiceDate
      status
    }
  }
`;
