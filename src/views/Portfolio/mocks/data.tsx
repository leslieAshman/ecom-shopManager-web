import { MockedResponse } from '@apollo/client/testing';
import {
  GetCashBalanceQuery,
  GetPortfolioBalancesQuery,
  GetPortfolioCurrentHoldingsQuery,
  GetPortfolioExternalStockQuery,
  GetSoldStocksQuery,
  PortalPortfolioPerformanceOverTimeQuery,
} from '__generated__/graphql';
import { randomUUID } from 'crypto';
import { getRange, pickRandom, randomDate, randomNumberBetween } from '../../../utils';
import { PORTFOLIO_CURRENT_HOLDINGS } from '../components/Details/graphql';
import { GET_EXTERNAL_STOCKS } from '../components/Details/graphql/getExternalStocks';
import { GET_SOLD_STOCKS } from '../components/Details/graphql/getSoldStocks';
import { PORTFOLIO_BALANCES } from '../components/Summary/graphql/getPortfolioBalances';
import { PORTFOLIO_PERFORMANCE_OVER_TIME } from '../components/Summary/graphql/portfolioPerformanceOverTime';
import { PORTFOLIO_CASH_BALANCE } from '../graphql/portfolioCashBalance';

export const portalPortfolioPerformanceOverTime: PortalPortfolioPerformanceOverTimeQuery['portalPortfolioPerformanceOverTime'] =
  [
    {
      date: '2022-07-28',
      currentHoldings: 1000,
      netContributions: 800,
      __typename: 'PortalPerformanceHistoricItem',
    },
    {
      date: '2022-08-28',
      currentHoldings: 1000,
      netContributions: 800,
      __typename: 'PortalPerformanceHistoricItem',
    },
    {
      date: '2022-09-28',
      currentHoldings: 1000,
      netContributions: 800,
      __typename: 'PortalPerformanceHistoricItem',
    },
  ];
export const portalPortfolioBalance: GetPortfolioBalancesQuery['portalPortfolioBalance'] = [
  {
    portfolioName: 'All Profilio ',
    portfolioId: null,
    currentFeeModel: false,
    balance: randomNumberBetween(100, 2000),
    currentHoldings: randomNumberBetween(100, 2000),
    capitalInvested: randomNumberBetween(100, 2000),
    totalMgmtFee: randomNumberBetween(10, 500),
    netProceedsFromSales: randomNumberBetween(50, 1000),
    netPosition: randomNumberBetween(50, 1000),
    netPositionPct: randomNumberBetween(10, 100),
    profitAndLoss: randomNumberBetween(10, 100),
    profitAndLossPct: randomNumberBetween(10, 100),
    balancePending: randomNumberBetween(100, 500),
    totalRefunds: randomNumberBetween(10, 500),
    netContributions: randomNumberBetween(10, 100),
    __typename: 'PortalPortfolioPerformanceItem' as const,
  },
  ...getRange(randomNumberBetween(5, 10)).map((z, i) => ({
    portfolioName: 'Profilio 1',
    currentFeeModel: pickRandom([true, false]),
    portfolioId: i,
    balance: randomNumberBetween(100, 2000),
    currentHoldings: randomNumberBetween(100, 2000),
    capitalInvested: randomNumberBetween(100, 2000),
    totalMgmtFee: randomNumberBetween(10, 500),
    netProceedsFromSales: randomNumberBetween(50, 1000),
    netPosition: randomNumberBetween(50, 1000),
    netPositionPct: randomNumberBetween(10, 100),
    profitAndLoss: randomNumberBetween(10, 100),
    profitAndLossPct: randomNumberBetween(10, 100),
    balancePending: randomNumberBetween(100, 500),
    totalRefunds: randomNumberBetween(10, 500),
    netContributions: randomNumberBetween(10, 100),
    __typename: 'PortalPortfolioPerformanceItem' as const,
  })),
];

