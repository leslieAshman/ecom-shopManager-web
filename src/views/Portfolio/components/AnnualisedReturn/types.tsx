export interface AnnualReturnType {
  date: string;
  profitAndLossPct: number;
}
export interface AnnualRepotItemType {
  yearToDateStart: string;
  profitAndLossPct: number;
}

export interface AunualisedReturnType {
  portfolio: string;
  annualisedReturnHistory: AnnualReturnType[];
  annualisedReturnReport: AnnualRepotItemType[];
}
