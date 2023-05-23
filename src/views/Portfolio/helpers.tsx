import { CellTypeEnum, TableCell, TableColumnType, TableRow } from '../../components/Table';
import {
  AccountIcon,
  CellarIcon,
  TrendingIcon,
  DiscoverIcon,
  InvestIcon,
  TagIcon,
  ProfitIcon,
  LossIcon,
  ContactsIcon,
} from '../../assets/icons';
import { PerformanceOverTime, CurrentAllocation } from './types';
import { ChartDataPoint, NavigationPath, SortDirection } from '../../types/DomainTypes';
import { TFunction } from 'react-i18next';
import { SideBarItemType } from '../shared/types';
import { DATA_REFS, Product, Region } from '../../types/productType';
import { getRegions } from '../../helpers';
import { ReactNode } from 'react';
import moment from 'moment';
import { roundNumber, toInternalId } from '../../utils';
import { CurrencyFormater } from '../../types/commonTypes';
import { NavigateFunction } from 'react-router-dom';
import { AccountViewType, SubjectOptionKeys } from '../Accounts/types';

export const buildTableRow = (
  dataRow: Record<string, unknown>,
  columns: TableColumnType[],
  id?: string,
  className?: string,
): TableRow => {
  const cells = columns.map((col: TableColumnType) => {
    return {
      dataRef: col.dataRef,
      isVisible: col.isVisible,
      text: dataRow[col.dataRef] as string,
      className: col.cellClassName || '',
      type: col.cellType || CellTypeEnum.TD,
      cellContentTemplate: col.cellContentTemplate,
    };
  });

  return {
    id,
    className: className || '',
    cells,
    rowData: dataRow,
  };
};
const notApplicable = 'N/A';

type PerformanceOverTimeChart = {
  netContributions: ChartDataPoint[];
  currentHoldings: ChartDataPoint[];
};
export const getHoldingsVsInvestedChartDatasource = (dataPoints: PerformanceOverTime[]): PerformanceOverTimeChart => {
  const netContributions: PerformanceOverTimeChart['netContributions'] = [],
    currentHoldings: PerformanceOverTimeChart['currentHoldings'] = [];
  dataPoints.forEach((dataPoint) => {
    // total refunds and net contributions
    netContributions.push({
      x: new Date(dataPoint.date).getTime(),
      y: dataPoint.netContributions,
      data: { ...dataPoint },
    });

    //Portfolio valuation, Pending Balance, Net proceeds from sales
    currentHoldings.push({
      x: new Date(dataPoint.date).getTime(),
      y: dataPoint.currentHoldings,
      data: { ...dataPoint },
    });
  });

  return { netContributions, currentHoldings };
};

export const getSidebarIcons = (t: TFunction, navigate: NavigateFunction): SideBarItemType[] => [
  {
    title: t('common:portfolio'),
    icon: <TrendingIcon />,
    value: NavigationPath.PORTFOLIO,
  },
  {
    title: t('common:invest'),
    icon: <InvestIcon />,
    value: NavigationPath.INVEST,
  },
  {
    title: t('common:cellar'),
    icon: <CellarIcon />,
    value: NavigationPath.MY_CELLAR,
  },
  {
    title: t('common:discover'),
    icon: <DiscoverIcon />,
    value: NavigationPath.DISCOVER,
  },
  {
    title: t('common:accounts'),
    icon: <AccountIcon />,
    value: NavigationPath.ACCOUNTS,
    onClick: () =>
      navigate(`${NavigationPath.ACCOUNTS}`, {
        state: { accountViewType: AccountViewType.OVERVIEW },
      }),
  },
  {
    title: t('common:contact'),
    icon: <ContactsIcon />,
    value: NavigationPath.CONTACT_US,
    onClick: () =>
      navigate(`${NavigationPath.ACCOUNTS}`, {
        state: { accountViewType: AccountViewType.CONTACT_US, subject: SubjectOptionKeys.GENERAL },
      }),
  },
];

