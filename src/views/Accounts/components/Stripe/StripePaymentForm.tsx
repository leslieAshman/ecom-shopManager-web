import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Loading from '../../../../components/Loading/loading';
import { PortfolioBalanceIcon } from '../../../../assets/icons';
import { buildDisplayText, formatter } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { ModelKeys, ModelType, TopupSlideoutViewType } from '../../types';
import { AppContext } from '../../../../context/ContextProvider';
import { AppEventTypes } from '../../../../types/AppType';
import { NavigationPath } from '../../../../types/DomainTypes';

enum DisplayTextKeys {
  TOPUP_AMOUNT_TEXT = 'top_up_amount',
  SUBMIT = 'submit_text',
}

interface StripePaymentFormProps {
  clientSecret: string;
  onError?: (error: unknown) => void;
  model: ModelType;
  type: TopupSlideoutViewType.STRIPE_OTP_PAYMENT | TopupSlideoutViewType.STRIPE_RECURRING_PAYMENT;
}

export const StripePaymentForm: FC<StripePaymentFormProps> = ({ clientSecret, onError, model }) => {
  const { dispatch } = useContext(AppContext);

  const { t } = useTranslation();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:slideout.topup', t), [t]);
  const stripe = useStripe();
  const elements = useElements();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.href}${NavigationPath.PAYMENT_CONFIRMATION}`,
        },
      });

      if (error.type === 'card_error' || error.type === 'validation_error') setMessage(error?.message as string);

      dispatch({
        type: AppEventTypes.UPDATE_STATE,
        payload: {
          isConfirmPayment: false,
          paymentType: TopupSlideoutViewType.ERROR,
        },
      });

      if (onError) onError(error);
      setIsProcessing(false);
    } catch (err) {
      if (onError) onError(err);
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }

    // setIsLoading(true);
    // stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent, error }) => {
    //   switch (paymentIntent?.status) {
    //     case 'succeeded':
    //       setMessage('Payment succeeded!');
    //       break;
    //     case 'processing':
    //       setMessage('Your payment is processing.');
    //       break;
    //     case 'requires_payment_method':
    //       setMessage('Your payment was not successful, please try again.');
    //       break;
    //     default:
    //       setMessage('Something went wrong.');
    //       break;
    //   }
    //   if (error) {
    //     if (onError) onError(error);
    //   } else {
    //     setIsLoading(false);
    //   }
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, clientSecret]);

  return (
    <>
      {isLoading && <Loading containerClassName="mt-10" />}
      {!isLoading && (
        <>
          <div className="flex items-center flex-col p-5 gap-2 mb-3">
            <div className="w-[32px] h-[26.18px]">
              <PortfolioBalanceIcon className="mr-2 bg-gray-200 " />
            </div>
            <span className="text-14">{displayText[DisplayTextKeys.TOPUP_AMOUNT_TEXT]}</span>
            <span className="text-center text-lg  border-none">
              {`${formatter.format(Number(model[ModelKeys.AMOUNT]))}`}
            </span>
          </div>
          <form id="payment-form" className="px-5 mb-5" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <PaymentElement
                id="payment-element"
                className={` mb-10 flex-1 w-full h-full ${isProcessing ? 'opacity-20 pointer-events-none' : ''}`}
              />

              <button className="btn-accent mt-0" disabled={isProcessing || !stripe || !elements} id="submit">
                <>
                  {isProcessing && (
                    <svg
                      role="status"
                      className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#1C64F2"
                      />
                    </svg>
                  )}
                  <span> {displayText[DisplayTextKeys.SUBMIT]}</span>
                </>
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default StripePaymentForm;
