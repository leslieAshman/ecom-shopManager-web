import { AuthAction, AuthEventTypes, AuthState } from '../types/AuthType';

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case AuthEventTypes.LOGIN:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