export const buildAllocationsDisplaySource = (allocations: CurrentAllocation[]) => {
  const regions: Region[] = getRegions();
  return allocations.map((allocation) => {
    const {
      regionName,
      currentAllocation: current,
      tacticalAllocation: tactical,
      StrategicAllocation: strategic,
    } = allocation;
    const mapping = {
      region: regionName.toLowerCase(),
      current,
      tactical,
      strategic,
    };
    return { ...mapping, color: regions.find((z) => z.id === mapping.region)?.color };
  });
};
const getSortableOptions = (columns: TableColumnType[]) => {
  return columns
    .filter((x) => {
      const isVisible = x.isVisible === true || x.isVisible === undefined;
      return (x.isSortable === undefined && isVisible) || x.isSortable;
    })
    .map((col) => ({
      id: col.dataRef,
      value: col.dataRef,
      text: col.text,
      content: <span>{col.text}</span>,
    }));
};
const regionColors = getRegions();
// eslint-disable-next-line @typescript-eslint/naming-convention
const cellClassName = 'text-center text-14 text-black cursor-pointer';
const dateFormat = 'DD MMM YYYY';
export const initialiseCurrentTab = (translation: TFunction, formatter: CurrencyFormater) => {
  const PORTFOLIO_DETIALS_TEXTS = {
    [DATA_REFS.NAME]: translation(`portfolio:table.headers.${DATA_REFS.NAME}`),
    [DATA_REFS.DEAL_DATE]: translation(`portfolio:table.headers.${DATA_REFS.DEAL_DATE}`),
    [DATA_REFS.UNIT]: translation(`portfolio:table.headers.${DATA_REFS.UNIT}`),
    [DATA_REFS.QUANTITY]: translation(`portfolio:table.headers.${DATA_REFS.QUANTITY}`),
    [DATA_REFS.COST_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.COST_PER_UNIT}`),
    [DATA_REFS.TOTAL_COST]: translation(`portfolio:table.headers.${DATA_REFS.TOTAL_COST}`),
    [DATA_REFS.VALUE_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.VALUE_PER_UNIT}`),
    [DATA_REFS.TOTAL_VALUE]: translation(`portfolio:table.headers.${DATA_REFS.TOTAL_VALUE}`),
    [DATA_REFS.COST_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.COST_PER_UNIT}`),
    [DATA_REFS.PERCENT_CHANGE]: translation(`portfolio:table.headers.${DATA_REFS.PERCENT_CHANGE}`),
    [DATA_REFS.PROFIT_LOSS]: translation(`portfolio:table.headers.${DATA_REFS.PROFIT_LOSS}`),
    [DATA_REFS.REGION]: translation(`portfolio:table.headers.${DATA_REFS.REGION}`),
  };

  const columns: TableColumnType[] = [
    {
      dataRef: DATA_REFS.NAME,
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.NAME],
      className: 'px-3',
      exportFn: (value: string | number, x) => `${x?.vintage} ${value}`,
      cellType: CellTypeEnum.TH,
      cellClassName: 'text-14 font-normal text-black whitespace-nowrap flex-1 cursor-pointer border-r border-gray-200 ',
      cellContentTemplate: (cell: TableCell, t: TFunction, rowData: TableRow['rowData']): ReactNode => {
        const rowInfo = rowData as unknown as Product;
        return (
          <div className="flex items-center ">
            <div
              style={{
                backgroundColor: regionColors.find(
                  (x) => x.id === toInternalId(`${rowData!.cultWinesAllocationRegion}`),
                )?.color,
              }}
              className={`w-[8px] h-[60px] mr-3 -mt-3 -mb-3`}
            />

            <div className="flex  flex-1 justify-between">
              <>
                <div className="flex-1 flex pr-3">{`${rowInfo.vintage} ${cell.text} `}</div>
                {rowInfo.qtyForSale > 0 && (
                  <div className=" px-3 py-1 flex items-center text-xs">
                    <TagIcon />
                    <span> {`x${rowInfo.qtyForSale}`}</span>
                  </div>
                )}
              </>
            </div>
          </div>
        );
      },
    },
    {
      dataRef: DATA_REFS.DEAL_DATE,
      className: 'text-center ',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.DEAL_DATE],
      cellClassName,
      exportFn: (value: string | number) => `${moment(value).format(dateFormat)}`,
      cellContentTemplate: (cell: TableCell) => (
        <span className="whitespace-nowrap pl-1">{`${moment(cell.text).format(dateFormat)}`}</span>
      ),
    },
    {
      dataRef: DATA_REFS.UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.UNIT],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.QUANTITY,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.QUANTITY],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.COST_PER_UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.COST_PER_UNIT],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.TOTAL_COST,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.TOTAL_COST],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.VALUE_PER_UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.VALUE_PER_UNIT],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.TOTAL_VALUE,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.TOTAL_VALUE],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.PERCENT_CHANGE,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.PERCENT_CHANGE],
      cellClassName,
      exportFn: (value: string | number) => `${roundNumber(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${roundNumber(Number(cell.text))}%`}</span>,
    },
    {
      dataRef: DATA_REFS.PROFIT_LOSS,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.PROFIT_LOSS],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => {
        const pl = Number(cell.text);
        return (
          <div className="flex  gap-2 items-center justify-end">
            <span className="whitespace-nowrap">{`${formatter.format(pl)}`}</span>
            <div className="w-[12px]">
              {pl > 0 && <ProfitIcon />}
              {pl < 0 && <LossIcon />}
            </div>
          </div>
        );
      },
    },
    {
      dataRef: DATA_REFS.VINTAGE,
      text: DATA_REFS.VINTAGE,
      isVisible: false,
      isExportable: true,
    },
    {
      dataRef: DATA_REFS.SANITIZED_WINE_NAME,
      text: DATA_REFS.SANITIZED_WINE_NAME,
      isVisible: false,
    },
    {
      dataRef: DATA_REFS.REGION,
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.REGION],
      isVisible: false,
      isSortable: true,
    },
  ];

  const sortByOptions = getSortableOptions(columns);
  const defaultSortBy = () => {
    const { id, text } = sortByOptions.find((x) => x.id === DATA_REFS.DEAL_DATE)!;
    return {
      id,
      text,
      direction: SortDirection.ASCENDING,
    };
  };

  return {
    PORTFOLIO_DETIALS_TEXTS,
    columns,
    sortByOptions,
    defaultSortBy: defaultSortBy(),
  };
};

export const initialiseSoldTab = (translation: TFunction, formatter: CurrencyFormater) => {
  const PORTFOLIO_DETIALS_TEXTS = {
    [DATA_REFS.NAME]: translation(`portfolio:table.headers.${DATA_REFS.NAME}`),
    [DATA_REFS.DEAL_DATE]: translation(`portfolio:table.headers.${DATA_REFS.DEAL_DATE}`),
    [DATA_REFS.UNIT]: translation(`portfolio:table.headers.${DATA_REFS.UNIT}`),
    [DATA_REFS.QTY_SOLD]: translation(`portfolio:table.headers.${DATA_REFS.QTY_SOLD}`),
    [DATA_REFS.SOLD_DATE]: translation(`portfolio:table.headers.${DATA_REFS.SOLD_DATE}`),
    [DATA_REFS.COST_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.COST_PER_UNIT}`),
    [DATA_REFS.TOTAL_COST]: translation(`portfolio:table.headers.${DATA_REFS.TOTAL_COST}`),
    [DATA_REFS.TOTAL_VALUE]: translation(`portfolio:table.headers.${DATA_REFS.TOTAL_VALUE}`),
    [DATA_REFS.COST_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.COST_PER_UNIT}`),
    [DATA_REFS.SOLD_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.SOLD_PER_UNIT}`),
    [DATA_REFS.PERCENT_CHANGE]: translation(`portfolio:table.headers.${DATA_REFS.PERCENT_CHANGE}`),
    [DATA_REFS.PROFIT_LOSS]: translation(`portfolio:table.headers.${DATA_REFS.PROFIT_LOSS}`),
    [DATA_REFS.REGION]: translation(`portfolio:table.headers.${DATA_REFS.REGION}`),
    [DATA_REFS.STATUS]: translation(`portfolio:table.headers.${DATA_REFS.STATUS}`),
  };

  const columns: TableColumnType[] = [
    {
      dataRef: DATA_REFS.NAME,
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.NAME],
      className: 'px-3',
      cellType: CellTypeEnum.TH,
      cellClassName: 'text-14 font-normal text-black whitespace-nowrap flex-1 cursor-pointer border-r border-gray-200 ',
      exportFn: (value: string | number, x) => `${x?.vintage} ${value}`,
      cellContentTemplate: (cell: TableCell, t: TFunction, rowData: TableRow['rowData']): ReactNode => {
        const rowInfo = rowData as unknown as Product;
        return (
          <div className="flex items-center ">
            <div
              style={{
                backgroundColor: regionColors.find(
                  (x) => x.id === toInternalId(`${rowData?.cultWinesAllocationRegion}`),
                )?.color,
              }}
              className={`w-[8px] h-[60px] mr-3 -mt-3 -mb-3`}
            />

            <div className="flex  flex-1 justify-between">
              <>
                <div className="flex-1 flex pr-3 ">{`${rowInfo.vintage} ${cell.text} `}</div>
                {rowInfo.qtyForSale > 0 && (
                  <div className=" px-3 py-1 flex items-center text-xs">
                    <TagIcon />
                    <span> {`x${rowInfo.qtyForSale}`}</span>
                  </div>
                )}
              </>
            </div>
          </div>
        );
      },
    },
    {
      dataRef: DATA_REFS.DEAL_DATE,
      className: 'text-center ',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.DEAL_DATE],
      cellClassName,
      exportFn: (value: string | number) => `${moment(value).format(dateFormat)}`,
      cellContentTemplate: (cell: TableCell) => (
        <span className="whitespace-nowrap pl-1">{`${moment(cell.text).format(dateFormat)}`}</span>
      ),
    },
    {
      dataRef: DATA_REFS.UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.UNIT],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.QTY_SOLD,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.QTY_SOLD],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.SOLD_DATE,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.SOLD_DATE],
      cellClassName,
      exportFn: (value: string | number) => `${moment(value).format(dateFormat)}`,
      cellContentTemplate: (cell: TableCell) => (
        <span className="whitespace-nowrap">{`${moment(cell.text).format(dateFormat)}`}</span>
      ),
    },

    {
      dataRef: DATA_REFS.COST_PER_UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.COST_PER_UNIT],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.TOTAL_COST,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.TOTAL_COST],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.SOLD_PER_UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.SOLD_PER_UNIT],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.TOTAL_VALUE,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.TOTAL_VALUE],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.PERCENT_CHANGE,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.PERCENT_CHANGE],
      cellClassName,
      exportFn: (value: string | number) => `${roundNumber(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${roundNumber(Number(cell.text))}%`}</span>,
    },
    {
      dataRef: DATA_REFS.PROFIT_LOSS,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.PROFIT_LOSS],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => {
        const pl = Number(cell.text);
        return (
          <div className="flex  gap-2 items-center justify-end">
            <span>{`${formatter.format(pl)}`}</span>
            <div className="w-[12px]">
              {pl > 0 && <ProfitIcon />}
              {pl < 0 && <LossIcon />}
            </div>
          </div>
        );
      },
    },
    {
      dataRef: DATA_REFS.STATUS,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.STATUS],
      cellClassName,
      cellContentTemplate: (cell: TableCell) => (
        <div className=" flex justify-center">
          <div className="flex w-fit  justify-center items-center px-3 rounded-full text-xs bg-[#FEF4EE] h-[20px]">
            <div className="w-[4px] h-[4px] rounded-full bg-[#F09555] mr-2"></div>
            {cell.text}
          </div>
        </div>
      ),
    },
    {
      dataRef: DATA_REFS.VINTAGE,
      text: DATA_REFS.VINTAGE,
      isVisible: false,
      isExportable: true,
    },
    {
      dataRef: DATA_REFS.REGION,
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.REGION],
      isVisible: false,
      isSortable: true,
    },
  ];

  const sortByOptions = getSortableOptions(columns);
  const defaultSortBy = () => {
    const { id, text } = sortByOptions.find((x) => x.id === DATA_REFS.DEAL_DATE)!;
    return {
      id,
      text,
      direction: SortDirection.ASCENDING,
    };
  };

  return {
    PORTFOLIO_DETIALS_TEXTS,
    columns,
    sortByOptions,
    defaultSortBy: defaultSortBy(),
  };
};

