import { useFormik } from 'formik';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { buildDisplayText } from '../../../utils';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import CustomInput from '../../CustomInput';
import { BuySellHoldingModel, ProductEventType, SellHoldingReasons } from '../types';
import { DisplayFieldType } from '../../DisplayForms';
import { SortAndFilterLayoutContext } from '../../Layout/SortAndFilterLayout';
import { CurrencyFormater } from '../../../types/commonTypes';
import ToolTip from '../../Tooltip';
import { Alignment, NavigationPath } from '../../../types/DomainTypes';
import { InfoIcon } from '../../../assets/icons';
import { useNavigate } from 'react-router-dom';
import { AccountViewType, SubjectOptionKeys } from '../../../views/Accounts/types';

export enum SellHoldingModelProp {
  UNITS = 'units',
  PRICE = 'price',
  REASON = 'reason',
  MARKET_VALUE = 'marketValue',
}

interface SellHoldingProps {
  model: BuySellHoldingModel;
  setModel: (model: BuySellHoldingModel) => void;
  qtyOwned: number;
  marketPrice: number;
  productId: string;
  onCTA?: <T>(event: ProductEventType, data: T) => void;
  formatter: CurrencyFormater;
}

export enum DisplayTextKeys {
  SUBMIT_REQUEST = 'submit_request',
  NUMBER_OF_UNITS_TEXT = 'number_of_units_text',
  RESERVED_PRICE_TEXT = 'reserve_price_text',
  REASON_FOR_SALE_TEXT = 'reason_for_sale_text',
  TOTAL = 'total',
  TOTAL_MARKET_VALUE_TEXT = 'total_market_value_text',
  TOTAL_RESERVE_PRICE_TEXT = 'total_reserve_price_text',
  UNIT_COUNT_ABOVE_MAX = 'unit_count_above_max',
  UNIT_COUNT_BELOW_MIN = 'unit_count_below_min',
  PLEASE_SELECT = 'saleReasons.please_select',
  PRICE_REQUIRED = 'price_required',
  RESERVE_PRICE_EXCEED_CONSTRAINT = 'price_exceed_constraint',
  RESERVE_PIRCE_INFO = 'reserve_price_info',
  CONTACT_US_INFO = 'contactUs_info',
}

