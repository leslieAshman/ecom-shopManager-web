/* eslint-disable @typescript-eslint/no-use-before-define */
import moment from 'moment';
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadIcon, LocationIcon } from '../../assets/icons';
import ExportCSV from '../../components/ExportToCsv';
import { DDFilterItem, FilterTypes } from '../../components/Filters/Filters';
import { SortAndFilterLayoutContextType, TabState } from '../../components/Layout/SortAndFilterLayout';
import Loading from '../../components/Loading/loading';
import ImageCard from '../../components/ProductTemplates/components/ImageCard';
import StockTab from '../../components/StockTab';
import { AppContext } from '../../context/ContextProvider';
import { getBlankProduct, getImageUrl, getRegions, onExportToXlsx } from '../../helpers';
import { AppEventTypes } from '../../types/AppType';
import { NavigationPath } from '../../types/DomainTypes';
import { Product, BaseProduct, DATA_REFS, StockItem } from '../../types/productType';
import { capitalizeFirstLetter, getRange, pickRandom, sumBy, toInternalId, uniqueItems } from '../../utils';
import { useExecuteQuery } from '../hooks/useExecuteQuery';
import useFadeInOnScroll from '../hooks/useFadeInOnScroll';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

import { initialiseMyCellarExportColumns } from '../Portfolio/helpers';
import { SortByOption } from '../Portfolio/types';
import SharedLayout from '../shared/SharedLayout';

import { MiscModal } from 'components/Misc';
import { GET_PORTFOLIO_ITEMS } from './graphql/getPortfolioDetails';
import { BaseResponse, ObjectType } from 'types/commonTypes';
import { AssetType, AssetTypeExtended, IEcommerceInfoType } from './components/types';
import AssetViewer from './components/AssetViewer';
import AssetList from './components/AssetList';
import AssetEditor from './components/AssetEditor';
import { EventArgs, EventTypes } from 'types';
import { isObjectType } from 'graphql';
import Preview, { PreviewModelType } from './components/AssetEditionSections/Preview';
import { useExecuteMutation } from 'views/hooks/useExecuteMutation';
import { DELETE_PORTFOLIO_ITEM_MUTATION } from './graphql/deletePortfolioItemMutation';

