import { useReactiveVar } from '@apollo/client';
import React, { createContext, useReducer, Dispatch, ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GET_MISCELLANEOUS } from '../App/graphql/getMiscellaneous';
import { logError } from '../components/LogError';
import { isLoggedInVar } from '../graphql/cache';
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
  SettingsEventTypes,
  UserSettings,
} from '../types/AppType';
import { AuthAction, AuthEventTypes, AuthState } from '../types/AuthType';
import { CurrencyFormater } from '../types/commonTypes';
import { ProductActions } from '../types/productType';
import { currencyFormatter } from '../utils';
import { GET_USER_PREFERENCES } from '../views/Accounts/graphql/getUserPreferences';
import { TopupSlideoutViewType } from '../views/Accounts/types';
import { useExecuteQuery } from '../views/hooks/useExecuteQuery';
import { useLazyExecuteQuery } from '../views/hooks/useLazyExecuteQuery';

import { GET_AUTH_USER } from '../views/Accounts/graphql/getAuthUser';
import { GET_USER_PROFILE } from '../views/Accounts/graphql/getUserProfile';
import { UserProfile } from '../types/DomainTypes';
import 'moment/min/locales';
import moment from 'moment';

declare global {
  interface Heap {
    identify(identity: string): VoidFunction;
  }

  interface Window {
    heap: Heap;
  }
}

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
};

const initialState = {
  auth: { isLogin: false, requiredActions: [] },
  app: {
    id: 'Portal',
    isConfirmPayment: false,
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
  dispatch: Dispatch<AuthAction | ProductActions | SettingsAction | MiscellaneousAction | AppAction>;
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
  { auth, myCellar, settings, miscellaneous, app }: InitialStateType,
  action: AuthAction | ProductActions | SettingsAction | MiscellaneousAction | AppAction,
) => ({
  myCellar: myCellarReducer(myCellar, action as ProductActions),
  auth: authReducer(auth, action as AuthAction),
  app: appReducer(app, action as AppAction),
  settings: settingsReducer(settings, action as SettingsAction),
  miscellaneous: miscellaneousReducer(miscellaneous, action as MiscellaneousAction),
});

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);
  const { error: miscError } = useExecuteQuery('miscellaneous', GET_MISCELLANEOUS);
  //const { executor: refetchUserPreferences, data: userPreferences } = useLazyExecuteQuery(GET_USER_PREFERENCES);
  // const { executor: getUserInfo, data: userInfo } = useLazyExecuteQuery(GET_AUTH_USER);
  // const { executor: getUserProfile } = useLazyExecuteQuery(GET_USER_PROFILE);

  const { i18n } = useTranslation();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const onLanguageChange = (lang: string, updateApp = true) => {
    i18n.changeLanguage(lang);
    moment.locale(lang);
    if (updateApp)
      dispatch({
        type: SettingsEventTypes.UPDATE_SETTINGS,
        payload: { language: lang },
      });
  };

  const currentLanguage = useMemo(() => i18n.language || window.localStorage.i18nextLng || navigator.language, [i18n]);
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
  //   if (isLoggedIn !== state.auth.isLogin) {
  //     if (isLoggedIn) {
  //       refetchUserPreferences();
  //       getUserInfo();
  //     }
  //     dispatch({
  //       type: AuthEventTypes.LOGIN,
  //       payload: { isLogin: isLoggedIn },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoggedIn, state.auth.isLogin]);

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
