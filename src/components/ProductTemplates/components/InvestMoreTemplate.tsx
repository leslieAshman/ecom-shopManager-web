import { useFormik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { buildDisplayText } from '../../../utils';
import Button from '../../Button';
import Dropdown, { DropdownItem } from '../../Dropdown';
import CustomInput from '../../CustomInput';
import { PricingType, ProductEventType, BuySellHoldingModel, BuyProductRequest } from '../types';
import { getInvestMorePricingOptions } from '../../../helpers';
import { DisplayFieldType } from '../../DisplayForms';
import { SortAndFilterLayoutContext } from '../../Layout/SortAndFilterLayout';
import { CurrencyFormater } from '../../../types/commonTypes';

export enum BuySellHoldingModelProp {
  UNITS = 'units',
  PRICE = 'price',
  REASON = 'reason',
  MARKET_VALUE = 'marketValue',
}

interface BuySellTemplateProps {
  model: BuySellHoldingModel;
  setModel: (model: BuySellHoldingModel) => void;
  qtyOwned: number;
  marketPrice: number;
  formatter: CurrencyFormater;
  productId?: string;
  onCTA?: <T>(event: ProductEventType, data: T) => void;
  canCustomPrice?: boolean;
}

export enum DisplayTextKeys {
  NUMBER_OF_UNITS_TEXT = 'number_of_units_text',
  UNIT_COUNT_ABOVE_MAX = 'unit_count_above_max',
  UNIT_COUNT_BELOW_MIN = 'unit_count_below_min',

  PRICE_REQUIRED = 'price_required',
  CUSTOM_PRICE_TEXT = 'custom_price_text',
  PRICING_CHOICE = 'pricing_choice',
  SUBMIT_REQUEST = 'submit_request',
  NUMBER_OF_UNITS = 'number_of_units',
  TOTAL = 'total',
  PLEASE_SELECT_TEXT = 'please_select_text',
}

const InvestMoreTemplate = ({
  model,
  setModel,
  onCTA,
  productId,
  marketPrice,
  formatter,
  canCustomPrice = true,
}: BuySellTemplateProps) => {
  const { t } = useTranslation();
  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'product:wineDetails.investMore', t),
    [t],
  );
  const [currentModel, setCurrentModel] = useState<BuySellHoldingModel>(model);
  const slideoutContext = useContext(SortAndFilterLayoutContext);
  const mValidationSchema = yup.object({
    [BuySellHoldingModelProp.UNITS]: yup.number().min(1, displayText[DisplayTextKeys.UNIT_COUNT_BELOW_MIN]),
    [BuySellHoldingModelProp.PRICE]: yup
      .number()
      .min(1, t('product:wineDetails.investMore.price_below_min', { amount: formatter.format(1) }))
      .required(displayText[DisplayTextKeys.PRICE_REQUIRED]),
  });

  const pricingOptions: DropdownItem[] = useMemo(() => getInvestMorePricingOptions(t), [t]);
  const formik = useFormik<BuySellHoldingModel>({
    initialValues: { ...model, price: marketPrice },
    onSubmit: () => {
      if (onCTA)
        onCTA(ProductEventType.EXECUTE_BUY_PRODUCT_REQUEST, {
          holdingId: productId,
          qty: Number(currentModel.units),
          purchasePrice: Number(currentModel.price),
          requestPrice: marketPrice,
        } as BuyProductRequest);
    },
    validationSchema: mValidationSchema || model,
  });

  const onPriceTypeChange = (item: DropdownItem) => {
    let price = 0;
    if (item.id === PricingType.MARKET) price = marketPrice;
    setModel({ ...model, price, pricingType: item.id as PricingType });
  };

  useEffect(() => {
    setCurrentModel({ ...model, price: marketPrice });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentModel({ ...model, price: model.pricingType === PricingType.MARKET ? marketPrice : model.price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const formIsValid = currentModel.price * currentModel.units > 0;

  return (
    <div className="py-5 gap-5 text-left">
      <div className="px-5 py-3 flex flex-col gap-3">
        <span className="text-gray-700 text-sm">{displayText[DisplayTextKeys.NUMBER_OF_UNITS_TEXT]}</span>
        <CustomInput
          name={BuySellHoldingModelProp.UNITS}
          type={DisplayFieldType.NUMERIC}
          value={formik.values.units}
          placeholder="0"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
            value?: string | number,
          ) => {
            formik.handleChange(e);
            setModel({ ...model, units: Number(value) });
          }}
          helperText={currentModel.units > 0 ? formik.errors[BuySellHoldingModelProp.UNITS] : ''}
        />
      </div>

      {canCustomPrice && (
        <div className="mx-5 pt-3 mt-5 pb-0 flex flex-col  gap-3 border-b border-gray-200">
          <span className="text-gray-700 text-sm">{displayText[DisplayTextKeys.PRICING_CHOICE]}</span>
          <Dropdown
            placeholder={'Please select'}
            value={`${currentModel.pricingType}`}
            valueTemplate={
              <div className="flex-1 text-start">
                {(pricingOptions.find((x) => x.id === currentModel.pricingType) || { text: '' }).text}
              </div>
            }
            onItemSelect={onPriceTypeChange}
            items={pricingOptions}
            className="flex-1 text-14 text-black"
            itemsWrapperClassName="w-full"
          />
        </div>
      )}
      {currentModel.pricingType === PricingType.CUSTOM && (
        <div className="px-5 py-3 mt-5 flex flex-col gap-3">
          <span className="text-gray-700 text-sm">{displayText[DisplayTextKeys.CUSTOM_PRICE_TEXT]}</span>
          <CustomInput
            value={currentModel.price}
            type={DisplayFieldType.CURRENCY}
            formatter={formatter}
            placeholder={formatter.format(0)}
            onBlur={formik.handleBlur}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
              value?: string | number,
            ) => {
              formik.handleChange(e);
              setModel({ ...model, [BuySellHoldingModelProp.PRICE]: Number(value) });
            }}
            name={BuySellHoldingModelProp.PRICE}
            helperText={
              formik.touched[BuySellHoldingModelProp.PRICE] && Boolean(formik.errors[BuySellHoldingModelProp.PRICE])
                ? formik.errors[BuySellHoldingModelProp.PRICE]
                : ''
            }
          />
        </div>
      )}

      <div className="flex flex-col py-10 px-5 drop-shadow-sm mt-[40px]">
        <div className="flex justify-between items-center ">
          <span className="text-center text-20">{displayText[DisplayTextKeys.TOTAL]}</span>
          <span className="text-center text-20">{formatter.format(currentModel.units * currentModel.price)}</span>
        </div>
        <Button
          isDisable={!formIsValid}
          className={` text-14 font-normal rounded-full mt-8  ${
            !formIsValid ? 'btn-disabled' : 'btn  bg-orange text-black'
          }`}
          onClick={() => {
            slideoutContext?.updateSlideoutConfig({ showBackButton: false });
            formik.handleSubmit();
          }}
          props={{
            name: DisplayTextKeys.SUBMIT_REQUEST,
          }}
        >
          {displayText[DisplayTextKeys.SUBMIT_REQUEST]}
        </Button>
      </div>
    </div>
  );
};

export default InvestMoreTemplate;
