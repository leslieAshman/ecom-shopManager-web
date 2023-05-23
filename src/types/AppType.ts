import { TopupSlideoutViewType } from '../views/Accounts/types';
import { ActionMap } from './commonTypes';

export interface AppState {
  isConfirmPayment: boolean;
  paymentType: TopupSlideoutViewType;
  [key: string]: unknown;
}

export interface UserSettings {
  language: string;
  currency: string;
  email: string;
  fullname: string;
}

export enum SettingsEventTypes {
  UPDATE_SETTINGS = 'update_settings',
}

type SettingsPayload = {
  [SettingsEventTypes.UPDATE_SETTINGS]: Partial<UserSettings>;
};

export type SettingsAction = ActionMap<SettingsPayload>[keyof ActionMap<SettingsPayload>];

export type MiscellaneousType = Record<string, unknown>;
export enum MiscellaneousEventTypes {
  UPDATE_MISC = 'update_misc',
}

type MiscellaneousPayload = {
  [MiscellaneousEventTypes.UPDATE_MISC]: Partial<MiscellaneousType>;
};

export type MiscellaneousAction = ActionMap<MiscellaneousPayload>[keyof ActionMap<MiscellaneousPayload>];

export enum AppEventTypes {
  UPDATE_STATE = 'update_appState',
}
type AppPayload = {
  [AppEventTypes.UPDATE_STATE]: Partial<AppState>;
};

export type AppAction = ActionMap<AppPayload>[keyof ActionMap<AppPayload>];
