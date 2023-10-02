import { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildDisplayText } from '../../utils';
import Details from './components/Details';

import { PortfolioType, ViewKeys } from './types';
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
import { useLazyExecuteQuery } from 'views/hooks/useLazyExecuteQuery';
import { GET_PORTFOLIOS } from './graphql/getPortfolios';
import OnboardShop from 'views/Onboarding/Shop';
import AddShop from 'views/Onboarding/Shop/components/AddShop';
import { mockQShopModel } from 'mocks';
import { CREATE_STRIPE_PAYMENT_MUTATION } from 'views/Accounts/graphql/stripePaymentMutation';
import { useExecuteMutation } from 'views/hooks/useExecuteMutation';
import { DELETE_PORTFOLIO_MUTATION } from 'views/Accounts/graphql/Mutation/deletePortfolio';
import { Button } from 'components';
import { logError } from 'components/LogError';
import { BaseResponse, GetResponse } from 'types/commonTypes';
import { AppEventTypes } from 'types/AppType';
import { signOut } from 'services/auth';

const mockShop = mockQShopModel();
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
      app: { refresh, isAppReady },
      settings: { fullname, email },
      user: { id: userId, portfolios },
    },
    formatter: currencyFormatter,
    dispatch,
  } = useContext(AppContext);

  const { results: cashBalanceResponse, loading: loadingTotalInvested } = useExecuteQuery(
    'portalCashBalance',
    PORTFOLIO_CASH_BALANCE,
  );

  const formatter = useMemo(
    () => ({ format: (value: number) => currencyFormatter.format(value, true) }),
    [currencyFormatter],
  );

  const { executor: executorDeletePortfolio } = useExecuteMutation(DELETE_PORTFOLIO_MUTATION);

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
      portfolioBalance: null,
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

  const deleteShop = (shopId: string) => {
    executorDeletePortfolio({
      shopId,
    });
  };

  console.log('PORTFOLIOS_DSDDS', portfolios);

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
            <div className="flex flex-col sm:flex-row sm:space-x-5 space-y-5 sm:space-y-0 mt-5 bg-red">
              <Button
                className="text-14 btn-primary"
                onClick={() => {
                  deleteShop('ZAKIN3EFC7F71');
                }}
              >
                DELETE
              </Button>
            </div>

            <Summary
              loadingBalances={false}
              onViewChange={onViewChange}
              currentPortfolio={selectedPortfolioBalanceId}
              portfolios={portfolios ?? []}
            />
          </>
        )}
        {viewKey === ViewKeys.DETIALS && portfolioBalance && <Details />}
      </SharedLayout>
      {isPwdChangeRequired && (
        <MiscModal>
          <div
            className="p-3    sm:max-w-lg
           sm:w-full flex justify-center items-center"
          >
            <ChangePasswordForm />
          </div>
        </MiscModal>
      )}

      {isAppReady && portfolios?.length === 0 && (
        <MiscModal>
          <div className="">
            <AddShop />
          </div>
        </MiscModal>
      )}
    </>
  );
};

export default Portfolio;
