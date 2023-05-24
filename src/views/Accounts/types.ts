export const enum AccountViewType {
  OVERVIEW = 'overview',
  PROFILE = 'profile',
  PAYMENTS = 'payments',
  SETTINGS = 'settings',
  CONTACT_US = 'contactUs',
  HELP_CENTER = 'help-center',
  NONE = 'NONE',
}

export enum PaymentType {
  CREDIT_CARD = 'credit card',
  BANK_TRANSFER = 'bank transfer',
}

export enum SlideOutPanelViews {
  TOP_UP = 'top-up',
  CUSTOM = 'custom',
}

export enum ModelKeys {
  AMOUNT = 'amount',
  PORTFOLIO_ID = 'portfolioId',
  PAYMENT_TYPE = 'paymentType',
  IS_RECURRING = 'isRecurring',
  START_DATE = 'startDate',
  FREQUENCY_TYPE = 'paymentFrequency',
}

export interface ModelType {
  [ModelKeys.AMOUNT]: number | string;
  [ModelKeys.PORTFOLIO_ID]: string;
  [ModelKeys.PAYMENT_TYPE]: string;
  [ModelKeys.IS_RECURRING]: boolean;
  [ModelKeys.START_DATE]: string;
  [ModelKeys.FREQUENCY_TYPE]: string;
}

export enum TopupSlideoutViewType {
  RECURRING_PAYMENTS = 'recurring-payments',
  OTP_CREDIT_CARD = 'credit-card',
  BANK_TRANSFER = 'bank-transfer',
  STRIPE_OTP_PAYMENT = 'stripe payment form',
  STRIPE_RECURRING_PAYMENT = 'stripe payment recurring form',
  NONE = 'none',
  ERROR = 'error',
}

export interface TopupSlideoutViewState {
  showBackButton: boolean;
  view: TopupSlideoutViewType;
  model?: unknown;
}

export interface BillingAddress {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postalCode: string | null;
  state: string | null;
}
export interface PaymentCard {
  id: string;
  brand: string;
  country: string;
  expMonth: number;
  expYear: number;
  last4: string;
  funding: string;
  billingAddress?: BillingAddress;
}

export interface PaymentSubscription {
  id: string;
  portfolioId: string;
  portfolioName: string;
  amount: number;
  frequency: string;
  card?: PaymentCard;
  currency: string;
  status: string;
  priceId: string;
  paymentMethodId: string | null;
}

export interface RecurringPaymentPrices {
  id: string;
  nickName: string;
  product: string;
  currency: string;
  unitAmount: string;
  recurringInterval: string;
  recurringIntervalCount: number;
}

export type OpenSlideoutFnType = (view: SlideOutPanelViews, config?: Record<string, unknown>) => void;

export enum PasswordChangeValidationKeys {
  MIN_LENGTH_TEST = 'minLengthTest',
  CHAR_CASE_TEST = 'caseTest',
  DIGIT_TEST = 'digitTest',
  SPECIAL_CHAR_TEST = 'specialCharTest',
  SAME_TEST = 'sameTest',
}

export interface RMDetails {
  id: string;
  name: string;
  photo: string;
}

export enum SubjectOptionKeys {
  FINANCIAL = 'financial',
  GENERAL = 'general',
  RELATION_MGR = 'relationMgr',
  SUPPORT = 'support',
  UPDATE_DETAILS = 'updateDetails',
}
