const dateRangeVariants = ['1M', '3M', '6M', '1Y', '5Y', '10Y', 'YTD'] as const;
export const monthsAmountByVariant = {
  '1M': 1,
  '3M': 3,
  '6M': 6,
  '1Y': 12,
  '5Y': 60,
  '10Y': 120,
  YTD: undefined,
  All: undefined,
};
export default dateRangeVariants;
