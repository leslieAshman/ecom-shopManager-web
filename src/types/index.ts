/* eslint-disable @typescript-eslint/no-explicit-any */
export type { RecentSearch } from './RecentSearch';
export * as DomainTypes from './DomainTypes';
export * as AppTypes from './AppType';

export interface FormikType {
  errors: { [key: string]: any }[];
  values: { [key: string]: any }[];
}

export type IsFormValidFnType = () => boolean;

export type ValidationFuncType = () => any;

export type EmptyObject = Record<string, unknown>;

export enum EventTypes {
  CANCEL = 'cancel',
  SAVE = 'save',
  CLOSE = 'close',
  EDIT = 'edit',
  PREVIEW = 'preview',
  NEW = 'new',
  DELETE = 'delete',
}

export interface EventArgs {
  onCTA: (type: EventTypes, data?: unknown) => void;
}
