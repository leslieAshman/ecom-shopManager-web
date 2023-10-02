import React, { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DisplayField, DisplayFieldType, DisplaySection } from '.';
import { useTranslation } from 'react-i18next';
import { buildDisplayText, classNames, toInternalId } from 'utils';
import { getFieldAttributes } from 'helpers';
import DisplayForm from './DisplayForm';
import Dropdown from 'components/Dropdown';
import { DropdownItem } from 'components/Dropdown';
import { COUNTRIES } from 'ConstantsHelpers';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const DisplayTextKeys = {
  NAME: 'name',
  ADDRESS: 'address',
  COUNTRY: 'country',
  CITY: 'city',
  POSTCODE: 'postcode',
} as { [key: string]: string };

const ModelKeys = {
  NAME: 'name',
  ADDRESS: 'address',
  CITY: 'city',
  POSTCODE: 'postcode',
};

type OverridableFieldType = {
  modelKey: string;
  label?: { text: string };
  overrides?: (configIn: Partial<DisplayField>) => Partial<DisplayField>;
};

type ModelType = { modelType: string } & Partial<{ [key in keyof typeof ModelKeys]: string }>;
const defaultModel: ModelType = {
  modelType: 'shop_details',
  [ModelKeys.NAME]: '',
  [ModelKeys.ADDRESS]: '',
  [ModelKeys.CITY]: '',
  [ModelKeys.POSTCODE]: '',
};
const [model, setModel] = [defaultModel, (update: ModelType) => null];
const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
  setModel({ ...model, [`${field!.modelKey}`]: e.target.value });
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

const fieldSet1 = [
  {
    modelKey: ModelKeys.NAME,
    label: { text: DisplayTextKeys.NAME },
    overrides: (configIn: Partial<DisplayField>) => ({
      containerClassName: `${configIn.containerClassName} w-1/2 `,
      placeholder: 'Name of shop',
    }),
  },
  {
    modelKey: ModelKeys.ADDRESS,
    label: { text: DisplayTextKeys.ADDRESS },
    overrides: (configIn: Partial<DisplayField>) => ({
      containerClassName: `${configIn.containerClassName} `,
    }),
  },
] as OverridableFieldType[];

const fieldSet2 = [
  {
    modelKey: ModelKeys.CITY,
    label: { text: DisplayTextKeys.CITY },
    overrides: (configIn: Partial<DisplayField>) => ({
      containerClassName: `${configIn.containerClassName} w-1/2 `,
      placeholder: 'City',
    }),
  },
  {
    modelKey: ModelKeys.POSTCODE,
    label: { text: DisplayTextKeys.POSTCODE },
    overrides: (configIn: Partial<DisplayField>) => ({
      containerClassName: `${configIn.containerClassName} `,
    }),
  },
] as OverridableFieldType[];

const shopDetailsForm: DisplaySection[] = [
  {
    className: 'w-full  gap-5',
    fields: getFields(fieldSet1),
  },

  {
    className: 'w-full flex flex-row',
    fields: getFields(fieldSet2),
  },
];
// eslint-disable-next-line react-hooks/exhaustive-deps

// const CtrlForms = () => {
//   const { t } = useTranslation();
//   const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:profile', t), [t]);
//   const [model, setModel] = useState<ModelType>(defaultModel);
//   const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
//     setModel({ ...model, [`${field!.modelKey}`]: e.target.value });
//   };

//   const getFields = (fieldsIn: OverridableFieldType[]): DisplayField[] => {
//     return [...fieldsIn].map((field) => {
//       const config = {
//         ...getFieldAttributes(field.modelKey as string, field.modelKey as string, field?.label?.text ?? ''),
//         containerClassName: 'mt-10 mr-5',
//         inputProps: {
//           inputClassName: classNames('bg-transparent '),
//           showClearButton: true,
//           inputContainerClassName: '!border-gray-700',
//         },
//         onChange: onFieldUpdate,
//       };
//       return {
//         ...config,
//         ...(field?.overrides?.(config) ?? {}),
//       };
//     });
//   };

//   const shopDetailsForm: DisplaySection[] = useMemo(() => {
//     const fieldSet1 = [
//       {
//         modelKey: ModelKeys.NAME,
//         label: { text: displayText[DisplayTextKeys.NAME] },
//         overrides: (configIn: Partial<DisplayField>) => ({
//           containerClassName: `${configIn.containerClassName} w-1/2 `,
//           placeholder: 'Name of shop',
//         }),
//       },
//       {
//         modelKey: ModelKeys.ADDRESS,
//         label: { text: displayText[DisplayTextKeys.ADDRESS] },
//         overrides: (configIn: Partial<DisplayField>) => ({
//           containerClassName: `${configIn.containerClassName} `,
//         }),
//       },
//     ] as OverridableFieldType[];

//     const fieldSet2 = [
//       {
//         modelKey: ModelKeys.CITY,
//         label: { text: displayText[DisplayTextKeys.CITY] },
//         overrides: (configIn: Partial<DisplayField>) => ({
//           containerClassName: `${configIn.containerClassName} w-1/2 `,
//           placeholder: 'City',
//         }),
//       },
//       {
//         modelKey: ModelKeys.POSTCODE,
//         label: { text: displayText[DisplayTextKeys.POSTCODE] },
//         overrides: (configIn: Partial<DisplayField>) => ({
//           containerClassName: `${configIn.containerClassName} `,
//         }),
//       },
//     ] as OverridableFieldType[];

//     return [
//       {
//         className: 'w-full  gap-5',
//         fields: getFields(fieldSet1),
//       },

//       {
//         className: 'w-full flex flex-row',
//         fields: getFields(fieldSet2),
//       },
//     ];
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <DisplayForm
//       titleContainerClassName="mt-10"
//       sectionsContainerClassName="pb-10"
//       sections={shopDetailsForm}
//       title={'Some title'}
//       model={model}
//     />
//   );
// };

const meta: Meta<typeof DisplayForm> = {
  title: 'Form',
  component: DisplayForm,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof DisplayForm>;
export const Form: Story = {
  args: {
    titleContainerClassName: 'mt-10',
    sectionsContainerClassName: 'pb-10',
    sections: shopDetailsForm,
    title: 'Form Title Here',
    model: model,
  },
};

const ddlConfig = {
  itemWrapperStyle: { width: '100%' },
  containerClassName: 'w-full',
  itemsContainerClassName: 'h-[300px] overflow-y-auto w-full',
  itemClassName: 'py-5 text-base flex',
  className: 'flex-1 text-sm sm:text-14 whitespace-nowrap p-0 justify-start border-b border-b-gray-400',
};

const countries: DropdownItem[] = [
  ...COUNTRIES.slice(0, 5).map((x: string) => {
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

const customFieldSections: DisplaySection[] = [
  {
    className: 'gap-5  w-full',
    fields: [
      {
        ...getFieldAttributes('a-id', 'Title'),
        label: {
          text: 'Title',
          isShow: true,
        },
        type: DisplayFieldType.CUSTOM,
        containerClassName: 'w-1/3',
        customTemplate: () => {
          return (
            <Dropdown
              placeholder={'A placeholder'}
              value={''}
              valueTemplate={
                <div className="flex w-[95%]">
                  <span className="truncate block">Select value shown here</span>
                </div>
              }
              items={countries}
              {...ddlConfig}
            />
          );
        },
      },
    ],
  },
];

export const CustomField: Story = {
  args: {
    titleContainerClassName: 'mt-10',
    sectionsContainerClassName: 'pb-10',
    sections: customFieldSections,
    title: '',
    model: model,
  },
};
