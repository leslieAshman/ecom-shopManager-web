import { ReactNode } from 'react';
import * as yup from 'yup';
import { RequiredStringSchema } from 'yup/lib/string';

export interface DisplayField {
  id: string;
  name: string;
  type?: DisplayFieldType;
  sectionId?: string;
  thousandSeparate?: boolean;
  isAutoFocus?: boolean;
  modelKey?: string;
  numberFormat?: string;
  customTemplate?: (field: DisplayField) => ReactNode;
  onClear?: (field?: DisplayField) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => void;
  ariaLabel?: string;
  className?: string;
  containerClassName?: string;
  translationKey?: string;
  placeholder?: string;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => void;
  onError?: (value: string, fieldId: string) => void;
  helperText?: string | undefined;
  helperTextClassName?: string;
  isRequired?: boolean;
  inputProps?: Record<string, unknown>;
  label?: {
    text: string;
    isShow?: boolean;
    className?: string;
  };
}

export enum DisplayFieldType {
  NUMERIC = 'numeric',
  PHONE = 'phone',
  TEXT = 'text',
  PASSWORD = 'password',
  CUSTOM = 'custom',
  CURRENCY = 'currency',
  TEXT_AREA = 'textArea',
}

export type ModelValidationSchemaType = Record<
  string | number,
  RequiredStringSchema<string | undefined, Record<string, unknown>>
>;

export interface DisplaySection {
  id?: string;
  className?: string;
  fields: DisplayField[];
  name?: string;
  head?: (section: DisplaySection) => ReactNode;
  footer?: (section: DisplaySection) => ReactNode;
}

export enum ModelKey {
  AccountName = 'accountName',
  SortCode = 'sortCode',
  AccountNumber = 'accountNumber',
  Iban = 'iban',
  Bic = 'bic',
  Amount = 'amount',
}

export const withdrawFundsModel = yup.object({
  modelType: yup.string(),
  amount: yup.string(),
  accountName: yup.string(),
  sortCode: yup.string(),
  accountNumber: yup.string(),
  iban: yup.string(),
  bic: yup.string(),
});

export type WithdrawFundsModelType = yup.InferType<typeof withdrawFundsModel>;

export interface OverridableFieldType {
  modelKey: string;
  label?: { text: string };
  sectionId?: string;
  overrides?: (configIn: Partial<DisplayField>) => Partial<DisplayField>;
}
