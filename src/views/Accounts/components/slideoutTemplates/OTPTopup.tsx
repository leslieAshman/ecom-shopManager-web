import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PortfolioBalanceIcon } from '../../../../assets/icons';
import { Button, Dropdown } from '../../../../components';
import CustomInput from '../../../../components/CustomInput';
import { DisplayField, DisplayFieldType, DisplaySection } from '../../../../components/DisplayForms';
import DisplayForm from '../../../../components/DisplayForms/DisplayForm';
import { DropdownItem } from '../../../../components/Dropdown';
import { PortfolioBalance } from '../../../../types/DomainTypes';
import { buildDisplayText, formatter } from '../../../../utils';
import { usePortfolioBalances } from '../../../Portfolio/components/Summary/hooks/usePortfolioBalances';
import { ModelKeys, ModelType, TopupSlideoutViewState, TopupSlideoutViewType } from '../../types';

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

const OTPTopup = forwardRef(({ onStateChange, initialModel }: TopupSlideoutProps, ref) => {
  const { t } = useTranslation();

  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:slideout.topup', t), [t]);
  const [portfolioText, setPortfolioText] = useState('');

  const [model, setModel] = useState<ModelType>(initialModel);

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

  const onPortfolioChange = (item: DropdownItem) => {
    const selectedPortfolio = portfolioBalances.find((x) => x.portfolioId === item.value);
    setPortfolioText((selectedPortfolio || { portfolioName: '' }).portfolioName);
    setModel({ ...model, [ModelKeys.PORTFOLIO_ID]: `${selectedPortfolio?.portfolioId}` });
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
    ];

    return [
      {
        className: 'gap-5  w-full',
        fields,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const onNext = () => {
    if (onStateChange)
      onStateChange({
        showBackButton: true,
        view: TopupSlideoutViewType.STRIPE_OTP_PAYMENT,
        model,
      });
  };

  const onBack = () => {
    let showBackButton = true;
    const viewUpdate = TopupSlideoutViewType.NONE;
    showBackButton = false;

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

  const isFormValid = () => {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    return model[ModelKeys.AMOUNT] > 0 && model[ModelKeys.PORTFOLIO_ID].length > 0;
  };

  const disableButton = !isFormValid();
  const viewTitle = displayText[DisplayTextKeys.TOPUP_AMOUNT_TEXT];

  return (
    <>
      <div className="flex items-center flex-col p-5 gap-2">
        <div className="w-[32px] h-[26.18px]">
          <PortfolioBalanceIcon className="mr-2 bg-gray-200 " />
        </div>
        <span className="text-14">{viewTitle}</span>

        <CustomInput
          inputProps={{
            inputContainerClassName: 'border-none',
          }}
          value={model.amount < 0 ? '' : model.amount}
          type={DisplayFieldType.CURRENCY}
          name={DisplayTextKeys.TOPUP_AMOUNT_TEXT}
          placeholder={formatter.format(0)}
          inputClassName="text-center text-lg  border-none"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
            value?: string | number,
          ) => {
            setModel({ ...model, [ModelKeys.AMOUNT as string]: value });
          }}
        />
      </div>

      <div className="flex flex-1 flex-col h-full pt-5 w-full p-5 overflow-x-hidden overflow-y-auto">
        <DisplayForm sections={sections} model={{ ...model, modelType: 'TopUp' }} />
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

export default OTPTopup;