const getMockHoldings = () =>
  getRange(randomNumberBetween(5, 20)).map(() => ({
    id: randomUUID(),
    portfolioId: Math.ceil(randomNumberBetween(1, 1000)),
    lwin18: randomUUID(),
    wineName: 'Vieux Château Certan',
    vintage: 2019,
    region: 'Bordeaux',
    cultWinesAllocationRegion: 'Bordeaux',
    dealDate: '2022-06-30',
    dealRef: '4234561',
    dealCCY: 'GBP',
    unit: '6x75cl',
    imageFileName: '',
    unitCount: randomNumberBetween(5, 20),
    qty: randomNumberBetween(1, 10),
    qtyForSale: 0,
    priceForSale: 0,
    costPerUnit: randomNumberBetween(100, 2000),
    totalCost: randomNumberBetween(300, 10000),
    valuePerUnit: randomNumberBetween(100, 900),
    valuePerBottle: randomNumberBetween(100, 900),
    totalValue: randomNumberBetween(300, 10000),
    changedPct: randomNumberBetween(1, 99),
    netPosition: randomNumberBetween(100, 900),
    netPositionPerUnit: randomNumberBetween(100, 500),
    profitAndLoss: randomNumberBetween(100, 900),
    profitAndLossPerUnit: randomNumberBetween(100, 500),
    mgmtFeePerUnit: randomNumberBetween(1, 500),
    totalMgmtFee: randomNumberBetween(1, 300),
    costWithMgmtFeePerUnit: randomNumberBetween(100, 2000),
    totalCostWithMgmtFee: randomNumberBetween(300, 10000),
    historicMarketPrices: getRange(randomNumberBetween(5, 20)).map(() => ({
      date: randomDate('2022-2-1', '2022-12-30'),
      marketPrice: randomNumberBetween(300, 10000),
      __typename: 'HistoricMarketPriceItem' as const,
    })),
    __typename: 'PortalCurrentHoldingItem' as const,
  }));

export function currentHoldingsData(): GetPortfolioCurrentHoldingsQuery['portalCurrentHoldings'] {
  return getMockHoldings();
}

export function soldStocksData(): GetSoldStocksQuery['portalSoldHoldings'] {
  return [
    {
      lwin18: '8',
      wineName: 'Vieux Château Certan',
      vintage: 2019,
      region: 'Bordeaux',
      cultWinesAllocationRegion: 'Bordeaux',
      dealDate: '2022-06-30',
      dealRef: '4234561',
      unit: '6x75cl',
      unitCount: 6,
      qtySold: 2,
      status: 'Processing',
      soldDate: '2022-08-30',
      costPerUnit: 1380,
      totalCost: 2760,
      soldPricePerUnit: 1500,
      totalValue: 3000,
      changedPct: 8.7,
      netPosition: 240,
      netPositionPerUnit: 120,
      profitAndLoss: 220,
      profitAndLossPerUnit: 110,
      mgmtFeePerUnit: 10,
      totalMgmtFee: 20,
      costWithMgmtFeePerUnit: 1390,
      totalCostWithMgmtFee: 2780,
      __typename: 'PortalSoldHoldingItem',
    },
    {
      lwin18: '9',
      wineName: 'Euxvi Château Certan',
      vintage: 2018,
      region: 'Bordeaux',
      cultWinesAllocationRegion: 'Bordeaux',
      dealDate: '2022-06-30',
      dealRef: '4234562',
      unit: '6x75cl',
      unitCount: 6,
      qtySold: 2,
      status: 'Processing',
      soldDate: '2022-08-30',
      costPerUnit: 1380,
      totalCost: 2760,
      soldPricePerUnit: 1500,
      totalValue: 3000,
      changedPct: 8.7,
      netPosition: 240,
      netPositionPerUnit: 120,
      profitAndLoss: 220,
      profitAndLossPerUnit: 110,
      mgmtFeePerUnit: 10,
      totalMgmtFee: 20,
      costWithMgmtFeePerUnit: 1390,
      totalCostWithMgmtFee: 2780,
      __typename: 'PortalSoldHoldingItem',
    },
  ];
}

