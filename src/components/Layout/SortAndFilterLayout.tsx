import { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseBlackIcon, CompactIcon, DownloadIcon, FilterIcon, ThreeDots } from '../../assets/icons';
import { Button, Dropdown } from '../../components';
import { TableColumnType } from '../../components/Table';
import { buildDisplayText, sortItems } from '../../utils';
import BitSelector from '../../components/BitSelectorProp';
import SlideOutPanel from '../../components/SlideOutPanel';
import { Switch } from '@headlessui/react';
import ExportCSV from '../../components/ExportToCsv';
import ExpandingSearch, { processSearch } from '../../components/ExpandingSearch';
import { DropdownItem } from '../../components/Dropdown';
import { DATA_REFS } from '../../types/productType';
import PDFilters, { DDFilterItem, Filters, FilterTypes } from '../../components/Filters/Filters';
import { SortByOption, SortByType } from '../../views/Portfolio/types';
import { onExportToXlsx } from '../../helpers';
import moment from 'moment';
import Switcher from 'components/Switcher';
import { Asset } from '__generated__/graphql';
import { AssetTypeExtended } from 'views/MyCellar/components/types';

export interface SortAndFilterLayoutContextType {
  config: SlideoutConfigType;
  updateSlideoutConfig: (config: Record<string, unknown>) => void;
  openSlideout: (product: AssetTypeExtended, config?: Record<string, unknown>) => void;
  openSlideoutWithProcessor: (processor: () => Promise<AssetTypeExtended>) => void;
  selectedProduct?: AssetTypeExtended;
  cardLayoutConfig?: {
    show: boolean;
    isCompact: boolean;
  };
}

export const SortAndFilterLayoutContext = createContext<SortAndFilterLayoutContextType | undefined>(undefined);

enum SortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}
enum SlideOutPanelViews {
  PRODUCT_DETAILS = 'product',
  FILTERS = 'filters',
}
const searchConfig = {
  uniqueIdRef: null,
  props: [DATA_REFS.NAME, DATA_REFS.VINTAGE],
  customFindFn: <T,>(data: T[], value: string) => {
    return [...data].filter((x) => {
      return x;
      // return (
      //   `${x[DATA_REFS.SANITIZED_WINE_NAME]}`.toLowerCase().startsWith(value.toLowerCase()) ||
      //   `${x[DATA_REFS.VINTAGE]} ${x[DATA_REFS.SANITIZED_WINE_NAME]}`.toLowerCase().startsWith(value.toLowerCase())
      // );
    });
  },
};

const DisplayTextKeys = {
  CLEAR_FILTER: 'portfolio:clearFilter',
  RESULTS: 'common:results',
  APPLY: 'common:apply',
  [SortDirection.ASCENDING]: 'common:ascending',
  [SortDirection.DESCENDING]: 'common:descending',
  SHOW_MORE: 'common:showMore',
  ORDER: 'common:order',
  SHOW_COMPACT_LIST: 'common:showCompactList',
  EXPORT_TO_XLS: 'common:exportToXls',
  SORTBY: 'portfolio:sortBy',
  SEARCH_PLACEHOLDER_TEXT: 'portfolio:searchPlaceholderText',
  SLIDE_OUT_WINE_DETAILS_TITLE: 'portfolio:wineDetails.title',
  SLIDE_OUT_FILTER_TITLE: 'portfolio:filters.title',
  CARD_VIEW: 'portfolio:filters.card-view',
  TABLE_VIEW: 'portfolio:filters.table-view',
};

export interface TabFilters<T> {
  selections: Filters | undefined;
  data: T[] | null;
}
export interface TabState<T> {
  id: string;
  sortTableBy: SortByType;
  searchQuery: string;
  isCardView: boolean;
  isCompact: boolean;
  filters: TabFilters<T> | null;
  timestamp: number;
}

interface SlideoutConfigType {
  showBackButton: boolean;
  open: boolean;
  view: SlideOutPanelViews;
  timestamp: number;
  title: string;
  onBack?: () => void;
  isDetailsFetched?: boolean;
}

