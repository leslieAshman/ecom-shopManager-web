import moment from 'moment';
import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleSolidInfoIcon } from '../../../assets/icons';
import { Button } from '../../../components';
import { ViewStateType } from '../../../components/ProductTemplates/types';
import RadioButton from '../../../components/RadioButton';
import { AppContext } from '../../../context/ContextProvider';
import { AppEventTypes } from '../../../types/AppType';
import { NavigationPath, PortfolioBalance } from '../../../types/DomainTypes';
import { buildDisplayText, classNames } from '../../../utils';
import { usePortfolioBalances } from '../../Portfolio/components/Summary/hooks/usePortfolioBalances';
import FeedbackTemplate, { MessageType } from '../../shared/FeedbackTemplate';
import {
  AccountViewType,
  ModelKeys,
  ModelType,
  PaymentType,
  SubjectOptionKeys,
  TopupSlideoutViewState,
  TopupSlideoutViewType,
} from '../types';
import BankTransferTemplate from './slideoutTemplates/BankTransferTemplate';
import OTPTopup from './slideoutTemplates/OTPTopup';
import RecurringTopup from './slideoutTemplates/RecurringTopup';
import StripeOTP from './Stripe/StripeOTP';
import StripeRecurringPayment from './Stripe/StripeRecurringPayment';
import { StripeRedirectKeys } from './Stripe/types';

export interface TopupSlideoutRefType {
  onBack: () => void;
}

enum DisplayTextKeys {
  TOPUP_AMOUNT_TEXT = 'top_up_amount',
  PORTFOLIO_PLACEHOLDER_TEXT = 'portfolio_placeholder_text',
  PAYMENT_PLACEHOLDER_TEXT = 'payment_placeholder_text',
  SELECT_PORTFOLIO_TITLE = 'select_portfolio_title',
  PAYMENT_FREQUENCY_TITLE = 'payment_frequency_title',
  PAYMENT_METHOD_TITLE = 'payment_method_title',
  TOPUP_TEXT = 'account:text.topup',
  NEXT = 'next',
  RECURRING_PAYMENT_TEXT = 'recurring_payment_text',
  FREQUENCY_TEXT = 'frequency_text',
  START_DATE_TEXT = 'start_date_text',
  CONTACT_US = 'common:contact',

  RECURRING_PAYMENTS = 'recurring-payments',
  OTP_CREDIT_CARD = 'credit-card',
  BANK_TRANSFER = 'bank-transfer',
}

const dateFormat = 'DD MMM YYYY';

interface TopupSlideoutProps {
  timestamp?: number;
  onClose?: (nextView?: AccountViewType) => void;
  onStateChange?: (state: TopupSlideoutViewState) => void;
  initialModel?: ModelType;
  initialView?: TopupSlideoutViewType;
}
const defaultValue = {
  [ModelKeys.AMOUNT]: '',
  [ModelKeys.PORTFOLIO_ID]: '',
  [ModelKeys.PAYMENT_TYPE]: PaymentType.CREDIT_CARD,
  [ModelKeys.IS_RECURRING]: false,
  [ModelKeys.START_DATE]: moment().format(dateFormat),
  [ModelKeys.FREQUENCY_TYPE]: '',
};

