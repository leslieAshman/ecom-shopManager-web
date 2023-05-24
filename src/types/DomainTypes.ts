export enum NavigationPath {
  LOGIN = '/login',
  REGISTRATION = '/registration',
  FORGET_PASSWORD = '/reset-password',
  PORTFOLIO = '/portfolio',
  INVEST = '/invest',
  MY_CELLAR = '/my-cellar',
  DISCOVER = '/discover',
  ACCOUNTS = '/accounts',
  TERMS_AND_CONDITIONS = '/legal/terms-and-conditions',
  PRIVACY_POLICY = '/legal/privacy-policy',
  PAYMENT_CONFIRMATION = '/payment-confirmation',
  NOTIFICATIONS = '/notifications',
  CONTACT_US = '/contact_us',
}

export interface AddressType {
  id?: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface PortfolioBalance {
  balance?: number;
  portfolioName: string;
  portfolioId: string;
  currentHoldings: number;
  capitalInvested: number;
  totalMgmtFee: number;
  netProceedsFromSales: number;
  netPosition: number;
  netPositionPct: number;
  profitAndLoss: number;
  profitAndLossPct: number;
  balancePending: number;
  totalRefunds: number;
  netContributions: number;
  currentFeeModel?: boolean;
}

export enum PortfolioBalanceInfo {
  CURRENT_HOLDINGS_TEXT = 'portfolio:summary.texts.currentHoldings',
  CAPITAL_INVESTED_TEXT = 'portfolio:summary.texts.currentInvested',
  NET_PROCEEDS_FROM_SALES_TEXT = 'portfolio:summary.texts.netProceedsFromSales',
  AVAILABLE_BALANCE = 'portfolio:summary.texts.availableBalance',
  NET_POSITION_TEXT = 'portfolio:summary.texts.netPosition',

  PORTFOLIO_VALUATION_TEXT = 'portfolio:summary.texts.portfolioValuation',
  BALANCE_PENDING_TEXT = 'portfolio:summary.texts.balancePending',
  TOTAL_REFUNDS_TEXT = 'portfolio:summary.texts.totalRefunds',
  NET_CONTRIBUTIONS_TEXT = 'portfolio:summary.texts.netContributions',
}

export interface ChartDataPoint {
  x: number;
  y: number;
  data?: Record<string, unknown>;
}

export interface GQLQueryMetaData {
  page: number;
  resultPerPage: number;
  resultSize: number;
  totalResultsSize: number;
  totalPages: number;
}

export type Size = {
  width?: number;
  height?: number;
};

export interface CurrencyType {
  id: string;
  symbol: string;
  text: string;
  value: string;
}

export enum SortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  addressline1?: string;
  addressline2?: string;
  addressline3?: string;
  city?: string;
  country?: string;
  postCode?: string;
  state?: string;
}

export enum Alignment {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum RefreshRegion {
  HEADER = 'header',
}