interface SortAndFilterLayoutProp<T> {
  products: T[];
  children: ReactNode;
  head?: () => ReactNode;
  slideoutContent?: (
    selectedProduct: T,
    timeStamp: number,
    onClose?: () => void,
    setTitle?: (title: string) => void,
    isDetailsFetched?: boolean,
  ) => ReactNode;
  onFilter?: (results: T[], currentTabState?: TabState<T> | null) => void;
  tabState?: TabState<T> | null;
  compId?: string;
  columns?: TableColumnType[];
  sortByOptions?: SortByOption[];
  defaultSortBy?: SortByType;
  filterPanelContainerClassName?: string;
  showCompactSwitch?: boolean;
  moreSelectorTemplate?: (() => ReactNode) | null;
  filterConfigure?: (filters: DDFilterItem[]) => DDFilterItem[];
  filterOverrides?: Partial<Record<FilterTypes, unknown>>;
  loading?: boolean;
}

const SortAndFilterLayout = <T extends { id: string }>({
  products,
  children,
  head,
  slideoutContent,
  onFilter,
  tabState,
  compId,
  columns,
  sortByOptions,
  defaultSortBy,
  filterPanelContainerClassName,
  showCompactSwitch = false,
  moreSelectorTemplate = null,
  filterConfigure,
  filterOverrides,
  loading = true,
}: SortAndFilterLayoutProp<T>) => {
  const { t } = useTranslation();
  const defaultTableSortingOptions = () => {
    const { id, text } = (sortByOptions || []).find((x) => x.id === DATA_REFS.DEAL_DATE)!;
    return {
      id,
      text,
      direction: SortDirection.ASCENDING,
    };
  };
  const [tmpTableSortOrderBy, setTmpTableSortOrderBy] = useState<SortByType>(
    defaultSortBy || defaultTableSortingOptions(),
  );
  const [showSortByOptions, setShowSortByOptions] = useState(false);
  const [sortTableBy, setSortTableBy] = useState<SortByType>(defaultSortBy || defaultTableSortingOptions());
  const [searchQuery, setSearchQuery] = useState('');
  const [isCardView, setIsCardView] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<TabFilters<T> | null>();
  const [currentTabState, setCurrentTabState] = useState<TabState<T> | null>();

  const [selectedProduct, setSelectedProduct] = useState<T>();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'common', t), [t]);
  const [slideOutPanelConfig, setSlideOutPanelConfig] = useState<SlideoutConfigType>({
    showBackButton: false,
    open: false,
    view: SlideOutPanelViews.PRODUCT_DETAILS,
    timestamp: Date.now(),
    title: '',
    isDetailsFetched: false,
  });

  const [filteredViewData, setFilteredViewData] = useState<T[] | undefined>();
  const openSlideout = (product: T, config?: Record<string, unknown>) => {
    setSelectedProduct({ ...product! });
    setSlideOutPanelConfig({
      open: true,
      title: displayText[DisplayTextKeys.SLIDE_OUT_WINE_DETAILS_TITLE],
      view: SlideOutPanelViews.PRODUCT_DETAILS,
      timestamp: Date.now(),
      showBackButton: false,
      isDetailsFetched: false,
      ...(config || {}),
    });
  };

  const updateSlideoutConfig = (config: Record<string, unknown>) => {
    setSlideOutPanelConfig({
      ...slideOutPanelConfig,
      ...(config || {}),
    });
  };

  const openSlideoutWithProcessor = (processor: () => Promise<T>) => {
    if (processor)
      processor().then((product) => {
        setSelectedProduct({ ...product! });
        setSlideOutPanelConfig({
          showBackButton: false,
          open: true,
          title: displayText[DisplayTextKeys.SLIDE_OUT_WINE_DETAILS_TITLE],
          view: SlideOutPanelViews.PRODUCT_DETAILS,
          timestamp: Date.now(),
          isDetailsFetched: true,
        });
      });
  };

  const onCloseSortTableByPanel = () => {
    setTmpTableSortOrderBy({ ...sortTableBy });
    setShowSortByOptions(false);
  };
  const onSortTableByChange = (item: DropdownItem) => {
    setTmpTableSortOrderBy({
      ...tmpTableSortOrderBy,
      id: item.id,
      text: item.text!,
    });
  };

  const updateViewDatasource = (sortArg: SortByType, data?: T[], isSearch = false) => {
    if (loading) return;
    let sortedTableData = sortItems<T>(
      data || filteredViewData || products,
      SortDirection.ASCENDING === sortArg.direction,
      sortArg.id as keyof T,
    );

    if (!isSearch) {
      sortedTableData = processSearch(
        sortedTableData,
        searchConfig.props,
        searchQuery,
        searchConfig.uniqueIdRef,
        searchConfig.customFindFn,
      );
    }

    setFilteredViewData(sortedTableData);
  };
  const onApplyTableSortingFilter = () => {
    setSortTableBy({ ...tmpTableSortOrderBy });
    setShowSortByOptions(false);
    updateViewDatasource({ ...tmpTableSortOrderBy }, [...(currentFilters?.data || products)]);
  };
  const toggleSortByVisibility = () => {
    const isShow = !showSortByOptions;
    if (!isShow) onCloseSortTableByPanel();
    else setShowSortByOptions(true);
  };

  const onOpenFiltersTray = () => {
    setSlideOutPanelConfig({
      showBackButton: false,
      open: true,
      title: displayText[DisplayTextKeys.SLIDE_OUT_FILTER_TITLE],
      view: SlideOutPanelViews.FILTERS,
      timestamp: Date.now(),
      isDetailsFetched: false,
    });
  };

  const onClearFilter = () => {
    updateViewDatasource(sortTableBy, [...products]);
    setCurrentFilters({ selections: undefined, data: null });
  };

  const onShowMoreOpen = () => {};
  const onApplyFilter = (filterResults: T[], filters?: Filters) => {
    updateViewDatasource(sortTableBy, [...filterResults]);
    setCurrentFilters({ selections: filters, data: filterResults });
    setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false });
  };

  const openSideoutSidePanel = useCallback(
    (
      sProduct: T,
      timeStamp: number,
      onClose?: () => void,
      setTitle?: (title: string) => void,
      isDetailsFetched = false,
    ) => slideoutContent?.(sProduct, timeStamp, onClose, setTitle, isDetailsFetched),
    [slideoutContent],
  );

  const onSearch = (results: T[], query?: string) => {
    setSearchQuery(query || '');
    updateViewDatasource(sortTableBy, [...results], true);
  };

  useEffect(() => {
    updateViewDatasource(sortTableBy, [...(currentFilters?.data || products)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  useEffect(() => {
    setCurrentTabState({
      id: compId || '',
      sortTableBy,
      searchQuery,
      isCardView,
      isCompact,
      filters: {
        selections: currentFilters?.selections,
        data: filteredViewData || null,
      },
      timestamp: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredViewData]);

  useEffect(() => {
    if (!loading && onFilter) {
      onFilter(currentTabState?.filters?.data || products, currentTabState || null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTabState]);

  useEffect(() => {
    let updatedState = tabState;
    if (!tabState) {
      updatedState = {
        id: compId || '',
        sortTableBy: defaultSortBy || defaultTableSortingOptions(),
        searchQuery: '',
        isCardView: false,
        isCompact: false,
        filters: null,
        timestamp: Date.now(),
      };
    }
    const newSort = updatedState?.sortTableBy || defaultSortBy || defaultTableSortingOptions();
    setSortTableBy(newSort);
    setSearchQuery(updatedState?.searchQuery || '');
    setIsCardView(updatedState?.isCardView || false);
    setIsCompact(updatedState?.isCompact || false);
    setCurrentFilters(updatedState?.filters);
    setTmpTableSortOrderBy(updatedState?.sortTableBy || defaultSortBy || defaultTableSortingOptions());
    updateViewDatasource(newSort, [...(updatedState?.filters?.data || products)]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabState, compId]);

  const numberOfResults = (filteredViewData || []).length;
  return (
    <div></div>
    // <SortAndFilterLayoutContext.Provider
    //   value={{
    //     config: slideOutPanelConfig,
    //     updateSlideoutConfig,
    //     openSlideout,
    //     openSlideoutWithProcessor,
    //     selectedProduct,
    //     cardLayoutConfig: { show: isCardView, isCompact: !showCompactSwitch ? true : isCompact },
    //   }}
    // >
    //   {head && head()}
    //   <>
    //     <div className={`${filterPanelContainerClassName || ''}`.trim()}>
    //       <div
    //         className={`flex items-center ${
    //           products.length === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
    //         }`.trim()}
    //       >
    //         <Dropdown
    //           autoClose={false}
    //           open={showSortByOptions}
    //           value={tmpTableSortOrderBy.id}
    //           valueTemplate={
    //             <div className="flex">
    //               <span className="text-base text-black mr-1">{`${sortTableBy.text}`}</span>
    //               <span className="text-gray-500 flex items-center">{`(${
    //                 displayText[DisplayTextKeys[sortTableBy.direction]]
    //               })`}</span>
    //             </div>
    //           }
    //           onOpen={toggleSortByVisibility}
    //           onItemSelect={onSortTableByChange}
    //           items={sortByOptions}
    //           itemsContainerClassName="h-[250px] overflow-y-auto"
    //           itemClassName="py-5 text-base"
    //           className="flex-1 text-sm sm:text-base whitespace-nowrap p-0 justify-start"
    //           header={
    //             <div className="flex flex-col relative">
    //               <CloseBlackIcon onClick={onCloseSortTableByPanel} className="cursor-pointer absolute right-3 top-3" />
    //               <BitSelector
    //                 title={displayText[DisplayTextKeys.ORDER]}
    //                 leftText={displayText[DisplayTextKeys[SortDirection.ASCENDING]]}
    //                 rightText={displayText[DisplayTextKeys[SortDirection.DESCENDING]]}
    //                 isTrue={tmpTableSortOrderBy.direction === SortDirection.ASCENDING}
    //                 onClick={(isAsc) => {
    //                   setTmpTableSortOrderBy({
    //                     ...tmpTableSortOrderBy,
    //                     direction: isAsc ? SortDirection.ASCENDING : SortDirection.DESCENDING,
    //                   });
    //                 }}
    //               />
    //               <div className="border-t border-t-gray-100 p-3 text-14">{displayText[DisplayTextKeys.SORTBY]} </div>
    //             </div>
    //           }
    //           footer={
    //             <div className="p-5 border-t border-t-100 flex w-full">
    //               <Button
    //                 className={`btn text-14 font-normal bg-orange rounded-full flex-1  text-black`}
    //                 onClick={onApplyTableSortingFilter}
    //                 props={{
    //                   name: 'viewPortfolio',
    //                 }}
    //               >
    //                 {displayText[DisplayTextKeys.APPLY]}
    //               </Button>
    //             </div>
    //           }
    //         />
    //         {!slideOutPanelConfig.open && (
    //           <div
    //             className={`flex-1 flex justify-end items-center ${
    //               products.length === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
    //             }`.trim()}
    //           >
    //             <ExpandingSearch
    //               uniqueIdRef={searchConfig.uniqueIdRef}
    //               placeholder={displayText[DisplayTextKeys.SEARCH_PLACEHOLDER_TEXT]}
    //               data={currentFilters?.data || products}
    //               props={searchConfig.props}
    //               onSearch={onSearch}
    //               query={searchQuery}
    //               customFindFn={searchConfig.customFindFn}
    //               className="focus:bg-white"
    //             />
    //             <div className="relative cursor-pointer" onClick={() => onOpenFiltersTray()}>
    //               <FilterIcon className="ml-[20px]  h-8" />
    //               {currentFilters?.selections && (
    //                 <div className="rounded-full h-3 w-3 bg-orange absolute top-1 -right-1" />
    //               )}
    //             </div>
    //             {moreSelectorTemplate && moreSelectorTemplate()}
    //             {!moreSelectorTemplate && (
    //               <Dropdown
    //                 onOpen={onShowMoreOpen}
    //                 containerClassName="ml-[32px]"
    //                 itemsWrapperClassName="right-0"
    //                 itemClassName="py-5 text-base"
    //                 className="flex-1 text-sm sm:text-base whitespace-nowrap p-0 justify-start h-8"
    //                 header={
    //                   <div className="flex flex-col">
    //                     <BitSelector
    //                       title={displayText[DisplayTextKeys.SHOW_MORE]}
    //                       leftText={displayText[DisplayTextKeys.CARD_VIEW]}
    //                       rightText={displayText[DisplayTextKeys.TABLE_VIEW]}
    //                       isTrue={isCardView}
    //                       onClick={(isViewAsCard) => setIsCardView(isViewAsCard)}
    //                     />
    //                     {showCompactSwitch && (
    //                       <div className="p-3 flex items-center justify-between">
    //                         <div className="flex items-center">
    //                           <CompactIcon className="mr-3" />
    //                           <span className="text-base">{displayText[DisplayTextKeys.SHOW_COMPACT_LIST]}</span>
    //                         </div>

    //                         <Switcher
    //                           checked={isCompact}
    //                           onChange={(val: boolean) => {
    //                             setIsCompact(val);
    //                           }}
    //                           text={displayText[DisplayTextKeys.SHOW_COMPACT_LIST]}
    //                         />
    //                       </div>
    //                     )}
    //                   </div>
    //                 }
    //                 footer={
    //                   <ExportCSV
    //                     csvData={filteredViewData || []}
    //                     fileName={`${moment().format('YYYY-MM-DD HH:mm')}`}
    //                     onPrepareData={(data: T[]) => onExportToXlsx(data, columns)}
    //                   >
    //                     <div className="p-5 flex cursor-pointer items-center">
    //                       <DownloadIcon className="mr-5" />
    //                       <span className="text-base">{displayText[DisplayTextKeys.EXPORT_TO_XLS]}</span>
    //                     </div>
    //                   </ExportCSV>
    //                 }
    //               >
    //                 <ThreeDots className="cursor-pointer h-5 " />
    //               </Dropdown>
    //             )}
    //           </div>
    //         )}
    //       </div>

    //       <div className="flex items-center  text-sm text-black ">
    //         <span>{`${numberOfResults} ${displayText[DisplayTextKeys.RESULTS]}`}</span>
    //         <div className="flex flex-1 justify-end">
    //           <Button
    //             isLink={true}
    //             isDisable={currentFilters?.selections ? false : true}
    //             onClick={onClearFilter}
    //             className={`${currentFilters?.selections ? 'text-black' : 'text-gray-300'}`}
    //           >
    //             {displayText[DisplayTextKeys.CLEAR_FILTER]}
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //     {children}
    //   </>
    //   <SlideOutPanel
    //     showBackButton={slideOutPanelConfig.showBackButton}
    //     onBack={slideOutPanelConfig?.onBack || (() => null)}
    //     headClassName="bg-vine"
    //     isBackgroundDark={true}
    //     title={slideOutPanelConfig.title}
    //     isOpen={slideOutPanelConfig.open}
    //     onClose={() => setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false })}
    //   >
    //     {slideoutContent &&
    //       slideOutPanelConfig.open &&
    //       slideOutPanelConfig.view === SlideOutPanelViews.PRODUCT_DETAILS &&
    //       openSideoutSidePanel(
    //         selectedProduct!,
    //         slideOutPanelConfig.timestamp,
    //         () => setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false }),
    //         (title: string) => setSlideOutPanelConfig({ ...slideOutPanelConfig, title }),
    //         slideOutPanelConfig?.isDetailsFetched || false,
    //       )}

    //     {slideOutPanelConfig.view === SlideOutPanelViews.FILTERS && (
    //       <PDFilters
    //         overrides={filterOverrides}
    //         timestamp={slideOutPanelConfig.timestamp}
    //         datasource={products}
    //         onApplyFilter={onApplyFilter}
    //         filters={currentFilters?.selections}
    //         onClearFilter={onClearFilter}
    //         filterConfigure={filterConfigure}
    //         parentCompId={compId}
    //       />
    //     )}
    //   </SlideOutPanel>
    // </SortAndFilterLayoutContext.Provider>
  );
};

export default SortAndFilterLayout;
