import { Button, Dropdown } from 'components';
import { DisplayField, DisplayFieldType, DisplaySection, OverridableFieldType } from 'components/DisplayForms';
import DisplayForm, { getFields } from 'components/DisplayForms/DisplayForm';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownItem, ddlDefaultConfig } from 'components/Dropdown';
import { MiscModal } from 'components/Misc';
import EditVariation, { EditVariationModelType } from './editVariation';
import { EventArgs, EventTypes } from 'types';
import { getUUID } from 'utils';

const unitCount = Array.from({ length: 500 }).map((x, i) => i);

enum ModelKeys {
  UNITS = 'units',
}

export interface VariationModelType {
  units: number;
  price?: number;
  variations?: EditVariationModelType[];
  modelType: string;
}

interface SectionProps {
  modelIn: VariationModelType;
  type: string;
  translationKey: string;
  timestamp?: string;
  onChange?: (upModel: VariationModelType, type: string) => void;
}

const VariationSection: FC<SectionProps> = ({ modelIn, translationKey, timestamp, onChange, type = 'variations' }) => {
  const { t } = useTranslation('portfolio');
  const [model, setModel] = useState<VariationModelType>({} as VariationModelType);
  const [currentEdit, setCurrentEdit] = useState<EditVariationModelType>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    setModel((preModel) => ({ ...preModel, [`${field!.modelKey}`]: e.target.value }));
  };
  const onCTA: EventArgs['onCTA'] = (eventType, data) => {
    switch (eventType) {
      case EventTypes.CANCEL:
        setIsModalOpen(false);
        setCurrentEdit(undefined);
        break;
      case EventTypes.SAVE:
        console.log('data', data);
        const varId = (data as EditVariationModelType).id;
        if (!varId) {
          setModel({
            ...model,
            variations: [...(model?.variations ?? []), { ...(data as EditVariationModelType), id: `_${getUUID()}` }],
          });
        } else {
          const newVariation = model.variations?.map((x) => {
            if (x.id === varId) {
              return { ...x, ...(data as EditVariationModelType) };
            }
            return x;
          });
          setModel({ ...model, variations: newVariation });
        }
        setIsModalOpen(false);
        setCurrentEdit(undefined);
        break;
      default:
        break;
    }
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
    setModel(modelIn as VariationModelType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelIn.units, modelIn.price, timestamp]);

  useEffect(() => {
    // onChange?.({ ...model }, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  console.log('VARIATION_Model', model);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center pb-3">
          <label className={`text-gray-700 text-base`}>Variations:</label>
          <span className="text-sm ml-2 text-gray-400">
            Add variation to your product. Buyers will have the option to choose from these during check out
          </span>
        </div>

        <Button
          className="w-[150px] btn-accent"
          isDisable={!model.units || `${model.units}` === `0`}
          onClick={() => {
            if (!isModalOpen) setIsModalOpen(true);
          }}
        >
          New Variation
        </Button>
        <div className="bg-[#f8f9fd] p-5 my-5">
          <div className="text-gray-400">Variation(s) and their selected default as presented to buyers.</div>
          <div className="flex flex-row items-center flex-wrap">
            {model.variations?.map((variation, i) => (
              <div key={`variation-${i}`} className="flex flex-col mt-3 ">
                <Button
                  type="badge"
                  onClick={() => {
                    const newVariation = model.variations?.filter((x) => x.id !== variation.id);
                    setModel({ ...model, variations: newVariation });
                  }}
                >
                  <div>
                    <span className="flex-1 mr-3">{`${variation.name.toUpperCase()}:`} </span>
                    <Dropdown
                      placeholder="Default option"
                      valueTemplate={
                        <div className="">
                          <span className="truncate block">
                            {variation.options?.find((x) => x.isDefault)?.displayText ?? ''}
                          </span>
                        </div>
                      }
                      onItemSelect={(item: DropdownItem) => {
                        const newVariation = model.variations?.map((x) => {
                          alert(variation.id);
                          if (x.id === variation.id) {
                            return { ...x, options: x.options?.map((z) => ({ ...z, isDefault: z.id === item.id })) };
                          }
                          return x;
                        });
                        setModel({ ...model, variations: newVariation });
                      }}
                      items={variation.options
                        ?.filter((z) => z.isVisible)
                        .map((x) => ({ id: `${x.id}`, value: `${x.id}`, content: `${x.displayText}` }))}
                      {...{
                        itemsWrapperClassName: ' overflow-x-hidden',
                        itemWrapperStyle: { width: '100%' },
                        containerClassName: '',
                        itemsContainerClassName: 'h-[300px] overflow-y-auto w-full',
                        itemClassName: 'text-base flex flex-1',
                        className:
                          'flex-1 text-sm sm:text-14 text-black pr-5 whitespace-nowrap p-0 justify-start border-b border-b-gray-400',
                      }}
                    />
                  </div>

                  <Button
                    isLink
                    onClick={() => {
                      if (!isModalOpen) {
                        setCurrentEdit(variation);
                        setIsModalOpen(true);
                      }
                    }}
                    className="ml-10"
                  >
                    edit
                  </Button>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {model.units > 0 && isModalOpen && (
        <MiscModal>
          <div className="flex-1 px-4 relative py-3 overflow-y-auto h-[calc(100vh-20vh)]">
            <EditVariation
              type="variations"
              onCTA={onCTA}
              modelIn={{ ...(currentEdit ?? {}), units: model.units, price: model.price }}
            />
          </div>
        </MiscModal>
      )}
    </>
  );
};

export default VariationSection;
