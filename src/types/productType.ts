import { ActionMap } from './commonTypes';

export enum Types {
  Delete = 'DELETE_PRODUCT',
  Add = 'ADD_PRODUCT',
}

export type ProductType = {
  id: number;
  name: string;
  price: number;
};

type ProductPayload = {
  [Types.Add]: {
    id: number;
    name: string;
    price: number;
  };
  [Types.Delete]: {
    id: number;
  };
};

export type ProductActions = ActionMap<ProductPayload>[keyof ActionMap<ProductPayload>];

export interface Region {
  id: string;
  text: string;
  color: string;
  value: string;
  textColor?: string;
}

export interface HoldingStockItem {
  rotationNumber: string;
  status: string;
  location: string;
}

export interface HistoricMarketPriceItem {
  date: string;
  marketPrice: number;
}

export interface BaseProduct {
  id: string;
  holdingId?: string;
  assetId: number;
  lwin18: string;
  wineName: string;
  vintage: string;
  region: string;
  dealDate: string;
  dealRef: string;
  dealCCY: string;
  unit: string;
  unitCount: number;
  qty: number;
  location?: string;
  status?: string;
  portfolioId?: number;
  rotationNumber?: string;
  sanitized_wine_name?: string;
}

export interface CurrentHolding extends BaseProduct {
  qtyForSale: number;
  cultWinesAllocationRegion?: string;
  qtySold?: number;
  soldDate?: string;
  soldPricePerUnit?: number;
  cashOffer?: number;
  costPerUnit: number;
  totalCost: number;
  valuePerUnit: number;
  totalValue: number;
  changedPct: number;
  totalMgmtFee: number;
  totalCostWithMgmtFee: number;
  netPosition: number;
  profitAndLoss: number;
  profitAndLossPerUnit?: number;
  netPositionPerUnit?: number;
  costWithMgmtFeePerUnit?: number;
  mgmtFeePerUnit?: number;
  profitAndLossHistory: {
    date: string;
    profitAndLoss: number;
  }[];
  holdingStocks?: HoldingStockItem[];
  historicMarketPrices?: HistoricMarketPriceItem[];
}

export interface Product extends CurrentHolding {
  imageFileName?: string;
  imageUrl?: string;
  color?: string;
  description?: string;
  stockId?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum DATA_REFS {
  ASSETID = 'lwin18',
  NAME = 'title',
  DEAL_DATE = 'dealDate',
  UNIT = 'unit',
  QUANTITY = 'qty',
  COST_PER_UNIT = 'costPerUnit',
  TOTAL_COST = 'totalCost',
  VALUE_PER_UNIT = 'valuePerUnit',
  TOTAL_VALUE = 'totalValue',
  PERCENT_CHANGE = 'changedPct',
  PROFIT_LOSS = 'profitAndLoss',
  REGION = 'region',
  VINTAGE = 'vintage',
  SOLD_DATE = 'soldDate',
  QTY_SOLD = 'qtySold',
  SOLD_PER_UNIT = 'soldPricePerUnit',
  STATUS = 'status',
  LOCATION = 'location',
  CASH_OFFER = 'cashOffer',
  ROTATION_NUMBER = 'rotationNumber',
  SANITIZED_WINE_NAME = 'sanitized_wine_name',
  NET_POSITION = 'netPosition',
  CULT_WINES_ALLOCATION_REGION = 'cultWinesAllocationRegion',
}

export interface EntityListing {
  quantity: number;
  price: number;
  basePrice: number;
}

export interface StockItem {
  id: string;
  holdingId?: string;
  assetId: number;
  lwin18: string;
  wineName: string;
  vintage: string;
  region: string;
  dealDate: string;
  dealRef: string;
  dealCCY: string;
  unit: string;
  unitCount: number;
  qty: number;
  location?: string;
  status?: string;
  portfolioId?: number;
  rotationNumber?: string;
  sanitized_wine_name?: string;
}
