import { Button } from 'components';
import { DisplayField, DisplayFieldType, DisplaySection, OverridableFieldType } from 'components/DisplayForms';
import DisplayForm, { getFields } from 'components/DisplayForms/DisplayForm';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckBox from 'components/CheckBox';

enum ModelKeys {
  PRICE = 'price',
  IS_ON_PROMOTION = 'isOnPromotion',
  PROMOTION_PRICE = 'promotionPrice',
  PRICE_METADATA = 'priceMetadata',
}

export interface PricingModelType {
  price: number;
  isOnPromotion: boolean;
  promotionPrice: number;
  priceMeta?: string[];
  modelType: string;
}

interface PricingSectionProps {
  modelIn: PricingModelType;
  type: string;
  translationKey: string;
  onChange?: (upModel: PricingModelType, type: string) => void;
}

const PricingSection: FC<PricingSectionProps> = ({ modelIn, translationKey, onChange, type = 'pricing' }) => {
  const { t } = useTranslation('portfolio');
  const [model, setModel] = useState<PricingModelType>({} as PricingModelType);
  const [priceMetadata, setPriceMetadata] = useState<string>('');
  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    setModel((preModel) => ({ ...preModel, [`${field!.modelKey}`]: e.target.value }));
  };

  const sections: DisplaySection[] = useMemo(() => {
    const sectionKey = `${translationKey}.${type}`;

    const pricingFields = [
      {
        modelKey: ModelKeys.PRICE,
        label: { text: t(`${sectionKey}.${ModelKeys.PRICE}.title`) },
        overrides: () => ({
          containerClassName: `w-1/3`,
          placeholder: '',
          disabled: model.isOnPromotion,
          helperText: t(`${sectionKey}.${ModelKeys.PRICE}.subTitle`),
          helperTextClassName: '!text-black',
          isRequired: true,
          type: DisplayFieldType.CURRENCY,
        }),
      },
    ] as OverridableFieldType[];

    const promotionFields = [
      {
        modelKey: ModelKeys.IS_ON_PROMOTION,
        label: { text: '' },
        overrides: (configIn: Partial<DisplayField>) => ({
          containerClassName: '!w-[250px]',
          type: DisplayFieldType.CUSTOM,
          customTemplate: () => {
            return (
              <CheckBox
                className=""
                inputClassName="mr-3"
                isChecked={model[`${ModelKeys.IS_ON_PROMOTION}`]}
                onChange={(_: string, isChecked: boolean) => {
                  setModel({ ...model, [ModelKeys.IS_ON_PROMOTION]: isChecked });
                }}
              >
                <span className="ml-3 text-black text-14">is on promotion?</span>
              </CheckBox>
            );
          },
        }),
      },
      {
        modelKey: ModelKeys.PROMOTION_PRICE,
        label: { text: t(`${sectionKey}.${ModelKeys.PROMOTION_PRICE}.title`) },
        overrides: (configIn: Partial<DisplayField>) => ({
          containerClassName: `${configIn.containerClassName} w-1/3 `,
          placeholder: '',
          disabled: !model.isOnPromotion,
          helperTextClassName: '!text-black',
          type: DisplayFieldType.CURRENCY,
        }),
      },
    ] as OverridableFieldType[];

    const priceMetadatas = [
      {
        modelKey: 'addPromotionMessageInput',
        label: { text: 'Price details (optional)' },
        overrides: () => ({
          containerClassName: 'w-full',
          helperText: "Provide information about what's included in the price.",
          helperTextClassName: '!text-black',
          onChange: (e: React.ChangeEvent<HTMLInputElement>, field?: DisplayField) => {
            setPriceMetadata(e.target.value);
          },
          customTemplate: () => {
            return (
              <Button
                className="btn-accent ml-5 rounded-none text-sm"
                onClick={() => {
                  if (priceMetadata) {
                    setModel({ ...model, priceMeta: [...(model.priceMeta ?? []), priceMetadata] });
                    setPriceMetadata('');
                  }
                }}
              >
                Add
              </Button>
            );
          },
        }),
      },
      {
        modelKey: 'AddPromotionMessage',
        label: { text: '' },
        overrides: () => ({
          type: DisplayFieldType.CUSTOM,
          customTemplate: () => {
            return (
              <div className="flex flex-wrap w-ful">
                {model.priceMeta?.map((item, x) => {
                  return (
                    <Button
                      key={x}
                      type="badge"
                      onClick={() => {
                        setModel({ ...model, priceMeta: [...(model.priceMeta ?? []).filter((i) => i !== item)] });
                      }}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>
            );
          },
        }),
      },
    ] as OverridableFieldType[];

    return [
      {
        className: '',
        fields: getFields(pricingFields, onFieldUpdate),
      },
      {
        className: 'flex flex-row items-end',
        fields: getFields(promotionFields, onFieldUpdate),
      },
      {
        className: 'mt-10',
        fields: getFields(priceMetadatas, onFieldUpdate),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, priceMetadata]);

  useEffect(() => {
    setModel(modelIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChange?.({ ...model }, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <DisplayForm
      titleContainerClassName="flex justify-center w-full py-5"
      sectionsContainerClassName="gap-5 border px-5 py-5 pb-10 border-1 mb-10"
      sections={sections}
      title={t('portfolio:asset.pricing.section.title')}
      model={{ ...model, addPromotionMessageInput: priceMetadata }}
    />
  );
};

export default PricingSection;
