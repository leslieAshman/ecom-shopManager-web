/* eslint-disable @typescript-eslint/no-use-before-define */
import moment from 'moment';
import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { capitalizeFirstLetter, sumBy, toInternalId, uniqueItems } from '../../utils';
import { useExecuteQuery } from '../hooks/useExecuteQuery';
import useFadeInOnScroll from '../hooks/useFadeInOnScroll';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useLazyExecuteQuery } from '../hooks/useLazyExecuteQuery';
import { GET_PRODUCT_DETAILS } from '../Portfolio/components/Details/graphql/getProductDetails';
import { initialiseMyCellarExportColumns } from '../Portfolio/helpers';
import { SortByOption } from '../Portfolio/types';
import SharedLayout from '../shared/SharedLayout';
import { GET_MY_CELLAR } from './graphql/myCellar';
import { MiscModal } from 'components/Misc';
import StockMgr from './components/StockMgr';

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

  const {
    results: DSFS,
    loading: loadingMyCellar,
    error: myCellarError,
    refetch: refetchMyCellar,
  } = useExecuteQuery('portalMyCellar', GET_MY_CELLAR);

  const { executor: fetchProductDetails } = useLazyExecuteQuery(GET_PRODUCT_DETAILS);
  const myCellarStock = useMemo(() => {
    return [] as StockItem[];
  }, []);
  const currentTabState = useRef<TabState | null>(null);
  const pageTitle = 'cellar';
  const title = t(`common:${pageTitle}`);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const onStateChange = (state: TabState | null) => {
    const update = state?.filters?.data;
    if (update !== filteredData) {
      setFilteredData(update || []);
    }
    currentTabState.current = state;
  };

  const stocks = useMemo(() => {
    const adjustQtySource = (myCellarStock as BaseProduct[])
      .map((x) => ({ ...getBlankProduct(), ...x }))
      .map((x) => {
        return {
          ...x,
          qty: x.rotationNumber && x.rotationNumber.length > 0 ? 1 : x.qty,
          [DATA_REFS.SANITIZED_WINE_NAME]: x[DATA_REFS.NAME].normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        };
      });
    return adjustQtySource;
  }, [myCellarStock]);

  const { isLoading, results, lastItemRef } = useInfiniteScroll(filteredData);
  const processIntersectionObserverEntry = useCallback((entry: IntersectionObserverEntry) => {
    entry.target.classList.toggle('flex', entry.isIntersecting);
  }, []);

  const { isItemVisible, fadeOnScrollClassName } = useFadeInOnScroll({ isLoading, processIntersectionObserverEntry });

  const statuses = useMemo(() => {
    return uniqueItems((myCellarStock as StockItem[]).map((x) => x.status));
  }, [myCellarStock]);

  const totals = useMemo(() => {
    const adjustQtySource = filteredData.map((x) => {
      return {
        ...x,
        cases: x.rotationNumber && x.rotationNumber.length > 0 ? 1 : x.qty,
        bottles: x.rotationNumber && x.rotationNumber.length > 0 ? x.unitCount : x.qty * x.unitCount,
      };
    });

    const bottles = sumBy(adjustQtySource, 'bottles');
    const cases = sumBy(adjustQtySource, 'cases');
    return {
      cases,
      bottles,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData]);

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
                {[`${totals.cases} cases`, `${totals.bottles} bottles`].map((x, index) => (
                  <div key={`item-${index}`} className="text-base px-3">
                    {x}
                  </div>
                ))}
              </div>
            </div>
            <StockTab
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
              datasource={stocks}
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
                <div className="flex   gap-[24px] flex-wrap justify-center overflow-hidden overflow-y-auto  flex-1 bg-gray-100 p-7">
                  {results.map((item, index) => {
                    let lastElemRefOption = { ref: isItemVisible };
                    if (results.length === index + 1) {
                      lastElemRefOption = { ref: lastItemRef };
                    }
                    const id = `${item.id}-${index}`;
                    const name = `${item.vintage} ${item.wineName}`;
                    const qtyString = `${item.qty}x (${item.unit})`;
                    const selectedRegion = regions.find(
                      (x) => x.id === toInternalId(item?.cultWinesAllocationRegion!.toLowerCase()),
                    );
                    const regionColor = selectedRegion?.color;
                    const textColor = `text-${selectedRegion?.textColor || 'black'}`;
                    const { dealDate, dealRef, rotationNumber, imageFileName, location, status } = item;
                    const itemImage = getImageUrl(imageFileName || '', { height: 200 });
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
                        onClick={() => onItemSelect(item, context)}
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
                              {capitalizeFirstLetter(item.cultWinesAllocationRegion!)}
                            </div>
                          </div>
                          <div className="text-14 whitespace-nowrap truncate mt-2">{qtyString}</div>
                          <div className="text-sm py-3 flex divide-x divide-gray-300 ">
                            <span className="pr-3">{`${moment(dealDate).format('DD MMM YYYY')}`.toUpperCase()}</span>
                            <span className="px-3">{dealRef}</span>
                            {rotationNumber && <span className="pl-3"> {rotationNumber}</span>}
                          </div>
                        </div>
                        <div className="text-sm flex w-full ">
                          <div className="mr-3 flex  flex-1 text-xs">
                            <LocationIcon className="mr-1 " />
                            {location}
                          </div>
                          <div className="flex  justify-center items-center px-3 rounded-full text-xs bg-[#FEF4EE] h-[20px]">
                            <div className="w-[4px] h-[4px] rounded-full bg-[#F09555] mr-2"></div>
                            {status}
                          </div>
                        </div>
                      </ImageCard>
                    );
                  })}
                </div>
              )}
            </StockTab>
          </>
        )}
      </SharedLayout>
      <MiscModal>
        <StockMgr />
      </MiscModal>
    </>
  );
};

export default MyCellar;
