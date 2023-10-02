/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { useFormik } from 'formik';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { buildDisplayText, toInternalId } from '../../../utils';
import Button from '../../Button';
import Dropdown, { DropdownItem } from '../../Dropdown';
import { ArrangeDeliveryRequest, ProductEventType } from '../types';
import DisplayForm from '../../DisplayForms/DisplayForm';
import { DisplayField, DisplayFieldType, DisplaySection } from '../../DisplayForms';
import { Plus } from '../../../assets/icons';
import RadioButton from '../../RadioButton';
import CustomInput from '../../CustomInput';
import { AddressType } from '../../../types/DomainTypes';
import { addressToString } from '../../../helpers';
import { COUNTRIES } from '../../../ConstantsHelpers';
import { SortAndFilterLayoutContext } from '../../Layout/SortAndFilterLayout';

export const blankAddessModel = {
  address1: '',
  address2: '',
  address3: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  isDefault: false,
};
export enum DisplayTextKeys {
  UNITS_FOR_DELIVERY = 'unit_for_delivery',
  UNITS_REQUIRED_TEXT = 'units_required_text',
  COUNTRY = 'country',
  CITY = 'city',
  ADDRESS_1 = 'address_1',
  ADDRESS_2 = 'address_2',
  ADDRESS_3 = 'address_3',
  POSTCODE = 'postcode',
  STATE = 'state',
  UNIT_COUNT_ABOVE_MAX = 'unit_count_above_max',
  UNIT_COUNT_BELOW_MIN = 'unit_count_below_min',
  SUBMIT_REQUEST = 'submit_request',
  SAVED_ADDRESS_TEXT = 'saved_address_text',
  SELECT_DELIVERY_ADDRESS_TEXT = 'select_delivery_address_text',
  ADD_NEW_DELIVERY_ADDRESS_TEXT = 'add_new_address_text',
}

const savedAddresses: AddressType[] = [];

const countries: DropdownItem[] = [
  ...COUNTRIES.map((x) => {
    const id = `${toInternalId(x)}`;
    return {
      id,
      value: id,
      text: x,
      content: (
        <div className="flex justify-between text-base">
          <span>{`${x}`}</span>
        </div>
      ),
    };
  }),
];

const addressFieldMapper = () => {
  return new Map<string, DisplayTextKeys>([
    ['address1', DisplayTextKeys.ADDRESS_1],
    ['address2', DisplayTextKeys.ADDRESS_2],
    ['address3', DisplayTextKeys.ADDRESS_3],
    ['city', DisplayTextKeys.CITY],
    ['country', DisplayTextKeys.COUNTRY],
    ['zip', DisplayTextKeys.POSTCODE],
    ['state', DisplayTextKeys.STATE],
  ]);
};

interface ArrangeDeliveryTemplateProps {
  model: ArrangeDeliveryRequest;
  qtyOwned: number;
  setModel: (model: ArrangeDeliveryRequest) => void;
  onCTA?: <T>(event: ProductEventType, data: T) => void;
}

