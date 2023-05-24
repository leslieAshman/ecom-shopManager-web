import { ActionMap } from './commonTypes';

export enum AuthEventTypes {
  LOGIN = 'login',
  LOG_OUT = 'logout',
  SIGN_UP = 'signup',
  RECOVER_PASSWORD = 'recover-password',
}

type AuthPayload = {
  [AuthEventTypes.LOGIN]: {
    isLogin: boolean;
    requiredActions?: string[];
  };
};

export type AuthAction = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

export interface AuthState {
  isLogin: boolean;
  requiredActions?: string[];
}

export enum EmailValuationType {
  VALID = 'valid',
  IN_VALID = 'invalid',
  REGISTERED = 'registered',
}
