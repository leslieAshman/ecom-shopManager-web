import React, { createContext, useReducer, Dispatch, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GET_MISCELLANEOUS } from '../App/graphql/getMiscellaneous';
import { logError } from '../components/LogError';
import { authReducer, myCellarReducer } from '../reducers';
import { appReducer } from '../reducers/appReducer';
import { miscellaneousReducer } from '../reducers/miscellaneousReducer';
import { settingsReducer } from '../reducers/settingsReducer';

import {
  AppAction,
  AppState,
  MiscellaneousAction,
  MiscellaneousType,
  SettingsAction,
  UserSettings,
} from '../types/AppType';
import { AuthAction, AuthState } from '../types/AuthType';
import { CurrencyFormater } from '../types/commonTypes';
import { ProductActions } from '../types/productType';
import { currencyFormatter } from '../utils';
import { TopupSlideoutViewType } from '../views/Accounts/types';
import { useExecuteQuery } from '../views/hooks/useExecuteQuery';

import 'moment/min/locales';
import moment from 'moment';
import { portfolioReducer } from 'views/Portfolio/reducer';
import { BaseUser, UserAction } from 'types/UserType';
import { userReducer } from 'reducers/userReducer';
import { PortfolioType, PortfolioAction } from 'views/Portfolio/types';
import { getBasePortfolioModel } from 'helpers';

type ProductType = {
  id: number;
  name: string;
  price: number;
};

type InitialStateType = {
  auth: AuthState;
  app: AppState;
  settings: UserSettings;
  miscellaneous: MiscellaneousType;
  myCellar: ProductType[];
  portfolio: PortfolioType;
  user: Partial<BaseUser>;
};

const initialState = {
  auth: { isLogin: false, requiredActions: [] },
  app: {
    id: 'Portal',
    isConfirmPayment: false,
    isAppReady: false,
    paymentType: TopupSlideoutViewType.STRIPE_RECURRING_PAYMENT,
    hasNotifications: false,
    refresh: [],
  },
  settings: {
    language: 'en-GB',
    currency: 'GBP',
    email: 'at+4263@cw.ta',
    useLoginEmail: false,
    fullname: '',
  },
  portfolio: getBasePortfolioModel(),
  user: {
    email: '',
    portfolios: [],
  },

  miscellaneous: {
    frequencyIntervalMap: new Map<string, string>([
      ['day', 'daily'],
      ['week', 'weekly'],
      ['month', 'monthly'],
      ['year', 'yearly'],
    ]),
  },
  myCellar: [],
};

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<
    AuthAction | ProductActions | SettingsAction | MiscellaneousAction | AppAction | PortfolioAction | UserAction
  >;
  onLanguageChange?: (lang: string) => void;
  formatter: CurrencyFormater;
}>({
  state: initialState,
  dispatch: () => null,
  formatter: {
    format: () => null || '',
  },
});

const mainReducer = (
  { auth, myCellar, settings, miscellaneous, app, portfolio, user }: InitialStateType,
  action: AuthAction | ProductActions | SettingsAction | MiscellaneousAction | AppAction | PortfolioAction | UserAction,
) =>
  ({
    myCellar: myCellarReducer(myCellar, action as ProductActions),
    entity: portfolioReducer({ portfolios: user.portfolios, ...portfolio }, action as PortfolioAction),
    auth: authReducer(auth, action as AuthAction),
    app: appReducer(app, action as AppAction),
    settings: settingsReducer(settings, action as SettingsAction),
    miscellaneous: miscellaneousReducer(miscellaneous, action as MiscellaneousAction),
    user: userReducer(user, action as UserAction),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);
  const { error: miscError } = useExecuteQuery('miscellaneous', GET_MISCELLANEOUS);

  // const { executor: getUserInfo, data: userInfo } = useLazyExecuteQuery(GET_AUTH_USER);
  // const { executor: getUserProfile } = useLazyExecuteQuery(GET_USER_PROFILE);

  const { i18n } = useTranslation();
  const onLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    moment.locale(lang);
    // if (updateApp)
    //   dispatch({
    //     type: SettingsEventTypes.UPDATE_SETTINGS,
    //     payload: { language: lang },
    //   });
  };

  const currencyConverter = useMemo(() => {
    return {
      format: (value: number, isNew = false) => {
        const { language, currency } = state.settings;
        const converter = currencyFormatter(language, isNew ? currency : 'GBP');
        return converter.format(value);
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.settings.currency, state.settings.language]);

  // useEffect(() => {
  //   if (userInfo) {
  //     const email = (userInfo as { authUser: { emailAddress: string } }).authUser.emailAddress;
  //     getUserProfile({
  //       email,
  //     }).then(({ data }) => {
  //       const { firstName, lastName } = (data as { getCustomer: UserProfile }).getCustomer;

  //       dispatch({
  //         type: SettingsEventTypes.UPDATE_SETTINGS,
  //         payload: { email, fullname: `${firstName} ${lastName}` },
  //       });
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userInfo]);

  // useEffect(() => {
  //   if (userPreferences) {
  //     const usrSetttings = (userPreferences as { portalClientPreferences: UserSettings }).portalClientPreferences;

  //     const lang = usrSetttings.language;
  //     if (lang !== currentLanguage) onLanguageChange(lang, false);
  //     dispatch({
  //       type: SettingsEventTypes.UPDATE_SETTINGS,
  //       payload: { ...usrSetttings },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userPreferences]);

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     getPortfolios().then(({ data }) => {
  //       const response = (data as any).portfolios as BaseResponse<Portfolio[]>;
  //       console.log('response', response);
  //       if (response.isSuccess) {
  //         dispatch({
  //           type: UserEventTypes.UPDATE_USER,
  //           payload: { portfolios: response.result || [] },
  //         });

  //         dispatch({
  //           type: AppEventTypes.UPDATE_STATE,
  //           payload: { isAppReady: true },
  //         });
  //       } else {
  //         logError(response.message);
  //         if (response.messageType === 'UNAUTHORIZED') {
  //           signOut();
  //           isLoggedInVar(false);
  //         }
  //       }
  //     });
  //     // getUserInfo();
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoggedIn]);

  if (miscError) {
    logError(miscError);
  }
  return (
    <AppContext.Provider value={{ state, dispatch, onLanguageChange, formatter: currencyConverter }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