const ArrangeDeliveryTemplate = ({ model, setModel, onCTA, qtyOwned }: ArrangeDeliveryTemplateProps) => {
  const { t } = useTranslation();
  const slideoutContext = useContext(SortAndFilterLayoutContext);
  // const [savedAddress, setSavedAddress] = useState(false);
  const [addNewAddress, setAddNewAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'product:wineDetails.arrangeDelivery', t),
    [t],
  );
  const containerRef = useRef<HTMLDivElement | null>();
  const mValidationSchema = yup.object({
    qty: yup
      .number()
      .min(1, displayText[DisplayTextKeys.UNIT_COUNT_BELOW_MIN])
      .max(qtyOwned, displayText[DisplayTextKeys.UNIT_COUNT_ABOVE_MAX])
      .required(displayText[DisplayTextKeys.UNITS_REQUIRED_TEXT]),
  });

  const formik = useFormik<ArrangeDeliveryRequest>({
    initialValues: model,
    onSubmit: () => {
      if (onCTA)
        onCTA(ProductEventType.ARRANGE_DELIVERY, {
          ...model,
        });
    },
    validationSchema: mValidationSchema || model,
  });

  const onAddNewAddress = () => {
    setModel({ ...model, ...blankAddessModel });
    setAddNewAddress(true);
  };

  const onDefaultAddressChange = (id: string) => {
    if (selectedAddressId !== id) setSelectedAddressId(id);
  };

  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.handleChange(e);
    setModel({ ...model, [field?.modelKey as string]: e.target.value });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  };

  const sections: DisplaySection[] = useMemo(() => {
    const mapper = addressFieldMapper();

    const fields: DisplayField[] = [];
    for (const [modelKey, translationKey] of mapper) {
      fields.push({
        id: translationKey,
        name: modelKey,
        ariaLabel: translationKey,
        modelKey,
        className: 'mb-5 ',
        containerClassName: 'mb-8 gap-5',
        translationKey: ``,
        placeholder: '',
        helperText: formik.errors[modelKey as keyof ArrangeDeliveryRequest]
          ? formik.errors[modelKey as keyof ArrangeDeliveryRequest]
          : '',
        disabled: false,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
          onFieldChange(e, field);
        },

        onBlur: () => {},
        label: {
          text: displayText[translationKey],
          isShow: true,
          className: 'mb-2 block',
        },
      });
    }

    const onCountryChange = (item: DropdownItem) => {
      setModel({ ...model, country: item.id });
    };

    const countryField = {
      type: DisplayFieldType.CUSTOM,
      customTemplate: () => {
        return (
          <Dropdown
            placeholder={'Please select'}
            value={`${model.country}`}
            containerClassName="w-full border-b "
            itemsContainerClassName="h-[250px] overflow-y-auto"
            valueTemplate={
              <div className="flex-1 text-start ">
                {(countries.find((x) => x.id === model.country) || { text: '' }).text}
              </div>
            }
            onItemSelect={onCountryChange}
            items={countries}
            className="flex-1 text-14 text-black "
            itemsWrapperClassName="w-full"
          />
        );
      },
    };

    const countryIndex = fields.findIndex((field) => field.id === DisplayTextKeys.COUNTRY);
    fields[countryIndex] = { ...fields[countryIndex], ...countryField };

    const unitForDeliveryIndex = fields.findIndex((field) => field.id === DisplayTextKeys.UNITS_FOR_DELIVERY);
    fields[unitForDeliveryIndex] = {
      ...fields[unitForDeliveryIndex],
      type: DisplayFieldType.NUMERIC,
      placeholder: '0',
    };
    /// De-scoped till after MVP!!
    // fields.push({
    //   id: DisplayTextKeys.SAVED_ADDRESS_TEXT,
    //   name: DisplayTextKeys.SAVED_ADDRESS_TEXT,
    //   type: DisplayFieldType.CUSTOM,
    //   customTemplate: () => {
    //     return (
    //       <CheckBox
    //         isDisabled={!savedAddresses || savedAddresses.length === 0}
    //         isChecked={!savedAddresses || savedAddresses.length === 0 ? true : savedAddress}
    //         id={'saved_new_address'}
    //         className=" flex-1 sm:w-[300px]"
    //         onChange={(id, value) => setSavedAddress(value)}
    //       >
    //         <span className="ml-3 text-black text-14">{displayText[DisplayTextKeys.SAVED_ADDRESS_TEXT]}</span>
    //       </CheckBox>
    //     );
    //   },
    //   className: 'mb-5 ',
    //   containerClassName: 'mb-8 gap-5',
    //   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    //     onFieldChange(e, field);
    //   },
    // });

    return [
      {
        className: 'gap-5 px-5 w-full',
        fields,
      },
    ];
  }, [model, formik, addNewAddress, savedAddresses]);

  useEffect(() => {
    const defaultAddress =
      !savedAddresses || savedAddresses.length === 0
        ? { ...blankAddessModel, id: '' }
        : savedAddresses.length === 1
        ? savedAddresses[0]
        : savedAddresses.find((x) => x.isDefault) || { id: '' };
    setSelectedAddressId(defaultAddress.id as string);
    setModel({
      ...model,
      ...defaultAddress,
    });
  }, []);

  const formIsValid =
    model.qty > 0 &&
    model.qty <= qtyOwned &&
    model.address1.length > 0 &&
    model.city.length > 0 &&
    model.zip.length > 0;

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-5 gap-5 text-left" ref={(r) => (containerRef.current = r)}>
      <div className="px-5 py-3 flex flex-col gap-3 mb-3">
        <span className="text-gray-700 text-sm">{displayText[DisplayTextKeys.UNITS_FOR_DELIVERY]}</span>
        <CustomInput
          name={'qty'}
          type={DisplayFieldType.NUMERIC}
          value={formik.values.qty}
          placeholder="0"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
            value?: string | number,
          ) => {
            formik.handleChange(e);
            setModel({ ...model, qty: Number(value) });
          }}
          helperText={Boolean(formik.errors.qty) ? formik.errors.qty : ''}
        />
      </div>
      {addNewAddress && <DisplayForm sections={sections} model={{ ...model, modelType: 'ArrangeDelivery' }} />}
      {!addNewAddress && (
        <div className="flex flex-col p-5 ">
          <div className="flex items-center cursor-pointer">
            <span className="flex-1">{displayText[DisplayTextKeys.SELECT_DELIVERY_ADDRESS_TEXT]}</span>
            <Button isLink={true} onClick={onAddNewAddress} className="flex-1 flex items-center justify-end">
              <Plus />
              <span className="ml-1">{displayText[DisplayTextKeys.ADD_NEW_DELIVERY_ADDRESS_TEXT]}</span>
            </Button>
          </div>

          <div className="flex flex-col mt-5 gap-5">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  onClick={() => onDefaultAddressChange(addr.id!)}
                  key={`address-${addr.id}`}
                  className="bg-gray-100 cursor-pointer flex items-center self-stretch p-5 gap-5 w-full h-[112px] rounded-md"
                >
                  <div className="flex flex-1 ">{addressToString(addr)}</div>
                  <RadioButton id={`${addr.id}`} name="savedAddresses" isChecked={isSelected} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex flex-col py-10 px-5 drop-shadow-sm">
        <Button
          isDisable={!formIsValid}
          className={` text-14 font-normal rounded-full ${!formIsValid ? 'btn-disabled' : 'btn  bg-orange text-black'}`}
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

export default ArrangeDeliveryTemplate;
