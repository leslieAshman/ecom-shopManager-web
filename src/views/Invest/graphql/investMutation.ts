import { gql } from '@apollo/client';

export const INVEST_NOW_MUTATION = gql`
  mutation PortalInvestNow($portalInvestNowRequest: PortalInvestNowRequestInput!) {
    portalInvestNow(portalInvestNowRequest: $portalInvestNowRequest) {
      isSuccess
      errorMessage
    }
  }
`;
