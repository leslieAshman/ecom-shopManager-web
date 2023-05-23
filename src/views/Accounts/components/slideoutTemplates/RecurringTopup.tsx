import moment from 'moment';
import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleSolidInfoIcon, PortfolioBalanceIcon } from '../../../../assets/icons';
import { Button, Dropdown } from '../../../../components';
import { DisplayField, DisplayFieldType, DisplaySection } from '../../../../components/DisplayForms';
import DisplayForm from '../../../../components/DisplayForms/DisplayForm';
import { DropdownItem } from '../../../../components/Dropdown';
import { logError } from '../../../../components/LogError';
import { AppContext } from '../../../../context/ContextProvider';
import { PortfolioBalance } from '../../../../types/DomainTypes';

import { buildDisplayText, capitalizeFirstLetter, formatter, sortItems, uniqueItems } from '../../../../utils';
import { useLazyExecuteQuery } from '../../../hooks/useLazyExecuteQuery';
import { usePortfolioBalances } from '../../../Portfolio/components/Summary/hooks/usePortfolioBalances';
import { GET_RECURRING_PRICES } from '../../graphql/getRecurringPaymentPrices';

import {
  ModelKeys,
  ModelType,
  RecurringPaymentPrices,
  TopupSlideoutViewState,
  TopupSlideoutViewType,
} from '../../types';

export interface TopupSlideoutRefType {
  onBack: () => void;
}

const getFieldAttributes = (modelKey: string, label = '') => ({
  id: modelKey,
  name: modelKey,
  ariaLabel: modelKey,
  modelKey,
  className: 'mb-5 ',
  containerClassName: 'mb-8 gap-5 ',
  translationKey: ``,
  placeholder: '',

  onBlur: () => {},
  label: {
    text: label,
    isShow: label.length > 0,
    className: 'mb-2 block',
  },
});

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
}

interface TopupSlideoutProps {
  timestamp?: number;
  onClose?: () => void;
  onStateChange?: (state: TopupSlideoutViewState) => void;
  initialModel: ModelType;
}

