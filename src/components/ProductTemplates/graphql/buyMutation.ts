// eslint-disable-next-line no-restricted-imports
import { gql } from '@apollo/client';

export const BUY_PRODUCT_MUTATION = gql`
  mutation PortalBuyWine($portalBuyWineRequest: PortalBuyWineRequestInput!) {
    portalBuyWine(portalBuyWineRequest: $portalBuyWineRequest) {
      isSuccess
      errorMessage
    }
  }
`;
