import React from 'react';
import { TFunction } from 'react-i18next';
import { DisplayField } from '../components/DisplayForms';
import { DropdownItem } from '../components/Dropdown';
import { PricingType } from '../components/ProductTemplates/types';
import { TableColumnType } from '../components/Table';
import { AddressType, PortfolioBalance, PortfolioBalanceInfo, Size } from '../types/DomainTypes';
import { Product, Region } from '../types/productType';
import { capitalizeFirstLetter, formatter, roundNumber, toInternalId } from '../utils';
import { PasswordChangeValidationKeys } from '../views/Accounts/types';
import defaultWineImage from '../assets/images/defaultWineImage.png';
import { ObjectType } from '../types/commonTypes';

export const getRegions = (t?: TFunction): Region[] => [
  {
    id: 'allregion',
    text: t ? capitalizeFirstLetter(t(`common:regions.allregion`)) : 'All Regions',
    value: 'allregion',
    color: '#1C2450',
  },
  {
    id: 'bordeaux',
    text: t ? capitalizeFirstLetter(t(`common:regions.bordeaux`)) : 'Bordeaux',
    value: 'bordeaux',
    color: '#213F47',
    textColor: 'white',
  },
  {
    id: 'burgundy',
    color: '#EF8E71',
    text: t ? capitalizeFirstLetter(t(`common:regions.burgundy`)) : 'Burgundy',
    value: 'burgundy',
    textColor: 'white',
  },
  {
    id: 'champagne',
    text: t ? capitalizeFirstLetter(t(`common:regions.champagne`)) : 'Champagne',
    color: '#6CB381',
    value: 'champagne',
    textColor: 'white',
  },
  {
    id: 'italy',
    value: 'italy',
    text: t ? capitalizeFirstLetter(t(`common:regions.italy`)) : 'Italy',
    color: '#757587',
    textColor: 'white',
  },
  {
    id: 'rhone',
    value: 'rhone',
    text: t ? capitalizeFirstLetter(t(`common:regions.rhone`)) : 'Rhone',
    color: '#1E234D',
    textColor: 'white',
  },

  {
    value: 'usa',
    id: 'usa',
    text: t ? capitalizeFirstLetter(t(`common:regions.usa`)) : 'USA',
    color: '#E5BE5F',
    textColor: 'white',
  },
  {
    id: 'other',
    value: 'other',
    text: t ? capitalizeFirstLetter(t(`common:regions.other`)) : 'Other',
    color: '#65A3A5',
    textColor: 'white',
  },
];

export const getRegionColors = (selectedRegion?: string) => {
  if (!selectedRegion) {
    return {
      color: '',
      textColor: 'text-black',
    };
  }
  const region = getRegions().find((x) => x.id === toInternalId(selectedRegion.toLowerCase()));

  const color = region?.color;
  const textColor = `text-${region?.textColor || 'white'}`;
  return { color, textColor };
};

export const getInvestMorePricingOptions = (t: TFunction): DropdownItem[] => [
  {
    id: PricingType.MARKET,
    value: PricingType.MARKET,
    text: t('product:wineDetails.investMore.current-market-price'),
    content: (
      <div className="flex justify-between text-base">
        <span>{`${t('product:wineDetails.investMore.current-market-price')}`}</span>
      </div>
    ),
  },
  {
    id: PricingType.CUSTOM,
    value: PricingType.CUSTOM,
    text: t('product:wineDetails.investMore.custom-price-bid-request'),
    content: (
      <div className="flex justify-between text-base">
        <span>{`${t('product:wineDetails.investMore.custom-price-bid-request')}`}</span>
      </div>
    ),
  },
];

export const addressToString = (addressIn: AddressType): string => {
  const address = { ...addressIn };
  delete address.id;
  delete address.isDefault;
  return Object.values(address)
    .filter((x) => x !== '')
    .join(', ');
};