const RecurringTopup = forwardRef(({ onStateChange, initialModel }: TopupSlideoutProps, ref) => {
  const { t } = useTranslation();
  const {
    state: {
      // settings: { currency },
      miscellaneous: { frequencyIntervalMap },
    },
  } = useContext(AppContext);

  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:slideout.topup', t), [t]);
  const [portfolioText, setPortfolioText] = useState('');

  const {
    executor: GetRecurringPaymentPrices,
    error: GetRecurringPricesError,
    data: paymentPricesResults,
  } = useLazyExecuteQuery(GET_RECURRING_PRICES);

  const [recurringPaymentPrices, setRecurringPaymentPrices] = useState<RecurringPaymentPrices[]>([]);
  const [paymentFrequencyText, setPaymentFrequencyText] = useState('');
  const [model, setModel] = useState<ModelType>(initialModel);

  if (GetRecurringPricesError) {
    logError(GetRecurringPricesError);
  }

  const onSubscriptionPriceChange = (item: DropdownItem) => {
    if (item) setModel({ ...model, [ModelKeys.AMOUNT]: Number(item.value) });
  };

  const { portfolioBalances } = usePortfolioBalances();
  const portfolioDropdownOptions = useMemo(() => {
    return portfolioBalances
      .filter(
        (x: PortfolioBalance) => `${x.portfolioId}`.length > 0 && !!x.currentFeeModel && x.currentFeeModel === true,
      )
      .map((balance: PortfolioBalance) => {
        const { portfolioId, portfolioName } = balance;
        return {
          id: portfolioId,
          value: portfolioId,
          content: (
            <div className="flex justify-between text-base">
              <span>{portfolioName}</span>
            </div>
          ),
        };
      });
  }, [portfolioBalances]);

  const paymentPricesOptions = useMemo(() => {
    const prices = uniqueItems(recurringPaymentPrices || [], 'unitAmount');
    const priceOptions = sortItems(prices, true, 'unitAmount').map((priceSubscription) => {
      const { unitAmount: value } = priceSubscription;
      return {
        id: value,
        text: value,
        value: value,
        content: (
          <div className="flex justify-between text-base">
            <span>{`${value}`}</span>
          </div>
        ),
      };
    });
    if (model[ModelKeys.AMOUNT] === '') {
      onSubscriptionPriceChange(priceOptions[0]);
    }

    return priceOptions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurringPaymentPrices]);

  const paymentFrequencyOptions = useMemo(() => {
    const availableFrequencies = (recurringPaymentPrices || []).filter(
      (x) => `${x.unitAmount}` === `${model[ModelKeys.AMOUNT]}`.trim(),
    );
    if (!availableFrequencies) return [];

    const frequencies = uniqueItems(availableFrequencies, 'recurringInterval');
    return sortItems(
      frequencies.map((priceSubscription) => {
        const { recurringInterval, nickName: value } = priceSubscription;
        const text = `${capitalizeFirstLetter(
          t(`common:${(frequencyIntervalMap as Map<string, string>).get(recurringInterval)}`),
        )}`;
        return {
          id: recurringInterval,
          text,
          value,
          content: (
            <div className="flex justify-between text-base">
              <span>{text}</span>
            </div>
          ),
        };
      }),
      true,
      'id',
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurringPaymentPrices, model[ModelKeys.AMOUNT], t]);

  const onPortfolioChange = (item: DropdownItem) => {
    const selectedPortfolio = portfolioBalances.find((x) => x.portfolioId === item.value);
    setPortfolioText((selectedPortfolio || { portfolioName: '' }).portfolioName);
    setModel({ ...model, [ModelKeys.PORTFOLIO_ID]: `${selectedPortfolio?.portfolioId}` });
  };

  const onPaymentFrequencyChange = (item: DropdownItem) => {
    const selectedPaymentFrequency = item
      ? paymentFrequencyOptions.find((x) => x.id === item.id)
      : paymentFrequencyOptions[0];
    setPaymentFrequencyText((selectedPaymentFrequency || { text: '' }).text);
    setModel({ ...model, paymentFrequency: selectedPaymentFrequency!.id });
  };

  const sections: DisplaySection[] = useMemo(() => {
    const ddlConfig = {
      itemWrapperStyle: { width: '100%' },
      containerClassName: 'w-full',
      itemsContainerClassName: 'h-[300px] overflow-y-auto w-full',
      itemClassName: 'py-5 text-base flex',
      className: 'flex-1 text-sm sm:text-14 whitespace-nowrap p-0 justify-start border-b border-b-gray-400',
    };

    const fields: DisplayField[] = [
      {
        ...getFieldAttributes(ModelKeys.PORTFOLIO_ID, displayText[DisplayTextKeys.SELECT_PORTFOLIO_TITLE]),
        type: DisplayFieldType.CUSTOM,
        customTemplate: () => {
          return (
            <Dropdown
              placeholder={displayText[DisplayTextKeys.PORTFOLIO_PLACEHOLDER_TEXT]}
              value={model.portfolioId}
              valueTemplate={
                <div className="flex w-[95%]">
                  <span className="truncate block">{portfolioText}</span>
                </div>
              }
              onItemSelect={onPortfolioChange}
              items={portfolioDropdownOptions}
              {...ddlConfig}
            />
          );
        },
      },

      {
        ...getFieldAttributes(ModelKeys.AMOUNT, displayText[DisplayTextKeys.TOPUP_AMOUNT_TEXT]),
        type: DisplayFieldType.CUSTOM,
        customTemplate: () => {
          return (
            <Dropdown
              placeholder={displayText[DisplayTextKeys.TOPUP_AMOUNT_TEXT]}
              value={`${model[ModelKeys.AMOUNT]}`}
              valueTemplate={
                <div className="flex w-[95%]">
                  <span className="truncate block ">{`${formatter.format(Number(model[ModelKeys.AMOUNT]))}`}</span>
                </div>
              }
              onItemSelect={onSubscriptionPriceChange}
              items={paymentPricesOptions}
              {...ddlConfig}
            />
          );
        },
      },
      {
        ...getFieldAttributes(ModelKeys.FREQUENCY_TYPE, displayText[DisplayTextKeys.PAYMENT_FREQUENCY_TITLE]),
        type: DisplayFieldType.CUSTOM,
        customTemplate: () => {
          return (
            <Dropdown
              placeholder={displayText[DisplayTextKeys.FREQUENCY_TEXT]}
              value={model.paymentFrequency}
              valueTemplate={
                <div className="flex w-[95%]">
                  <span className="truncate block">{paymentFrequencyText}</span>
                </div>
              }
              onItemSelect={onPaymentFrequencyChange}
              items={paymentFrequencyOptions}
              {...ddlConfig}
            />
          );
        },
      },
    ];

    return [
      {
        className: 'gap-5  w-full',
        fields,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, paymentPricesOptions, paymentFrequencyOptions, portfolioDropdownOptions]);

  const onNext = () => {
    if (onStateChange)
      onStateChange({
        showBackButton: true,
        view: TopupSlideoutViewType.STRIPE_RECURRING_PAYMENT,
        model: { ...model, [ModelKeys.IS_RECURRING]: true },
      });
  };

  const onBack = () => {
    const showBackButton = true;
    const viewUpdate = TopupSlideoutViewType.NONE;

    if (onStateChange)
      onStateChange({
        showBackButton,
        view: viewUpdate,
      });
  };

  useImperativeHandle(ref, () => ({
    onBack,
  }));

  useEffect(() => {
    if (paymentFrequencyOptions) {
      const freq = model[ModelKeys.FREQUENCY_TYPE];
      if (paymentFrequencyOptions.length === 1) {
        onPaymentFrequencyChange(paymentFrequencyOptions[0]);
      } else if (paymentFrequencyOptions.length > 0 && freq && freq.length > 0) {
        onPaymentFrequencyChange(paymentFrequencyOptions.find((x) => x.id === freq)!);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentFrequencyOptions]);

  useEffect(() => {
    if (paymentPricesOptions) {
      const amt = model[ModelKeys.AMOUNT];
      if (paymentPricesOptions.length === 1 || amt === -1) {
        onSubscriptionPriceChange(paymentPricesOptions[0]);
      } else if (paymentPricesOptions.length > 0 && amt && amt > 0) {
        onSubscriptionPriceChange(paymentPricesOptions.find((x) => Number(x.value) === amt)!);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentPricesOptions]);

  useEffect(() => {
    GetRecurringPaymentPrices({
      currency: 'GBP',
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (portfolioDropdownOptions) {
      const pId = model[ModelKeys.PORTFOLIO_ID];
      if (portfolioDropdownOptions.length === 1) {
        onPortfolioChange(portfolioDropdownOptions[0]);
      } else if (portfolioDropdownOptions.length > 0 && pId && pId.length > 0) {
        onPortfolioChange(portfolioDropdownOptions.find((x) => `${x.id}` === `${pId}`)!);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioDropdownOptions]);

  useEffect(() => {
    if (paymentPricesResults !== recurringPaymentPrices)
      setRecurringPaymentPrices(
        (
          (paymentPricesResults || { recurringPaymentPrices: [] }) as {
            recurringPaymentPrices: RecurringPaymentPrices[];
          }
        ).recurringPaymentPrices,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentPricesResults]);

  const isFormValid = () => {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check

    return (
      model[ModelKeys.AMOUNT] > 0 &&
      model[ModelKeys.PORTFOLIO_ID].length > 0 &&
      model[ModelKeys.FREQUENCY_TYPE].length > 0
    );
  };

  const disableButton = !isFormValid();
  const viewTitle = displayText[DisplayTextKeys.RECURRING_PAYMENT_TEXT];

  return (
    <>
      <div className="flex items-center flex-col p-5 gap-2">
        <div className="w-[32px] h-[26.18px]">
          <PortfolioBalanceIcon className="mr-2 bg-gray-200 " />
        </div>
        <span className="text-14">{viewTitle}</span>
      </div>

      <div className="flex flex-col h-full pt-5 w-full p-5 ">
        <DisplayForm sections={sections} model={{ ...model, modelType: 'TopUp' }} />

        <>
          <div className="flex items-center w-full mt-8 mb-4">
            <div className="mr-5 ">{t`account:slideout.topup.recurring_payment_info_title`}</div>
            <CircleSolidInfoIcon />
          </div>
          <p className="text-sm w-full">
            {t(`account:slideout.topup.recurring_payment_info`, {
              amount: formatter.format(Number(model[ModelKeys.AMOUNT]) < 0 ? 0 : Number(model[ModelKeys.AMOUNT])),
              date: moment(model[ModelKeys.START_DATE]).format('Do'),
            })}
          </p>
        </>
      </div>
      <div className="w-full justify-center items-center p-5">
        <Button
          isDisable={disableButton}
          className={` text-14 font-normal rounded-full  w-full ${
            disableButton ? 'btn-disabled' : 'btn  bg-orange text-black'
          }`}
          onClick={onNext}
          props={{
            name: DisplayTextKeys.NEXT,
          }}
        >
          {displayText[DisplayTextKeys.NEXT]}
        </Button>
      </div>
    </>
  );
});

export default RecurringTopup;