const TopupSlideout = forwardRef(
  (
    {
      onClose,
      onStateChange,
      initialModel = defaultValue,
      initialView = TopupSlideoutViewType.NONE,
    }: TopupSlideoutProps,
    ref,
  ) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    const displayText = useMemo(
      () => buildDisplayText(Object.values(DisplayTextKeys), 'account:slideout.topup', t),
      [t],
    );
    const [feedbackState, setFeedbackState] = useState(ViewStateType.DEFAULT);

    const {
      state: {
        settings: { currency },
        app: { paymentType, isConfirmPayment },
      },
      dispatch,
    } = useContext(AppContext);

    const [selectedTopupTypeId, setSelectedTopTypeId] = useState('');
    const [view, setView] = useState(initialView);

    const [model, setModel] = useState<ModelType>({ ...defaultValue, ...initialModel });
    const [feedbackTemplateConfig, setFeedbackTemplateConfig] = useState<MessageType>({
      title: () => null,
      subTitle: () => null,
      onClick: () => null,
      content: () => null,
      footer: () => null,
    });

    const onTopupTypeSelect = () => {
      let nView = TopupSlideoutViewType.NONE;
      let showBackButton = false;
      switch (selectedTopupTypeId) {
        case TopupSlideoutViewType.BANK_TRANSFER:
          nView = TopupSlideoutViewType.BANK_TRANSFER;
          showBackButton = true;
          break;
        case TopupSlideoutViewType.RECURRING_PAYMENTS:
        case TopupSlideoutViewType.OTP_CREDIT_CARD:
          nView = selectedTopupTypeId as TopupSlideoutViewType;
          showBackButton = true;
          break;
      }
      setView(nView);
      if (onStateChange)
        onStateChange({
          showBackButton,
          view: nView,
        });
    };
    const onViewStateChange = (change: TopupSlideoutViewState) => {
      setModel({ ...model, ...(change.model || {}) });
      setView(change.view);
      if (onStateChange) onStateChange(change);
    };

    const onCTA = (requestView: ViewStateType) => {
      switch (requestView) {
        case ViewStateType.ERROR_RESULT:
          setView(TopupSlideoutViewType.ERROR);
          setFeedbackTemplateConfig({
            footer: () => (
              <div className="flex flex-col w-full">
                <Button
                  className={`btn-outline mt-5`}
                  onClick={() => {
                    onCTA(ViewStateType.CONTACT_US);
                  }}
                  props={{
                    name: displayText[DisplayTextKeys.CONTACT_US],
                  }}
                >
                  {displayText[DisplayTextKeys.CONTACT_US]}
                </Button>
              </div>
            ),
          });
          setFeedbackState(ViewStateType.ERROR_RESULT);
          if (onStateChange)
            onStateChange({
              showBackButton: false,
              view: TopupSlideoutViewType.ERROR,
            });
          break;

        case ViewStateType.PAYMENT_SUCCESS:
          setView(TopupSlideoutViewType.NONE);
          setFeedbackTemplateConfig({
            onClick: () => {
              if (onClose) onClose();
            },

            subTitle: () => (
              <div className="text-14 mt-2">
                {t`paymentSuccess.subTitle${
                  paymentType === TopupSlideoutViewType.STRIPE_RECURRING_PAYMENT ? '_recurring' : ''
                }`.trim()}
              </div>
            ),
          });
          setFeedbackState(requestView);
          dispatch({ type: AppEventTypes.UPDATE_STATE, payload: { isConfirmPayment: false } });
          break;

        case ViewStateType.CONTACT_US:
          if (onClose) onClose(AccountViewType.CONTACT_US);
          navigate(NavigationPath.ACCOUNTS, {
            state: { accountViewType: AccountViewType.CONTACT_US, subject: SubjectOptionKeys.FINANCIAL },
          });
          break;

        default:
          setView(TopupSlideoutViewType.NONE);
          setFeedbackState(requestView);
          break;
      }
    };

    const onBack = () => {
      let showBackButton = true;
      const viewUpdate = TopupSlideoutViewType.NONE;
      switch (view) {
        case TopupSlideoutViewType.BANK_TRANSFER:
          showBackButton = false;
          break;
        case TopupSlideoutViewType.OTP_CREDIT_CARD:
          showBackButton = false;
          break;

        default:
          showBackButton = false;
          break;
      }

      setView(viewUpdate);
      if (onStateChange)
        onStateChange({
          showBackButton,
          view: viewUpdate,
        });
    };

    const { portfolioBalances } = usePortfolioBalances();

    const showFeeModelInfo = useMemo(() => {
      const feeModels = portfolioBalances.filter((x: PortfolioBalance) => `${x.portfolioId}`.length > 0);
      const otherFeeModelExist = !!feeModels.find((x) => x.currentFeeModel === false);
      return otherFeeModelExist;
    }, [portfolioBalances]);

    useImperativeHandle(ref, () => ({
      onBack,
    }));

    const onConfirmPayment = (queryParams: URLSearchParams) => {
      let paymentInfo: Record<string, string> = {};
      for (const [key, value] of queryParams) {
        paymentInfo = { ...paymentInfo, [key]: value };
      }

      if (
        paymentInfo[StripeRedirectKeys.REDIRECT_STATUS].length > 0 &&
        paymentInfo[StripeRedirectKeys.CLIENT_SECRET].length > 0 &&
        paymentInfo[StripeRedirectKeys.REDIRECT_STATUS] === 'succeeded'
      ) {
        onCTA(ViewStateType.PAYMENT_SUCCESS);
        dispatch({
          type: AppEventTypes.UPDATE_STATE,
          payload: {
            isConfirmPayment: false,
          },
        });
      }
      window.history.replaceState(null, '', NavigationPath.ACCOUNTS);
    };

    useEffect(() => {
      if (isConfirmPayment && pathname === `${NavigationPath.ACCOUNTS}${NavigationPath.PAYMENT_CONFIRMATION}`) {
        onConfirmPayment(new URLSearchParams(search));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConfirmPayment]);

    return (
      <div className="flex flex-col flex-1 bg-gradient-to-b  from-gray-100 to-gray-500  pb-5 px-3 w-screen relative overflow-x-hidden sm:w-[390px]">
        <div className="w-full h-full rounded-md  overflow-y-auto flex flex-col">
          <FeedbackTemplate
            onClose={onClose}
            templateConfig={feedbackTemplateConfig}
            viewState={feedbackState}
            onCTA={onCTA}
          >
            <div className="flex flex-col bg-white  divide-y divide-gray-200  h-full w-full">
              {view === TopupSlideoutViewType.NONE && (
                <div className=" w-full h-full p-5 flex flex-col">
                  <div className="flex flex-col mt-5 gap-5 flex-1">
                    {[
                      TopupSlideoutViewType.OTP_CREDIT_CARD,
                      TopupSlideoutViewType.RECURRING_PAYMENTS,
                      TopupSlideoutViewType.BANK_TRANSFER,
                    ].map((topType) => {
                      const isSelected = selectedTopupTypeId === topType;
                      return (
                        <div
                          onClick={() => setSelectedTopTypeId(topType!)}
                          key={`topupType-${topType}`}
                          className="bg-gray-100 cursor-pointer flex items-center self-stretch p-5 gap-5 w-full h-[112px] rounded-md"
                        >
                          <div className="flex flex-1 ">{displayText[topType]}</div>
                          <RadioButton id={`${topType}`} name="topup-types" isChecked={isSelected} />
                        </div>
                      );
                    })}
                  </div>
                  {showFeeModelInfo && (
                    <>
                      <div className="flex items-center w-full mt-8 mb-4">
                        <div className="mr-5">{t`account:slideout.topup.recurring_payment_info_title`}</div>
                        <CircleSolidInfoIcon />
                      </div>
                      <p className="text-sm w-full flex-1 h-full overflow-x-hidden">
                        {t(`account:slideout.topup.current_fee_model_info`)}
                      </p>
                    </>
                  )}
                  <Button
                    isDisable={selectedTopupTypeId === ''}
                    className={classNames('mt-5', selectedTopupTypeId === '' ? 'btn-disabled' : 'btn-accent')}
                    onClick={onTopupTypeSelect}
                    props={{
                      name: DisplayTextKeys.NEXT,
                    }}
                  >
                    {displayText[DisplayTextKeys.NEXT]}
                  </Button>
                </div>
              )}

              {view === TopupSlideoutViewType.RECURRING_PAYMENTS && (
                <RecurringTopup initialModel={model} onStateChange={onViewStateChange} />
              )}
              {view === TopupSlideoutViewType.OTP_CREDIT_CARD && (
                <OTPTopup initialModel={model} onStateChange={onViewStateChange} />
              )}
              {view === TopupSlideoutViewType.BANK_TRANSFER && <BankTransferTemplate />}
              {view === TopupSlideoutViewType.STRIPE_RECURRING_PAYMENT && (
                <StripeRecurringPayment
                  model={model}
                  onCTA={onCTA}
                  request={{
                    currency,
                    priceId: '',
                    portfolioId: Number(model[ModelKeys.PORTFOLIO_ID]),
                    defaultPaymentMethod: null,
                    amount: Number(model[ModelKeys.AMOUNT]),
                    frequency: model[ModelKeys.FREQUENCY_TYPE],
                  }}
                />
              )}
              {view === TopupSlideoutViewType.STRIPE_OTP_PAYMENT && (
                <StripeOTP
                  model={model}
                  onCTA={onCTA}
                  timestamp={`${new Date().getTime()}`}
                  request={{
                    amount: Number(model[ModelKeys.AMOUNT]),
                    portfolioId: Number(model[ModelKeys.PORTFOLIO_ID]),
                  }}
                />
              )}
            </div>
          </FeedbackTemplate>
        </div>
      </div>
    );
  },
);

export default TopupSlideout;
