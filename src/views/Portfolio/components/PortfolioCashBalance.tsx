import { FC, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PortfolioBalanceIcon } from '../../../assets/icons';
import { CurrencyFormater } from '../../../types/commonTypes';
import { buildDisplayText } from '../../../utils';

enum DisplayTextKeys {
  TITLE = 'portfolio:title',
  CURRENTLY_UNAVAILABLE = 'common:currentlyUnavailable',
}

interface PortfolioCashBalanceProps {
  children?: ReactNode;
  formatter: CurrencyFormater;
  loading: boolean;
  portfolioCashBalance?: number | undefined | null;
}
const PortfolioCashBalance: FC<PortfolioCashBalanceProps> = ({
  children,
  formatter,
  portfolioCashBalance,
  loading,
}) => {
  const { t } = useTranslation();

  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'portfolio', t), [t]);
  return (
    <div className=" h-[40px] flex items-center px-5 rounded-md border border-vine text-vine  bg-white">
      {loading ? (
        <div role="status" className="max-w-sm animate-pulse flex items-center ">
          <div className="w-[16px] h-[13px] mr-2">
            <PortfolioBalanceIcon className=" bg-gray-200 " />
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full w-32 "></div>
        </div>
      ) : (
        <>
          <div className="w-[16px] h-[13px] mr-2">
            <PortfolioBalanceIcon />
          </div>

          <span className="whitespace-nowrap text-xs sm:text-14">
            {portfolioCashBalance === undefined || portfolioCashBalance === null
              ? displayText[DisplayTextKeys.CURRENTLY_UNAVAILABLE]
              : formatter.format(portfolioCashBalance)}
          </span>
          {children}
        </>
      )}
    </div>
  );
};

export default PortfolioCashBalance;
