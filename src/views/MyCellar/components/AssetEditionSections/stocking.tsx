import { Dropdown } from 'components';
import { DisplayField, DisplayFieldType, DisplaySection, OverridableFieldType } from 'components/DisplayForms';
import DisplayForm, { getFields } from 'components/DisplayForms/DisplayForm';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownItem, ddlDefaultConfig } from 'components/Dropdown';

const unitCount = Array.from({ length: 500 }).map((x, i) => i);

enum ModelKeys {
  UNITS = 'units',
}

export interface StockingModelType {
  units: number;
  modelType: string;
}

interface SectionProps {
  modelIn: StockingModelType;
  type: string;
  translationKey: string;
  onChange?: (upModel: StockingModelType, type: string) => void;
}

const StockingSection: FC<SectionProps> = ({ modelIn, translationKey, onChange, type = 'stocking' }) => {
  const { t } = useTranslation('portfolio');
  const [model, setModel] = useState<StockingModelType>({} as StockingModelType);

  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    setModel((preModel) => ({ ...preModel, [`${field!.modelKey}`]: e.target.value }));
  };

  const sections: DisplaySection[] = useMemo(() => {
    const sectionKey = `${translationKey}.${type}`;

    const fieldSet = [
      {
        modelKey: ModelKeys.UNITS,
        label: { text: t(`${sectionKey}.${ModelKeys.UNITS}.title`) },
        overrides: () => ({
          containerClassName: `$ w-1/3 `,
          placeholder: '',
          helperTextClassName: '!text-black',
          isRequired: true,
          type: DisplayFieldType.CUSTOM,
          customTemplate: () => {
            return (
              <div className="flex flex-col w-1/2">
                <Dropdown
                  placeholder="Type"
                  value={''}
                  valueTemplate={
                    <div className="flex w-[95%]">
                      <span className="truncate block">{model.units ?? ''}</span>
                    </div>
                  }
                  onItemSelect={(item: DropdownItem) =>
                    setModel({ ...model, [ModelKeys.UNITS]: item.value as unknown as number })
                  }
                  items={unitCount.map((x) => ({ id: `${x}`, value: `${x}`, content: `${x}` }))}
                  {...ddlDefaultConfig}
                />
              </div>
            );
          },
        }),
      },
    ] as OverridableFieldType[];

    return [
      {
        className: '',
        fields: getFields(fieldSet, onFieldUpdate),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

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
      title={t(`portfolio:asset.${type}.section.title`)}
      model={model}
    />
  );
};

export default StockingSection;
