import { useEffect, FC, useMemo, useContext } from 'react';
import StripePaymentForm from './StripePaymentForm';
import Loading from '../../../../components/Loading/loading';
import { ViewStateType } from '../../../../components/ProductTemplates/types';
import { logError } from '../../../../components/LogError';
import StripeContainer from '.';
import { ModelType, TopupSlideoutViewType } from '../../types';
import {
  CreateStripeRecurringPaymentMutationResponse,
  useCreateStripeRecurringPaymentMutation,
} from '../../hooks/useCreateStripeRecurringPaymentMutation';
import { stripeThemeAppearance } from './helpers';
import { useGetRecurringPrices } from '../../hooks/useGetRecurringPrices';
import { AppContext } from '../../../../context/ContextProvider';

interface StripeRecurringPaymentProps {
  request: Parameters<CreateStripeRecurringPaymentMutationResponse['execute']>[0];
  onCTA?: (viewState: ViewStateType) => void;
  model: ModelType;
}

//{"message":"400: Bad Request","locations":[{"line":2,"column":3}],"path":["createStripeRecurringPayment"],"extensions":{"code":"INTERNAL_SERVER_ERROR","response":{"url":"https://cw-cds-dev-finance-wa.azurewebsites.net/Payment/StripePaymentSubscription","status":400,"statusText":"Bad Request","body":"Already have the Active or Initiated status for userId: 7f6da2b2-0c6c-415c-857d-3ce8e75d5e18"
const StripeRecurringPayment: FC<StripeRecurringPaymentProps> = ({ request, onCTA, model }) => {
  const {
    state: {
      miscellaneous: { frequencyIntervalMap },
    },
  } = useContext(AppContext);
  const { execute, error, loading, data } = useCreateStripeRecurringPaymentMutation();
  const { recurringPaymentPrices, loading: loadingPriceProducts } = useGetRecurringPrices(request.currency);

  const stripeResponse = useMemo(() => {
    if (!data) return { paymentIntentId: '', options: null };
    const { clientSecret, id } = data.createStripeRecurringPayment;
    return {
      paymentIntentId: id,
      options: {
        clientSecret,
        appearance: { ...stripeThemeAppearance },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as const,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!loadingPriceProducts) {
      const { amount, paymentFrequency } = model;
      const priceId = (
        recurringPaymentPrices.find(
          (x) => `${x.unitAmount}` === `${amount}` && `${paymentFrequency}` === `${x.recurringInterval}`,
        ) || { id: '' }
      ).id;

      execute({
        ...request,
        priceId,
        frequency: (frequencyIntervalMap as Map<string, string>).get(paymentFrequency) || paymentFrequency,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurringPaymentPrices]);

  const onError = (err: unknown) => {
    logError(err);
    if (onCTA) {
      onCTA(ViewStateType.ERROR_RESULT);
    }
  };

  useEffect(() => {
    if (error) {
      onError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div>
      {loading && <Loading containerClassName="mt-10" />}
      {!loading && stripeResponse.options && stripeResponse.options.clientSecret && (
        <StripeContainer options={stripeResponse.options}>
          <StripePaymentForm
            type={TopupSlideoutViewType.STRIPE_RECURRING_PAYMENT}
            clientSecret={stripeResponse.options.clientSecret}
            onError={onError}
            model={model}
          />
        </StripeContainer>
      )}
    </div>
  );
};

export default StripeRecurringPayment;