export const initialiseExternalTab = (translation: TFunction, formatter: CurrencyFormater) => {
  const PORTFOLIO_DETIALS_TEXTS = {
    [DATA_REFS.NAME]: translation(`portfolio:table.headers.${DATA_REFS.NAME}`),
    [DATA_REFS.LOCATION]: translation(`portfolio:table.headers.${DATA_REFS.LOCATION}`),
    [DATA_REFS.CASH_OFFER]: translation(`portfolio:table.headers.${DATA_REFS.CASH_OFFER}`),
    [DATA_REFS.DEAL_DATE]: translation(`portfolio:table.headers.${DATA_REFS.DEAL_DATE}`),
    [DATA_REFS.UNIT]: translation(`portfolio:table.headers.${DATA_REFS.UNIT}`),
    [DATA_REFS.QUANTITY]: translation(`portfolio:table.headers.${DATA_REFS.QUANTITY}`),
    [DATA_REFS.COST_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.COST_PER_UNIT}`),
    [DATA_REFS.TOTAL_COST]: translation(`portfolio:table.headers.${DATA_REFS.TOTAL_COST}`),
    [DATA_REFS.VALUE_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.VALUE_PER_UNIT}`),
    [DATA_REFS.TOTAL_VALUE]: translation(`portfolio:table.headers.${DATA_REFS.TOTAL_VALUE}`),
    [DATA_REFS.COST_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.COST_PER_UNIT}`),
    [DATA_REFS.PERCENT_CHANGE]: translation(`portfolio:table.headers.${DATA_REFS.PERCENT_CHANGE}`),
    [DATA_REFS.PROFIT_LOSS]: translation(`portfolio:table.headers.${DATA_REFS.PROFIT_LOSS}`),
    [DATA_REFS.REGION]: translation(`portfolio:table.headers.${DATA_REFS.REGION}`),
  };

  const columns: TableColumnType[] = [
    {
      dataRef: DATA_REFS.NAME,
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.NAME],
      className: 'px-3',
      cellType: CellTypeEnum.TH,
      cellClassName: 'text-14 font-normal text-black whitespace-nowrap flex-1 cursor-pointer border-r border-gray-200 ',
      exportFn: (value: string | number, x) => `${x?.vintage} ${value}`,
      cellContentTemplate: (cell: TableCell, t: TFunction, rowData: TableRow['rowData']): ReactNode => {
        const rowInfo = rowData as unknown as Product;
        return (
          <div className="flex items-center ">
            <div
              style={{
                backgroundColor: regionColors.find(
                  (x) => x.id === toInternalId(`${rowData!.cultWinesAllocationRegion}`),
                )?.color,
              }}
              className={`w-[8px] h-[60px] mr-3 -mt-3 -mb-3`}
            />

            <div className="flex  flex-1 justify-between">
              <>
                <div className="flex-1 flex ">{`${rowInfo.vintage} ${cell.text} `}</div>
                {rowInfo.qtyForSale > 0 && (
                  <div className=" px-3 py-1 flex items-center text-xs">
                    <TagIcon />
                    <span> {`x${rowInfo.qtyForSale}`}</span>
                  </div>
                )}
              </>
            </div>
          </div>
        );
      },
    },

    {
      dataRef: DATA_REFS.UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.UNIT],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.QUANTITY,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.QUANTITY],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.LOCATION,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.LOCATION],
      cellClassName,
      exportFn: (value: string | number) => `${value || notApplicable}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${cell.text || notApplicable}`}</span>,
    },
    {
      dataRef: DATA_REFS.COST_PER_UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.COST_PER_UNIT],
      cellClassName,
      exportFn: (value: string | number) => `${value ? formatter.format(Number(value)) : notApplicable} `,
      cellContentTemplate: (cell: TableCell) => (
        <span>{`${cell.text ? formatter.format(Number(cell.text)) : notApplicable} `}</span>
      ),
    },

    {
      dataRef: DATA_REFS.TOTAL_COST,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.TOTAL_COST],
      cellClassName,
      exportFn: (value: string | number) => `${value ? formatter.format(Number(value)) : notApplicable} `,
      cellContentTemplate: (cell: TableCell) => (
        <span>{`${cell.text ? formatter.format(Number(cell.text)) : notApplicable}`}</span>
      ),
    },
    {
      dataRef: DATA_REFS.VALUE_PER_UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.VALUE_PER_UNIT],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: DATA_REFS.TOTAL_VALUE,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.TOTAL_VALUE],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },

    {
      dataRef: DATA_REFS.CASH_OFFER,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.CASH_OFFER],
      cellClassName,
      exportFn: (value: string | number) => `${formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },

    {
      dataRef: DATA_REFS.PERCENT_CHANGE,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.PERCENT_CHANGE],
      cellClassName,
      exportFn: (value: string | number) => (value ? `${roundNumber(Number(value))}` : notApplicable),
      cellContentTemplate: (cell: TableCell) => (
        <span>{cell.text ? `${roundNumber(Number(cell.text))}%` : notApplicable}</span>
      ),
    },
    {
      dataRef: DATA_REFS.NET_POSITION,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.PROFIT_LOSS],
      cellClassName,
      exportFn: (value: string | number) => `${!value ? notApplicable : formatter.format(Number(value))}`,
      cellContentTemplate: (cell: TableCell) => {
        if (!cell.text) return <span>{`${notApplicable}`}</span>;
        const pl = Number(cell.text);
        return (
          <div className="flex  gap-2 items-center justify-end">
            <span>{`${formatter.format(pl)}`}</span>
            <div className="w-[12px]">
              {pl > 0 && <ProfitIcon />}
              {pl < 0 && <LossIcon />}
            </div>
          </div>
        );
      },
    },

    {
      dataRef: DATA_REFS.VINTAGE,
      text: DATA_REFS.VINTAGE,
      isVisible: false,
      isExportable: true,
    },
    {
      dataRef: DATA_REFS.REGION,
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.REGION],
      isVisible: false,
      isSortable: true,
    },
  ];

  const sortByOptions = getSortableOptions(columns);

  const defaultSortBy = () => {
    const { id, text } = sortByOptions.find((x) => x.id === DATA_REFS.NAME)!;
    return {
      id,
      text,
      direction: SortDirection.ASCENDING,
    };
  };

  return {
    PORTFOLIO_DETIALS_TEXTS,
    columns,
    sortByOptions,
    defaultSortBy: defaultSortBy(),
  };
};

