import { SortDirection } from '../../types/DomainTypes';

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