const priceCapInPreent = 95;
const SellHoldingTemplate = ({
  model,
  setModel,
  onCTA,
  qtyOwned = 0,
  productId,
  marketPrice,
  formatter,
}: SellHoldingProps) => {
  const { t } = useTranslation();
  const slideoutContext = useContext(SortAndFilterLayoutContext);
  const navigate = useNavigate();

  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'product:wineDetails.sellHolding', t),
    [t],
  );
  const priceConstraint = (priceCapInPreent / 100) * marketPrice;

  const mValidationSchema = yup.object({
    [SellHoldingModelProp.UNITS]: yup
      .number()
      .min(1, displayText[DisplayTextKeys.UNIT_COUNT_BELOW_MIN])
      .max(qtyOwned, displayText[DisplayTextKeys.UNIT_COUNT_ABOVE_MAX]),
    [SellHoldingModelProp.PRICE]: yup
      .number()
      .min(1, t('product:wineDetails.sellHolding.price_below_min', { amount: formatter.format(1) }))
      .max(
        priceConstraint,
        t(`product:wineDetails.sellHolding.${DisplayTextKeys.RESERVE_PRICE_EXCEED_CONSTRAINT}`, {
          amount: formatter.format(priceConstraint),
        }),
      )
      .required(displayText[DisplayTextKeys.PRICE_REQUIRED]),
  });

  const formik = useFormik<BuySellHoldingModel>({
    initialValues: model,
    onSubmit: (values) => {
      if (onCTA)
        onCTA(ProductEventType.EXECUTE_SELL_PRODUCT_REQUEST, {
          holdingId: productId,
          qty: Number(values.units),
          marketPrice: marketPrice,
          reservePrice: Number(values.price),
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          reasonForSale: forSaleReasonsDDItems.find((x) => x.id === model[SellHoldingModelProp.REASON])!.text,
        });
    },
    validationSchema: mValidationSchema || model,
  });

  const forSaleReasonsDDItems = useMemo(
    () =>
      [...Object.values(SellHoldingReasons)].map((x) => {
        const text = t(`product:wineDetails.sellHolding.saleReasons.${x}`);
        return {
          id: x,
          value: x,
          text,
          content: (
            <div className="flex justify-between text-base">
              <span>{text}</span>
            </div>
          ),
        };
      }),
    [t],
  );

  const formIsValid =
    Object.keys(formik.errors).length === 0 && model.price > 0 && model.units > 0 && model.reason > '';

  return (
    <div className="py-5 gap-5  text-left">
      <div className="px-5 py-3 flex flex-col gap-3">
        <span className="text-gray-700 text-sm">{displayText[DisplayTextKeys.NUMBER_OF_UNITS_TEXT]}</span>
        <CustomInput
          name={SellHoldingModelProp.UNITS}
          type={DisplayFieldType.NUMERIC}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
            value?: string | number,
          ) => {
            formik.handleChange(e);
            setModel({ ...model, [SellHoldingModelProp.UNITS]: Number(value!) });
          }}
          value={formik.values.units}
          placeholder="0"
          onInput={(value) => setModel({ ...model, units: Number(value) })}
          helperText={model.units > 0 ? formik.errors[SellHoldingModelProp.UNITS] : ''}
        />
      </div>

      <div className="px-5 py-3 mt-5 flex flex-col gap-3">
        <div className="flex items-center">
          <span className="text-gray-700 text-sm mr-2">{displayText[DisplayTextKeys.RESERVED_PRICE_TEXT]}</span>
          <ToolTip
            align={Alignment.CENTER}
            tooltip={
              <div className="bg-white border border-gray-300 w-[200px] text-sm p-2">
                {t(`${displayText[DisplayTextKeys.RESERVE_PIRCE_INFO]}`)}
              </div>
            }
          >
            <InfoIcon className="cursor-pointer w-5" />
          </ToolTip>
        </div>

        <CustomInput
          value={`${formik.values.price === 0 ? '' : formik.values.price}`}
          type={DisplayFieldType.CURRENCY}
          formatter={formatter}
          placeholder={formatter.format(0)}
          onBlur={formik.handleBlur}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
            value?: string | number,
          ) => {
            formik.handleChange(e);
            setModel({ ...model, [SellHoldingModelProp.PRICE]: Number(value!) });
          }}
          name={SellHoldingModelProp.PRICE}
          helperText={
            formik.touched[SellHoldingModelProp.PRICE] && Boolean(formik.errors[SellHoldingModelProp.PRICE])
              ? formik.errors[SellHoldingModelProp.PRICE]
              : ''
          }
          onInput={(value) => setModel({ ...model, [SellHoldingModelProp.PRICE]: Number(value) })}
        />
      </div>

      <div className="mx-5 pt-3 mt-5 pb-0 flex flex-col  gap-3 border-b border-gray-200">
        <span className="text-gray-700 text-sm">{displayText[DisplayTextKeys.REASON_FOR_SALE_TEXT]}</span>
        <Dropdown
          placeholder={'Please select'}
          value={model.reason}
          valueTemplate={
            <>
              {!model.reason || model.reason === '' ? (
                <div className="flex-1 text-start text-gray-300"> {displayText[DisplayTextKeys.PLEASE_SELECT]} </div>
              ) : (
                <div className="flex-1 text-start">
                  {forSaleReasonsDDItems.find((x) => x.id === model[SellHoldingModelProp.REASON])!.text}
                </div>
              )}
            </>
          }
          onItemSelect={(item) => {
            setModel({ ...model, [SellHoldingModelProp.REASON]: item.id as SellHoldingReasons });
          }}
          items={forSaleReasonsDDItems}
          className="flex-1 text-14 text-black"
          itemsWrapperClassName="w-full"
          itemsContainerClassName="divide-y divide-gray-200"
        />
      </div>
      <div className="flex flex-col py-10 px-5 drop-shadow-sm mt-[40px]">
        <div className="flex justify-between divide-x divide-gray-300">
          <div className="flex-1 flex flex-col">
            <span className="text-center text-sm">{displayText[DisplayTextKeys.TOTAL_MARKET_VALUE_TEXT]}</span>
            <span className="text-center text-20">{formatter.format(model.units * marketPrice)}</span>
          </div>

          <div className="flex-1 flex flex-col">
            <span className="text-center text-sm">{displayText[DisplayTextKeys.TOTAL_RESERVE_PRICE_TEXT]}</span>
            <span className="text-center text-20">{formatter.format(model.units * model.price)}</span>
          </div>
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

        <Button
          isLink={true}
          onClick={() => {
            navigate(`${NavigationPath.ACCOUNTS}`, {
              state: { accountViewType: AccountViewType.CONTACT_US, subject: SubjectOptionKeys.GENERAL },
            });
          }}
          className="w-full flex justify-center text-center text-sm mt-3"
        >
          {displayText[DisplayTextKeys.CONTACT_US_INFO]}
        </Button>
      </div>
    </div>
  );
};

export default SellHoldingTemplate;
