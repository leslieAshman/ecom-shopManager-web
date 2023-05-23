import { AppAction, AppEventTypes, AppState } from '../types/AppType';

export const appReducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case AppEventTypes.UPDATE_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
