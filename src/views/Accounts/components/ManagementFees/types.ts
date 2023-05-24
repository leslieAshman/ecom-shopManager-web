// eslint-disable-next-line @typescript-eslint/naming-convention
export enum MGMT_DATA_REFS {
  ID = 'id',
  NAME = 'accountHolderName',
  VALUATION_DATE = 'valuationDate',
  FEE_TYPE = 'feeType',
  PORTFOLIO_VALUE = 'portfolioValue',
  OFFSET_VALUE = 'offsetValue',
  FFE_AMOUNT = 'feeAmount',
  APPLIED = 'appliedPct',
  INVOICE_NUMBER = 'invoiceNumber',
  INVOICE_DATE = 'invoiceDate',
  STATUS = 'status',
}

export enum MgmtFeesExplainedType {
  ANNUAL_FEES = 'annualMgmtFees',
  LATE_PAID_STOCK_FEES = 'latePaidStockFees',
  CANCELLED_DEAL_REBATE = 'cancelledDealRebate',
}
