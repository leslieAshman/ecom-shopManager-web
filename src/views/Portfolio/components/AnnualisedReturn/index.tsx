import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '../../../../components';
import { DropdownItem } from '../../../../components/Dropdown';
import Table, { CellTypeEnum, TableCell, TableColumnType, TableRow } from '../../../../components/Table';
import { buildDisplayText, roundNumber, toChartXYPoint, capitalizeFirstLetter } from '../../../../utils';
import Loading from '../../../../components/Loading/loading';
import { logError } from '../../../../components/LogError';
import { PChart } from '../../../../components/Charts';
import DataPointTooltip from '../../../../components/Charts/DataPointTooltip';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import { buildTableRow } from '../../helpers';
import { PORTFOLIO_ANNUALISED_RETURN } from './graphql';
import { useLazyExecuteQuery } from '../../../hooks/useLazyExecuteQuery';

import { SeriesOptionsType } from 'highcharts';
import ToolTip from '../../../../components/Tooltip';
import { InfoIcon } from '../../../../assets/icons';
import { Alignment } from '../../../../types/DomainTypes';

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum DATA_TESTID {
  CONTAINER = 'portfolio-annualised-return-container',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
enum DATA_REFS {
  DATE = 'date',
  VALUE = 'value',
}

const cellClassName = 'text-center text-14 text-black';

enum DisplayTextKeys {
  CHART_TITLE = 'chartTitle',
  PORTFOLIO_FILTER_PLACEHOLDER_TEXT = 'portfolio:filterPortfolioPlaceHolderText',
  TABLE_HEADING_YTD = 'table_heading_ytd',
  TABLE_HEADING_RETURNS = 'table_heading_return',
}
enum ChartPeriod {
  MONTHLY = 'monthly',
  YEARS = 'years',
}

interface AReturnItem {
  date: string;
  value: number;
}

interface AnnualizedReturnResult {
  portalPortfolioAnnualisedReturn: {
    years: AReturnItem[];
    monthly: AReturnItem[];
  };
}

const AnnualisedReturn = ({ selectedPortfolioId = '' }: { selectedPortfolioId?: string }) => {
  const { t } = useTranslation();
  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'portfolio:annualisedReturn', t),
    [t],
  );
  const [rows, setRows] = useState<TableRow[]>([]);
  const [selectedChartPeriod, setSelectedChartPeriod] = useState(ChartPeriod.MONTHLY);
  const {
    executor: fetchData,
    loading,
    error,
    data: annualiseReturnData,
  } = useLazyExecuteQuery(PORTFOLIO_ANNUALISED_RETURN);

  const columns: TableColumnType[] = useMemo(
    () => [
      {
        dataRef: DATA_REFS.DATE,
        text: t(`portfolio:annualisedReturn.${DisplayTextKeys.TABLE_HEADING_YTD}`),
        cellType: CellTypeEnum.TH,
        cellClassName: 'text-14 text-black whitespace-nowrap flex-1',
        className: 'px-5',
      },
      {
        dataRef: DATA_REFS.VALUE,
        className: 'text-center',
        text: t(`portfolio:annualisedReturn.${DisplayTextKeys.TABLE_HEADING_RETURNS}`), //displayText[DisplayTextKeys.TABLE_HEADING_RETURNS],
        cellClassName,
        cellContentTemplate: (cell: TableCell) => <span>{`${roundNumber(Number(cell.text))}%`}</span>,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const chartPeriods = useMemo(() => {
    return Object.values(ChartPeriod).map((x) => {
      return {
        id: x,
        value: x as ChartPeriod,
        content: (
          <div className="flex justify-between text-base">
            <span>{`${capitalizeFirstLetter(x)}`}</span>
          </div>
        ),
      };
    });
  }, []);

  const onChartPeriodChange = (item: DropdownItem) => {
    setSelectedChartPeriod(item.value as ChartPeriod);
  };

  const [chartConfig, setChartConfig] = useState<Highcharts.Options>({
    chart: {
      backgroundColor: '#FFFFFF',
    },

    legend: {
      enabled: false,
    },
    title: {
      text: '',
    },
    yAxis: {
      title: {
        text: '',
      },
      labels: {
        enabled: true,
      },
      tickColor: '#fff',
      tickWidth: 0.1,
      gridLineColor: '#e6e6e6',
      gridLineDashStyle: 'ShortDashDot',
    },

    tooltip: {
      useHTML: true,
      borderColor: 'none',
      borderRadius: 8,
      backgroundColor: '#fff',

      formatter() {
        return renderToString(
          <DataPointTooltip
            contentTemplate={(x, y) => {
              return (
                <div className="flex flex-col text-xs justify-center items-center ">
                  <span className="uppercase">{displayText[DisplayTextKeys.CHART_TITLE]}</span>
                  <span>{moment(new Date(x)).format('DD MMM YYYY').toUpperCase()}</span>
                  <span>{`${y}%`}</span>
                </div>
              );
            }}
            x={this.x as string}
            y={`${this.y}`}
          />,
        );
      },
    },

    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          //  const label = this.axis.defaultLabelFormatter.call(this);
          return `${moment(this.value).year()}`;
        },
      },
    },

    series: [],
  });

  const getARSeries = (datasource: AReturnItem[], color = '#1D4854') => {
    let minDate = moment();
    const chartData = toChartXYPoint(datasource, 'date', 'value', false).map((point) => {
      const dateObj = moment(point.x);
      minDate = moment.min([dateObj, minDate]);
      return { ...point, x: dateObj.toDate().getTime() } as { x: number; y: number };
    });

    return {
      type: 'column',
      color,
      data: chartData,
      pointStart: minDate.year(),
    } as SeriesOptionsType;
  };

  useEffect(() => {
    fetchData({
      variables: {
        portfolioId: 3,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData({
      variables: {
        portfolioId: selectedPortfolioId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPortfolioId]);

  useEffect(() => {
    if (annualiseReturnData) {
      const datasource = (annualiseReturnData as AnnualizedReturnResult).portalPortfolioAnnualisedReturn;
      if (datasource) {
        // datasource = {
        //   years: datasource.years.map((x) => ({
        //     ...x,
        //     value: randomNumberBetween(-100, 100),
        //   })),
        //   monthly: datasource.monthly.map((x) => ({
        //     ...x,
        //     value: randomNumberBetween(-100, 100),
        //   })),
        // };
        setRows((datasource.years || []).map((report) => buildTableRow({ ...report }, columns)));
        const positiveData = datasource[selectedChartPeriod].filter((x) => x.value >= 0);
        const negtiveData = datasource[selectedChartPeriod].filter((x) => x.value < 0);
        setChartConfig({
          ...chartConfig,
          plotOptions: {
            series: {
              opacity: 1,
              lineWidth: 1,
              marker: {
                radius: 1,
              },
              // pointStart: minDate.year(),
            },
          },
          xAxis: {
            ...chartConfig.xAxis,
            // tickInterval: 1000 * 3600 * 24 * 365,
            units: [['year', [1]]],
          },
          series: [getARSeries(positiveData), getARSeries(negtiveData, '#FF906D')],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annualiseReturnData, selectedChartPeriod]);

  if (error) logError(error!.message);

  return (
    <div data-testid={DATA_TESTID.CONTAINER}>
      {error && <div>{error!.message}</div>}
      <div className="flex flex-row w-full items-center ">
        <div className="text-2 mb-3 flex flex-1 flex-row items-center">
          <span className="pr-3">{displayText[DisplayTextKeys.CHART_TITLE]}</span>
          <ToolTip
            align={Alignment.LEFT}
            tooltip={<div className="bg-white border border-gray-300 w-[200px] text-sm p-2"></div>}
          >
            <InfoIcon className="cursor-pointer w-5" />
          </ToolTip>
        </div>
        <div className="">
          <Dropdown
            value={selectedChartPeriod}
            valueText={capitalizeFirstLetter(selectedChartPeriod)}
            onItemSelect={onChartPeriodChange}
            items={chartPeriods}
            iconClassName="text-white"
            itemClassName="py-5 text-base w-[150px] cursor-pointer"
            style={{ fill: 'white' }}
            className="flex-1 bg-vine rounded-full text-14 py-3 px-3 flex justify-between text-white w-fit mb-5 mt-3"
          />
        </div>
      </div>

      {!error && (
        <>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className=" p-3 shadow-md rounded-md">
                <PChart config={chartConfig} />
              </div>
              <Table className="mt-5 mb-5" columns={columns} rows={rows} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AnnualisedReturn;
