import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { AssetType, AssetTypeExtended, IEcommerceInfoType } from './types';
import DisplayForm, { getFields } from 'components/DisplayForms/DisplayForm';
import { DisplayField, DisplayFieldType, DisplaySection, OverridableFieldType } from 'components/DisplayForms';
import { getFieldAttributes, getPortfolioDropdownOptions } from 'helpers';
import { buildDisplayText, capitalizeFirstLetter, classNames } from 'utils';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'components';
import { DropdownItem, ddlDefaultConfig } from 'components/Dropdown';
import { ICategory } from '../types';
import { ObjectType } from 'types/commonTypes';
import { AppContext } from 'context/ContextProvider';
import { useExecuteQuery } from 'views/hooks/useExecuteQuery';
import { GET_PORTFOLIOS } from 'views/Portfolio/graphql/getPortfolios';
import { useLazyExecuteQuery } from 'views/hooks/useLazyExecuteQuery';
import CheckBox from 'components/CheckBox';
import InformationSection, { InformationModelType } from './AssetEditionSections/information';
import PricingSection, { PricingModelType } from './AssetEditionSections/pricing';
import StockingSection, { StockingModelType } from './AssetEditionSections/stocking';
import VariationSection, { VariationModelType } from './AssetEditionSections/variations';
import CustomInput from 'components/CustomInput';
import { MiscModal } from 'components/Misc';
import Preview, { mockPreviewModel2 } from './AssetEditionSections/Preview';
import { EventArgs, EventTypes } from 'types';
import moment from 'moment';
import { mode } from 'crypto-js';
import { setIn } from 'formik';
import { EditVariationModelType } from './AssetEditionSections/editVariation';
import { color } from 'highcharts';
import { useExecuteMutation } from 'views/hooks/useExecuteMutation';
import { ADD_PORTFOLIO_ITEM_MUTATION } from '../graphql/addPortfolioItemMutation';
import { DELETE_PORTFOLIO_ITEM_MUTATION } from '../graphql/deletePortfolioItemMutation';

import ImageViewer from './AssetEditionSections/ImageViewer';
import { CloseBlackIcon } from 'assets/icons';

const translationKey = 'asset';
type DropdownItemType = { id: string; value: string; name?: string; _id?: string };
type ModelType = InformationModelType & PricingModelType;

enum ModelKeys {
  INFORMATION = 'information',
  PRICING = 'pricing',
  STOCKING = 'stocking',
  VARIATIONS = 'variations',
  POLICIES = 'policies',
  HASHTAGS = 'hashTags',
  ADDITIONAL_INFO = 'additionalInfo',
}

const DisplayTextKeys = { ...ModelKeys };
const hasCategory = false;

interface AssetEditorProps {
  onCancel?: () => void;
  assetModel?: AssetTypeExtended;
}

