import { FC, ReactNode, useEffect, useState } from 'react';
import Table, { TableColumnType, TableRow } from '../Table';
import { buildTableRow } from '../../views/Portfolio/helpers';
import Loading from '../Loading/loading';
import DetailCard from '../../views/Portfolio/components/Details/CardView';
import ProductSlideout from '../ProductTemplates/components/ProductSlideout';
import SortAndFilterLayout, {
  SortAndFilterLayoutContext,
  SortAndFilterLayoutContextType,
  TabState,
} from '../Layout/SortAndFilterLayout';
import SharedTemplate from '../ProductTemplates/components/MessageTemplate';
import noResultImage from '../../assets/images/no_results_image.png';
import { ApolloError } from '@apollo/client';
import { BaseProduct, Product } from '../../types/productType';
import { useTranslation } from 'react-i18next';
import { SortByOption, SortByType, StockTotal } from '../../views/Portfolio/types';
import { DDFilterItem, FilterTypes } from '../Filters/Filters';

enum NoResultsTextKeys {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
}

const dateFormat = 'DD MMM YYYY';

interface StockTabProps {
  datasource: Product[];
  loading: boolean;
  error: ApolloError | undefined;
  id?: string;
  onStateChange?: (tabState: TabState | null) => void;
  tabState?: TabState | null;
  disableTableClick?: boolean;
  columns?: TableColumnType[];
  sortByOptions?: SortByOption[];
  defaultSortBy?: SortByType;
  refreshTotals?: (tableData: Product[]) => StockTotal[];
  children?: (context: SortAndFilterLayoutContextType | undefined) => ReactNode;
  filterPanelContainerClassName?: string;
  showCompactSwitch?: boolean;
  moreSelectorTemplate?: () => ReactNode;
  filterConfigure?: (filters: DDFilterItem[]) => DDFilterItem[];
  filterOverrides?: Partial<Record<FilterTypes, unknown>>;
}

const StockTab: FC<StockTabProps> = ({
  datasource,
  loading,
  error,
  id,
  onStateChange,
  tabState,
  disableTableClick = false,
  columns,
  sortByOptions,
  defaultSortBy,
  refreshTotals,
  children,
  filterPanelContainerClassName,
  showCompactSwitch = false,
  moreSelectorTemplate = null,
  filterConfigure,
  filterOverrides,
}) => {
  const { t } = useTranslation();
  const [filteredTableData, setFilteredTableData] = useState(datasource);
  const [viewState, setViewState] = useState({
    columns: columns,
    source: null,
    rows: null,
    headings: [] as StockTotal[],
  });

  const onTableRowClick = (row: TableRow, openSlideout?: SortAndFilterLayoutContextType['openSlideout']) => {
    const newProduct = datasource.find((x: BaseProduct) => `${x.id}` === row.id);
    if (openSlideout) openSlideout(newProduct!);
  };

  const buildTableRows = (dataSet: Product[]) => {
    return (dataSet || []).map((report) => {
      return {
        ...buildTableRow({ ...report }, columns || [], `${report.id}`, 'divide-x-0'),
      };
    });
  };

  const updateViewState = (key: string, data: unknown) => {
    setViewState((vs) => ({
      ...vs,
      [key]: data,
    }));
  };

  const refreshBalances = (tableData: Product[]) => {
    let results = [] as StockTotal[];
    if (refreshTotals) results = refreshTotals(tableData);
    updateViewState('headings', [...results]);
  };

  const onFilter = (filteredData: Product[], newTabState?: TabState | null) => {
    if (onStateChange) onStateChange(newTabState || null);
    setFilteredTableData(filteredData);
    updateViewState('rows', buildTableRows(filteredData));
    refreshBalances(filteredData);
  };

  useEffect(() => {
    updateViewState('source', datasource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasource]);

  const errorText = error ? error.message : null;
  return (
    <>
      <SortAndFilterLayout
        filterPanelContainerClassName={filterPanelContainerClassName}
        tabState={tabState}
        compId={id}
        showCompactSwitch={showCompactSwitch}
        moreSelectorTemplate={moreSelectorTemplate}
        onFilter={onFilter}
        loading={!viewState.source || loading}
        columns={columns}
        filterConfigure={filterConfigure}
        sortByOptions={sortByOptions}
        products={viewState.source || []}
        defaultSortBy={defaultSortBy}
        filterOverrides={filterOverrides}
        slideoutContent={(
          productSelected: Product,
          timestamp: number,
          onClose?: () => void,
          setTitle?: (title: string) => void,
          isDetailsFetched?: boolean,
        ) => (
          <ProductSlideout
            isDetailsFetched={isDetailsFetched}
            setTitle={setTitle}
            product={productSelected}
            timestamp={timestamp}
            onClose={onClose}
          />
        )}
      >
        <SortAndFilterLayoutContext.Consumer>
          {(context) => {
            return children ? (
              <>{children(context)}</>
            ) : (
              <div className="flex flex-1 p-5 w-full h-full flex-col">
                <div className="flex flex-wrap p-[24px] bg-white rounded-t-md">
                  {!loading &&
                    viewState.rows &&
                    (viewState.rows as TableRow[]).length > 0 &&
                    viewState.headings.map((heading, index) => {
                      return (
                        <div className="flex flex-col mr-[56px] mb-5" key={`${heading.title}-${index}`}>
                          <span className="text-sm sm:text-14 mb-[4px]">{heading.title}</span>
                          <span
                            className="text-md flex items-end "
                            style={{ color: heading.color ? heading.color : 'black' }}
                          >
                            {`${heading.text}`}{' '}
                            <span className="text-14 ml-1">{`${
                              heading.additionalText ? `${heading.additionalText}` : ''
                            }`}</span>
                          </span>
                        </div>
                      );
                    })}
                </div>

                <div className="justify-center items-center bg-white rounded-b-md flex-1 h-full">
                  {errorText && <div>{errorText}</div>}
                  {!errorText && (
                    <>
                      {loading || !viewState.source ? (
                        <Loading />
                      ) : !viewState.rows ? null : (viewState.rows as TableRow[]).length === 0 ? (
                        <div className="animate-[fade-in_5s_ease-out]">
                          <SharedTemplate
                            showButton={false}
                            displayTextKeys={NoResultsTextKeys}
                            translationKey="common:noResult"
                            imageSrc={noResultImage}
                            title={() => (
                              <div className="flex items-center gap-3">
                                <span className="text-20 font-medium ">{t('common:noResult.title')}</span>
                              </div>
                            )}
                          />
                        </div>
                      ) : context?.cardLayoutConfig?.show ? (
                        <DetailCard
                          tableRows={viewState.rows || []}
                          dateFormat={dateFormat}
                          filteredItems={filteredTableData}
                          isCompact={context?.cardLayoutConfig?.isCompact}
                          onItemClick={(row) =>
                            disableTableClick ? null : onTableRowClick(row as TableRow, context!.openSlideout)
                          }
                        />
                      ) : (
                        <Table
                          columns={viewState.columns || []}
                          rows={viewState.rows || []}
                          onTableEvent={(row) =>
                            disableTableClick ? null : onTableRowClick(row as TableRow, context!.openSlideout)
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          }}
        </SortAndFilterLayoutContext.Consumer>
      </SortAndFilterLayout>
    </>
  );
};

export default StockTab;
