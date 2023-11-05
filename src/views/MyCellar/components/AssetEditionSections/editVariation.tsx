import { Button, Dropdown } from 'components';
import { DisplayField, DisplayFieldType, DisplaySection, OverridableFieldType } from 'components/DisplayForms';
import { getFields } from 'components/DisplayForms/DisplayForm';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownItem, ddlDefaultConfig } from 'components/Dropdown';
import CustomInput from 'components/CustomInput';
import CheckBox from 'components/CheckBox';
import { capitalizeFirstLetter, classNames, formatter, getUUID } from 'utils';
import { mode } from 'crypto-js';
import { EventArgs, EventTypes } from 'types';
import { WarningIcon } from 'assets/icons';
import Alert from 'components/Alert';
import { ObjectType } from 'types/commonTypes';

const getBlankVOptionModel = () => ({
  id: '',
  label: '',
  displayText: '',
  price: 0,
  qty: 0,
  isDefault: false,
  isVisible: false,
});

const getBlankModel = () => ({
  id: '',
  name: '',
  options: [],
  units: 0,
  price: 0,
  modelType: 'variation',
});

enum ModelKeys {
  UNITS = 'units',
  NAME = 'name',
}

interface VOptionType {
  id: string;
  label: string;
  displayText: string;
  price: number;
  qty: number;
  isDefault: boolean;
  isVisible: boolean;
}

export interface EditVariationModelType {
  id?: string;
  name: string;
  options: VOptionType[];
  units: number;
  price: number;
  modelType: string;
}

interface EditVariationProps {
  modelIn?: Partial<EditVariationModelType>;
  type: string;
  // translationKey: string;
  onCTA?: EventArgs['onCTA'];
}

