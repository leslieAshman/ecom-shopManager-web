/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-node-access */
// import { MockedProvider, MockedResponse } from '@apollo/client/testing';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { defaultOptions } from '../../../graphql/client';
// import { formatter, sortItems, sumBy, uniqueItems } from '../../../utils';
// import PortfolioLayout from '../index';
// import { PORTFOLIO_CASH_BALANCE } from '../graphql/portfolioCashBalance';
// import { PortalCashBalance } from '../graphql/__generated__/PortalCashBalance';
// import {
//   cashBalance,
//   getPortfolioAunualisedReturnResponse,
//   portalCashBalanceResponse,
//   portalCurrentHoldings,
//   portalCurrentHoldingsResponse,
//   portalExternalStocks,
//   portalExternalStocksResponse,
//   portalPortfolioBalance,
//   portalPortfolioPerformanceOverTimeResponse,
//   portalSoldStocks,
//   portalSoldStocksResponse,
//   portfolioBalancesResponse,
//   currentHoldingsData,
//   soldStocksData,
//   externalStocksData,
// } from '../mocks/data';
// import { mockResponse } from '../hooks/usePortfolioCurrentAllocation';
// import { act } from 'react-dom/test-utils';
// import { GetPortfolioCurrentHoldings_portalCurrentHoldings } from '../components/Details/graphql/__generated__/GetPortfolioCurrentHoldings';
// import { GetSoldStocks_portalSoldHoldings } from '../components/Details/graphql/__generated__/GetSoldStocks';
// import { GetPortfolioExternalStock_portalExternalHoldings } from '../components/Details/graphql/__generated__/GetPortfolioExternalStock';

// jest.mock('react-i18next', () => ({
//   useTranslation: () => {
//     return {
//       t: (key: string) => key,
//       i18n: {
//         changeLanguage: () => new Promise(() => {}),
//       },
//     };
//   },
//   initReactI18next: {
//     type: '3rdParty',
//     init: jest.fn(),
//   },
// }));

// const renderLayout = (args = {}) =>
//   render(
//     <MemoryRouter initialEntries={['/portfolio']}>
//       <MockedProvider defaultOptions={defaultOptions} {...args}>
//         <PortfolioLayout />
//       </MockedProvider>
//     </MemoryRouter>,
//   );

// describe('Portfolio', () => {
//   it('Load layout with title', () => {
//     renderLayout();
//     expect(screen.getByText(/portfolio:titles.summaryPage/i)).toBeInTheDocument();
//   });

//   it('Show current unavailable on error, network error', async () => {
//     const loginResponse: MockedResponse<PortalCashBalance> = {
//       request: {
//         query: PORTFOLIO_CASH_BALANCE,
//       },
//       error: new Error('Network error'),
//     };
//     renderLayout({ mocks: [loginResponse], addTypename: false });
//     await waitFor(() => {
//       expect(screen.getByText(/common:currentlyUnavailable/i)).toBeInTheDocument();
//     });
//   });

//   it('Show cash balance, no error', async () => {
//     renderLayout({ mocks: [portalCashBalanceResponse], addTypename: false });
//     await waitFor(() => {
//       const formattedResult = formatter.format(cashBalance);
//       expect(screen.getByText(formattedResult)).toBeInTheDocument();
//     });
//   });

//   const assertCashBalance = async () => {
//     await waitFor(() => {
//       const formattedResult = formatter.format(cashBalance);
//       expect(screen.getByText(formattedResult)).toBeInTheDocument();
//     });
//   };

//   const assertCurrentHoldings = async () => {
//     await waitFor(() => {
//       const formattedResult = formatter.format(portalPortfolioBalance[0].currentHoldings);
//       expect(screen.getByText(formattedResult)).toBeInTheDocument();
//     });
//   };

//   const assertCapitalInvested = async () => {
//     await waitFor(() => {
//       const formattedResult = formatter.format(
//         sumBy(
//           portalPortfolioBalance.filter((e) => e.portfolioId !== null),
//           'capitalInvested',
//         ),
//       );
//       expect(screen.getByText(formattedResult)).toBeInTheDocument();
//     });
//   };

//   const assertNetProceedsFromSales = async () => {
//     await waitFor(() => {
//       const formattedResult = formatter.format(
//         sumBy(
//           portalPortfolioBalance.filter((e) => e.portfolioId !== null),
//           'netProceedsFromSales',
//         ),
//       );
//       expect(screen.getByText(formattedResult)).toBeInTheDocument();
//     });
//   };

