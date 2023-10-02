import { ActionMap, BaseResponse } from 'types/commonTypes';
import { SortDirection } from '../../types/DomainTypes';
import { typeDefs } from 'graphql/typeDefs';

export interface PortfolioType {
  _id: string | number | undefined;
  shopId: string;
  name: string;
  email: string;
  owner: string;
  isOnline: boolean;
  address: string;
  area: string;
  city: string;
  country: string;
  postcode: string;
  phoneNo: string;
  isAgreementSigned: boolean;
  hashTags: string[];
  // _id    info logo
  ownerPic?: string;
  policy?: string;
  info?: string;
  logo?: { createdDate: string; pic: string };
  logoSmall?: { createdDate: string; pic: string };
  countryObj?: string;
  website?: string;
  followers?: string[];
  likes?: number;
  informations?: {
    title: string;
    body: string;
    ordinal: number;
    infoRef: string;
  }[];
}

export enum PortfolioEventTypes {
  UPDATE_PORTFOLIO = 'update_portfolioState',
  ADD_TO_CART = 'add_to_cart',
  UPDATE_SHOP = 'update_shop',
}

type PortfolioPayload = {
  [PortfolioEventTypes.UPDATE_PORTFOLIO]: Partial<PortfolioType>;
  [PortfolioEventTypes.ADD_TO_CART]: Partial<PortfolioType>;
  [PortfolioEventTypes.UPDATE_SHOP]: BasePortfolioType;
};

export type PortfolioAction = ActionMap<PortfolioPayload>[keyof ActionMap<PortfolioPayload>];

export type BasePortfolioType = Partial<{
  _id: string | number;
  shopId: string;
  logo: { name: string; image: string };
  logoSmall: string;
  name: string;
  address: string;
  area: string;
  postcode: string;
  city: string;
  country: string;
  email: string;
  phoneNo: string;
  createdBy: string;
  createdDate: string;
  isAgreementSigned: boolean;
  owner: string;
  ownerPic: string;
  website: string;
  hashTags: string[];
  isOnline: boolean;
  likes: 0;
  reviews: string[];
  gallery: string[];
  serviceBin: string[];
  currency: {
    symbol: string;
    short: string;
    long: string;
  };

  bookings: string[];
  employees: string[];
}>;

export enum ViewKeys {
  SUMMARY = 'summary',
  DETIALS = 'details',
}

export enum DetailsTableColumn {
  WINE_NAME = 'wine name',
  DEAL_DATE = 'deal date',
  UNITS = 'units',
  QUANTITY = 'quantity',
  COST_PER_UNIT = 'cost per unit',
  TOTAL_COST = 'total cost',
  VALUE_PER_UNIT = 'value per unit',
  TOTAL_VALUE = 'total value',
  PERCENT_CHANGE = '% Change',
  P_AND_L = 'P&L',
}

export interface PerformanceOverTime {
  date: string;
  currentHoldings: number;
  netContributions: number;
}

export interface CurrentAllocation {
  regionName: string;
  currentAllocation: number;
  tacticalAllocation: number;
  StrategicAllocation: number;
}

export interface RegionPerformance {
  regionName: string;
  currentHoldings: number;
  totalPurchasePrice: number;
  netPosition: number;
  netPositionPct: number;
}

export interface PortalAllocations {
  portalCashBalance: number;
  portalPortfolioCurrentAllocation: {
    portalRegionPerformances: RegionPerformance[];
    portalPortfolioCurrentAllocation: CurrentAllocation[];
  };
}

export interface SortByOption {
  id: string;
  value: string;
  text: string;
  content: JSX.Element;
}

export interface SortByType {
  id: string;
  text: string;
  direction: SortDirection;
}

export interface StockTotal {
  title: string;
  value: number;
  color?: string;
  text: string;
  additionalText?: string;
}
