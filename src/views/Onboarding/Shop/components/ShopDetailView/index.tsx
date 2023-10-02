import { Button } from 'components';
import { DisplayField, DisplayFieldType, DisplaySection } from 'components/DisplayForms';
import DisplayForm from 'components/DisplayForms/DisplayForm';
import { getFieldAttributes } from 'helpers';
import { mockQShopModel } from 'mocks';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopOnBoardingModel } from 'types/DomainTypes';

import { ObjectType } from 'types/commonTypes';
import { buildDisplayText, classNames } from 'utils';

const ModelKeys = {
  LOGO: 'logo',
  NAME: 'name',
  ADDRESS: 'address',
  TOWN: 'town',
  CITY: 'city',
  COUNTRY: 'country',
  POSTCODE: 'postcode',
} as { [key: string]: string };

const DisplayTextKeys = { ...ModelKeys };

type ModelType = { modelType: string } & Partial<{ [key in keyof typeof ModelKeys]: string }>;
const defaultModel: ModelType = {
  modelType: 'shop_details',
  [ModelKeys.LOGO]: '',
  [ModelKeys.NAME]: '',
  [ModelKeys.ADDRESS]: '',
  [ModelKeys.TOWN]: '',
  [ModelKeys.CITY]: '',
  [ModelKeys.COUNTRY]: '',
  [ModelKeys.POSTCODE]: '',
};
// const buildShopDetailsModel = (shopDetails: BaseEntityType): ModelType => {
//   const newModel = new Map<keyof ShopOnBoardingModel['shopDetails'], ModelKeys>([
//     ['name', ModelKeys.NAME],
//     ['address', ModelKeys.ADDRESS],
//   ]);
//   return newModel;
// };

type OverridableFieldType = {
  modelKey: string;
  label?: { text: string };
  overrides?: (configIn: Partial<DisplayField>) => Partial<DisplayField>;
};

const ShopDetailsView = () => {
  const [model, setModel] = useState<ModelType>(defaultModel);
  const { t } = useTranslation();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'portfolio:shopDetails', t), [t]);
  const isAddingCity = false;

  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    setModel((preModel) => ({ ...preModel, [`${field!.modelKey}`]: e.target.value }));
  };

  const getFields = (fieldsIn: OverridableFieldType[]): DisplayField[] => {
    return [...fieldsIn].map((field) => {
      const config = {
        ...getFieldAttributes(field.modelKey as string, field.modelKey as string, field?.label?.text ?? ''),
        containerClassName: 'mt-10 mr-5',
        inputProps: {
          inputClassName: classNames('bg-transparent '),
          showClearButton: true,
          inputContainerClassName: '!border-gray-700',
        },
        onChange: onFieldUpdate,
      };
      return {
        ...config,
        ...(field?.overrides?.(config) ?? {}),
      };
    });
  };

  const shopDetailsForm: DisplaySection[] = useMemo(() => {
    const nameAddressFields = [
      {
        modelKey: ModelKeys.NAME,
        label: { text: displayText[DisplayTextKeys.NAME] },
        overrides: (configIn: Partial<DisplayField>) => ({
          containerClassName: `${configIn.containerClassName} w-1/2 `,
          placeholder: 'Name of shop',
        }),
      },
      {
        modelKey: ModelKeys.ADDRESS,
        label: { text: displayText[DisplayTextKeys.ADDRESS] },
        overrides: (configIn: Partial<DisplayField>) => ({
          containerClassName: `${configIn.containerClassName} `,
        }),
      },
      {
        modelKey: ModelKeys.COUNTRY,
        label: { text: displayText[DisplayTextKeys.COUNTRY] },
        overrides: (configIn: Partial<DisplayField>) => ({
          containerClassName: `${configIn.containerClassName} w-1/2 `,
        }),
      },
    ] as OverridableFieldType[];

    const locationFields = [
      {
        modelKey: ModelKeys.TOWN,
        label: { text: displayText[DisplayTextKeys.TOWN] },
      },
      {
        modelKey: ModelKeys.CITY,
        label: { text: displayText[DisplayTextKeys.CITY] },
      },
      {
        modelKey: ModelKeys.POSTCODE,
        label: { text: displayText[DisplayTextKeys.POSTCODE] },
      },
    ] as OverridableFieldType[];

    // ...Object.keys(ModelKeys).map((x) => {
    //   return {
    //     modelKey: ModelKeys[x],
    //     label: { text: displayText[DisplayTextKeys[x]] },
    //     overrides: (configIn: Partial<DisplayField>) => ({
    //       containerClassName: `${configIn.containerClassName} w-full sm:w-1/2 `,
    //       placeholder: displayText[DisplayTextKeys[x]],
    //     }),
    //   };
    // }),

    return [
      {
        className: 'w-full  gap-5',
        fields: getFields(nameAddressFields),
      },
      {
        className: 'w-full flex flex-row justify-between  w-full',
        fields: getFields(locationFields),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log('MODEL123', model);
  return (
    <div className="flex-1 px-4 max-w-[1200px]  max-h-[500px] ">
      <DisplayForm
        titleContainerClassName=""
        sectionsContainerClassName="pb-10"
        sections={shopDetailsForm}
        title={''}
        model={model}
      />
    </div>
  );
};

export default ShopDetailsView;

///https://github.com/bocacode/react-image-upload
//https://www.youtube.com/watch?v=cZ0YsVpA1Ps
//CROP IMAGE: https://www.youtube.com/watch?v=jyeRDo2tP_s
//https://github.com/codelikepro22/react-firebase-images-gallery/tree/sixth-part
//https://www.youtube.com/watch?v=MWzaItRRTXw