export const getPortfolioDropdownOptions = (portfolioBalances: PortfolioBalance[]) => {
  return portfolioBalances.map((balance) => {
    const { portfolioId, portfolioName, currentHoldings } = balance;
    return {
      id: portfolioId,
      value: portfolioId,
      content: (
        <div className="flex justify-between text-base">
          <span>{portfolioName}</span>
          <span>{`${formatter.format(currentHoldings)}`}</span>
        </div>
      ),
    };
  });
};

export const getPortfolioInfo = (
  portfolioBalances: PortfolioBalance[],
  displayText: Record<string, string>,
  selectedPortfolioBalance: string,
  colors?: string[],
) => {
  if (!portfolioBalances || portfolioBalances.length === 0)
    return {
      selectedText: '',
      info: [],
    };

  const balance = portfolioBalances.find((x) => x.portfolioId === selectedPortfolioBalance);

  const {
    portfolioName,
    currentHoldings,
    balancePending,
    totalRefunds,
    netContributions,
    netPosition,
    balance: availableBalance,
    netPositionPct,
  } = balance!;

  const currentHoldingsSeriesColor = (colors || [])[0];
  const netContributionSeriesColor = (colors || [])[1];

  return {
    selectedText: portfolioName,
    info: [
      {
        color: currentHoldingsSeriesColor,
        title: displayText[PortfolioBalanceInfo.PORTFOLIO_VALUATION_TEXT],
        body: (className = 'text-base') => <span className={`${className}`}>{formatter.format(currentHoldings)}</span>,
        tooltipKey: 'portfolioValuation_tooltip',
      },
      {
        color: currentHoldingsSeriesColor,
        title: displayText[PortfolioBalanceInfo.AVAILABLE_BALANCE],
        body: (className = 'text-base') => (
          <span className={`${className}`}>{formatter.format(availableBalance || 0)}</span>
        ),
        tooltipKey: 'availableBalance_tooltip',
      },
      {
        color: currentHoldingsSeriesColor,
        title: displayText[PortfolioBalanceInfo.BALANCE_PENDING_TEXT],
        body: (className = 'text-base') => <span className={`${className}`}>{formatter.format(balancePending)}</span>,
        tooltipKey: 'balancePending_tooltip',
      },
      {
        color: netContributionSeriesColor,
        title: displayText[PortfolioBalanceInfo.CAPITAL_INVESTED_TEXT],
        body: (className = 'text-base') => <span className={`${className}`}>{formatter.format(netContributions)}</span>,
        tooltipKey: 'netContributions_tooltip',
      },

      {
        color: netContributionSeriesColor,
        title: displayText[PortfolioBalanceInfo.TOTAL_REFUNDS_TEXT],
        body: (className = 'text-base') => <span className={`${className}`}>{formatter.format(totalRefunds)}</span>,
        tooltipKey: 'totalRefunds_tooltip',
      },

      {
        title: displayText[PortfolioBalanceInfo.NET_POSITION_TEXT],
        tooltipKey: 'netPosition_tooltip',
        body: (className = 'text-base') => (
          <div className="flex items-center">
            <span className={`mr-2 ${className} ${netPosition > 0 ? 'text-trendup' : 'text-trenddown'} `}>
              {formatter.format(netPosition)}
            </span>
            <span className={`text-xs ${netPositionPct > 0 ? 'text-trendup' : 'text-trenddown'}`}>{`(${roundNumber(
              netPositionPct,
            )}%)`}</span>
          </div>
        ),
      },
    ],
  };
};

export const getBlankProduct = (): Product => ({
  id: '',
  assetId: 0,
  lwin18: '0',
  wineName: '',
  vintage: '',
  region: '',
  dealDate: '',
  dealRef: '',
  dealCCY: '',
  unit: '',
  unitCount: 0,
  qty: 0,
  qtyForSale: 0,
  costPerUnit: 0,
  totalCost: 0,
  valuePerUnit: 0,
  totalValue: 0,
  changedPct: 0,
  totalMgmtFee: 0,
  totalCostWithMgmtFee: 0,
  netPosition: 0,
  profitAndLoss: 0,
  profitAndLossHistory: [],
});

