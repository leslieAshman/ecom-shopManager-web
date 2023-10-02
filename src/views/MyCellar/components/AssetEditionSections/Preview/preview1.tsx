import React, { FC, useEffect, useState } from 'react';
import { capitalizeFirstLetter, formatter } from 'utils';
import { PreviewModelType, mockPreviewModel } from '.';
import { Dropdown } from 'components';
import { DropdownItem } from 'components/Dropdown';
import { ProductImage } from 'components/ProductTemplates';
import PreviewImage from './previewImage';
import ProductMeta from './productMeta';
import { EventArgs, EventTypes } from 'types';
import { it } from 'node:test';

export const PreviewType = 'preview';
export interface PreviewProps {
  modelIn: PreviewModelType;
  onCTA?: EventArgs['onCTA'];
  type?: string;
}
interface ModelType {
  qty: number;
  price: number;
  units?: number;
  selectedVariations?: string[];
}

const Preview1: FC<PreviewProps> = ({ modelIn, onCTA, type = PreviewType }) => {
  const [model, setModel] = useState<PreviewModelType>({} as PreviewModelType);
  const [previewModel, setPreviewModel] = useState<ModelType>();

  const recaculatePrice = () => {
    const selectedVars = model.variations?.filter((x) => previewModel?.selectedVariations?.includes(x.id as string));
    const newPrice = selectedVars?.reduce((acc, curr) => {
      const selectedOption = curr.options?.find((x) => x.isDefault);
      return acc + (selectedOption?.price || 0);
    }, 0);
  };
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setModel({ ...modelIn });
    const selectedVariations = modelIn.variations?.map((x) => (x.options?.find((z) => z.isDefault) || x.options[0]).id);
    setPreviewModel({ qty: 1, price: modelIn.price, units: modelIn.units, selectedVariations });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { reviewCount, price, isOnPromotion, priceMeta, promotionPrice, units } = model;
  console.log('PreviewModel', previewModel);
  if (!previewModel) return null;
  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <div className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                onClick={() => onCTA?.(EventTypes.CLOSE, type)}
                type="button"
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <PreviewImage />
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-lg font-bold text-gray-900 sm:pr-12">{model.title}</h2>
                  <ProductMeta
                    modelIn={{
                      units: modelIn.units,
                      price: previewModel.price,
                      priceMeta,
                      isOnPromotion,
                      reviewCount,
                      promotionPrice,
                    }}
                  />

                  <section aria-labelledby="options-heading" className="mt-10">
                    <h3 id="options-heading" className="sr-only">
                      Product options
                    </h3>

                    {model.variations && model.variations.length > 0 && (
                      <div className="flex flex-row  space-x-5 flex-wrap">
                        {model.variations?.map((variation) => {
                          return (
                            <div key={`variation-${variation.id}`}>
                              <h4 className="text-base  text-gray-900">{capitalizeFirstLetter(variation.name)}</h4>
                              <fieldset className="mt-4">
                                <legend className="sr-only">Choose variation</legend>
                                <span className="flex items-center space-x-3">
                                  <Dropdown
                                    placeholder="Default option"
                                    valueTemplate={
                                      <div className="">
                                        <span className="truncate block">
                                          {variation.options?.find((x) =>
                                            previewModel.selectedVariations?.includes(x.id),
                                          )?.displayText ?? ''}
                                        </span>
                                      </div>
                                    }
                                    onItemSelect={(item: DropdownItem) => {
                                      console.log('item', item);

                                      const args = item.value.split('_');
                                      setPreviewModel({
                                        ...previewModel,
                                        units: Number(args[0]),
                                        price: Number(modelIn.price) + Number(args[1]),
                                      });
                                    }}
                                    items={variation.options
                                      ?.filter((z) => z.isVisible)
                                      .map((x) => ({
                                        id: `${x.id}`,
                                        value: `${x.qty}_${x.price}`,
                                        content: `${x.displayText}`,
                                      }))}
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
                                </span>
                              </fieldset>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-5">
                      <h4 className="text-base  text-gray-900 mb-3">Quantity</h4>
                      <Dropdown
                        placeholder="Qty"
                        valueTemplate={
                          <div className="">
                            <span className="truncate block">{previewModel?.qty ?? 0}</span>
                          </div>
                        }
                        onItemSelect={(item: DropdownItem) =>
                          setPreviewModel({
                            ...previewModel,
                            price: Number(previewModel.price) * Number(item.value),
                            qty: Number(item.value),
                          })
                        }
                        items={Array.from({ length: previewModel.units || modelIn.units }, (_, i) => ({
                          id: `${i + 1}`,
                          value: `${i + 1}`,
                          content: `${i + 1}`,
                        }))}
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
                  </section>

                  <section aria-labelledby="options-heading" className="mt-10">
                    <h3 className="sr-only">Description</h3>

                    <div className="space-y-6">
                      <p className="text-base text-gray-900">{`${model.description?.substring(0, 250)}${
                        model.description?.length ?? 0 > 250 ? '...' : ''
                      }`}</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview1;