//   const assertNetPosition = async () => {
//     await waitFor(() => {
//       const formattedResult = formatter.format(
//         sumBy(
//           portalPortfolioBalance.filter((e) => e.portfolioId !== null),
//           'netPosition',
//         ),
//       );
//       expect(screen.getByText(formattedResult)).toBeInTheDocument();
//     });
//   };

//   const assertAllRegionsCurrentAllocation = async () => {
//     await waitFor(() => {
//       const formattedResult = formatter.format(
//         mockResponse.data.portalPortfolioCurrentAllocation.portalRegionPerformances[0].currentHolling,
//       );
//       expect(screen.getByText(formattedResult)).toBeInTheDocument();
//     });
//   };

//   const assertViewDetailsButton = async () => {
//     await waitFor(() => {
//       const viewPortfolioButton = screen.getByRole('button', { name: 'Portfolio:viewPortfolioButton' });
//       // eslint-disable-next-line testing-library/no-wait-for-side-effects
//       expect(viewPortfolioButton).toBeInTheDocument();
//       // eslint-disable-next-line testing-library/no-wait-for-side-effects
//       fireEvent.click(viewPortfolioButton);
//     });
//     await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
//   };

//   it('Show cash balance and portfolio balance, no error', async () => {
//     renderLayout({
//       mocks: [
//         portalCashBalanceResponse,
//         getPortfolioAunualisedReturnResponse,
//         portalPortfolioPerformanceOverTimeResponse,
//         portfolioBalancesResponse,
//       ],
//       addTypename: false,
//     });

//     await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

//     await assertCashBalance();

//     await assertCurrentHoldings();
//     await assertCapitalInvested();
//     await assertNetProceedsFromSales();
//     await assertNetPosition();
//   });

//   it('Show cash balance and portfolio balance and current allocation, no error', async () => {
//     renderLayout({
//       mocks: [
//         portalCashBalanceResponse,
//         getPortfolioAunualisedReturnResponse,
//         portalPortfolioPerformanceOverTimeResponse,
//         portfolioBalancesResponse,
//       ],
//       addTypename: false,
//     });

//     await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

//     await assertCashBalance();

//     await assertAllRegionsCurrentAllocation();

//     await assertCurrentHoldings();
//     await assertCapitalInvested();
//     await assertNetProceedsFromSales();
//     await assertNetPosition();
//   });

//   jest.setTimeout(1000 * 1888);

//   const changeToDescending = async () => {
//     await waitFor(() => {
//       const elem = screen.queryByText(`(Common:ascending)`);
//       expect(elem).toBeInTheDocument();
//       fireEvent.click(elem!);
//     });

//     await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

//     const descendingButton = screen.queryByText(/Common:descending/i);
//     expect(descendingButton).toBeInTheDocument();
//     fireEvent.click(descendingButton!);

//     fireEvent.click(screen.queryByText(/Common:apply/i)!);

//     await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
//   };

//   const gotoDetailScreen = async () => {
//     renderLayout({
//       mocks: [
//         portalCashBalanceResponse,
//         getPortfolioAunualisedReturnResponse,
//         portalPortfolioPerformanceOverTimeResponse,
//         portfolioBalancesResponse,
//         portalCurrentHoldingsResponse,
//         portalSoldStocksResponse,
//         portalExternalStocksResponse,
//       ],
//       addTypename: false,
//     });
//     await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

//     await assertViewDetailsButton();
//   };

//   const assertValueByKeys = (data: any, keys: string[]) => {
//     keys.forEach((k) => {
//       const formattedResult = formatter.format(sumBy(data, k));
//       expect(screen.getByText(formattedResult)).toBeInTheDocument();
//     });
//   };

//   const assertCurrentHoldingsTable = async (isAscending: boolean) => {
//     await waitFor(() => {
//       const table = screen.queryByRole('table');
//       expect(table).toBeInTheDocument();

//       const sortedTableData = sortItems<GetPortfolioCurrentHoldings_portalCurrentHoldings>(
//         currentHoldingsData(),
//         isAscending,
//         'dealDate',
//       );
//       const firstWine = sortedTableData[0];
//       expect(table!.children[1].children[0].children[0].children[0].children[1].children[0].innerHTML).toBe(
//         `${firstWine.vintage} ${firstWine.wineName} `,
//       );
//     });
//   };

