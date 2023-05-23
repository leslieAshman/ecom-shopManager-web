import { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackArrow, ChevronDown, ChevronUp, HamburgerIcon, NotificationIcon } from '../../assets/icons';
import { Button, Dropdown } from '../../components';
import { logError } from '../../components/LogError';
import { AppContext } from '../../context/ContextProvider';
import { isLoggedInVar } from '../../graphql/cache';
import { signOut } from '../../services/auth';
import { AppEventTypes } from '../../types/AppType';
import { CurrencyFormater } from '../../types/commonTypes';
import { NavigationPath, RefreshRegion } from '../../types/DomainTypes';
import { useExecuteQuery } from '../hooks/useExecuteQuery';
import { GET_NOTIFICATIONS } from '../Notifications/graphql/getNotifications';
import { NotificationResponse, NotificationType } from '../Notifications/types';
import PortfolioCashBalance from '../Portfolio/components/PortfolioCashBalance';
import { PORTFOLIO_CASH_BALANCE } from '../Portfolio/graphql/portfolioCashBalance';
import SharedSideBar from './SharedSideBar';
import { BalanceSummary, CashBalanceResponse, SideBarItemType } from './types';

export const getPortfolioBalanceDropdownOptions = (
  portfolioBalances: BalanceSummary[],
  formatter: CurrencyFormater,
) => {
  return portfolioBalances
    .filter((x) => x.portfolioId !== '')
    .map((option) => {
      const { portfolioId, portfolioName, balance } = option;
      return {
        id: portfolioId,
        value: portfolioId,
        content: (
          <div key={`key-${portfolioId}`} className="flex justify-between text-xs sm:text-14">
            <div>{portfolioName}</div>
            <div>{`${formatter.format(balance!)}`}</div>
          </div>
        ),
      };
    });
};
const notificationPullInterval = Number(process.env.REACT_APP_NOTIFICATION_POLL_INTERVAL || 1000 * 60 * 5); // default to 5 mins

