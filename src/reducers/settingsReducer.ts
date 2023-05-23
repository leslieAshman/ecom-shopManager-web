import { SettingsAction, SettingsEventTypes, UserSettings } from '../types/AppType';

export const settingsReducer = (state: UserSettings, action: SettingsAction) => {
  switch (action.type) {
    case SettingsEventTypes.UPDATE_SETTINGS:
      return {
        ...state,
        ...(action.payload || {}),
      };
    default:
      return state;
  }
};
