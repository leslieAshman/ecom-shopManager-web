import moment from 'moment';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoIcon } from '../../../../assets/icons';
import { Button, Dropdown } from '../../../../components';
import { InvesCurrentHoldingsVsCapitalInvested } from '../../../../components/Charts';
import { HoldingVsInvestedSeries } from '../../../../components/Charts/CurrentHoldingsVsCapitalInvested';
import { DropdownItem } from '../../../../components/Dropdown';
import Loading from '../../../../components/Loading/loading';
import { getPortfolioDropdownOptions, getPortfolioInfo } from '../../../../helpers';
import { Alignment, PortfolioBalance, PortfolioBalanceInfo } from '../../../../types/DomainTypes';
import { buildDisplayText } from '../../../../utils';
import { getHoldingsVsInvestedChartDatasource } from '../../helpers';
import { usePortfolioCurrentAllocation } from '../../hooks/usePortfolioCurrentAllocation';
import {
  usePortfolioPerformanceOverTime,
  UsePortfolioPerformanceOverTimeResponse,
} from './hooks/usePortfolioPerformanceOverTime';
import { PortfolioType, ViewKeys } from '../../types';
import Allocation from '../Allocation';
import ToolTip from '../../../../components/Tooltip';
import { useFlags } from 'launchdarkly-react-client-sdk';
import AnnualisedReturn from '../AnnualisedReturn';
import { AppContext } from '../../../../context/ContextProvider';

const ddlConfig = {
  itemsWrapperClassName: 'min-w-[300px] overflow-x-hidden',
  itemWrapperStyle: { width: '100%' },
  containerClassName: 'w-full flex-1',
  itemsContainerClassName: 'h-[300px] overflow-y-auto w-full',
  itemClassName: 'text-base flex flex-1',
  className: 'flex-1 text-sm sm:text-14 text-black  whitespace-nowrap p-0 justify-start border-b border-b-gray-400',
};

const seriesColors = ['#28515C', '#FF906D'];
enum DisplayTextKeysEnum {
  TITLE = 'portfolio:title',
  CURRENTLY_UNAVAILABLE = 'common:currentlyUnavailable',
  VIEW_PORTFOLIO_BUTTON = 'portfolio:viewPortfolioButton',
  PORTFOLIO_FILTER_TEXT = 'portfolio:filterPortfolioText',
  PORTFOLIO_FILTER_PLACEHOLDER_TEXT = 'portfolio:filterPortfolioPlaceHolderText',
  TEXT_PORTFOLIO_BALANCE = 'texts.portfolioBalance',
  NET_CONTRIBUTIONS_TEXT = 'texts.netContributions',
  CURRENT_HOLDINGS_TEXT = 'texts.currentHoldings',
  TEXT_VIEW_DETAILS = 'texts.viewDetails',
  TEXT_ALL_TIME = 'texts.all_time',

  PORTFOLIO_VALUATION_TOOLTIP = 'texts.portfolioValuation_tooltip',
}

const DisplayTextKeys = {
  ...DisplayTextKeysEnum,
  ...PortfolioBalanceInfo,
};

interface SummaryProps {
  onViewChange: (viewKey: ViewKeys, selectedOptionId: string) => void;
  portfolios: PortfolioType[];
  currentPortfolio: string;
  loadingBalances: boolean;
}

const filterPeriod = (
  datasource: UsePortfolioPerformanceOverTimeResponse['portfolioPerformanceOverTime'],
  periodInMonths = 0,
): UsePortfolioPerformanceOverTimeResponse['portfolioPerformanceOverTime'] => {
  if (periodInMonths === -1) return datasource;
  const today = moment();
  const endDate = today.subtract(1, 'months').endOf('month');
  const startDate =
    periodInMonths === 0
      ? moment(`${today.year() - 1}-12-31`)
      : moment(endDate).subtract(periodInMonths, 'months').endOf('month');
  //find date between startDate and endDate inclusive of endDate

  const filteredData = datasource.filter(
    (x) => moment(x.date, 'YYYY-MM-DD').isBetween(startDate, endDate) || moment(x.date, 'YYYY-MM-DD').isSame(endDate),
  );

  return filteredData;
};