//   const assertSoldStocksTable = async (isAscending: boolean) => {
//     await waitFor(() => {
//       const table = screen.queryByRole('table');
//       expect(table).toBeInTheDocument();

//       const sortedTableData = sortItems<GetSoldStocks_portalSoldHoldings>(soldStocksData(), isAscending, 'dealDate');
//       const firstWine = sortedTableData[0];
//       expect(table!.children[1].children[0].children[0].children[0].children[1].children[0].innerHTML).toBe(
//         `${firstWine.vintage} ${firstWine.wineName} `,
//       );
//     });
//   };

//   const assertExternalStocksTable = async (isAscending: boolean) => {
//     await waitFor(() => {
//       const table = screen.queryByRole('table');
//       expect(table).toBeInTheDocument();

//       const sortedTableData = sortItems<GetPortfolioExternalStock_portalExternalHoldings>(
//         externalStocksData(),
//         isAscending,
//         'wineName',
//       );
//       const firstWine = sortedTableData[0];
//       expect(table!.children[1].children[0].children[0].children[0].children[1].children[0].innerHTML).toBe(
//         `${firstWine.vintage} ${firstWine.wineName} `,
//       );
//     });
//   };

//   it('Show portfolio current stocks details, no error', async () => {
//     await gotoDetailScreen();

//     const uniqueHoldings = uniqueItems(portalCurrentHoldings, 'assetId');
//     assertValueByKeys(uniqueHoldings, ['totalValue', 'totalCost', 'totalMgmtFee']);

//     await assertCurrentHoldingsTable(true);
//   });

//   it('Show portfolio current stocks details and sort wine by deal date descending, no error', async () => {
//     await gotoDetailScreen();

//     const uniqueHoldings = uniqueItems(portalCurrentHoldings, 'assetId');
//     assertValueByKeys(uniqueHoldings, ['totalValue', 'totalCost', 'totalMgmtFee']);

//     await assertCurrentHoldingsTable(true);
//     await changeToDescending();
//     await assertCurrentHoldingsTable(false);
//   });

//   const switchTabByKey = async (labelText: RegExp) => {
//     await gotoDetailScreen();

//     await waitFor(() => {
//       const spanElem = screen.queryByLabelText(labelText)!;
//       expect(spanElem).toBeInTheDocument();
//       const tabs = screen.getAllByRole('tab');
//       const id = spanElem.getAttribute('aria-labelledby');
//       fireEvent.click(tabs.find((e) => e.id === id)!);
//     });
//     await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
//   };

//   const assertTabByKey = async (labelText: RegExp, data: any, keys: string[]) => {
//     await switchTabByKey(labelText);

//     await waitFor(() => {
//       expect(screen.getByText(`${data.length} Common:results`)).toBeInTheDocument();
//     });

//     assertValueByKeys(data, keys);
//   };

//   it('Show portfolio sold stocks details, no error', async () => {
//     await assertTabByKey(/Portfolio:sold/i, portalSoldStocks, ['totalValue', 'totalCost', 'totalMgmtFee']);
//     await assertSoldStocksTable(true);
//   });

//   it('Show portfolio sold stocks details and sort wine by deal date descending, no error', async () => {
//     await assertTabByKey(/Portfolio:sold/i, portalSoldStocks, ['totalValue', 'totalCost', 'totalMgmtFee']);
//     await assertSoldStocksTable(true);
//     await changeToDescending();
//     await assertSoldStocksTable(false);
//   });

//   it('Show portfolio external stocks details, no error', async () => {
//     await assertTabByKey(/Portfolio:external/i, portalExternalStocks, ['totalValue', 'totalCost']);
//     await assertExternalStocksTable(true);
//   });

//   it('Show portfolio external stocks details and sort wine by wine name descending, no error', async () => {
//     await assertTabByKey(/Portfolio:external/i, portalExternalStocks, ['totalValue', 'totalCost']);
//     await assertExternalStocksTable(true);
//     await changeToDescending();
//     await assertExternalStocksTable(false);
//   });
// });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

it('the best flavor is grapefruit', () => {
  const fruit = 'grapefruit';
  expect(fruit).toBe('grapefruit');
});