export const getFieldAttributes = (id: string, modelKey: string, label = '') => ({
  id,
  name: modelKey,
  ariaLabel: modelKey,
  modelKey,
  className: '',
  containerClassName: 'mt-5 mr-5',
  translationKey: ``,
  placeholder: '',

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => null,
  label: {
    text: label,
    isShow: label.length > 0,
    className: 'mb-2 block',
  },
});

export const validatePasswordChange = (key: PasswordChangeValidationKeys, value: string) => {
  switch (key) {
    case PasswordChangeValidationKeys.MIN_LENGTH_TEST:
      return value.length > 7;
    case PasswordChangeValidationKeys.CHAR_CASE_TEST:
      return /[A-Z]/.test(value) && /[a-z]/.test(value);
    //  return /(?=.*[a-z])(?=.*[A-Z])/g.test(value);
    case PasswordChangeValidationKeys.DIGIT_TEST:
      return /[\d]/g.test(value);
    case PasswordChangeValidationKeys.SPECIAL_CHAR_TEST:
      // eslint-disable-next-line no-useless-escape
      const specialFormat = /[ `!@#$£%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      ///[-+_!@#$%^&*.,?]/;
      return specialFormat.test(value);

    default:
      return false;
  }
};

export function getImageUrl(fileName: string, size?: Size): string {
  const imageUrl = process.env.REACT_APP_IMAGE_CDN_URL;

  if (!fileName || fileName.length === 0) return defaultWineImage;
  if (size) {
    if (size.width && !size.height) {
      return `${imageUrl}/width/${size.width}/${fileName}`;
    }
    if (size.height && !size.width) {
      return `${imageUrl}/height/${size.height}/${fileName}`;
    }
    // if both width and height are defined, it returns the image with the given width from the api
  }
  return `${imageUrl}/upload/${fileName}`;
}

export const passwordChangeValidationTests = (
  value: string,
  t: TFunction,
  tPassKeys: string,
): Record<string, { isValid: boolean; text: string }> => {
  const keys = t(`${tPassKeys}`);
  const validations = keys.split(';').reduce((result, key) => {
    return {
      ...result,
      [key]: {
        isValid: validatePasswordChange(key as PasswordChangeValidationKeys, value),
        text: t(`account:settings.${key}`),
      },
    };
  }, {});

  return validations;
};

export const onExportToXlsx = <T,>(data: T[], columns: TableColumnType[] | undefined) => {
  if (!data || data.length === 0) return;
  const dataColumnRefs = (columns || [])
    .filter((z) => z.isVisible === undefined || z.isExportable || z.isVisible)
    .map((x) => x.dataRef);
  return data.map((x) => {
    return dataColumnRefs.reduce((result, dataRef) => {
      const columnRef = (columns || []).find((z) => z.dataRef === dataRef);

      let value = x[dataRef as keyof T] as string | number;
      if (columnRef?.exportFn) {
        value = columnRef?.exportFn(value, x as ObjectType);
      }

      return {
        ...result,
        [`${columnRef?.text}`]: value,
      };
    }, {});
  });
};

// export const onXlsxExport = (data: Product[], columns: TableColumnType[] | undefined) => {
//  if (!data || data.length === 0) return;
//   const dataColumnRefs = (columns || []).map((x) => x.dataRef);
//   return data.map((x) => {
//     return dataColumnRefs.reduce((result, dataRef) => {
//       const columnText = (columns || []).find((z) => z.dataRef === dataRef)?.text;
//       let value = x[dataRef as keyof Product];
//       if (dataRef === DATA_REFS.NAME) value = `${x.vintage} ${value}`;
//       return {
//         ...result,
//         [`${columnText}`]: value,
//       };
//     }, {});
//   });
// };
