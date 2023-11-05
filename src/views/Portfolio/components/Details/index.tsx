import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '../../../../components';
import { TabState } from '../../../../components/Layout/SortAndFilterLayout';
import { TabType } from '../../../../components/Tabs';
import { DATA_REFS, Product } from '../../../../types/productType';
import { capitalizeFirstLetter, sumBy, toInternalId, uniqueItems } from '../../../../utils';
import { initialiseCurrentTab, initialiseExternalTab, initialiseSoldTab } from '../../helpers';
import { SortByOption } from '../../types';
import StockTab from '../../../../components/StockTab';
import { DDFilterItem, FilterTypes } from '../../../../components/Filters/Filters';
import { AppContext } from '../../../../context/ContextProvider';
import { useExecuteQuery } from '../../../hooks/useExecuteQuery';
import { PORTFOLIO_CURRENT_HOLDINGS } from './graphql';
import { GET_SOLD_STOCKS } from './graphql/getSoldStocks';
import { GET_EXTERNAL_STOCKS } from './graphql/getExternalStocks';
import { AssetType, AssetTypeExtended } from 'views/MyCellar/components/types';
enum TabTypes {
  CURRENT = 'current',
  SOLD = 'sold',
  EXTERNAL = 'external',
}

const notApplicable = 'N/A';
const Details = () => {
  const { t } = useTranslation();
  const {
    formatter: currencyFormatter,
    state: {
      settings: { currency },
    },
  } = useContext(AppContext);

  const formatter = useMemo(
    () => ({ format: (value: number) => currencyFormatter.format(value, true) }),
    [currencyFormatter],
  );
  const [tabStates, setTabStates] = useState({
    [TabTypes.CURRENT]: null,
    [TabTypes.SOLD]: null,
    [TabTypes.EXTERNAL]: null,
  });
  const currentTabState = useRef<TabState<AssetType> | null>(null);
  const [selectedTab, setSelectedTab] = useState(TabTypes.CURRENT);
  const {
    columns,
    sortByOptions,
    defaultSortBy: currentDefaultSortBy,
  } = useMemo(() => initialiseCurrentTab(t, formatter), [t, formatter]);
  const {
    columns: soldStockColumns,
    sortByOptions: soldSortByOptions,
    defaultSortBy: soldDefaultSortBy,
  } = useMemo(() => initialiseSoldTab(t, formatter), [t, formatter]);
  const {
    columns: externaltockColumns,
    sortByOptions: externalSortByOptions,
    defaultSortBy: externalDefaultSortBy,
  } = useMemo(() => initialiseExternalTab(t, formatter), [t, formatter]);
  const onStateChange = (state: TabState<AssetType> | null) => {
    currentTabState.current = state;
  };

  const onTabSelect = (tab: TabType) => {
    setSelectedTab(tab.value as TabTypes);
    setTabStates({ ...tabStates, [currentTabState.current?.id as TabTypes]: currentTabState.current });
  };

  const {
    results: currentHoldings,
    loading: loadingCurrent,
    error: currentError,
    refetch: reFetchCurrentHoldings,
  } = useExecuteQuery('portalCurrentHoldings', PORTFOLIO_CURRENT_HOLDINGS);
  const {
    results: soldStocks,
    loading: loadingSoldStocks,
    error: soldStockError,
    refetch: reFetchSoldStock,
  } = useExecuteQuery('portalSoldHoldings', GET_SOLD_STOCKS);
  const {
    results: externalStocks,
    loading: loadingExternal,
    error: externalError,
    refetch: reFetchExternalStock,
  } = useExecuteQuery('portalExternalHoldings', GET_EXTERNAL_STOCKS);

  const refreshCurrentStocksTotals = (tableData: Product[]) => {
    const totalHoldings = sumBy(tableData, 'totalValue');
    const totalPurchase = sumBy(tableData, 'totalCost');
    const totalMgmtFee = sumBy(tableData, 'totalMgmtFee');
    const totalCostWithMgmtFee = sumBy(tableData, 'totalCostWithMgmtFee');
    const totalProfitAndLoss = totalHoldings - totalPurchase;
    const totalPAndLPercent = (totalProfitAndLoss / totalPurchase) * 100;
    const totalPAndLWithFees = totalHoldings - totalCostWithMgmtFee;
    const totalPAndLWithFeesPAndL = (totalPAndLWithFees / totalPurchase) * 100;
    return [
      {
        title: t('portfolio:titles.details_totals.current-holdings'),
        value: totalHoldings,
        text: `${formatter.format(totalHoldings)}`,
      },
      {
        title: t('portfolio:titles.details_totals.total-purchase-price'),
        value: totalPurchase,
        text: `${formatter.format(totalPurchase)}`,
      },
      {
        title: t('portfolio:titles.details_totals.total-upfront-fees'),
        value: totalMgmtFee,
        text: `${formatter.format(totalMgmtFee)}`,
      },
      {
        title: t('portfolio:titles.details_totals.total-profit-loss'),
        value: totalProfitAndLoss,
        text: `${formatter.format(totalProfitAndLoss)}`,
        additionalText: ` (${totalPAndLPercent.toFixed(2)}%)`,
        color: totalProfitAndLoss > 0 ? '#68CA5D' : '#FF5C5C',
      },
      {
        title: t('portfolio:titles.details_totals.total-profit-loss-including-fees'),
        value: totalPAndLWithFees,
        text: `${formatter.format(totalPAndLWithFees)}`,
        additionalText: ` (${totalPAndLWithFeesPAndL.toFixed(2)}%)`,
        color: totalPAndLWithFees > 0 ? '#68CA5D' : '#FF5C5C',
      },
    ];
  };

  const refreshSoldStocksTotals = (tableData: Product[]) => {
    const totalHoldings = sumBy(tableData, 'totalValue');
    const totalPurchase = sumBy(tableData, 'totalCost');
    const totalMgmtFee = sumBy(tableData, 'totalMgmtFee');
    const totalCostWithMgmtFee = sumBy(tableData, 'totalCostWithMgmtFee');
    const totalProfitAndLoss = totalHoldings - totalPurchase;
    const totalPAndLPercent = (totalProfitAndLoss / totalPurchase) * 100;
    const totalPAndLWithFees = totalHoldings - totalCostWithMgmtFee;
    const totalPAndLWithFeesPAndL = (totalPAndLWithFees / totalPurchase) * 100;
    return [
      {
        title: t('portfolio:titles.details_totals.total-sold-value'),
        value: totalHoldings,
        text: `${formatter.format(totalHoldings)}`,
      },
      {
        title: t('portfolio:titles.details_totals.total-purchase-price'),
        value: totalPurchase,
        text: `${formatter.format(totalPurchase)}`,
      },
      {
        title: t('portfolio:titles.details_totals.total-upfront-fees'),
        value: totalMgmtFee,
        text: `${formatter.format(totalMgmtFee)}`,
      },
      {
        title: t('portfolio:titles.details_totals.total-profit-loss'),
        value: totalProfitAndLoss,
        text: `${formatter.format(totalProfitAndLoss)}`,
        additionalText: ` (${totalPAndLPercent.toFixed(2)}%)`,
        color: totalProfitAndLoss > 0 ? '#68CA5D' : '#FF5C5C',
      },
      {
        title: t('portfolio:titles.details_totals.total-profit-loss-including-fees'),
        value: totalPAndLWithFees,
        text: `${formatter.format(totalPAndLWithFees)}`,
        additionalText: ` (${totalPAndLWithFeesPAndL.toFixed(2)}%)`,
        color: totalPAndLWithFees > 0 ? '#68CA5D' : '#FF5C5C',
      },
    ];
  };

  const refreshExternalStocksTotals = (tableData: Product[]) => {
    const totalHoldings = sumBy(tableData, 'totalValue');
    const unknownTotalCost = tableData.find((x) => !x.totalCost);
    let totalPurchase = null;
    let totalProfitAndLoss = 0;
    let totalPAndLPercent = 0;
    if (!unknownTotalCost) {
      totalPurchase = sumBy(tableData, 'totalCost');
      totalProfitAndLoss = totalHoldings - totalPurchase;
      totalPAndLPercent = (totalProfitAndLoss / totalPurchase) * 100;
    }
    return [
      {
        title: t('portfolio:titles.details_totals.total-current-value'),
        value: totalHoldings,
        text: `${formatter.format(totalHoldings)}`,
      },
      {
        title: t('portfolio:titles.details_totals.total-purchase-price'),
        value: totalPurchase || 0,
        text: !totalPurchase ? notApplicable : `${formatter.format(totalPurchase || 0)}`,
      },
      {
        title: t('portfolio:titles.details_totals.total-profit-loss'),
        value: totalProfitAndLoss,
        text: !totalPurchase ? notApplicable : `${formatter.format(totalProfitAndLoss)}`,
        additionalText: !totalPurchase ? '' : ` (${totalPAndLPercent.toFixed(2)}%)`,
        color: !totalPurchase ? '' : totalProfitAndLoss > 0 ? '#68CA5D' : '#FF5C5C',
      },
    ];
  };

  const tabs = useMemo(
    () => [
      {
        id: TabTypes.CURRENT,
        value: TabTypes.CURRENT,
        title: <span className="text-14">{capitalizeFirstLetter(t(`portfolio:${TabTypes.CURRENT}`))}</span>,
        content: () => (
          <StockTab
            refreshTotals={refreshCurrentStocksTotals as any}
            showCompactSwitch={true}
            columns={columns}
            sortByOptions={sortByOptions as SortByOption[]}
            defaultSortBy={currentDefaultSortBy}
            tabState={tabStates[selectedTab]}
            filterPanelContainerClassName="px-5"
            id={TabTypes.CURRENT}
            datasource={(currentHoldings as AssetTypeExtended[]).map((x) => ({
              ...x,
              id: x.id,
              unit: Number(x.units),
              // [DATA_REFS.SANITIZED_WINE_NAME]: x[DATA_REFS.NAME].normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            }))}
            onStateChange={onStateChange}
            loading={loadingCurrent}
            error={currentError}
          />
        ),
      },
      {
        id: TabTypes.SOLD,
        value: TabTypes.SOLD,
        title: <span className="text-14">{capitalizeFirstLetter(t(`portfolio:${TabTypes.SOLD}`))}</span>,
        content: () => (
          <StockTab
            refreshTotals={refreshSoldStocksTotals as any}
            columns={soldStockColumns}
            sortByOptions={soldSortByOptions}
            defaultSortBy={soldDefaultSortBy}
            disableTableClick={true}
            tabState={tabStates[selectedTab]}
            id={TabTypes.SOLD}
            filterOverrides={{
              [FilterTypes.STATUES]: {
                source: [t('portfolio:filters.processing'), t('portfolio:filters.sold')],
                filterFn: (data: AssetTypeExtended[], ids: string[]) => {
                  let statusesFilterResult: AssetTypeExtended[] = [];
                  uniqueItems(data.map((x) => x.id)).forEach((status) => {
                    if (ids.includes(toInternalId(status!))) {
                      statusesFilterResult = [
                        ...statusesFilterResult,
                        ...data.filter((x) => x.id?.toLowerCase() === status?.toLowerCase()),
                      ];
                    }
                  });
                  return statusesFilterResult;
                },
              },
            }}
            filterPanelContainerClassName="px-5"
            datasource={(soldStocks as AssetTypeExtended[]).map((x, i) => ({
              ...x,
              unit: Number(x.units),
              lwin18: `${i + 1}`,
              // [DATA_REFS.SANITIZED_WINE_NAME]: x[DATA_REFS.NAME].normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            }))}
            onStateChange={onStateChange}
            loading={loadingSoldStocks}
            error={soldStockError}
          />
        ),
      },
      {
        id: TabTypes.EXTERNAL,
        value: TabTypes.EXTERNAL,
        title: <span className="text-14">{capitalizeFirstLetter(t(`portfolio:${TabTypes.EXTERNAL}`))}</span>,
        content: () => (
          <StockTab
            refreshTotals={refreshExternalStocksTotals as any}
            columns={externaltockColumns}
            sortByOptions={externalSortByOptions}
            defaultSortBy={externalDefaultSortBy}
            disableTableClick={true}
            tabState={tabStates[selectedTab]}
            onStateChange={onStateChange}
            filterConfigure={(filters: DDFilterItem[]) => {
              return filters.filter((x) => x.type !== FilterTypes.STATUES);
            }}
            filterPanelContainerClassName="px-5"
            id={TabTypes.EXTERNAL}
            datasource={(externalStocks as AssetTypeExtended[]).map((x) => ({
              ...x,
              unit: Number(x.units),
              // [DATA_REFS.SANITIZED_WINE_NAME]: x[DATA_REFS.NAME].normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            }))}
            loading={loadingExternal}
            error={externalError}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      t,
      currentHoldings,
      loadingCurrent,
      currentError,
      soldStocks,
      loadingSoldStocks,
      soldStockError,
      externalStocks,
      loadingExternal,
      externalError,
      selectedTab,
    ],
  );

  useEffect(() => {
    reFetchCurrentHoldings();
    reFetchSoldStock();
    reFetchExternalStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <div className="h-100 flex-1 bg-gray-100 flex overflow-y-auto flex-col">
      <Tabs className="pb-5" items={tabs} onItemSelect={onTabSelect} value={selectedTab}></Tabs>
    </div>
  );
};

export default Details;