const AssetEditor: FC<AssetEditorProps> = ({ assetModel, onCancel }) => {
  const {
    state: {
      auth: { requiredActions },
      app: { refresh, isAppReady },
      settings: { fullname, email },
      user: { id: userId, portfolios },
    },
    formatter: currencyFormatter,
    dispatch,
  } = useContext(AppContext);
  const { t } = useTranslation('portfolio');
  const [informationModel, setInformationModel] = useState<InformationModelType>({} as InformationModelType);
  const [pricingModel, setPricingModel] = useState<PricingModelType>({} as PricingModelType);
  const [stockingModel, setStockingModel] = useState<StockingModelType>({} as StockingModelType);
  const [variationModel, setVariationModel] = useState<VariationModelType>({} as VariationModelType);
  const [hashTags, setHashTags] = useState<string[]>();
  const [timestamp, setTimestamp] = useState<string>();

  const [currentHashTag, setCurrentHashTag] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [policyModel, setPolicyModel] = useState<ModelType>({} as ModelType);
  const [AdditionInfoModel, setAdditionalInfoModel] = useState<ModelType>({} as ModelType);
  const { executor } = useExecuteMutation(ADD_PORTFOLIO_ITEM_MUTATION);

  const isImgPresent = Boolean(
    informationModel.pic &&
      informationModel?.pic?.pic &&
      informationModel?.pic?.pic?.image &&
      informationModel?.pic?.pic?.image.length > 0,
  );

  const onModelChange = (upModel: unknown, type: string) => {
    switch (type) {
      case ModelKeys.INFORMATION:
        setInformationModel((preModel) => ({ ...preModel, ...(upModel as InformationModelType) }));
        break;
      case ModelKeys.PRICING:
        setPricingModel((preModel) => ({ ...preModel, ...(upModel as PricingModelType) }));
        setVariationModel((preModel) => ({ ...preModel, price: (upModel as PricingModelType).price }));
        break;
      case ModelKeys.STOCKING:
        setStockingModel((preModel) => ({ ...preModel, ...(upModel as StockingModelType) }));
        setVariationModel((preModel) => ({ ...preModel, units: (upModel as StockingModelType).units }));
        break;
      case ModelKeys.VARIATIONS:
        setVariationModel((preModel) => ({ ...preModel, ...(upModel as VariationModelType) }));
        break;
      case ModelKeys.HASHTAGS:
        setVariationModel((preModel) => ({ ...preModel, ...(upModel as VariationModelType) }));
        break;
      default:
        break;
    }
  };

  const onCTA: EventArgs['onCTA'] = (evenType, data) => {
    switch (evenType) {
      case EventTypes.CANCEL:
        onCancel?.();
        break;
      case EventTypes.CLOSE:
        if (data === 'preview') setIsModalOpen(false);
        break;

      case EventTypes.DELETE:
        alert(data as string);
        return;
        executor({
          shopId: '6500ca883a7ced6ccd1efa19',
          serviceId: data as string,
        });
        break;
      case EventTypes.SAVE:
        const { modelType, priceMeta, promotionPrice, ...service } = {
          ...informationModel,
          ...pricingModel,
          ...stockingModel,
          variations: variationModel.variations?.map((x) => {
            return {
              name: x.name,
              default: '',
              displayText: x.name,
              options: x.options.map((z) => {
                return {
                  label: z.label,
                  color: 'black',
                  priceAdjustment: z.price,
                  units: z.qty,
                  isVisible: z.isVisible,
                };
              }),
            } as any;
          }),
          hashTags,
          reviewCount: 0,
        } as any;

        const selectedQueues = [] as string[];
        const shopId = '6500ca883a7ced6ccd1efa19';
        const newItem = {
          ...service,
          buyInfo: [{ text: 'VAT included', color: 'black' }],
          prevServiceId: service.serviceId,
          serviceId: `${shopId}${service.price}${service.title?.replace(/\s/g, '')}${moment().format(
            'YYYYMMDDHHmmss',
          )}`,
          pic: isImgPresent
            ? {
                createdDate: service.pic?.createdDate,
                pic: JSON.stringify({
                  image: service.pic?.pic.image,
                  name: service.pic?.pic?.name,
                }),
              }
            : undefined,
        };

        console.log('SAVE', {
          // ...informationModel,
          // ...pricingModel,
          // ...stockingModel,
          // variations: variationModel.variations,
          // hashTags,
          // reviewCount: 0,
          // ...mockPreviewModel2,
          ...newItem,
        });

        executor({
          shopId: '6500ca883a7ced6ccd1efa19',
          item: newItem,
          selectedQueues: [],
        });
        break;
      default:
        break;
    }
  };

  const { executor: getPortfolioResult, loading, data } = useLazyExecuteQuery(GET_PORTFOLIOS);

  const por = useMemo(() => {
    if (!portfolios || portfolios.length === 0) return undefined;
    // getPortfolioResult({
    //   portfolioId: portfolios?.[0].shopId,
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolios]);

  const addHashTags = () => {
    if (!currentHashTag) return;
    setHashTags((pre) => [...(pre ?? []), ...currentHashTag.split(' ')]);
    setCurrentHashTag('');
  };

  useEffect(() => {
    console.log('DATA', data);
  }, [data]);

  useEffect(() => {
    const modelIn = {
      ...assetModel,
      id: '1233',
      shopId: '133SSd',
      isVisible: true,
      isAvailable: true,
      serviceId: '',
    } as AssetTypeExtended;

    const mInformationModel = {
      pic: {},
      title: modelIn.title,
      category: modelIn?.category ?? '',
      description: modelIn.description,
      listingType: modelIn.listingType,
      modelType: 'information',
    } as InformationModelType;

    const mPricingModel = {
      price: modelIn.price,
      isOnPromotion: modelIn.isOnPromotion,
      promotionPrice: modelIn.discount,
      priceMeta: modelIn.buyInfo?.map((x) => x.text),
      modelType: 'pricing',
    } as PricingModelType;

    const mStockingModel = { units: modelIn.units, modelType: 'stocking' } as StockingModelType;
    const mVariationModel = {
      units: modelIn.units,
      price: modelIn.price,
      modelType: 'variations',
      variations: modelIn.variations?.map((x) => {
        return {
          name: x.name,
          units: modelIn.units,
          price: modelIn.price,
          modelType: 'variation',
          options: x.options.map((y) => ({
            label: y.label,
            displayText: y.label,
            color: '',
            price: y.priceAdjustment,
            qty: y.units,
            isVisible: y.isVisible,
            isDefault: false,
          })),
        };
      }),
    } as VariationModelType;

    setInformationModel(mInformationModel);
    setPricingModel(mPricingModel);
    setStockingModel(mStockingModel);
    setVariationModel(mVariationModel);
    setHashTags(modelIn.hashTags);
    setTimestamp(moment().format());

    // ...informationModel,
    // ...pricingModel,
    // ...stockingModel,
    // variations: variationModel.variations,
    // hashTags,
    // reviewCount: 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetModel]);

  const finalModel = {
    ...informationModel,
    ...pricingModel,
    ...stockingModel,
    variations: variationModel.variations,
    hashTags,
    reviewCount: 0,
  };

  console.log('portfolioItem', finalModel);

  return (
    <div className="flex-1 px-4 relative py-3 overflow-y-auto h-[calc(100vh-10vh)] ">
      <CloseBlackIcon onClick={() => onCTA(EventTypes.CANCEL)} className="right-5 top-3 absolute cursor-pointer" />
      <div className="px-4 py-5  overflow-y">
        <ImageViewer />

        <InformationSection
          timestamp={timestamp}
          modelIn={informationModel}
          type={ModelKeys.INFORMATION}
          translationKey={translationKey}
          onChange={onModelChange}
        />
        <PricingSection
          timestamp={timestamp}
          modelIn={pricingModel}
          type={ModelKeys.PRICING}
          translationKey={translationKey}
          onChange={onModelChange}
        />
        <StockingSection
          timestamp={timestamp}
          modelIn={stockingModel}
          type={ModelKeys.STOCKING}
          translationKey={translationKey}
          onChange={onModelChange}
        />
        <VariationSection
          timestamp={timestamp}
          modelIn={variationModel}
          type={ModelKeys.VARIATIONS}
          translationKey={translationKey}
          onChange={onModelChange}
        />

        <div className="py-5">
          <label className="flex flex-row items-center mb-5 uppercase">Tags</label>
          <div className="flex flex-col border border-1 p-5">
            <label className="flex flex-row items-center">
              <span className="text-gray-400 text-sm ">Keywords to search for your listings.</span>
            </label>
            <CustomInput
              className=""
              inputClassName="w-full"
              name="hashTags"
              onChange={(e, value) => {
                setCurrentHashTag(value as string);
              }}
              placeholder="Type hashtag here, eg. feature, colour, style, service, etc"
              type={DisplayFieldType.TEXT}
              value={currentHashTag}
              inputProps={{
                showClearButton: true,
              }}
              addOnEnd={() => (
                <Button className="btn-accent ml-5 rounded-none text-sm" onClick={addHashTags}>
                  Add
                </Button>
              )}
              helperText="Separate each tag with a space or comma"
              helperTextClassName="!text-black !text-gray-400 text-sm"
            />
            <div className="bg-[#f8f9fd] p-5 my-5">
              {hashTags && hashTags?.length > 0 && (
                <div className="flex justify-end  text-sm underline cursor-pointer" onClick={() => setHashTags([])}>
                  Clear All
                </div>
              )}
              {hashTags?.map((item, i) => {
                return (
                  <Button
                    key={`${i}`}
                    type="badge"
                    onClick={() => {
                      setHashTags((pre) => [...(pre || []).filter((x) => x !== item)]);
                    }}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex py-5 px-1 w-full mt-10">
          <Button className="btn-outline ml-2 " onClick={() => onCTA(EventTypes.CANCEL)}>
            Cancel
          </Button>
          <div className="flex-1"></div>
          <Button className="btn-accent mx-5" onClick={() => setIsModalOpen(true)}>
            Preview
          </Button>
          <Button className="btn-primary ml-2" onClick={() => onCTA(EventTypes.SAVE)}>
            Save
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <MiscModal>
          <div className="flex-1 px-4 relative py-3 overflow-y-auto h-[calc(100vh-20vh)]">
            <Preview onCTA={onCTA} modelIn={finalModel} />
          </div>
        </MiscModal>
      )}
    </div>
  );
};

export default AssetEditor;

const capitalizeNameField = (x: { name: string } & ObjectType) => ({
  ...x,
  name: `${x.name
    .split(' ')
    .map((z: string) => capitalizeFirstLetter(z))
    .join(' ')}`,
});

const getQuantities = () => {
  return [...Array(100).keys()].map((x) => ({
    id: x,
    name: x,
    value: x,
  }));
};
const getCategory = (categories: any, catId: string, index = -1) => {
  const noCategory = {
    id: '-1',
    name: 'None',
    value: '',
  } as DropdownItemType;

  if (!!!categories || categories.length === 0) {
    if (!!!catId && index === -1) return [noCategory];
    return noCategory;
  }

  const rObj = (x: Partial<DropdownItemType & { categoryRef: string; title: string }>) => ({
    id: x.categoryRef || x.id,
    name: x.title || x.name,
    value: x.categoryRef || x.value,
  });

  if (!!!catId && index === -1) {
    return [noCategory, ...categories.map(rObj)];
  }

  let itm;
  if (catId) {
    itm = categories.find(
      (x: Partial<DropdownItemType & { categoryRef: string; title: string }>) => (x.categoryRef || x.value) === catId,
    );
    if (itm) return rObj(itm);
    return undefined;
  }

  if (index > -1 && index < categories.length) {
    itm = categories[index];
    if (itm) return rObj(itm);
  }
};

const getPolicyOut = (policies: DropdownItemType[], policyId: string, index = -1) => {
  const noPolicy = {
    id: -1,
    name: 'None',
    value: '',
  };

  if (!!!policies || policies.length === 0) {
    if (!!!policyId && index === -1) return [noPolicy];
    return noPolicy;
  }
  const rObj = (x: DropdownItemType) => ({
    id: x._id || x.id,
    name: x.name,
    value: x._id || x.id,
  });
  if (!!!policyId && index === -1) {
    return [noPolicy, ...policies.map(rObj)];
  }

  let itm;
  if (policyId) {
    itm = policies.find((x: DropdownItemType) => (x._id || x.id) === policyId);
    if (itm) return rObj(itm);
    return undefined;
  }

  if (index > -1 && index < policies.length) {
    itm = policies[index];
    if (itm) return rObj(itm);
  }
};

const getDropDownOptions = <T,>(source: T[], valRef: keyof T, displayRef: keyof T, value = '', index = -1) => {
  const noOption = {
    id: '-1',
    name: 'None',
    value: '',
    content: '',
  } as DropdownItemType;

  if (!!!source || source.length === 0) {
    if (!!!value && index === -1) return [noOption];
    return noOption;
  }

  const rObj = (x: T) => ({
    id: x[valRef],
    name: x[displayRef],
    value: x[valRef],
  });

  if (!!!value && index === -1) {
    return [noOption, ...source.map(rObj)];
  }

  let itm;
  if (value) {
    itm = source.find((x: T) => x[valRef] === value);
    if (itm) return rObj(itm);
    return undefined;
  }

  if (index > -1 && index < source.length) {
    itm = source[index];
    if (itm) return rObj(itm);
  }
};