const MyCellar = () => {
  const { t } = useTranslation();
  const regions = useMemo(() => getRegions(t), [t]);
  const {
    state: {
      app: { refresh },
    },
    dispatch,
  } = useContext(AppContext);
  const {
    columns,
    sortByOptions,
    defaultSortBy: currentDefaultSortBy,
  } = useMemo(() => initialiseMyCellarExportColumns(t), [t]);

  const { executor: deleteExecutor } = useExecuteMutation(DELETE_PORTFOLIO_ITEM_MUTATION);

  const {
    results: fetchPortfolioItems,
    loading: loadingMyCellar,
    error: myCellarError,
    refetch: refetchMyCellar,
  } = useExecuteQuery('getPortfolioItems', GET_PORTFOLIO_ITEMS, {
    variables: { shopId: '6500ca883a7ced6ccd1efa19' },
  });
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type?: EventTypes;
    item?: unknown;
  }>({
    isOpen: false,
  });

  // const { executor: fetchPortfolioItems } = useLazyExecuteQuery(GET_PORTFOLIO_ITEMS);
  const myCellarStock = useMemo(() => {
    // if (!loadingMyCellar) {
    const cellarData = (fetchPortfolioItems as BaseResponse<AssetTypeExtended[]>)?.result?.map((x) => ({
      ...x,
      ...x.ecommerceInfo,
    }));

    return cellarData ?? [];
    //setFilteredData(cellarData ?? []);
  }, [fetchPortfolioItems]);

  const currentTabState = useRef<TabState<AssetTypeExtended> | null>(null);
  const pageTitle = 'cellar';
  const title = t(`common:${pageTitle}`);

  const stocks = useMemo(() => {
    return myCellarStock;
  }, [myCellarStock]);

  const statuses = useMemo(() => {
    return uniqueItems((myCellarStock as AssetTypeExtended[]).map((x) => x.serviceId));
  }, [myCellarStock]);

  const totals = useMemo(() => {
    // const adjustQtySource = stocks.map((x) => {
    //   return {
    //     ...x,
    //     cases: x.rotationNumber && x.rotationNumber.length > 0 ? 1 : x.qty,
    //     bottles: x.rotationNumber && x.rotationNumber.length > 0 ? x.unitCount : x.qty * x.unitCount,
    //   };
    // });

    const items = stocks.length;
    const stockItems = sumBy(stocks, 'units');
    return {
      items,
      stockItems,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks]);

  const onItemSelect = (item: Product, context: SortAndFilterLayoutContextType | undefined) => {
    // context!.openSlideoutWithProcessor(
    //   () =>
    //     new Promise((resolve) => {
    //       if (!item.stockId) {
    //         fetchProductDetails({ id: item.holdingId }).then((response) => {
    //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //           resolve((response.data as { portalHoldingDetails: Product }).portalHoldingDetails);
    //         });
    //       } else {
    //         fetchMyCellarDetails({ stockId: item.stockId }, { fetchPolicy: 'network-only' }).then((response) => {
    //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //           resolve((response.data as { portalMyCellarWineDetails: Product }).portalMyCellarWineDetails);
    //         });
    //       }
    //     }),
    // );
  };

  const onCTA: EventArgs['onCTA'] = (eventType, data) => {
    switch (eventType) {
      case EventTypes.CLOSE:
        setModalState({ ...modalState, isOpen: false });
        break;

      case EventTypes.PREVIEW:
        const {
          title: itemTitle,
          price,
          units,
          description,
          isOnPromotion,
          buyInfo,
          pic,
          ratings,
          variations,
        } = data as AssetTypeExtended;
        const previewModel = {
          title: itemTitle,
          price,
          units,
          description,
          isOnPromotion,
          promotionPrice: 0,
          priceMeta: buyInfo?.map((x) => x.text),
          pic,
          reviewCount: 0,
          ratings: ratings ?? 0,
          variations: variations?.map((x) => {
            return {
              name: x.name,
              units,
              price,
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
        };

        setModalState({ ...modalState, type: EventTypes.PREVIEW, item: previewModel, isOpen: true });
        break;

      case EventTypes.EDIT:
        setModalState({ ...modalState, type: EventTypes.EDIT, item: data, isOpen: true });
        break;

      case EventTypes.NEW:
        setModalState({ isOpen: true, type: EventTypes.EDIT, item: null });
        break;

      case EventTypes.DELETE:
        deleteExecutor({
          shopId: '6500ca883a7ced6ccd1efa19',
          serviceId: data as string,
        });
        break;

      default:
        break;
    }
  };

  useLayoutEffect(() => {
    if (refresh && (refresh as string[]).length > 0 && (refresh as string[]).includes(NavigationPath.MY_CELLAR)) {
      refetchMyCellar();
      dispatch({
        type: AppEventTypes.UPDATE_STATE,
        payload: { refresh: (refresh as string[]).filter((x) => x !== NavigationPath.MY_CELLAR) },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  // useEffect(() => {
  //   if (!loadingMyCellar) {
  //     const cellarData = (fetchPortfolioItems as BaseResponse<AssetTypeExtended[]>)?.result?.map((x) => ({
  //       ...x,
  //       ...x.ecommerceInfo,
  //     }));
  //     setFilteredData(cellarData ?? []);
  //   }
  // }, [fetchPortfolioItems, loadingMyCellar]);

  //return <AssetViewer />;
  //return <AssetList />;
  return (
    <>
      <SharedLayout view={NavigationPath.MY_CELLAR} title={title} onBack={() => null} showBackButton={false}>
        {loadingMyCellar && (
          <div className="w-full h-full justify-center p-10">
            <Loading />
          </div>
        )}
        {!loadingMyCellar && (
          <>
            <div className="p-5 flex justify-center items-center">
              <div className="flex divide-x divide-gray-300">
                {[`${totals.items} Stock`, `${totals.stockItems} Items`].map((x, index) => (
                  <div key={`item-${index}`} className="text-base px-3">
                    {x}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <AssetList items={stocks} onCTA={onCTA} />
            </div>

            {/* <div className="bg-white">
              <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {results.map((item, index) => {
                    // let lastElemRefOption = { ref: isItemVisible };
                    // if (results.length === index + 1) {
                    //   lastElemRefOption = { ref: lastItemRef };
                    // }
                    const id = `${item.id}-${index}`;
                    const name = `${item.title}`;
                    // const qtyString = `${item.ecommerceInfo?.units}`;

                    const regionColor = undefined;
                    const textColor = `text-black`;

                    const itemImage = 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg';
                    const image = (
                      <div className="h-[130px]">
                        <img className="img h-full" alt={name} src={itemImage} />
                      </div>
                    );
                    return (
                      <a key={id} className="group">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                          <img
                            src={itemImage}
                            alt={name}
                            className="h-full w-full object-cover object-center group-hover:opacity-75"
                          />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700">{name}</h3>
                        <p className="mt-1 text-14 font-medium text-gray-900">{item.price}</p>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div> */}
            {/* <div className="flex gap-[24px] flex-wrap justify-center overflow-hidden overflow-y-auto  flex-1 bg-gray-100 p-7">
              {results.map((item, index) => {
                let lastElemRefOption = { ref: isItemVisible };
                if (results.length === index + 1) {
                  lastElemRefOption = { ref: lastItemRef };
                }
                const id = `${item.id}-${index}`;
                const name = `${item.title}`;
                const qtyString = `${item.ecommerceInfo?.units}`;
                //   (x) => x.id === toInternalId(item?.cultWinesAllocationRegion!.toLowerCase()),
                // );
                const regionColor = undefined;
                const textColor = `text-black`;
                const itemImage = 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg';
                const image = (
                  <div className="h-[130px]">
                    <img className="img h-full" alt={title} src={itemImage} />
                  </div>
                );

                return (
                  <ImageCard
                    {...lastElemRefOption}
                    key={id}
                    id={id}
                    image={image}
                    onClick={() => null}
                    className={`${fadeOnScrollClassName} sm:w-[302px] w-full`}
                    imageClassName="w-full"
                  >
                    <div className="w-full flex-1">
                      <div className="relative space-y-[4px] flex flex-col border-none ">
                        <div className="whitespace-nowrap truncate text-20">{name}</div>
                      </div>
                      <div
                        style={{ background: regionColor! }}
                        className={`flex  justify-center items-center border w-fit px-3 py-[2px] rounded-full h-auto mt-1 ${textColor}`}
                      >
                        <div className="w-fit whitespace-nowrap text-center font-semibold text-sm">
                          {capitalizeFirstLetter('selectedRegion')}
                        </div>
                      </div>
                      <div className="text-14 whitespace-nowrap truncate mt-2">{qtyString}</div>
                      <div className="text-sm py-3 flex divide-x divide-gray-300 ">
                        <span className="pr-3">{`${moment().format('DD MMM YYYY')}`.toUpperCase()}</span>
                        <span className="px-3">Deal Ref</span>

                      </div>
                    </div>
                    <div className="text-sm flex w-full ">
                      <div className="mr-3 flex  flex-1 text-xs">
                        <LocationIcon className="mr-1 " />
                        Location
                      </div>
                      <div
                        onClick={() =>
                          setModalState({
                            ...modalState,
                            type: EventTypes.EDIT,
                            item: item as unknown,
                            isOpen: true,
                          })
                        }
                        className="flex cursor-pointer  justify-center items-center px-3 rounded-full text-xs bg-[#FEF4EE] h-[20px]"
                      >
                        Edit
                      </div>

                      <div
                        onClick={() => onCTA(EventTypes.PREVIEW, item as unknown)}
                        className="flex cursor-pointer ml-2  justify-center items-center px-3 rounded-full text-xs bg-[#FEF4EE] h-[20px]"
                      >

                        View
                      </div>
                    </div>
                  </ImageCard>
                );
              })}
            </div> */}
            {/* <StockTab
              columns={columns}
              sortByOptions={sortByOptions as SortByOption[]}
              defaultSortBy={currentDefaultSortBy}
              moreSelectorTemplate={() => (
                <ExportCSV
                  csvData={filteredData}
                  fileName={`my-cellar ${moment().format('YYYY-MM-DD HH:mm')}`}
                  onPrepareData={(data: Product[]) => onExportToXlsx(data, columns)}
                >
                  <div
                    className={`pl-8 flex items-center ${
                      filteredData.length > 0 ? 'cursor-pointer opacity-100' : 'pointer-events-none opacity-50'
                    }`}
                  >
                    <DownloadIcon />
                  </div>
                </ExportCSV>
              )}
              tabState={null}
              id={'myCellar'}
              datasource={stocks as any}
              onStateChange={onStateChange}
              loading={loadingMyCellar}
              error={myCellarError}
              filterConfigure={(filters: DDFilterItem[]) => {
                return filters.filter((x) => x.type !== FilterTypes.P_AND_L);
              }}
              filterPanelContainerClassName="px-10 bg-gray-100"
              filterOverrides={{
                [FilterTypes.STATUES]: {
                  source: statuses,
                  filterFn: (data: Product[], ids: string[]) => {
                    let statusesFilterResult: Product[] = [];
                    statuses.forEach((status) => {
                      if (ids.includes(toInternalId(status!))) {
                        statusesFilterResult = [
                          ...statusesFilterResult,
                          ...data.filter((x) => x.status?.toLowerCase() === status?.toLowerCase()),
                        ];
                      }
                    });
                    return statusesFilterResult;
                  },
                },
              }}
            >
              {(context) => (
             
              )}
            </StockTab> */}
          </>
        )}
      </SharedLayout>
      {modalState.isOpen && (
        <MiscModal>
          {/* <StockMgr /> */}
          {modalState.type === EventTypes.EDIT && (
            <AssetEditor
              assetModel={modalState.item as AssetTypeExtended}
              onCancel={() => onCTA(EventTypes.CLOSE, { isOpen: false })}
            />
          )}
          {modalState.type === EventTypes.PREVIEW && (
            <div className="flex-1 px-4 relative py-3 overflow-y-auto h-[calc(100vh-20vh)]">
              <Preview onCTA={onCTA} modelIn={modalState.item as PreviewModelType} />
            </div>
          )}
        </MiscModal>
      )}
    </>
  );
};

export default MyCellar;

export const mockSavedItem: AssetTypeExtended = {
  id: '',
  isVisible: true,
  isAvailable: true,
  title: 'T-shirt',
  shopId: '123',
  isOnPromotion: false,
  discount: 0,
  promotionPrice: 0,
  reviewCount: 0,
  serviceId: '123',
  hashTags: ['fahion', 'clothes'],
  listingType: 'Physical',
  description:
    "What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  price: 12.49,

  buyInfo: [{ text: 'VAT included', color: 'black' }],
  units: 15,
  variations: [
    {
      name: 'Color',
      displayText: 'Color',
      default: '_463711f9-500e-4ae6-a0f4-9b0355a2149a',
      options: [
        {
          // id: '_463711f9-500e-4ae6-a0f4-9b0355a2149a',
          label: 'Black',
          color: 'black',
          priceAdjustment: 0,
          units: 2,
          isVisible: true,
        },
      ],
    },
  ] as IEcommerceInfoType['variations'],

  pic: {
    createdDate: moment().format(),
    pic: { image: 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg', name: 'Tom Tom' },
  },
};