const Summary: FC<SummaryProps> = ({ onViewChange, portfolios, currentPortfolio, loadingBalances }) => {
  const { t } = useTranslation();
  const { deployAnnualizedReturnFeature } = useFlags();
  const {
    state: { settings: language },
  } = useContext(AppContext);
  const [selectedChartPeriod, setSelctedChartPeriod] = useState(-1);
  const [selectedPortfolioBalance, setSelectedPortfolioBalance] = useState(currentPortfolio);
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'portfolio:summary', t), [t]);
  const {
    portfolioPerformanceOverTime,
    loading,
    refetch: refreshPreformanceOverTime,
  } = usePortfolioPerformanceOverTime(undefined);
  const { regionPerformances, allocations, loading: loadingAllocations } = usePortfolioCurrentAllocation();
  const [holdlingVsInvestSeries, setHoldingsVsInvestedSeries] = useState<HoldingVsInvestedSeries[]>([]);

  const portfolioDropdownOptions = useMemo(() => {
    setSelectedPortfolioBalance(portfolios[0]?.shopId);
    return getPortfolioDropdownOptions(portfolios);
  }, [portfolios]);

  const chartPeriods = useMemo(
    () => [
      {
        id: 0,
        displayText: 'YTD',
      },
      {
        id: 3,
        displayText: '3M',
      },
      {
        id: 6,
        displayText: '6M',
      },
      {
        id: 12,
        displayText: '1Y',
      },
      {
        id: 36,
        displayText: '3Y',
      },
      {
        id: 60,
        displayText: '5Y',
      },
      {
        id: -1,
        displayText: displayText[DisplayTextKeys.TEXT_ALL_TIME],
      },
    ],
    [displayText],
  );
  const onViewPortfolio = (viewId: ViewKeys, filterOption: string) => {
    if (onViewChange) onViewChange(viewId, filterOption);
  };

  const onChartPeriodChange = (btnId: number) => {
    setSelctedChartPeriod(btnId);
  };
  const onViewDetails = () => {
    onViewPortfolio(ViewKeys.DETIALS, selectedPortfolioBalance);
  };
  const onPortfolioChange = (item: DropdownItem) => {
    refreshPreformanceOverTime({
      portfolioId: item.value === '' ? undefined : Number(item.value),
    });
    setSelectedPortfolioBalance(item.value);
  };
  const selectedPortfolioInfo = useMemo(
    () => getPortfolioInfo(portfolios, displayText, selectedPortfolioBalance, seriesColors),
    [portfolios, selectedPortfolioBalance, displayText],
  );

  useEffect(() => {
    const chartData = getHoldingsVsInvestedChartDatasource(
      filterPeriod(portfolioPerformanceOverTime, selectedChartPeriod),
    );

    setHoldingsVsInvestedSeries([
      {
        id: 'currentHoldings',
        name: `${displayText[DisplayTextKeys.CURRENT_HOLDINGS_TEXT]}`,
        color: seriesColors[0],
        data: chartData.currentHoldings,
        toolTipKey: 'currentHoldings_graph_tooltip',
      },
      {
        id: 'netContributions',
        name: `${displayText[DisplayTextKeys.NET_CONTRIBUTIONS_TEXT]}`,
        color: seriesColors[1],
        data: chartData.netContributions,
        toolTipKey: 'netContributions_graph_tooltip',
      },
    ]);
  }, [selectedChartPeriod, portfolioPerformanceOverTime, displayText, language]);

  console.log('PortfolioDropdownOptions', portfolioDropdownOptions);
  return (
    <div className=" w-full h-full px-5">
      <div className="flex items-center relative justify-end h-[80px] ">
        <Button
          className={`btn text-14 font-normal bg-orange rounded-full   text-black`}
          onClick={() => onViewPortfolio(ViewKeys.DETIALS, selectedPortfolioBalance)}
          props={{
            name: 'viewPortfolio',
          }}
        >
          {displayText[DisplayTextKeys.VIEW_PORTFOLIO_BUTTON]}
        </Button>
      </div>
      <div className="flex flex-col-reverse  w-full sm:flex-row py-3 gap-3  ">
        <div className="bg-gray-50 rounded-md shadow-md flex flex-col p-[16px] ">
          <div className="flex justify-between">
            <span className="text-base">{displayText[DisplayTextKeys.TEXT_PORTFOLIO_BALANCE]}</span>
            <Button isLink={true} className="text-sm" onClick={onViewDetails}>
              {displayText[DisplayTextKeys.TEXT_VIEW_DETAILS]}
            </Button>
          </div>
          {loadingBalances && <Loading />}
          {!loadingBalances && (
            <div className="flex flex-col min-w-[301px] mt-[16px] gap-[6px]">
              {selectedPortfolioInfo.info &&
                selectedPortfolioInfo.info.length > 0 &&
                selectedPortfolioInfo.info.map((pBal, index) => {
                  return (
                    <div
                      key={`portfolio-balance-${index}`}
                      className="flex flex-1 border border-gray-100   rounded-[8px] shadow-md"
                    >
                      <div className="w-[4px] rounded-l-[8px]" style={{ background: pBal.color || 'white' }}></div>
                      <div className="w-full flex bg-white items-center pr-3">
                        <div className=" flex flex-col py-[8px] gap-[4px] px-2 flex-1  pb-5">
                          <span className="text-sm">{pBal.title}</span>
                          {pBal.body()}
                        </div>
                        {pBal.tooltipKey && (
                          <ToolTip
                            align={Alignment.RIGHT}
                            tooltip={
                              <div className="bg-white border border-gray-300 w-[200px] text-sm p-2">
                                {t(`portfolio:summary.texts.${pBal.tooltipKey}`)}
                              </div>
                            }
                          >
                            <InfoIcon className="cursor-pointer w-5" />
                          </ToolTip>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col rounded-md bg-gray-50 pb-5 shadow-md">
            {loading ? (
              <Loading />
            ) : (
              <InvesCurrentHoldingsVsCapitalInvested
                header={() => {
                  return (
                    <div className="flex flex-wrap justify-center  p-5 pt-[24px] w-full gap-3">
                      {holdlingVsInvestSeries.map((series, index) => {
                        return (
                          <div key={`${series.name}-${index}`} className="flex  items-center ">
                            <div
                              className="rounded-md w-[37px] h-[30px] mr-1"
                              style={{ background: series.color }}
                            ></div>
                            <span className="text-sm">{series.name}</span>
                            <ToolTip
                              align={Alignment[index === 0 ? 'CENTER' : 'RIGHT']}
                              tooltip={
                                <div className="bg-white border border-gray-300 w-[200px] text-sm p-2">
                                  {t(`portfolio:summary.texts.${series.toolTipKey}`)}
                                </div>
                              }
                            >
                              <InfoIcon className="cursor-pointer w-5" />
                            </ToolTip>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
                footer={() => (
                  <div className="flex w-full px-3 sm:px-7 py-1 mt-[10px]  items-center justify-between ">
                    {chartPeriods.map((btn) => (
                      <Button
                        isLink={true}
                        onClick={() => onChartPeriodChange(btn.id)}
                        className={`cursor-pointer text-sm sm:text-14 h-[28px] whitespace-nowrap pt-0 pb-0 text-gray-7 no-underline border border-gray-300  rounded-md px-3 ${
                          selectedChartPeriod === btn.id ? 'bg-vine  text-white' : 'text-gray-700 '
                        }`.trim()}
                        key={`${btn.id}`}
                      >
                        {btn.displayText}
                      </Button>
                    ))}
                  </div>
                )}
                series={holdlingVsInvestSeries}
              />
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 bg-gray-50  border border-[#F5F5F5]  mt-[40px] space-y-3 sm:space-x-3 sm:space-y-0">
        <div className=" flex-1 p-sm h-full rounded-md">
          {loadingAllocations ? (
            <Loading />
          ) : (
            <Allocation regionPerformances={regionPerformances} allocations={allocations} />
          )}
        </div>

        {deployAnnualizedReturnFeature && (
          <div className="flex-1 flex flex-col p-3 h-full  ">
            <AnnualisedReturn selectedPortfolioId={selectedPortfolioBalance} />
          </div>
        )}
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default Summary;
