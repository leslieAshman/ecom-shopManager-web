/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ContentType {
  Article = "Article",
  Video = "Video",
}

export enum DocType {
  cwi_portal_event = "cwi_portal_event",
  cwi_portal_learning_hub = "cwi_portal_learning_hub",
  cwi_portal_offer = "cwi_portal_offer",
  cwi_portal_rms = "cwi_portal_rms",
}

export enum DocumentStatus {
  current = "current",
  previous = "previous",
}

export enum PortalEmailValidationStatus {
  Invalid = "Invalid",
  Registered = "Registered",
  Valid = "Valid",
}

export interface AuthChangePasswordInput {
  clientId: string;
  passwordCurrent: string;
  passwordNew: string;
  passwordConfirm: string;
}

export interface AuthGetMfaAuthenticatorsRequestInput {
  mfaToken: string;
}

export interface AuthLoginRequestInput {
  clientId?: string | null;
  emailAddress: string;
  password: string;
}

export interface AuthMfaChallengeRequestInput {
  authenticatorId: string;
  clientId: string;
  mfaToken: string;
}

export interface AuthMfaOobCodeVerifyRequestInput {
  clientId: string;
  mfaOobCode: string;
  mfaOtpCode: string;
  mfaToken: string;
}

export interface AuthRefreshAccessTokenRequestInput {
  clientId: string;
  refreshToken: string;
}

export interface AuthResetPasswordInput {
  clientId: string;
  emailAddress: string;
}

export interface ContactRmInput {
  subject: string;
  message: string;
  contactMethod: string;
  contactMethodValue: string;
}

export interface DocumentQueryInput {
  page: number;
  pageSize: number;
  docType: DocType;
  docStatus?: DocumentStatus | null;
  locations?: string[] | null;
}

export interface MarkNotificationsReadRequest {
  ids: string[];
  isRead: boolean;
}

export interface PortalAuthRegisterUserInput {
  emailAddress: string;
  password: string;
  passwordConfirmation: string;
  registeredByApp: string;
}

export interface PortalBuyWineRequestInput {
  holdingId: string;
  qty: number;
  purchasePrice: number;
  requestPrice: number;
}

export interface PortalDeliverWineRequestInput {
  id?: string | null;
  holdingId: string;
  rotationNumber?: string | null;
  qty: number;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean | null;
}

export interface PortalInvestNowRequestInput {
  offerTitle: string;
  offerSubTitle: string;
  offerPrice: number;
  numberOfUnits: number;
  totalPrice: number;
  offerExpiryDate: string;
}

export interface PortalSellWineRequestInput {
  holdingId: string;
  qty: number;
  marketPrice: number;
  reservePrice: number;
  reasonForSale: string;
}

export interface StripePaymentInput {
  amount: number;
  portfolioId: number;
}

export interface StripeRecurringPaymentInput {
  currency: string;
  amount: number;
  frequency: string;
  priceId: string;
  portfolioId: number;
  defaultPaymentMethod?: string | null;
}

export interface UpdatePreferencesInput {
  currency?: string | null;
  language?: string | null;
}

export interface UpdateStripeRecurringPaymentInput {
  subscriptionId: string;
  currency: string;
  amount: number;
  frequency: string;
  priceId: string;
  defaultPaymentMethod?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
