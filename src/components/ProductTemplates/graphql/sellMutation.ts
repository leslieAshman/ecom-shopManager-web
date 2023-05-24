import { gql } from '@apollo/client';

export const SELL_PRODUCT_MUTATION = gql`
  mutation PortalSellWine($portalSellWineRequest: PortalSellWineRequestInput!) {
    portalSellWine(portalSellWineRequest: $portalSellWineRequest) {
      isSuccess
      errorMessage
    }
  }
`;
