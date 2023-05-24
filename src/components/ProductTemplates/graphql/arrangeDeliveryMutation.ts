import { gql } from '__generated__';

export const ARRANGE_DELIVERY_MUTATION = gql(`
  mutation PortalDeliverWine($portalDeliverWineRequest: PortalDeliverWineRequestInput!) {
    portalDeliverWine(portalDeliverWineRequest: $portalDeliverWineRequest) {
      isSuccess
      errorMessage
    }
  }
`);
