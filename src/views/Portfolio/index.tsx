import { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildDisplayText } from '../../utils';
import Details from './components/Details';

import { ViewKeys } from './types';
import Summary from './components/Summary';
import SharedLayout from '../shared/SharedLayout';
import { NavigationPath, PortfolioBalance } from '../../types/DomainTypes';
import { usePortfolioBalances } from './components/Summary/hooks/usePortfolioBalances';

import { AppContext } from '../../context/ContextProvider';
import { InfoIconWhite } from '../../assets/icons';
import { useExecuteQuery } from '../hooks/useExecuteQuery';
import { PORTFOLIO_CASH_BALANCE } from './graphql/portfolioCashBalance';
import { CashBalanceResponse } from '../shared/types';
import ChangePasswordForm from './components/ChangePassword';
import { GQLMessageKeys } from 'types/gqlMessageTypes';
import { isLoggedInVar } from 'graphql/cache';
import { MiscModal } from 'components/Misc';

enum DisplayTextKeys {
  SUMMARY_TITLE = 'portfolio:titles.summaryPage',
  DETAIL_TITLE = 'portfolio:titles.detailsPage',
  VIEW_PORTFOLIO_BUTTON = 'portfolio:viewPortfolioButton',
  WELCOME_TITLE = 'portfolio:welcome_banner.title',
  WELCOME_SUBTITLE = 'portfolio:welcome_banner.subTitle',
  WELCOME_DESCRIPTION = 'portfolio:welcome_banner.description',
}

interface ViewState {
  viewKey: ViewKeys;
  title: string;
  showBackButton: boolean;
  selectedPortfolioBalanceId: string;
  portfolioBalance: PortfolioBalance | null;
}

const Portfolio = () => {
  const { t } = useTranslation();
  const {
    state: {
      auth: { requiredActions },
      app: { refresh },
      settings: { fullname },
    },
    formatter: currencyFormatter,
  } = useContext(AppContext);

  const { results: cashBalanceResponse, loading: loadingTotalInvested } = useExecuteQuery(
    'portalCashBalance',
    PORTFOLIO_CASH_BALANCE,
  );

  const formatter = useMemo(
    () => ({ format: (value: number) => currencyFormatter.format(value, true) }),
    [currencyFormatter],
  );

  const { portfolioBalances, loading: loadingBalances } = usePortfolioBalances();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'portfolio', t), [t]);
  const [viewState, setViewState] = useState<ViewState>({
    viewKey: ViewKeys.SUMMARY,
    title: displayText[DisplayTextKeys.SUMMARY_TITLE],
    showBackButton: false,
    selectedPortfolioBalanceId: '',
    portfolioBalance: null,
  });
  const [isPwdChangeRequired, setIsPwdChangeRequired] = useState(false);

  const [userName, setUserName] = useState('');

  const onViewChange = (viewKey: ViewKeys, portfolioId: string) => {
    let title = '',
      showBackButton = false;
    switch (viewKey) {
      case ViewKeys.DETIALS:
        title = displayText[DisplayTextKeys.DETAIL_TITLE];
        showBackButton = true;
        break;
      default:
        title = displayText[DisplayTextKeys.SUMMARY_TITLE];
        break;
    }
    setViewState({
      title,
      viewKey,
      showBackButton,
      selectedPortfolioBalanceId: portfolioId,
      portfolioBalance: portfolioBalances.find((x) => x.portfolioId === portfolioId)!,
    });
  };

  const onBack = () => {
    onViewChange(ViewKeys.SUMMARY, viewState.selectedPortfolioBalanceId);
  };

  const { viewKey, title, showBackButton, selectedPortfolioBalanceId, portfolioBalance } = viewState;

  const availableBalance = useMemo(() => {
    const response = cashBalanceResponse as CashBalanceResponse;
    if (!response || !response.balances) return '';

    return formatter.format(response.todayInvestment);
  }, [cashBalanceResponse, formatter]);

  useEffect(() => {
    if (fullname !== userName) setUserName(`- ${fullname}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullname]);

  useLayoutEffect(() => {
    if (refresh && (refresh as string[]).length > 0 && (refresh as string[]).includes(NavigationPath.PORTFOLIO)) {
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    if (requiredActions && requiredActions.includes(GQLMessageKeys.PASSWORD_CHANGE_REQUIRED)) {
      setIsPwdChangeRequired(true);
    } else if (isPwdChangeRequired) setIsPwdChangeRequired(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredActions]);
  console.log('DSDSDSD', isPwdChangeRequired);
  return (
    <>
      <SharedLayout view={NavigationPath.PORTFOLIO} title={title} onBack={onBack} showBackButton={showBackButton}>
        {viewKey === ViewKeys.SUMMARY && (
          <>
            <div className="bg-vine gap-3 flex flex-wrap text-white p-3 sm:divide-x divide-white">
              <div className="flex  sm:flex-1 flex-col pr-5 justify-center">
                <span className="text-[18px]">{`${displayText[DisplayTextKeys.WELCOME_TITLE]} ${userName}`}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-14">{`${displayText[DisplayTextKeys.WELCOME_SUBTITLE]} ${
                    loadingTotalInvested ? '' : availableBalance
                  }`}</span>
                </div>
              </div>
              <div className="flex flex-nowrap flex-1 sm:pl-5 pr-2 items-center">
                <div className="flex items-center justify-center w-[60px] h-[60px] pr-3">
                  <InfoIconWhite />
                </div>
                <span className="text-sm">{displayText[DisplayTextKeys.WELCOME_DESCRIPTION]}</span>
              </div>
            </div>

            <Summary
              loadingBalances={loadingBalances}
              onViewChange={onViewChange}
              currentPortfolio={selectedPortfolioBalanceId}
              portfolioBalances={portfolioBalances}
            />
          </>
        )}
        {viewKey === ViewKeys.DETIALS && portfolioBalance && <Details />}
      </SharedLayout>
      {isPwdChangeRequired && (
        <MiscModal>
          <div className="p-3 border-4  flex justify-center items-center">
            <ChangePasswordForm />
          </div>
        </MiscModal>
      )}
    </>
  );
};

export default Portfolio;