export const initialiseMyCellarExportColumns = (translation: TFunction) => {
  const PORTFOLIO_DETIALS_TEXTS = {
    [DATA_REFS.NAME]: translation(`portfolio:table.headers.${DATA_REFS.NAME}`),
    [DATA_REFS.DEAL_DATE]: translation(`portfolio:table.headers.${DATA_REFS.DEAL_DATE}`),
    [DATA_REFS.UNIT]: translation(`portfolio:table.headers.${DATA_REFS.UNIT}`),
    [DATA_REFS.QUANTITY]: translation(`portfolio:table.headers.${DATA_REFS.QUANTITY}`),
    [DATA_REFS.COST_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.COST_PER_UNIT}`),
    [DATA_REFS.TOTAL_COST]: translation(`portfolio:table.headers.${DATA_REFS.TOTAL_COST}`),
    [DATA_REFS.VALUE_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.VALUE_PER_UNIT}`),
    [DATA_REFS.TOTAL_VALUE]: translation(`portfolio:table.headers.${DATA_REFS.TOTAL_VALUE}`),
    [DATA_REFS.COST_PER_UNIT]: translation(`portfolio:table.headers.${DATA_REFS.COST_PER_UNIT}`),
    [DATA_REFS.PERCENT_CHANGE]: translation(`portfolio:table.headers.${DATA_REFS.PERCENT_CHANGE}`),
    [DATA_REFS.PROFIT_LOSS]: translation(`portfolio:table.headers.${DATA_REFS.PROFIT_LOSS}`),
    [DATA_REFS.REGION]: translation(`portfolio:table.headers.${DATA_REFS.REGION}`),
    [DATA_REFS.STATUS]: translation(`portfolio:table.headers.${DATA_REFS.STATUS}`),
    [DATA_REFS.LOCATION]: translation(`portfolio:table.headers.${DATA_REFS.LOCATION}`),
    [DATA_REFS.ROTATION_NUMBER]: translation(`portfolio:table.headers.${DATA_REFS.ROTATION_NUMBER}`),
  };

  const columns: TableColumnType[] = [
    {
      dataRef: DATA_REFS.NAME,
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.NAME],
      className: 'px-3',
      cellType: CellTypeEnum.TH,
      cellClassName: 'text-14 text-black whitespace-nowrap flex-1 cursor-pointer border-r border-gray-200 ',
      cellContentTemplate: (cell: TableCell, t: TFunction, rowData: TableRow['rowData']): ReactNode => {
        const rowInfo = rowData as unknown as Product;
        return (
          <div className="flex items-center ">
            <div
              style={{
                backgroundColor: regionColors.find(
                  (x) => x.id === toInternalId(`${rowData!.cultWinesAllocationRegion}`),
                )?.color,
              }}
              className={`w-[8px] h-[60px] mr-3 -mt-3 -mb-3`}
            />

            <div className="flex  flex-1 justify-between">
              <>
                <div className="flex-1 flex ">{`${rowInfo.vintage} ${cell.text} `}</div>
                {rowInfo.qtyForSale > 0 && (
                  <div className=" px-3 py-1 flex items-center text-xs">
                    <TagIcon />
                    <span> {`x${rowInfo.qtyForSale}`}</span>
                  </div>
                )}
              </>
            </div>
          </div>
        );
      },
    },
    {
      dataRef: DATA_REFS.REGION,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.REGION],
      cellClassName,
      isSortable: false,
    },
    {
      dataRef: DATA_REFS.DEAL_DATE,
      className: 'text-center ',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.DEAL_DATE],
      cellClassName,
      cellContentTemplate: (cell: TableCell) => <span>{`${moment(cell.text).format(dateFormat)}`}</span>,
    },
    {
      dataRef: DATA_REFS.UNIT,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.UNIT],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.QUANTITY,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.QUANTITY],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.LOCATION,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.LOCATION],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.ROTATION_NUMBER,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.ROTATION_NUMBER],
      cellClassName,
    },
    {
      dataRef: DATA_REFS.STATUS,
      className: 'text-center',
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.STATUS],
      cellClassName,
      cellContentTemplate: (cell: TableCell) => (
        <div className=" flex justify-center">
          <div className="flex w-fit  justify-center items-center px-3 rounded-full text-xs bg-[#FEF4EE] h-[20px]">
            <div className="w-[4px] h-[4px] rounded-full bg-[#F09555] mr-2"></div>
            {cell.text}
          </div>
        </div>
      ),
    },

    {
      dataRef: DATA_REFS.VINTAGE,
      text: DATA_REFS.VINTAGE,
      isVisible: false,
    },
    {
      dataRef: DATA_REFS.CULT_WINES_ALLOCATION_REGION,
      text: PORTFOLIO_DETIALS_TEXTS[DATA_REFS.REGION],
      isVisible: false,
      isSortable: true,
    },
  ];

  const sortByOptions = getSortableOptions(columns);
  const defaultSortBy = () => {
    const { id, text } = sortByOptions.find((x) => x.id === DATA_REFS.NAME)!;
    return {
      id,
      text,
      direction: SortDirection.ASCENDING,
    };
  };

  return {
    PORTFOLIO_DETIALS_TEXTS,
    columns,
    sortByOptions,
    defaultSortBy: defaultSortBy(),
  };
};
