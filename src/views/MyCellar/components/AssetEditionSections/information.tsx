import { Dropdown } from 'components';
import { DisplayField, DisplayFieldType, DisplaySection, OverridableFieldType } from 'components/DisplayForms';
import DisplayForm, { getFields } from 'components/DisplayForms/DisplayForm';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetType } from '../StockMgr/types';
import { DropdownItem, ddlDefaultConfig } from 'components/Dropdown';

const hasCategory = false;
const assetTypes = ['Physical', 'Digital', 'Service'];

enum ModelKeys {
  NAME = 'name',
  CATEGORY = 'category',
  TYPE = 'listingType',
  DESCRIPTION = 'description',
}

export type InformationModelType = Pick<AssetType, 'pic' | 'title' | 'category' | 'description' | 'listingType'> & {
  modelType: string;
};

interface InformationSectionProps {
  modelIn: InformationModelType;
  type: string;
  translationKey: string;
  onChange?: (upModel: InformationModelType, type: string) => void;
}

const InformationSection: FC<InformationSectionProps> = ({
  modelIn,
  translationKey,
  onChange,
  type = 'information',
}) => {
  const { t } = useTranslation('portfolio');
  const [model, setModel] = useState<InformationModelType>({} as InformationModelType);

  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    setModel((preModel) => ({ ...preModel, [`${field!.modelKey}`]: e.target.value }));
  };

  const sections: DisplaySection[] = useMemo(() => {
    const sectionKey = `${translationKey}.${type}`;

    const fieldSet = [
      {
        modelKey: 'title',
        label: { text: t(`${sectionKey}.${ModelKeys.NAME}.title`) },
        overrides: (configIn: Partial<DisplayField>) => ({
          containerClassName: `${configIn.containerClassName} w-1/2 `,
          placeholder: '',
          helperText: t(`${sectionKey}.${ModelKeys.NAME}.subTitle`),
          helperTextClassName: '!text-black',
          isRequired: true,
        }),
      },
      hasCategory
        ? {
            modelKey: ModelKeys.CATEGORY,
            label: { text: t(`${sectionKey}.${ModelKeys.CATEGORY}.title`) },
            overrides: (configIn: Partial<DisplayField>) => ({
              containerClassName: `${configIn.containerClassName} `,
              type: DisplayFieldType.CUSTOM,
              isRequired: true,
              customTemplate: () => {
                return (
                  <div className="flex flex-col w-1/2">
                    <Dropdown
                      placeholder="Select item"
                      value={''}
                      valueTemplate={
                        <div className="flex w-[95%]">
                          <span className="truncate block">{model.category ?? ''}</span>
                        </div>
                      }
                      onItemSelect={(item: DropdownItem) => setModel({ ...model, [ModelKeys.CATEGORY]: item.value })}
                      items={[
                        { id: 'A', value: 'A', content: 'A' },
                        { id: 'B', value: 'B', content: 'B' },
                      ]}
                      {...ddlDefaultConfig}
                    />
                  </div>
                );
              },
            }),
          }
        : null,

      {
        modelKey: ModelKeys.TYPE,
        label: { text: t(`${sectionKey}.${ModelKeys.TYPE}.title`) },
        overrides: (configIn: Partial<DisplayField>) => ({
          containerClassName: `${configIn.containerClassName} `,
          type: DisplayFieldType.CUSTOM,
          isRequired: true,
          customTemplate: () => {
            return (
              <div className="flex flex-col w-1/2">
                <Dropdown
                  placeholder="Type"
                  value={''}
                  valueTemplate={
                    <div className="flex w-[95%]">
                      <span className="truncate block">{model.listingType ?? ''}</span>
                    </div>
                  }
                  onItemSelect={(item: DropdownItem) => setModel({ ...model, [ModelKeys.TYPE]: item.value })}
                  items={assetTypes.map((x) => ({ id: x, value: x, content: x }))}
                  {...ddlDefaultConfig}
                />
              </div>
            );
          },
        }),
      },
      {
        modelKey: ModelKeys.DESCRIPTION,
        label: { text: t(`${sectionKey}.${ModelKeys.DESCRIPTION}.title`) },
        overrides: (configIn: Partial<DisplayField>) => ({
          containerClassName: `${configIn.containerClassName} `,
          type: DisplayFieldType.TEXT_AREA,
          id: ModelKeys.DESCRIPTION,
          placeholder: t(`${sectionKey}.${ModelKeys.DESCRIPTION}.placeholder`),
          inputProps: {
            inputClassName: '',
            rows: 10,
          },
        }),
      },
    ] as OverridableFieldType[];

    return [
      {
        className: 'w-full',
        id: type,
        fields: getFields(
          fieldSet.filter((x) => x),
          onFieldUpdate,
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useEffect(() => {
    setModel(modelIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChange?.(model, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <DisplayForm
      titleContainerClassName="flex justify-center w-full py-5"
      sectionsContainerClassName="gap-5 border px-5 py-5 pb-10 border-1 mb-10"
      sections={sections}
      title={t('portfolio:asset.information.section.title')}
      model={model}
    />
  );
};

export default InformationSection;
