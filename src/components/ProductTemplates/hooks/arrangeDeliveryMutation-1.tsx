import { useMutation } from '@apollo/client';
import { ARRANGE_DELIVERY_MUTATION } from '../graphql/arrangeDeliveryMutation';
import { ArrangeDeliveryRequest } from '../types';

export const useArrangeDeliverytMutation = () => {
  const [arrangeDelivery, { error, loading, data }] = useMutation(ARRANGE_DELIVERY_MUTATION);
  const execute = (request: ArrangeDeliveryRequest) =>
    arrangeDelivery({
      variables: {
        portalDeliverWineRequest: {
          ...request,
        },
      },
    });

  return {
    execute,
    error,
    loading,
    data,
  };
};
