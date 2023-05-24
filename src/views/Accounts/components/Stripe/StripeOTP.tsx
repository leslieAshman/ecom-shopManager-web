import { useEffect, FC, useMemo } from 'react';
import StripePaymentForm from './StripePaymentForm';
import {
  CreateStripePaymentMutationResponse,
  useCreateStripePaymentMutation,
} from '../../hooks/useCreateStripePaymentMutation';
import Loading from '../../../../components/Loading/loading';
import { ViewStateType } from '../../../../components/ProductTemplates/types';
import { logError } from '../../../../components/LogError';
import StripeContainer from '.';
import { ModelType, TopupSlideoutViewType } from '../../types';
import { stripeThemeAppearance } from './helpers';

interface StripeOTPProps {
  request: Parameters<CreateStripePaymentMutationResponse['execute']>[0];
  onCTA?: (viewState: ViewStateType) => void;
  model: ModelType;
  timestamp?: string;
}

const StripeOTP: FC<StripeOTPProps> = ({ request, onCTA, model }) => {
  const { execute, error, loading, data } = useCreateStripePaymentMutation();

  const stripeResponse = useMemo(() => {
    if (!data) return { paymentIntentId: '', options: null };
    const { clientSecret, paymentIntentId } = data.createStripePayment;
    return {
      paymentIntentId,
      options: {
        clientSecret,
        appearance: { ...stripeThemeAppearance },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as const,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    execute(request);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            type={TopupSlideoutViewType.STRIPE_OTP_PAYMENT}
            clientSecret={stripeResponse.options.clientSecret}
            onError={onError}
            model={model}
          />
        </StripeContainer>
      )}
    </div>
  );
};

export default StripeOTP;