const EditVariation: FC<EditVariationProps> = ({ type, modelIn, onCTA }) => {
  const { t } = useTranslation('portfolio');
  const [model, setModel] = useState<EditVariationModelType>({} as EditVariationModelType);
  const [vOption, setVOptionModel] = useState<VOptionType>(getBlankVOptionModel());
  const [upVOptions, setUpVOptions] = useState<string>('');
  const [error, setError] = useState<ObjectType>({});
  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    setModel((preModel) => ({ ...preModel, [`${field!.modelKey}`]: e.target.value }));
  };

  const onFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof EditVariationModelType,
  ) => {
    setModel((preModel) => ({ ...preModel, [key]: e.target.value }));
  };

  const addUpdateVOption = () => {
    if (!vOption.label) {
      return setError({ option_label: 'Option name required' });
    } else if (error.option_label) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { option_label, ...rest } = error;
      setError(rest);
    }

    if (!vOption.qty && vOption.isVisible) {
      return setError({ option_qty: 'Quantity is required for visible options' });
    } else if (error.option_qty) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { option_qty, ...rest } = error;
      setError(rest);
    }

    const displayText = `${vOption.label} ${vOption.price ? `+${formatter.format(vOption.price)}` : ''}`;
    console.log('displayText', displayText);
    if (vOption.id) {
      const existingOption = model.options?.find((x) => x.id === vOption.id);
      if (existingOption) {
        existingOption.label = vOption.label;
        existingOption.price = vOption.price;
        existingOption.qty = vOption.qty;
        existingOption.isVisible = vOption.isVisible;
        existingOption.displayText = displayText;
      }
      setModel({ ...model, options: [...model.options] });
    } else setModel({ ...model, options: [...model.options, { ...vOption, displayText, id: `_${getUUID()}` }] });
    setVOptionModel(getBlankVOptionModel());
  };

  const availableUnits = useMemo(() => {
    if (!model.options || model.options.length === 0) return model.units;
    const allocatedStock = model.options?.reduce((acc, x) => acc + Number(x.qty), 0);
    return model.units - (allocatedStock || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vOption.qty, model.options]);

  const getUnitCount = useCallback((xUnits: number) => {
    return Array.from({ length: xUnits }).map((x, i) => i + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('modelIn', model, modelIn);
    setModel({ ...getBlankModel(), ...modelIn, price: modelIn?.price ?? 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!Object.keys(model).length) return null;

  return (
    <div className="flex flex-col w-full space-y-5 py-5">
      {Object.keys(error).length > 0 && (
        <Alert
          isRelative
          className="bg-red  top-3 w-full text-14 text-white"
          show={true}
          onClose={() => setError({})}
          icon={<WarningIcon />}
        >
          <div className="flex-1 w-full">
            {Object.keys(error).map((x, index) => {
              return (
                <span key={`${index}`} className="text-sm">
                  {error[x] as string}
                </span>
              );
            })}
          </div>
        </Alert>
      )}
      <div className=" w-full text-md pb-5"> Configure Variations</div>
      <div className="flex flex-col">
        <label className={`text-gray-700 text-sm`}>Variation label</label>
        <CustomInput
          className="w-1/3"
          name={ModelKeys.NAME}
          onChange={(e) => onFieldChange(e, ModelKeys.NAME)}
          placeholder="Type the name of the variation"
          value={model[ModelKeys.NAME] ?? ''}
          inputProps={{
            showClearButton: true,
          }}
        />
      </div>

      <div className="flex flex-row items-center">
        <label className={`text-gray-700 text-sm`}>
          Total available units:
          <span className="px-3 text-base">{model.units}</span>
          Allocated units:
          <span className="px-3 text-base">{model.units - availableUnits}</span>
          Unallocated units:
          <span className="px-3 text-base">{availableUnits}</span>
        </label>
      </div>

      <div className="flex flex-col ">
        <label className={`text-gray-700 text-sm`}>
          Variation options
          <span className="text-sm ml-2 text-gray-400">
            Buyers will be able to select from these options during checkout. Options will be listed in the same order
            as they are shown here.
          </span>
        </label>
        {model.options?.length > 0 && (
          <div className="flex w-full">
            {[
              { label: 'Visible options', isVisible: true },
              { label: 'Hidden options', isVisible: false },
            ].map((k, j) => {
              return (
                <div className="w-1/2 flex flex-col gap-2 py-3" key={j}>
                  <span className="text-sm text-gray-400  ">{k.label}</span>
                  {model.options
                    ?.filter((z) => z.isVisible === k.isVisible)
                    .map((x, index) => (
                      <Button
                        key={`btn-${index}`}
                        type="badge"
                        isDisable={x.id === vOption.id}
                        onClick={() => {
                          setModel({ ...model, options: model.options?.filter((z) => z.id !== x.id) });
                        }}
                      >
                        <span className="flex-col flex w-full pr-5">
                          <span className="flex-1">{x.displayText ?? x.label} </span>
                          <span className="text-gray-400 text-sm">
                            qty:
                            <span className="pl-1 pr-3 font-bold text-black">{` ${x.qty}`}</span>
                            price:
                            <span className="pl-1 pr-3 font-bold text-black">{`${formatter.format(
                              Number(model.price) + x.price,
                            )}`}</span>
                          </span>
                        </span>
                        <Button
                          isLink
                          onClick={() => {
                            setVOptionModel(x);
                          }}
                        >
                          edit
                        </Button>
                      </Button>
                    ))}
                </div>
              );
            })}
          </div>
        )}
        {model.options?.length === 0 && (
          <div className="flex flex-col">
            <span className="text-base py-3">No options added yet</span>
          </div>
        )}
      </div>

      <div className="pt-3">
        <div className="flex flex-row items-center ">
          <label className={`text-gray-700 text-base`}>Add an option</label>
          <span className="text-sm ml-2 text-gray-400"> {`( base price= ${formatter.format(model.price)}`} </span>
          <span className="text-sm ml-2 text-gray-400">|</span>
          <span className="text-sm ml-2 text-gray-400"> {`available units= ${availableUnits} )`}</span>
        </div>

        <div className="w-full gap-1 grid grid-cols-[min-content_minmax(0,_1fr)_120px_100px_100px] items-end">
          <CheckBox
            className=" pr-2"
            isChecked={vOption.isVisible}
            onChange={(_, isChecked) => {
              setVOptionModel({ ...vOption, isVisible: isChecked });
            }}
          ></CheckBox>
          <CustomInput
            className={classNames('flex-1', `${error.option_label ? 'border border-1 border-red' : ''}`)}
            name="option_label"
            onChange={(_, value) => setVOptionModel({ ...vOption, label: value as string })}
            onTextAreaChange={() => {}}
            placeholder="Option name eg. red"
            value={vOption.label ?? ''}
            inputProps={{
              showClearButton: true,
            }}
          />
          <div className="mx-2 flex-col flex items-center w-full">
            <label className="text-gray-400 text-sm flex  flex-row">
              Price:
              <span className="text-vine ml-1 ">{formatter.format(Number(model.price) + vOption.price)}</span>
            </label>
            <CustomInput
              className=""
              inputClassName="w-full text-center"
              name="option_price"
              onChange={(_, value) => setVOptionModel({ ...vOption, price: Number(value) })}
              placeholder={formatter.format(0)}
              type={DisplayFieldType.CURRENCY}
              value={vOption.price ?? ''}
            />
          </div>
          <div
            className={classNames(
              'px-3 flex-col flex items-center',
              `${error.option_qty ? 'border border-red border-1  ' : ''}`,
            )}
          >
            <label className={`text-gray-400 text-sm`}>Qty</label>
            <Dropdown
              placeholder="Qty"
              valueTemplate={
                <div className="">
                  <span className="truncate block">{vOption.qty ?? ''}</span>
                </div>
              }
              onItemSelect={(item: DropdownItem) => setVOptionModel({ ...vOption, qty: Number(item.value) })}
              items={[0, ...getUnitCount(availableUnits)].map((x) => ({ id: `${x}`, value: `${x}`, content: `${x}` }))}
              {...{
                itemsWrapperClassName: ' overflow-x-hidden',
                itemWrapperStyle: { width: '100%' },
                containerClassName: '',
                itemsContainerClassName: 'h-[300px] overflow-y-auto w-full',
                itemClassName: 'text-base flex flex-1',
                className:
                  'flex-1 text-sm sm:text-14 text-black  !min-w-[50px]  whitespace-nowrap p-0 justify-center border-b border-b-gray-400',
              }}
            />
          </div>
          <Button className="btn-accent ml-3 rounded-none text-sm" onClick={addUpdateVOption}>
            {model.options?.find((x) => x.id === vOption?.id) ? 'Update' : 'Add'}
          </Button>
        </div>
        <span className="text-sm text-gray-400">Check box to make option visible</span>
      </div>

      <div className="w-full flex flex-col py-10">
        <label className={`text-gray-700 text-sm `}>
          Default option
          <span className="text-gray-300 ml-3">Set the default option for this variation</span>
        </label>
        <Dropdown
          placeholder="Default option"
          valueTemplate={
            <div className="">
              <span className="truncate block">
                {(model.options?.find((x) => x.isDefault) ?? (model.options ?? [{ displayText: '' }])[0]).displayText}
              </span>
            </div>
          }
          onItemSelect={(item: DropdownItem) => {
            setModel({
              ...model,
              options: model.options?.map((x) => ({ ...x, isDefault: x.id === item.id })),
            });
          }}
          items={model.options
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
      <div className="justify-between py-5 flex px-1 w-full mt-10">
        <Button
          className="btn-outline ml-2"
          onClick={() => {
            onCTA?.(EventTypes.CANCEL);
          }}
        >
          Cancel
        </Button>
        <Button
          isDisable={!model.name}
          className="btn-primary ml-2"
          onClick={() => {
            onCTA?.(EventTypes.SAVE, model);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditVariation;