export function externalStocksData(): GetPortfolioExternalStockQuery['portalExternalHoldings'] {
  return [
    {
      lwin18: '1',
      wineName: 'Unico, Vega Sicilia',
      vintage: 2004,
      region: 'Other',
      cultWinesAllocationRegion: 'Other',
      unit: '6x75cl',
      unitCount: 6,
      qty: 2,
      costPerUnit: 1500,
      totalCost: 1200,
      valuePerUnit: 1582,
      totalValue: 3164,
      changedPct: 5.47,
      netPosition: 164,
      location: 'somewhere',
      cashOffer: 12054,
      createdDate: '2022-08-30',
      __typename: 'PortalExternalHoldingItem',
    },
    {
      lwin18: '2',
      wineName: 'Dominus Estate, C. Moueix',
      vintage: 2010,
      region: 'USA',
      cultWinesAllocationRegion: 'USA',
      unit: '6x75cl',
      unitCount: 6,
      qty: 2,
      costPerUnit: null,
      totalCost: null,
      valuePerUnit: 1500,
      totalValue: 2100,
      changedPct: null,
      netPosition: null,
      location: null,
      cashOffer: 1666685024,
      createdDate: '2022-08-30',
      __typename: 'PortalExternalHoldingItem',
    },
  ];
}

export const portalCurrentHoldings: GetPortfolioCurrentHoldingsQuery['portalCurrentHoldings'] = currentHoldingsData();
export const portalSoldStocks: GetSoldStocksQuery['portalSoldHoldings'] = soldStocksData();
export const portalExternalStocks: GetPortfolioExternalStockQuery['portalExternalHoldings'] = externalStocksData();

export const cashBalance = 123456;
export const todayInvestment = 123444242;
export const portalCashBalanceResponse: MockedResponse<GetCashBalanceQuery> = {
  request: {
    query: PORTFOLIO_CASH_BALANCE,
  },
  result: {
    data: {
      portalCashBalance: {
        __typename: 'PortaBalanceAndInvestmentValues',
        todayInvestment: todayInvestment,
        balances: [
          {
            __typename: 'PortalCashBalanceItem',
            portfolioName: 'All',
            portfolioId: null,
            balance: cashBalance,
          },
        ],
      },
    },
  },
};

export const portfolioBalancesResponse: MockedResponse<GetPortfolioBalancesQuery> = {
  request: {
    query: PORTFOLIO_BALANCES,
  },
  result: {
    data: {
      portalPortfolioBalance: portalPortfolioBalance,
    },
  },
};

export const portalPortfolioPerformanceOverTimeResponse: MockedResponse<PortalPortfolioPerformanceOverTimeQuery> = {
  request: {
    query: PORTFOLIO_PERFORMANCE_OVER_TIME,
  },
  result: {
    data: {
      portalPortfolioPerformanceOverTime: portalPortfolioPerformanceOverTime,
    },
  },
};
export const portalCurrentHoldingsResponse: MockedResponse<GetPortfolioCurrentHoldingsQuery> = {
  request: {
    query: PORTFOLIO_CURRENT_HOLDINGS,
  },
  result: {
    data: {
      portalCurrentHoldings: portalCurrentHoldings,
    },
  },
};
export const portalSoldStocksResponse: MockedResponse<GetSoldStocksQuery> = {
  request: {
    query: GET_SOLD_STOCKS,
  },
  result: {
    data: {
      portalSoldHoldings: portalSoldStocks,
    },
  },
};
export const portalExternalStocksResponse: MockedResponse<GetPortfolioExternalStockQuery> = {
  request: {
    query: GET_EXTERNAL_STOCKS,
  },
  result: {
    data: {
      portalExternalHoldings: portalExternalStocks,
    },
  },
};