interface SharedLayoutProps {
  children?: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack: () => void;
  view: NavigationPath;
  containerClassName?: string;
  className?: string;
}
const SharedLayout: FC<SharedLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  view,
  onBack,
  containerClassName,
  className,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    results: cashBalanceResponse,
    loading: loadingCashBalances,
    refetch: refetchCashBalances,
    error,
  } = useExecuteQuery('portalCashBalance', PORTFOLIO_CASH_BALANCE);
  if (error instanceof Error) {
    logError((error as Error).message);
  }
  const [isShowBalances, setIsShowBalances] = useState(false);
  const { t } = useTranslation();

  const {
    state: {
      app: { hasNotifications, refresh },
      settings: { fullname },
    },
    dispatch,
    formatter: currencyFormatter,
  } = useContext(AppContext);

  const formatter = useMemo(
    () => ({ format: (value: number) => currencyFormatter.format(value, true) }),
    [currencyFormatter],
  );

  const balances = useMemo(
    () => {
      const response = cashBalanceResponse as CashBalanceResponse;
      if (!response || !response.balances) return { total: null, secondary: [] };
      const allCashBalance = response?.balances.find((x) => !x.portfolioId || `${x.portfolioId}` === '');
      return {
        total: allCashBalance?.balance,
        secondary: response.balances.filter((x) => allCashBalance?.portfolioId !== x.portfolioId),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cashBalanceResponse],
  );

  const [loginUserInitials, setLoginUserInitials] = useState('');

  const { results: fetchedNotifications } = useExecuteQuery('userNotifications', GET_NOTIFICATIONS, {
    variables: {
      from: 0,
      pageSize: 10000,
    },
    pollInterval: notificationPullInterval,
  });
  const portfolioDropdownOptions = useMemo(
    () => getPortfolioBalanceDropdownOptions(balances.secondary, formatter),
    [balances.secondary, formatter],
  );
  const onOpenMenu = () => {
    setShowMenu(true);
  };
  const onBackHandler = () => {
    if (onBack) onBack();
  };

  const onSideBarIconSelect = (item: SideBarItemType) => {
    navigate(`${item.value}`);
  };
  const openNotifications = () => {
    navigate(NavigationPath.NOTIFICATIONS);
  };

  const onSessionLogout = () => {
    signOut();
    isLoggedInVar(false);
    navigate(NavigationPath.LOGIN);
  };

  useEffect(() => {
    if (fullname) {
      const name = fullname.split(' ');
      setLoginUserInitials(`${name[0].charAt(0).toUpperCase()}${name[name.length - 1].charAt(0).toUpperCase()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullname]);

  useEffect(() => {
    if (fetchedNotifications) {
      const notificationResponse = fetchedNotifications as NotificationResponse;
      if (notificationResponse.results && notificationResponse.results?.length > 0) {
        const notifications = notificationResponse.results as NotificationType[];
        const unReadNotifications = notifications.find((x) => !x.isRead);
        const isNotifications = !!unReadNotifications;

        dispatch({
          type: AppEventTypes.UPDATE_STATE,
          payload: {
            hasNotifications: isNotifications,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedNotifications]);

  useEffect(() => {
    if (refresh && (refresh as string[]).length > 0 && (refresh as string[]).includes(RefreshRegion.HEADER)) {
      refetchCashBalances();
      dispatch({
        type: AppEventTypes.UPDATE_STATE,
        payload: { refresh: (refresh as string[]).filter((x) => x !== RefreshRegion.HEADER) },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <>
      <div className="flex relative overflow-hidden">
        <SharedSideBar value={view} onClick={onSideBarIconSelect} isSmallScreen={false} />
        {showMenu && (
          <SharedSideBar
            value={view}
            onClick={onSideBarIconSelect}
            isSmallScreen={true}
            onClose={() => setShowMenu(false)}
          />
        )}
        <div
          className={`flex flex-col flex-1  h-screen rounded-tl-lg ml-0 sm:-ml-5 overflow-hidden pb-5 bg-white ${
            className || ''
          } `.trim()}
        >
          <div className="flex items-center shadow-[0_8px_16px_0px_rgba(0,0,0,0.08)]">
            <div className="flex items-center  m-5">
              {showBackButton && <BackArrow className="mr-3 cursor-pointer" onClick={onBackHandler} />}
              <HamburgerIcon className="sm:hidden mr-3 cursor-pointer" onClick={() => onOpenMenu()} />

              <h5 className="sm:text-md">{title}</h5>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-5 pr-5">
              <Dropdown
                itemsWrapperClassName="right-0 mt-2"
                itemClassName="py-5 text-base"
                className="flex-1 text-sm sm:text-base whitespace-nowrap p-0 justify-start h-8"
                header={
                  <div className="flex flex-col w-fit min-w-[200px] p-3 space-y-2">
                    {portfolioDropdownOptions.map((balanceItem) => {
                      return balanceItem.content;
                    })}
                  </div>
                }
                footer={
                  <div className="flex justify-center items-center p-5">
                    <Button
                      isDisable={pathname === NavigationPath.ACCOUNTS}
                      className={pathname === NavigationPath.ACCOUNTS ? 'btn-disabled' : 'btn-accent'}
                      onClick={() => navigate(NavigationPath.ACCOUNTS)}
                      props={{
                        name: 'gotoOverview',
                      }}
                    >
                      {t(`common:overview`)}
                    </Button>
                  </div>
                }
              >
                <div className="flex items-center" onClick={() => setIsShowBalances(!isShowBalances)}>
                  <PortfolioCashBalance
                    formatter={formatter}
                    portfolioCashBalance={balances.total}
                    loading={loadingCashBalances}
                  >
                    <div className="ml-5">
                      {!isShowBalances && <ChevronDown className="" aria-hidden="true" />}
                      {isShowBalances && <ChevronUp className="" aria-hidden="true" />}
                    </div>
                  </PortfolioCashBalance>
                </div>
              </Dropdown>
              <div onClick={openNotifications} className="relative cursor-pointer">
                <>
                  {hasNotifications && <div className="rounded-full h-3 w-3 bg-orange absolute -right-1" />}
                  <NotificationIcon />
                </>
              </div>

              <Dropdown
                itemsWrapperClassName="right-0 mt-2"
                itemClassName="py-5 text-base"
                className="flex-1 text-sm sm:text-base whitespace-nowrap p-0 justify-start h-8"
                header={
                  <div className="flex flex-col w-fit mt-1 p-3 space-y-2">
                    <div onClick={onSessionLogout} className="w-full flex cursor-pointer text-sm">
                      {t('auth:logout')}
                    </div>
                  </div>
                }
              >
                <div className="rounded-full flex items-center justify-center bg-orange w-[40px] h-[40px]">
                  {loginUserInitials}
                </div>
              </Dropdown>
            </div>
          </div>
          <div className={`flex-1 flex flex-col h-100  overflow-y-auto  ${containerClassName || ''}`.trim()}>
            {children || null}
          </div>
        </div>
      </div>
    </>
  );
};

export default SharedLayout;
