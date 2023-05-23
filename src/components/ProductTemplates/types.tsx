export enum DisplayTextKeys {
  INVEST_MORE_BUTTON_TEXT = 'invest_more_button_text',
  SELL_HOLDINGS_BUTTON_TEXT = 'sell_holdings_button_text',
  INVEST_MORE_TITLE_TEXT = 'investMore.title',
  SELL_HOLDINGS_TITLE_TEXT = 'sellHolding.title',
  UINTS_OWNED = 'units_owned',
  VALUE_PER_UNIT = 'value_per_unit',
  TOTAL_VALUE = 'total_value',
  INCLUDE_FEES = 'include_fees',
  DATA_AND_VALUATION = 'data_and_valuations',
  ARRANGE_DELIVERY_BUTTON_TEXT = 'arrangeDelivery.buttonText',
  ARRANGE_DELIVERY_TITLE = 'arrangeDelivery.title',
  ARRANGE_DELIVERY_SUBTITLE = 'arrangeDelivery.subTitle',
  LIVE_EX_PERFORMANCE_CHART_DESCRIPTION = 'live_ex-performance_chart_description',
  LIVE_EX_CHART_TITLE = 'live_ex_chart_title',

  TOTAL_PURCHASE_PRICE = 'valuations.total-purchase-price',
  TOTAL_UPFRONT_FEES = 'valuations.total-upfront-fees',
  MARKET_PRICE = 'valuations.market-price',
  PROFIT_LOSS = 'valuations.profit-loss',
  PER_UNIT = 'valuations.per-unit',
  TOTAL_COST = 'valuations.total-cost',
  PROFIT_LOSS_INC_FEES = 'valuations.profit-loss-including-fees',
}

export enum PricingType {
  MARKET = 'market_price',
  CUSTOM = 'custom_price',
}

export interface InvestMoreModel {
  pricing: PricingType;
  units: string;
  customPrice: string;
}

export enum SellHoldingReasons {
  FOR_REFUND = 'forRefund',
  NEW_PURCHASE = 'newPurchase',
  RE_BALANCE = 'reBalance',
  LOCK_IN_PROFITS = 'lockInProfits',
}

export interface BuySellHoldingModel {
  price: number;
  units: number;
  reason: string;
  pricingType: PricingType;
}

export enum ViewStateType {
  DEFAULT = 'default',
  THANK_YOU = 'thank_you',
  NO_CONNECTION = 'noConnection',
  SOMETHING_WENT_WRONG = 'somethingWentWrong',
  CUSTOM = 'custom',
  ERROR_RESULT = 'error',
  INVEST_MORE = 'invest_more',
  SELL_HOLDINGS = 'sellHoldings',
  ARRANGE_DELIVERY = 'arrange_delivery',
  LOADING = 'loading',
  MESSAGE = 'Message',
  CONTACT_US = 'contactUs',
  PAYMENT_SUCCESS = 'payment_success',
  SUCCESS = 'success',
}

export enum ProductEventType {
  SHOW_PRODUCT_DETAILS = 'details',
  SHOW_THANK_YOU = 'thank_you',
  SHOW_NO_CONNECTION = 'noConnection',
  SHOW_INVEST_MORE_VIEW = 'invest_more',
  SHOW_SELL_HOLDINGS_VIEW = 'sellHoldings',
  EXECUTE_SELL_PRODUCT_REQUEST = 'execute_sell_product_request',
  EXECUTE_BUY_PRODUCT_REQUEST = 'execute_buy_product_request',
  ARRANGE_DELIVERY = 'arrange_delivery',
  SET_TITLE = 'set_title',
  DEFAULT = 'default',
}

export interface IsSuccessResponseType {
  isSuccess: boolean;
  errorMessage: string;
}

export interface ExecuteResponse {
  portalSellWine?: IsSuccessResponseType;
  portalBuyWine?: IsSuccessResponseType;
  portalDeliverWine?: IsSuccessResponseType;
}

export interface ArrangeDeliveryRequest {
  holdingId: string;
  qty: number;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface BuyProductRequest {
  holdingId: string;
  qty: number;
  purchasePrice: number;
  requestPrice: number;
}

export interface SellProductRequest {
  holdingId: string;
  qty: number;
  marketPrice: number;
  reservePrice: number;
  reasonForSale: string;
}
