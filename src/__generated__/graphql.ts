/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type ActiveMarket = {
  __typename?: 'ActiveMarket';
  assetId: Scalars['Int'];
  highestBid: ActiveMarketOrder;
  imageFileName?: Maybe<Scalars['String']>;
  lowestOffer: ActiveMarketOrder;
  lwin18: Scalars['String'];
  marketValue: Scalars['Float'];
  region: Scalars['String'];
  spread?: Maybe<Scalars['Float']>;
  unitCount: Scalars['Int'];
  unitSize: Scalars['String'];
  vintage: Scalars['Int'];
  wineName: Scalars['String'];
};

export type ActiveMarketOrder = {
  __typename?: 'ActiveMarketOrder';
  createdDate?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
};

export type ActiveMarketResult = {
  __typename?: 'ActiveMarketResult';
  results: Array<ActiveMarket>;
  total: Scalars['Int'];
};

export type AddExternalPortfolioInput = {
  assetId: Scalars['Int'];
  purchaseDate?: InputMaybe<Scalars['String']>;
  purchasePrice?: InputMaybe<Scalars['Float']>;
  quantity: Scalars['Int'];
};

export type AddToWatchListResponse = {
  __typename?: 'AddToWatchListResponse';
  assetId: Scalars['Int'];
  watchlistItemId: Scalars['Int'];
};

export type Address = {
  __typename?: 'Address';
  addressId: Scalars['ID'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  addressLine3?: Maybe<Scalars['String']>;
  country: Scalars['String'];
  county?: Maybe<Scalars['String']>;
  createdDateTime: Scalars['String'];
  postcode: Scalars['String'];
  town: Scalars['String'];
  type: Scalars['String'];
};

export type AddressDeletedResult = {
  __typename?: 'AddressDeletedResult';
  deletedAddressId: Scalars['ID'];
};

export type AddressInput = {
  addressLine1: Scalars['String'];
  addressLine2?: InputMaybe<Scalars['String']>;
  addressLine3?: InputMaybe<Scalars['String']>;
  country: Scalars['String'];
  county?: InputMaybe<Scalars['String']>;
  postcode: Scalars['String'];
  town: Scalars['String'];
  type: Scalars['String'];
};

export type Appellation = {
  __typename?: 'Appellation';
  appellationAuthority?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  parentAppellationId?: Maybe<Scalars['Int']>;
  regionId?: Maybe<Scalars['Int']>;
};

export type Asset = {
  __typename?: 'Asset';
  calculatedMarketData?: Maybe<CalculatedMarketData>;
  id: Scalars['Int'];
  isInWatchList: Scalars['Boolean'];
  lwin11?: Maybe<Scalars['String']>;
  lwin18?: Maybe<Scalars['String']>;
  marketData: MarketData;
  marketValue?: Maybe<Scalars['Float']>;
  openOrders: Array<BookedOrder>;
  provenance?: Maybe<Scalars['String']>;
  recentWineSearcherOffer: OffersResponse;
  releasePrice?: Maybe<Scalars['Float']>;
  spread?: Maybe<OrderSpread>;
  tradingInfo: TradingInfo;
  unitCount: Scalars['Int'];
  unitSize: Scalars['String'];
  unitSizeId?: Maybe<Scalars['Int']>;
  unitVolume?: Maybe<Scalars['Int']>;
  vintage: WineVintage;
  vintages: Array<WineVintage>;
  wineId?: Maybe<Scalars['Int']>;
  wineVintagesId: Scalars['Int'];
};


export type AssetMarketDataArgs = {
  dateFrom?: InputMaybe<Scalars['String']>;
  dateTo?: InputMaybe<Scalars['String']>;
};


export type AssetSpreadArgs = {
  selectLowestOffer?: InputMaybe<Scalars['Boolean']>;
};

export type AssetInstance = {
  __typename?: 'AssetInstance';
  assetId: Scalars['Int'];
  bondedStatus: Scalars['String'];
  entryDate: Scalars['String'];
  id: Scalars['String'];
  location: Scalars['String'];
  purchasePrice: Scalars['Float'];
  traceability: Scalars['String'];
  transferRequested?: Maybe<Scalars['Boolean']>;
  valuation?: Maybe<Scalars['Float']>;
};

export type AuthChangePasswordInput = {
  clientId: Scalars['String'];
  passwordConfirm: Scalars['String'];
  passwordCurrent: Scalars['String'];
  passwordNew: Scalars['String'];
};

export type AuthChangePasswordResponse = {
  __typename?: 'AuthChangePasswordResponse';
  wasPasswordChanged: Scalars['Boolean'];
};

export type AuthGetMfaAuthenticatorsRequestInput = {
  mfaToken: Scalars['String'];
};

export type AuthGetMfaAuthenticatorsResponse = {
  __typename?: 'AuthGetMfaAuthenticatorsResponse';
  mfaAuthenticators: Array<AuthMfaAuthenticator>;
};

export type AuthLoginRequestInput = {
  clientId?: InputMaybe<Scalars['String']>;
  emailAddress: Scalars['String'];
  password: Scalars['String'];
};

export type AuthLoginResponse = {
  __typename?: 'AuthLoginResponse';
  accessToken?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  errorDescription?: Maybe<Scalars['String']>;
  idToken?: Maybe<Scalars['String']>;
  mfaToken?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  scope?: Maybe<Scalars['String']>;
  tokenType?: Maybe<Scalars['String']>;
  userToken?: Maybe<Scalars['String']>;
};

export type AuthMfaAuthenticator = {
  __typename?: 'AuthMfaAuthenticator';
  active: Scalars['Boolean'];
  authenticatorType: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  oobChannel: Scalars['String'];
};

export type AuthMfaChallengeRequestInput = {
  authenticatorId: Scalars['String'];
  clientId: Scalars['String'];
  mfaToken: Scalars['String'];
};

export type AuthMfaChallengeResponse = {
  __typename?: 'AuthMfaChallengeResponse';
  challengeType: Scalars['String'];
  oobCode: Scalars['String'];
};

export type AuthMfaOobCodeVerifyRequestInput = {
  clientId: Scalars['String'];
  mfaOobCode: Scalars['String'];
  mfaOtpCode: Scalars['String'];
  mfaToken: Scalars['String'];
};

export type AuthMfaOobCodeVerifyResponse = {
  __typename?: 'AuthMfaOobCodeVerifyResponse';
  accessToken: Scalars['String'];
  error?: Maybe<Scalars['String']>;
  errorDescription?: Maybe<Scalars['String']>;
  idToken: Scalars['String'];
  refreshToken: Scalars['String'];
  scope: Scalars['String'];
  tokenType: Scalars['String'];
  userToken: Scalars['String'];
};

export type AuthRefreshAccessTokenRequestInput = {
  clientId: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type AuthRefreshAccessTokenResponse = {
  __typename?: 'AuthRefreshAccessTokenResponse';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  userToken: Scalars['String'];
};

export type AuthRegisterUserInput = {
  dateOfBirth?: InputMaybe<Scalars['String']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  hasAgreedToMarketing?: InputMaybe<Scalars['Boolean']>;
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  /** Must be one of "Zellar" or "WebsiteOnboarding" */
  registeredByApp: Scalars['String'];
  residenceCountry?: InputMaybe<Scalars['String']>;
  surname: Scalars['String'];
};

export type AuthResetPasswordInput = {
  clientId: Scalars['String'];
  emailAddress: Scalars['String'];
};

export type AuthResetPasswordResponse = {
  __typename?: 'AuthResetPasswordResponse';
  emailAddress: Scalars['String'];
};

export type AuthUpdateUserDtoInput = {
  dateOfBirth?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  surname: Scalars['String'];
};

export type AuthUser = {
  __typename?: 'AuthUser';
  accountType?: Maybe<Scalars['String']>;
  cultWineId?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  isPhoneNumberVerified: Scalars['Boolean'];
  kycStatus?: Maybe<KycStatus>;
  mitConsentedFlag?: Maybe<Scalars['Boolean']>;
  phoneNumber?: Maybe<Scalars['String']>;
  surname: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
};

export type AuthUserJwtResponse = {
  __typename?: 'AuthUserJwtResponse';
  /** JWT containing representation of the UserDto */
  userToken?: Maybe<Scalars['String']>;
};

export type BaseResultType = {
  __typename?: 'BaseResultType';
  isSuccess: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  messageType?: Maybe<Scalars['String']>;
};

export type Bid = {
  __typename?: 'Bid';
  assetId: Scalars['Int'];
  clientOrderId: Scalars['String'];
  direction: Scalars['Int'];
  filledTime: Scalars['String'];
  filledType: TaskStateEnumType;
  id: Scalars['String'];
  price: Scalars['Int'];
  quantity: Scalars['Int'];
  submittedTimeUtc: Scalars['String'];
  userId: Scalars['String'];
};

export type BidOfferModel = {
  __typename?: 'BidOfferModel';
  clientOrderId?: Maybe<Scalars['String']>;
  direction: Scalars['String'];
  filledTime?: Maybe<Scalars['String']>;
  filledType?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  quantityOutstanding: Scalars['Int'];
  userId: Scalars['String'];
};

export type BidsResult = {
  __typename?: 'BidsResult';
  appellation?: Maybe<Scalars['String']>;
  assetId: Scalars['Int'];
  bidStatus: Scalars['String'];
  calculatedMarketData: CalculatedMarketData;
  date: Scalars['String'];
  docId: Scalars['String'];
  expiryDate: Scalars['String'];
  myBid: Scalars['Float'];
  region: Scalars['String'];
  spread?: Maybe<OrderSpread>;
  unitCount: Scalars['Int'];
  unitSize: Scalars['String'];
  vintage: Scalars['Int'];
  wineName: Scalars['String'];
};

export type BookedOrder = {
  __typename?: 'BookedOrder';
  asset: Asset;
  assetId: Scalars['Int'];
  cancelled: Scalars['Boolean'];
  clientOrderId: Scalars['String'];
  direction: Scalars['Int'];
  executableWindow: ExecutableWindow;
  id: Scalars['ID'];
  outstandingQuantity: Scalars['Int'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  status: Scalars['String'];
  submittedTimeUtc: Scalars['String'];
  userId: Scalars['ID'];
};

export type BuyItNowInitiatedInput = {
  assetId: Scalars['Int'];
  fees?: InputMaybe<Array<FeeItems>>;
  quantity: Scalars['Int'];
  totalPrice: Scalars['Float'];
};

export type BuyItNowInitiatedResponse = {
  __typename?: 'BuyItNowInitiatedResponse';
  clientOrderId?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
  initiated: Scalars['Boolean'];
};

export enum CacheControlScope {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC'
}

export type CalculatedMarketData = {
  __typename?: 'CalculatedMarketData';
  combinedScore?: Maybe<Scalars['Float']>;
  currentPrice?: Maybe<Scalars['Float']>;
  liquidityScore?: Maybe<Scalars['Float']>;
  lwin11?: Maybe<Scalars['String']>;
  lwin18?: Maybe<Scalars['String']>;
  performance: HoldingPerformanceResponse;
};

export type CancelStripeRecurringPaymentResponse = {
  __typename?: 'CancelStripeRecurringPaymentResponse';
  hasCancelled: Scalars['Boolean'];
  subscriptionId: Scalars['String'];
};

export type CardDetailDeletedResult = {
  __typename?: 'CardDetailDeletedResult';
  errorMessage?: Maybe<Scalars['String']>;
  isSuccess?: Maybe<Scalars['Boolean']>;
};

export type CardDetailResponse = {
  __typename?: 'CardDetailResponse';
  clientName?: Maybe<Scalars['String']>;
  defaultMitFlag?: Maybe<Scalars['Boolean']>;
  expiry?: Maybe<Scalars['String']>;
  instrumentId?: Maybe<Scalars['String']>;
  last4?: Maybe<Scalars['String']>;
  mitConsentedFlag?: Maybe<Scalars['Boolean']>;
  scheme?: Maybe<Scalars['String']>;
};

export type CardPaymentInput = {
  amount: Scalars['Float'];
  cardToken?: InputMaybe<Scalars['String']>;
  clientName?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  defaultMitFlag?: InputMaybe<Scalars['Boolean']>;
  failureUrl: Scalars['String'];
  instrumentId?: InputMaybe<Scalars['String']>;
  mitConsentedFlag?: InputMaybe<Scalars['Boolean']>;
  storeCardFlag?: InputMaybe<Scalars['Boolean']>;
  successUrl: Scalars['String'];
};

export type CardPaymentResponse = {
  __typename?: 'CardPaymentResponse';
  errorMessage?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  redirectUrl?: Maybe<Scalars['String']>;
  status: Scalars['String'];
};

export type Channels = {
  __typename?: 'Channels';
  email: Scalars['Boolean'];
  push: Scalars['Boolean'];
};

export type ChannelsInput = {
  email: Scalars['Boolean'];
  push: Scalars['Boolean'];
};

export type Client = {
  __typename?: 'Client';
  phoneNumber: Scalars['String'];
  type: Scalars['String'];
};

export type ConfirmBankTransferResponse = {
  __typename?: 'ConfirmBankTransferResponse';
  errorMessage?: Maybe<Scalars['String']>;
  isSuccess: Scalars['Boolean'];
};

export type ContactRmInput = {
  contactMethod: Scalars['String'];
  contactMethodValue: Scalars['String'];
  message: Scalars['String'];
  subject: Scalars['String'];
};

export type ContactRmResponse = {
  __typename?: 'ContactRmResponse';
  errorMessage?: Maybe<Scalars['String']>;
  isSuccess?: Maybe<Scalars['Boolean']>;
};

export enum ContentType {
  Article = 'Article',
  Video = 'Video'
}

export type CosmosAsset = {
  __typename?: 'CosmosAsset';
  id: Scalars['Int'];
  spread?: Maybe<CosmosSpread>;
  unitCount?: Maybe<Scalars['Int']>;
  unitSize?: Maybe<Scalars['String']>;
  vintage?: Maybe<CosmosVintage>;
};

export type CosmosBidOffer = {
  __typename?: 'CosmosBidOffer';
  price?: Maybe<Scalars['Float']>;
  userId?: Maybe<Scalars['String']>;
};

export type CosmosCalculatedMarketData = {
  __typename?: 'CosmosCalculatedMarketData';
  combinedScore?: Maybe<Scalars['String']>;
};

export type CosmosExecutableWindow = {
  __typename?: 'CosmosExecutableWindow';
  endTime?: Maybe<Scalars['String']>;
};

export type CosmosRegion = {
  __typename?: 'CosmosRegion';
  name?: Maybe<Scalars['String']>;
};

export type CosmosSpread = {
  __typename?: 'CosmosSpread';
  highestBid?: Maybe<CosmosBidOffer>;
  lowestOffer?: Maybe<CosmosBidOffer>;
  percentageDifference?: Maybe<Scalars['String']>;
};

export type CosmosVintage = {
  __typename?: 'CosmosVintage';
  calculatedMarketData?: Maybe<CalculatedMarketData>;
  id?: Maybe<Scalars['Int']>;
  imageFileName?: Maybe<Scalars['String']>;
  vintage?: Maybe<Scalars['Int']>;
  wine?: Maybe<CosmosWine>;
};

export type CosmosWine = {
  __typename?: 'CosmosWine';
  appellation?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  region?: Maybe<CosmosRegion>;
};

export type CreateOrderInput = {
  assetId: Scalars['Int'];
  cancelAt?: InputMaybe<Scalars['String']>;
  fillOrKill?: InputMaybe<Scalars['Boolean']>;
  limitFXExposure?: InputMaybe<Scalars['Boolean']>;
  price?: InputMaybe<Scalars['Float']>;
  quantity: Scalars['Int'];
  targetPortfolioId?: InputMaybe<Scalars['String']>;
  totalPrice?: InputMaybe<Scalars['Float']>;
};

export type DefaultMitCardInput = {
  instrumentId: Scalars['String'];
};

export type DeleteAccountResponse = {
  __typename?: 'DeleteAccountResponse';
  errorMessage?: Maybe<Scalars['String']>;
  isSuccess?: Maybe<Scalars['Boolean']>;
};

export type DetailResult = EventDetail | InvestOfferDetail | LearningHubDetail;

export enum DocType {
  cwi_portal_event = 'cwi_portal_event',
  cwi_portal_learning_hub = 'cwi_portal_learning_hub',
  cwi_portal_offer = 'cwi_portal_offer',
  cwi_portal_rms = 'cwi_portal_rms'
}

export type DocumentQueryInput = {
  docStatus?: InputMaybe<DocumentStatus>;
  docType: DocType;
  locations?: InputMaybe<Array<Scalars['String']>>;
  page: Scalars['Int'];
  pageSize: Scalars['Int'];
};

export type DocumentResult = Event | InvestOffer | LearningHub;

export enum DocumentStatus {
  current = 'current',
  previous = 'previous'
}

export type DocumentsResponse = {
  __typename?: 'DocumentsResponse';
  page: Scalars['Int'];
  resultPerPage: Scalars['Int'];
  resultSize: Scalars['Int'];
  results?: Maybe<Array<DocumentResult>>;
  totalPages: Scalars['Int'];
  totalResultsSize: Scalars['Int'];
};

export type EmailValidationResult = {
  __typename?: 'EmailValidationResult';
  isSuccess?: Maybe<Scalars['Boolean']>;
  result?: Maybe<EmailValidationResultType>;
};

export enum EmailValidationResultType {
  INVALID = 'INVALID',
  REGISTERED = 'REGISTERED',
  VALID = 'VALID'
}

export type Event = {
  __typename?: 'Event';
  country: Scalars['String'];
  dateTime: Scalars['String'];
  id: Scalars['String'];
  locationShort: Scalars['String'];
  mainImage: Scalars['String'];
  price: Scalars['Float'];
  priceCurrency: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['String'];
};

export type EventDetail = {
  __typename?: 'EventDetail';
  content: Scalars['String'];
  country: Scalars['String'];
  dateTime: Scalars['String'];
  eventbriteId: Scalars['String'];
  eventbriteShow: Scalars['Boolean'];
  id: Scalars['String'];
  locationFullAddress: Scalars['String'];
  locationShort: Scalars['String'];
  mainImage: Scalars['String'];
  price: Scalars['Float'];
  priceCurrency: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['String'];
};

export type Event_And_Experience = {
  __typename?: 'Event_And_Experience';
  date: Scalars['String'];
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  location: Scalars['String'];
  price: Scalars['Int'];
  time: Scalars['String'];
  title: Scalars['String'];
};

export type ExecutableWindow = {
  __typename?: 'ExecutableWindow';
  endTime?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['String']>;
};

export type ExternalPortfolioAsset = {
  __typename?: 'ExternalPortfolioAsset';
  addedToExternalPortfolioDate: Scalars['String'];
  asset: Asset;
  assetId: Scalars['Int'];
  calculatedMarketData: CalculatedMarketData;
  id: Scalars['Int'];
  purchaseDate?: Maybe<Scalars['String']>;
  purchasePrice?: Maybe<Scalars['Float']>;
};

export type ExternalPortfolioInstance = {
  __typename?: 'ExternalPortfolioInstance';
  id: Scalars['Int'];
  purchaseDate?: Maybe<Scalars['String']>;
  purchasePrice?: Maybe<Scalars['Float']>;
};

export type FeeItems = {
  type: FeeType;
  value: Scalars['Float'];
};

export enum FeeType {
  TRANSACTION_FEES = 'TRANSACTION_FEES',
  VAT_FEES = 'VAT_FEES'
}

export type FinancialAvailableWithdrawalAmount = {
  __typename?: 'FinancialAvailableWithdrawalAmount';
  currentWithdrawalGbp: Scalars['Float'];
};

export type FinancialOperation = {
  __typename?: 'FinancialOperation';
  operationAmountGbp: Scalars['Float'];
  operationCurrency: Scalars['String'];
  operationDate: Scalars['String'];
  operationSource?: Maybe<Scalars['String']>;
  operationType: OperationType;
};

export type FinancialOperationCapitalInvestment = {
  __typename?: 'FinancialOperationCapitalInvestment';
  totalCapitalInvestedGbp: Scalars['Float'];
  userId: Scalars['String'];
};

export type FinancialOperationCurrentBalance = {
  __typename?: 'FinancialOperationCurrentBalance';
  cultWineId: Scalars['String'];
  currentBalanceGbp: Scalars['Float'];
};

export type FinancialOperationInput = {
  operationAmountGbp: Scalars['Float'];
  operationCurrency: Scalars['String'];
  operationDate: Scalars['String'];
  operationSource?: InputMaybe<Scalars['String']>;
  operationType: OperationType;
};

export type FinancialOperationMonthWiseFlow = {
  __typename?: 'FinancialOperationMonthWiseFlow';
  monthlyExpenses: Array<MonthlyExpense>;
};

export type FinancialRecentOperation = {
  __typename?: 'FinancialRecentOperation';
  operationAmountGbp: Scalars['Float'];
  operationCurrency: Scalars['String'];
  operationDate: Scalars['String'];
  operationSource?: Maybe<Scalars['String']>;
  operationType: Scalars['String'];
  userId: Scalars['String'];
};

export type Get_Stock = {
  __typename?: 'Get_Stock';
  changedPct: Scalars['Int'];
  costPerUnit: Scalars['Int'];
  costWithMgmtFeePerUnit: Scalars['Int'];
  cultWinesAllocationRegion: Scalars['String'];
  dealCCY?: Maybe<Scalars['String']>;
  dealDate: Scalars['String'];
  dealRef: Scalars['String'];
  historicMarketPrices?: Maybe<Array<Maybe<HistoricMarketPrices>>>;
  holdingStocks?: Maybe<Array<Maybe<HoldingStock>>>;
  id: Scalars['String'];
  lwin18: Scalars['Int'];
  mgmtFeePerUnit: Scalars['Int'];
  netPosition: Scalars['Int'];
  netPositionPerUnit: Scalars['Int'];
  portfolioId: Scalars['Int'];
  priceForSale: Scalars['Int'];
  profitAndLoss: Scalars['Int'];
  profitAndLostPerUnit: Scalars['Int'];
  qty: Scalars['Int'];
  qtyForSale: Scalars['Int'];
  region: Scalars['String'];
  totalCost: Scalars['Int'];
  totalCostWithMgmtFee: Scalars['Int'];
  totalMgmtFee: Scalars['Int'];
  totalValue: Scalars['Int'];
  unit?: Maybe<Scalars['String']>;
  unitCount: Scalars['Int'];
  valuePerBottle: Scalars['Int'];
  valuePerUnit: Scalars['Int'];
  vintage: Scalars['String'];
  wineName: Scalars['String'];
};

export type HistoricMarketPriceItem = {
  __typename?: 'HistoricMarketPriceItem';
  date: Scalars['String'];
  marketPrice: Scalars['Float'];
};

export type HistoricMarketPrices = {
  __typename?: 'HistoricMarketPrices';
  date: Scalars['String'];
  marketPrice: Scalars['Int'];
};

export type HistoricalMarketData = {
  __typename?: 'HistoricalMarketData';
  assetId: Scalars['Int'];
  liveX: Scalars['JSON'];
  lwin18: Scalars['String'];
  wineSearcher: Scalars['JSON'];
};

export type HistoricalMarketDataChange = {
  __typename?: 'HistoricalMarketDataChange';
  assetId: Scalars['Int'];
  liveX: Scalars['JSON'];
  lwin18: Scalars['String'];
  wineSearcher: Scalars['JSON'];
};

export type Holding = {
  __typename?: 'Holding';
  assetId: Scalars['Int'];
  buyingTransactionId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  sellingTransactionId?: Maybe<Scalars['String']>;
  soldTransactionDate?: Maybe<Scalars['String']>;
  soldTransactionPrice?: Maybe<Scalars['Float']>;
  unitSizeId: Scalars['Int'];
  vintageId: Scalars['Int'];
};

export type HoldingItem = {
  __typename?: 'HoldingItem';
  activeOfferQuantity: Scalars['Int'];
  totalMarketValuation: Scalars['Float'];
  totalPurchasePrice: Scalars['Float'];
  totalQuantityOwned: Scalars['Int'];
};

export type HoldingPerformanceResponse = {
  __typename?: 'HoldingPerformanceResponse';
  percentageDifference?: Maybe<Scalars['Float']>;
  valueDifference?: Maybe<Scalars['Float']>;
};

export type HoldingPurchaseDateDto = {
  __typename?: 'HoldingPurchaseDateDto';
  purchaseDate?: Maybe<Scalars['String']>;
  purchasePrice?: Maybe<Scalars['Float']>;
};

export type HoldingResponse = {
  __typename?: 'HoldingResponse';
  assetId: Scalars['Int'];
  buyingTransactionId: Scalars['Int'];
  sellingTransactionId?: Maybe<Scalars['Int']>;
  unitSizeId: Scalars['Int'];
  vintageId: Scalars['Int'];
};

export type HoldingResult = {
  __typename?: 'HoldingResult';
  appellation?: Maybe<Scalars['String']>;
  assetId: Scalars['Int'];
  calculatedMarketData: CalculatedMarketData;
  cultWineId: Scalars['String'];
  docId: Scalars['String'];
  drinkingWindow: WineVintageDrinkingWindow;
  holding: HoldingItem;
  marketValue: Scalars['Float'];
  portfolioId: Scalars['Int'];
  region: Scalars['String'];
  score: Scalars['Int'];
  spread?: Maybe<OrderSpread>;
  totalPurchasedPrice: Scalars['Float'];
  unitCount: Scalars['Int'];
  unitSize: Scalars['String'];
  vintage: Scalars['Int'];
  wineName: Scalars['String'];
};

export type HoldingStock = {
  __typename?: 'HoldingStock';
  location: Scalars['String'];
  rotationNumber: Scalars['String'];
  status: Scalars['String'];
};

export type HoldingTimeSeries = {
  __typename?: 'HoldingTimeSeries';
  date: Scalars['String'];
  holdings: Array<HoldingResponse>;
};

export type HubSpotCustomer = {
  __typename?: 'HubSpotCustomer';
  addressline1?: Maybe<Scalars['String']>;
  addressline2?: Maybe<Scalars['String']>;
  addressline3?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  postCode?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type IBookedOrder = {
  __typename?: 'IBookedOrder';
  assetId: Scalars['Int'];
  direction: Scalars['Int'];
  id: Scalars['ID'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  status: Scalars['String'];
  submittedTimeUtc: Scalars['String'];
  userId: Scalars['ID'];
};

export type IFilledOrder = {
  __typename?: 'IFilledOrder';
  assetId: Scalars['Int'];
  direction: Scalars['Int'];
  filledType: OrderFillType;
  id: Scalars['ID'];
  originalOrder: IBookedOrder;
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  submittedTimeUtc: Scalars['String'];
  userId: Scalars['ID'];
};

export type ImsRegionSummary = {
  __typename?: 'ImsRegionSummary';
  regionName: Scalars['String'];
  totalBottles: Scalars['Int'];
};

export type InvestOffer = {
  __typename?: 'InvestOffer';
  expiryDate: Scalars['String'];
  id: Scalars['String'];
  mainImage: Scalars['String'];
  name: Scalars['String'];
  priceGbp: Scalars['Float'];
  region: Scalars['String'];
  subtitle: Scalars['String'];
  type: Scalars['String'];
  unitSize: Scalars['String'];
};

export type InvestOfferDetail = {
  __typename?: 'InvestOfferDetail';
  disclaimer?: Maybe<Scalars['String']>;
  expiryDate: Scalars['String'];
  id: Scalars['String'];
  mainImage: Scalars['String'];
  name: Scalars['String'];
  priceGbp: Scalars['Float'];
  region: Scalars['String'];
  sections?: Maybe<Array<OfferSection>>;
  subtitle: Scalars['String'];
  type: Scalars['String'];
  unitSize: Scalars['String'];
};

export type KycInitiateInput = {
  addressLine1: Scalars['String'];
  addressLine2?: InputMaybe<Scalars['String']>;
  addressLine3?: InputMaybe<Scalars['String']>;
  country: Scalars['String'];
  county: Scalars['String'];
  dob: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  middleName?: InputMaybe<Scalars['String']>;
  postcode: Scalars['String'];
  town?: InputMaybe<Scalars['String']>;
};

export type KycInitiateResponse = {
  __typename?: 'KycInitiateResponse';
  errorMessage?: Maybe<Scalars['String']>;
  isKycInitiated: Scalars['Boolean'];
};

export enum KycStatus {
  failed = 'failed',
  not_attempted = 'not_attempted',
  pending = 'pending',
  successful = 'successful'
}

export type LearningHub = {
  __typename?: 'LearningHub';
  contentShort: Scalars['String'];
  contentType: ContentType;
  id: Scalars['String'];
  mainImage: Scalars['String'];
  publishDate: Scalars['String'];
  title: Scalars['String'];
};

export type LearningHubDetail = {
  __typename?: 'LearningHubDetail';
  contentLong: Scalars['String'];
  contentShort: Scalars['String'];
  contentType: ContentType;
  id: Scalars['String'];
  mainImage: Scalars['String'];
  publishDate: Scalars['String'];
  title: Scalars['String'];
  videoUrl?: Maybe<Scalars['String']>;
};

export type Learning_Hub = {
  __typename?: 'Learning_Hub';
  date: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type LiveActiveMarket = {
  __typename?: 'LiveActiveMarket';
  assetId: Scalars['Int'];
  highestBid?: Maybe<ActiveMarketOrder>;
  imageFileName?: Maybe<Scalars['String']>;
  lowestOffer?: Maybe<ActiveMarketOrder>;
  lwin18: Scalars['String'];
  marketValue?: Maybe<Scalars['Float']>;
  region?: Maybe<Scalars['String']>;
  spread?: Maybe<Scalars['Float']>;
  toBeRemove?: Maybe<Scalars['Boolean']>;
  unitCount?: Maybe<Scalars['Int']>;
  unitSize?: Maybe<Scalars['String']>;
  vintage?: Maybe<Scalars['Int']>;
  wineName?: Maybe<Scalars['String']>;
};

export type LiveActiveMarketResult = {
  __typename?: 'LiveActiveMarketResult';
  result: LiveActiveMarket;
  total: Scalars['Int'];
};

export type LivexIndexHistory = {
  __typename?: 'LivexIndexHistory';
  annualPercentageChange: Scalars['String'];
  historicalData: Scalars['JSON'];
  id: Scalars['Int'];
  lastMonthValue: Scalars['String'];
  name: Scalars['String'];
};

export type LoginInput = {
  clientId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  isStaff?: InputMaybe<Scalars['Boolean']>;
  password: Scalars['String'];
  pushToken?: InputMaybe<Scalars['String']>;
  shopRef?: InputMaybe<Scalars['String']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  isSuccess: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  messageType?: Maybe<Scalars['String']>;
  result?: Maybe<User>;
  userToken?: Maybe<Scalars['String']>;
};

export type MarkNotificationsReadRequest = {
  ids: Array<Scalars['String']>;
  isRead: Scalars['Boolean'];
};

export type MarketData = {
  __typename?: 'MarketData';
  liveX: Scalars['JSON'];
  lwin18?: Maybe<Scalars['String']>;
  wineSearcher: Scalars['JSON'];
};

export type MgmtFeeDetail = {
  __typename?: 'MgmtFeeDetail';
  applied: Scalars['Int'];
  feeAmount: Scalars['Int'];
  feeType: Scalars['String'];
  id: Scalars['String'];
  invoiceDate: Scalars['String'];
  invoiceNumber: Scalars['String'];
  name: Scalars['String'];
  offsetValue?: Maybe<Scalars['String']>;
  portfolioValue?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
  valuationDate: Scalars['String'];
};

export type MiscellaneousItem = {
  __typename?: 'MiscellaneousItem';
  iconUrl?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  symbol?: Maybe<Scalars['String']>;
  text: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type MiscellaneousType = {
  __typename?: 'MiscellaneousType';
  currencies?: Maybe<Array<Maybe<MiscellaneousItem>>>;
  languages?: Maybe<Array<Maybe<MiscellaneousItem>>>;
  paymentFrequencies?: Maybe<Array<Maybe<MiscellaneousItem>>>;
};

export type MonthlyExpense = {
  __typename?: 'MonthlyExpense';
  inward: Scalars['Float'];
  monthDate: Scalars['String'];
  monthName: Scalars['String'];
  outward: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  accountDeletion: DeleteAccountResponse;
  addAssetToWatchList: AddToWatchListResponse;
  /**
   * Connect device to push notifications
   *
   * Equivalent to POST /UserDeviceTokens
   */
  addUserDeviceToken: UserDeviceToken;
  /**
   * Allow user to change password.
   *
   * Equivalent to POST /Auth/ChangePassword
   */
  authChangePassword: AuthChangePasswordResponse;
  /**
   * Sign in via Auth0
   *
   * Equivalent to POST /Auth/Login
   */
  authLogin: AuthLoginResponse;
  authMfaAuthenticators: AuthGetMfaAuthenticatorsResponse;
  authMfaChallenge: AuthMfaChallengeResponse;
  /** Verify code sent to oob authenticator (e.g. code sent to email) */
  authMfaVerify: AuthMfaOobCodeVerifyResponse;
  /**
   * Get fresh access token from refresh token
   *
   * Equivalent to POST /Auth/RefreshAccessToken
   */
  authRefreshAccessToken: AuthRefreshAccessTokenResponse;
  /** Create new user record and also create equivalent Authentication Provider record */
  authRegister: AuthUser;
  /**
   * If there is no user found with the specified address, this endpoint will still return a 200 response.
   *
   * Equivalent to POST /Auth/ResetPassword
   */
  authResetPassword: AuthResetPasswordResponse;
  /**
   * Update user record
   *
   * Equivalent to PUT /Auth/User
   */
  authUserUpdate: AuthUser;
  bid: Scalars['ID'];
  buyItNow: BuyItNowInitiatedResponse;
  cancelOrder: Scalars['ID'];
  cancelStripeRecurringPayment: CancelStripeRecurringPaymentResponse;
  confirmManualBankTransfer: ConfirmBankTransferResponse;
  createCardPayment: CardPaymentResponse;
  createPaymentResource: Scalars['String'];
  createStripePayment: StripePaymentResponse;
  createStripeRecurringPayment: StripeRecurringPaymentResponse;
  deleteAssetFromWatchList: Scalars['Int'];
  deleteCardDetail: CardDetailDeletedResult;
  empty?: Maybe<Scalars['String']>;
  externalPortfolioAddExternalPortfolio: Scalars['Int'];
  externalPortfolioDeleteExternalPortfolio: Scalars['Boolean'];
  externalPortfolioRemoveFromExternalPortfolio: Scalars['Int'];
  /** Kyc initiate */
  kycInitiate: KycInitiateResponse;
  /** Equivalent to POST /ReadNotifications */
  markNotificationsRead: Scalars['Boolean'];
  offer: Scalars['ID'];
  portalAuthLogin: AuthLoginResponse;
  portalAuthMfaAuthenticators: AuthGetMfaAuthenticatorsResponse;
  portalAuthMfaChallenge: AuthMfaChallengeResponse;
  portalAuthMfaVerify: AuthMfaOobCodeVerifyResponse;
  portalAuthRegister: AuthUser;
  portalAuthResetPassword: AuthResetPasswordResponse;
  portalBuyWine: PortalProcessWineResponse;
  portalContactRelationshipManger: ContactRmResponse;
  portalDeliverWine: PortalProcessWineResponse;
  portalInvestNow: PortalProcessWineResponse;
  portalSellWine: PortalProcessWineResponse;
  portalUpdatePreferences: PortalClientPreferencesResponse;
  registerUser?: Maybe<BaseResultType>;
  /**
   * Remove device from push notifications
   *
   * Equivalent to DELETE /UserDeviceTokens
   */
  removeUserDeviceToken: Scalars['Boolean'];
  /**
   * Search bids in Elastic Search
   *
   * Equivalent to GET /Search/SearchBid with indexName 'bid'
   */
  searchBids: SearchBidsResult;
  /**
   * Search holdings in Elastic Search
   *
   * Equivalent to GET /Search/SearchHolding with indexName 'holding'
   */
  searchHoldings: SearchHoldingResult;
  /**
   * Search offers in Elastic Search
   *
   * Equivalent to GET /Search/SearchOffer with indexName 'offer'
   */
  searchOffers: SearchOffersResult;
  /**
   * Search watchlist in Elastic Search
   *
   * Equivalent to GET /Search/SearchWatchlist with indexName 'watchlist'
   */
  searchWatchlist: SearchWatchlistResult;
  /**
   * Search wine vintages in Elastic Search
   *
   * Equivalent to GET /Search/SearchWineVintages with indexName 'wine-vintage'
   */
  searchWineVintages: SearchWineVintagesResult;
  transferInventoryOut: Array<Scalars['String']>;
  /**
   * Patch category
   *
   * Equivalent to PATCH /UpdateCategory
   */
  updateCategory: NotificationCategory;
  /**
   * Patch category type
   *
   * Equivalent to PATCH /UpdateCategoryType
   */
  updateCategoryType: NotificationCategoryType;
  updateDefaultMitCard: UpdateDefaultMitCardResponse;
  updateMitConsent: UpdateMitConsentResponse;
  /** Equivalent to Patch /UpdateNotification */
  updateNotification: Notification;
  updateStripeRecurringPayment: UpdateStripeRecurringPaymentResponse;
  withdrawConfirmation: WithdrawConfirmationResponse;
  zellarClientAddAddress: Address;
  zellarClientDeleteAddress: AddressDeletedResult;
  zellarClientUpdateAddress: Address;
};


export type MutationAddAssetToWatchListArgs = {
  assetId: Scalars['Int'];
};


export type MutationAddUserDeviceTokenArgs = {
  deviceId: Scalars['String'];
  platform: Scalars['Int'];
};


export type MutationAuthChangePasswordArgs = {
  changePasswordInput: AuthChangePasswordInput;
};


export type MutationAuthLoginArgs = {
  loginRequestInput: AuthLoginRequestInput;
};


export type MutationAuthMfaAuthenticatorsArgs = {
  getMfaAuthenticatorsRequestInput: AuthGetMfaAuthenticatorsRequestInput;
};


export type MutationAuthMfaChallengeArgs = {
  mfaChallengeRequestInput: AuthMfaChallengeRequestInput;
};


export type MutationAuthMfaVerifyArgs = {
  mfaOobCodeVerifyRequestInput: AuthMfaOobCodeVerifyRequestInput;
};


export type MutationAuthRefreshAccessTokenArgs = {
  refreshAccessTokenRequestInput: AuthRefreshAccessTokenRequestInput;
};


export type MutationAuthRegisterArgs = {
  registerUserInput: AuthRegisterUserInput;
};


export type MutationAuthResetPasswordArgs = {
  resetPasswordInput: AuthResetPasswordInput;
};


export type MutationAuthUserUpdateArgs = {
  updateUserInput: AuthUpdateUserDtoInput;
};


export type MutationBidArgs = {
  createOrderInput: CreateOrderInput;
};


export type MutationBuyItNowArgs = {
  buyItNowInitiatedInput?: InputMaybe<BuyItNowInitiatedInput>;
};


export type MutationCancelOrderArgs = {
  orderId: Scalars['ID'];
};


export type MutationCancelStripeRecurringPaymentArgs = {
  recurringPaymentId: Scalars['String'];
};


export type MutationCreateCardPaymentArgs = {
  cardPayment: CardPaymentInput;
};


export type MutationCreatePaymentResourceArgs = {
  paymentResource: PaymentResourceInput;
};


export type MutationCreateStripePaymentArgs = {
  stripePayment: StripePaymentInput;
};


export type MutationCreateStripeRecurringPaymentArgs = {
  stripeRecurringPayment: StripeRecurringPaymentInput;
};


export type MutationDeleteAssetFromWatchListArgs = {
  assetId: Scalars['Int'];
};


export type MutationDeleteCardDetailArgs = {
  instrumentId: Scalars['String'];
};


export type MutationExternalPortfolioAddExternalPortfolioArgs = {
  externalPortfolio?: InputMaybe<AddExternalPortfolioInput>;
};


export type MutationExternalPortfolioRemoveFromExternalPortfolioArgs = {
  externalPortfolioId: Scalars['Int'];
};


export type MutationKycInitiateArgs = {
  kycInitiateInput: KycInitiateInput;
};


export type MutationMarkNotificationsReadArgs = {
  request: MarkNotificationsReadRequest;
};


export type MutationOfferArgs = {
  createOrderInput: CreateOrderInput;
};


export type MutationPortalAuthLoginArgs = {
  loginRequestInput: AuthLoginRequestInput;
};


export type MutationPortalAuthMfaAuthenticatorsArgs = {
  getMfaAuthenticatorsRequestInput: AuthGetMfaAuthenticatorsRequestInput;
};


export type MutationPortalAuthMfaChallengeArgs = {
  mfaChallengeRequestInput: AuthMfaChallengeRequestInput;
};


export type MutationPortalAuthMfaVerifyArgs = {
  mfaOobCodeVerifyRequestInput: AuthMfaOobCodeVerifyRequestInput;
};


export type MutationPortalAuthRegisterArgs = {
  registerUserInput: PortalAuthRegisterUserInput;
};


export type MutationPortalAuthResetPasswordArgs = {
  resetPasswordInput: AuthResetPasswordInput;
};


export type MutationPortalBuyWineArgs = {
  portalBuyWineRequest: PortalBuyWineRequestInput;
};


export type MutationPortalContactRelationshipMangerArgs = {
  request: ContactRmInput;
};


export type MutationPortalDeliverWineArgs = {
  portalDeliverWineRequest: PortalDeliverWineRequestInput;
};


export type MutationPortalInvestNowArgs = {
  portalInvestNowRequest: PortalInvestNowRequestInput;
};


export type MutationPortalSellWineArgs = {
  portalSellWineRequest: PortalSellWineRequestInput;
};


export type MutationPortalUpdatePreferencesArgs = {
  request: UpdatePreferencesInput;
};


export type MutationRegisterUserArgs = {
  userCredentials: RegisterInput;
};


export type MutationRemoveUserDeviceTokenArgs = {
  id: Scalars['String'];
};


export type MutationSearchBidsArgs = {
  filterNames: Array<Scalars['String']>;
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
  preQueryString?: InputMaybe<Scalars['String']>;
  queryString: Scalars['String'];
  sortFilter?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type MutationSearchHoldingsArgs = {
  filterNames: Array<Scalars['String']>;
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
  preQueryString?: InputMaybe<Scalars['String']>;
  queryString: Scalars['String'];
  sortFilter?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type MutationSearchOffersArgs = {
  filterNames: Array<Scalars['String']>;
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
  preQueryString?: InputMaybe<Scalars['String']>;
  queryString: Scalars['String'];
  sortFilter?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type MutationSearchWatchlistArgs = {
  filterNames: Array<Scalars['String']>;
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
  preQueryString?: InputMaybe<Scalars['String']>;
  queryString: Scalars['String'];
  sortFilter?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type MutationSearchWineVintagesArgs = {
  filterNames: Array<Scalars['String']>;
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
  preQueryString?: InputMaybe<Scalars['String']>;
  queryString: Scalars['String'];
  sortFilter?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
};


export type MutationTransferInventoryOutArgs = {
  assetUnitIds: Array<Scalars['String']>;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['String'];
  payload: Scalars['JSON'];
};


export type MutationUpdateCategoryTypeArgs = {
  id: Scalars['String'];
  payload: Scalars['JSON'];
};


export type MutationUpdateDefaultMitCardArgs = {
  defaultMitCard: DefaultMitCardInput;
};


export type MutationUpdateMitConsentArgs = {
  updateMitConsentInput: UpdateMitConsentInput;
};


export type MutationUpdateNotificationArgs = {
  id: Scalars['String'];
  payload: Scalars['JSON'];
};


export type MutationUpdateStripeRecurringPaymentArgs = {
  request: UpdateStripeRecurringPaymentInput;
};


export type MutationWithdrawConfirmationArgs = {
  input: WithdrawConfirmationInput;
};


export type MutationZellarClientAddAddressArgs = {
  address: AddressInput;
};


export type MutationZellarClientDeleteAddressArgs = {
  addressId: Scalars['String'];
};


export type MutationZellarClientUpdateAddressArgs = {
  address: AddressInput;
  addressId: Scalars['String'];
};

export type MyTrades = {
  __typename?: 'MyTrades';
  asset: Asset;
  assetId: Scalars['Int'];
  bid: Bid;
  bookingEngineId: Scalars['String'];
  id: Scalars['String'];
  offer: Offer;
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  size: Scalars['Int'];
  totalPrice: Scalars['Float'];
  tradeTime: Scalars['String'];
};

export type Notification = {
  __typename?: 'Notification';
  body: Scalars['String'];
  category: Scalars['String'];
  createdDateTime: Scalars['String'];
  dateTime: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isRead: Scalars['Boolean'];
  subject: Scalars['String'];
  summary: Scalars['String'];
  type: Scalars['String'];
  updatedDateTime?: Maybe<Scalars['String']>;
};

export type NotificationCategory = {
  __typename?: 'NotificationCategory';
  channels: Channels;
  id: Scalars['String'];
  name: Scalars['String'];
  types: Array<NotificationCategoryType>;
};

export type NotificationCategoryInput = {
  channels: ChannelsInput;
  id: Scalars['String'];
  name: Scalars['String'];
  types: Array<NotificationCategoryTypeInput>;
};

export type NotificationCategoryType = {
  __typename?: 'NotificationCategoryType';
  description: Scalars['String'];
  id: Scalars['String'];
  isEnabled: Scalars['Boolean'];
  name: Scalars['String'];
};

export type NotificationCategoryTypeInput = {
  description: Scalars['String'];
  id: Scalars['String'];
  isEnabled: Scalars['Boolean'];
  name: Scalars['String'];
};

export type NotificationResponse = {
  __typename?: 'NotificationResponse';
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
  results: Array<Notification>;
  total: Scalars['Int'];
  totalPages: Scalars['Int'];
  unreadCount: Scalars['Int'];
};

export type NotificationSettingsResponse = {
  __typename?: 'NotificationSettingsResponse';
  categories: Array<NotificationCategory>;
};

export type Offer = {
  __typename?: 'Offer';
  assetId: Scalars['Int'];
  clientOrderId: Scalars['String'];
  direction: Scalars['Int'];
  filledTime: Scalars['String'];
  filledType: TaskStateEnumType;
  id: Scalars['String'];
  price: Scalars['Int'];
  quantity: Scalars['Int'];
  submittedTimeUtc: Scalars['String'];
  userId: Scalars['String'];
};

export type OfferSection = {
  __typename?: 'OfferSection';
  content: Scalars['String'];
  title: Scalars['String'];
};

export type OffersResponse = {
  __typename?: 'OffersResponse';
  offers: Array<WineSearcherOffer>;
};

export type OffersResult = {
  __typename?: 'OffersResult';
  appellation?: Maybe<Scalars['String']>;
  assetId: Scalars['Int'];
  calculatedMarketData: CalculatedMarketData;
  date: Scalars['String'];
  docId: Scalars['String'];
  expiryDate: Scalars['String'];
  myOffer: Scalars['Float'];
  offerStatus: Scalars['String'];
  region: Scalars['String'];
  spread?: Maybe<OrderSpread>;
  unitCount: Scalars['Int'];
  unitSize: Scalars['String'];
  vintage: Scalars['Int'];
  wineName: Scalars['String'];
};

export enum OperationType {
  Adjustment = 'Adjustment',
  Fresh = 'Fresh',
  Purchase = 'Purchase',
  Refund = 'Refund',
  Sale = 'Sale'
}

export type Order = {
  __typename?: 'Order';
  asset: CosmosAsset;
  cancelled?: Maybe<Scalars['String']>;
  direction: Scalars['String'];
  executableWindow?: Maybe<CosmosExecutableWindow>;
  id: Scalars['String'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  status: Scalars['String'];
  userId: Scalars['String'];
};

export type OrderBook = {
  __typename?: 'OrderBook';
  assetId: Scalars['Int'];
  bids?: Maybe<Array<Maybe<OrderBookdBidOffer>>>;
  lastTradeDate?: Maybe<Scalars['String']>;
  offers?: Maybe<Array<Maybe<OrderBookdBidOffer>>>;
};

export type OrderBookdBidOffer = {
  __typename?: 'OrderBookdBidOffer';
  direction: Scalars['Int'];
  orderId: Scalars['String'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  quantityOutstanding: Scalars['Int'];
};

export enum OrderFillType {
  _1 = '_1',
  _2 = '_2'
}

export type OrderSpread = {
  __typename?: 'OrderSpread';
  highestBid?: Maybe<SpreadOrder>;
  lowestOffer?: Maybe<SpreadOrder>;
  percentageDifference?: Maybe<Scalars['Float']>;
};

export type PaymentResourceInput = {
  amount: Scalars['Float'];
  returnUri: Scalars['String'];
};

export type PortaBalanceAndInvestmentValues = {
  __typename?: 'PortaBalanceAndInvestmentValues';
  balances?: Maybe<Array<Maybe<PortalCashBalanceItem>>>;
  todayInvestment: Scalars['Float'];
};

export type PortalAnnualisedReturnItem = {
  __typename?: 'PortalAnnualisedReturnItem';
  date: Scalars['String'];
  value: Scalars['Float'];
};

export type PortalAuthRegisterUserInput = {
  emailAddress: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  registeredByApp: Scalars['String'];
  residenceCountry?: InputMaybe<Scalars['String']>;
};

export type PortalBuyWineRequestInput = {
  holdingId: Scalars['String'];
  purchasePrice: Scalars['Float'];
  qty: Scalars['Int'];
  requestPrice: Scalars['Float'];
};

export type PortalCashBalanceItem = {
  __typename?: 'PortalCashBalanceItem';
  balance: Scalars['Float'];
  portfolioId?: Maybe<Scalars['Int']>;
  portfolioName: Scalars['String'];
};

export type PortalClientPreferencesResponse = {
  __typename?: 'PortalClientPreferencesResponse';
  currency: Scalars['String'];
  language: Scalars['String'];
};

export type PortalCurrentHoldingItem = {
  __typename?: 'PortalCurrentHoldingItem';
  changedPct: Scalars['Float'];
  costPerUnit: Scalars['Float'];
  costWithMgmtFeePerUnit: Scalars['Float'];
  cultWinesAllocationRegion: Scalars['String'];
  dealCCY?: Maybe<Scalars['String']>;
  dealDate: Scalars['String'];
  dealRef: Scalars['String'];
  historicMarketPrices?: Maybe<Array<Maybe<HistoricMarketPriceItem>>>;
  id: Scalars['String'];
  imageFileName?: Maybe<Scalars['String']>;
  lwin11: Scalars['String'];
  lwin18: Scalars['String'];
  mgmtFeePerUnit: Scalars['Float'];
  netPosition: Scalars['Float'];
  netPositionPerUnit: Scalars['Float'];
  portfolioId: Scalars['Int'];
  priceForSale?: Maybe<Scalars['Float']>;
  profitAndLoss: Scalars['Float'];
  profitAndLossPerUnit: Scalars['Float'];
  qty: Scalars['Int'];
  qtyForSale: Scalars['Int'];
  region: Scalars['String'];
  totalCost: Scalars['Float'];
  totalCostWithMgmtFee: Scalars['Float'];
  totalMgmtFee: Scalars['Float'];
  totalValue: Scalars['Float'];
  unit: Scalars['String'];
  unitCount: Scalars['Int'];
  valuePerBottle: Scalars['Float'];
  valuePerUnit: Scalars['Float'];
  vintage?: Maybe<Scalars['Int']>;
  wineName: Scalars['String'];
};

export type PortalDeliverWineRequestInput = {
  address1: Scalars['String'];
  address2: Scalars['String'];
  address3: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  holdingId: Scalars['String'];
  id?: InputMaybe<Scalars['String']>;
  isDefault?: InputMaybe<Scalars['Boolean']>;
  qty: Scalars['Int'];
  rotationNumber?: InputMaybe<Scalars['String']>;
  state: Scalars['String'];
  zip: Scalars['String'];
};

export type PortalEmailValidationResponse = {
  __typename?: 'PortalEmailValidationResponse';
  status?: Maybe<PortalEmailValidationStatus>;
};

export enum PortalEmailValidationStatus {
  Invalid = 'Invalid',
  Registered = 'Registered',
  Valid = 'Valid'
}

export type PortalExternalHoldingItem = {
  __typename?: 'PortalExternalHoldingItem';
  cashOffer: Scalars['Float'];
  changedPct?: Maybe<Scalars['Float']>;
  costPerUnit?: Maybe<Scalars['Float']>;
  createdDate: Scalars['String'];
  cultWinesAllocationRegion: Scalars['String'];
  imageFileName?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  lwin11: Scalars['String'];
  lwin18: Scalars['String'];
  netPosition?: Maybe<Scalars['Float']>;
  qty: Scalars['Int'];
  region: Scalars['String'];
  totalCost?: Maybe<Scalars['Float']>;
  totalValue: Scalars['Float'];
  unit: Scalars['String'];
  unitCount: Scalars['Int'];
  valuePerUnit: Scalars['Float'];
  vintage?: Maybe<Scalars['Int']>;
  wineName: Scalars['String'];
};

export type PortalHoldingDetails = {
  __typename?: 'PortalHoldingDetails';
  changedPct: Scalars['Float'];
  costPerUnit: Scalars['Float'];
  costWithMgmtFeePerUnit: Scalars['Float'];
  cultWinesAllocationRegion: Scalars['String'];
  dealCCY?: Maybe<Scalars['String']>;
  dealDate: Scalars['String'];
  dealRef: Scalars['String'];
  historicMarketPrices?: Maybe<Array<Maybe<HistoricMarketPriceItem>>>;
  holdingStocks?: Maybe<Array<Maybe<PortalHoldingStockItem>>>;
  id: Scalars['String'];
  imageFileName?: Maybe<Scalars['String']>;
  lwin11: Scalars['String'];
  lwin18: Scalars['String'];
  mgmtFeePerUnit: Scalars['Float'];
  netPosition: Scalars['Float'];
  netPositionPerUnit: Scalars['Float'];
  portfolioId: Scalars['Int'];
  priceForSale?: Maybe<Scalars['Float']>;
  profitAndLoss: Scalars['Float'];
  profitAndLossPerUnit: Scalars['Float'];
  qty: Scalars['Int'];
  qtyForSale: Scalars['Int'];
  region: Scalars['String'];
  totalCost: Scalars['Float'];
  totalCostWithMgmtFee: Scalars['Float'];
  totalMgmtFee: Scalars['Float'];
  totalValue: Scalars['Float'];
  unit: Scalars['String'];
  unitCount: Scalars['Int'];
  valuePerBottle: Scalars['Float'];
  valuePerUnit: Scalars['Float'];
  vintage?: Maybe<Scalars['Int']>;
  wineName: Scalars['String'];
};

export type PortalHoldingStockItem = {
  __typename?: 'PortalHoldingStockItem';
  location?: Maybe<Scalars['String']>;
  rotationNumber: Scalars['String'];
  status?: Maybe<Scalars['String']>;
};

export type PortalInvestNowRequestInput = {
  numberOfUnits: Scalars['Int'];
  offerExpiryDate: Scalars['String'];
  offerPrice: Scalars['Float'];
  offerSubTitle: Scalars['String'];
  offerTitle: Scalars['String'];
  totalPrice: Scalars['Float'];
};

export type PortalManagementFeeResponse = {
  __typename?: 'PortalManagementFeeResponse';
  accountHolderName: Scalars['String'];
  appliedPct: Scalars['Float'];
  clientName: Scalars['String'];
  feeAmount: Scalars['Float'];
  feeType: Scalars['String'];
  id: Scalars['String'];
  invoiceDate?: Maybe<Scalars['String']>;
  invoiceNumber?: Maybe<Scalars['Int']>;
  offsetValue?: Maybe<Scalars['Float']>;
  portfolioValue?: Maybe<Scalars['Float']>;
  status: Scalars['String'];
  valuationDate: Scalars['String'];
  vintradeAccountHolderId: Scalars['Int'];
  vintradeClientId: Scalars['String'];
};

export type PortalMyCellarItem = {
  __typename?: 'PortalMyCellarItem';
  cultWinesAllocationRegion: Scalars['String'];
  dealCCY?: Maybe<Scalars['String']>;
  dealDate: Scalars['String'];
  dealRef: Scalars['String'];
  holdingId: Scalars['String'];
  imageFileName?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  lwin11: Scalars['String'];
  lwin18: Scalars['String'];
  portfolioId: Scalars['Int'];
  qty: Scalars['Int'];
  region: Scalars['String'];
  rotationNumber?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  stockId?: Maybe<Scalars['String']>;
  unit: Scalars['String'];
  unitCount: Scalars['Int'];
  vintage?: Maybe<Scalars['Int']>;
  wineName: Scalars['String'];
};

export type PortalMyCellarWineDetailsItem = {
  __typename?: 'PortalMyCellarWineDetailsItem';
  changedPct: Scalars['Float'];
  costPerUnit: Scalars['Float'];
  costWithMgmtFeePerUnit: Scalars['Float'];
  cultWinesAllocationRegion: Scalars['String'];
  dealCCY?: Maybe<Scalars['String']>;
  dealDate: Scalars['String'];
  dealRef: Scalars['String'];
  historicMarketPrices?: Maybe<Array<Maybe<HistoricMarketPriceItem>>>;
  id: Scalars['String'];
  imageFileName?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  lwin11: Scalars['String'];
  lwin18: Scalars['String'];
  mgmtFeePerUnit: Scalars['Float'];
  netPosition: Scalars['Float'];
  netPositionPerUnit: Scalars['Float'];
  portfolioId: Scalars['Int'];
  priceForSale?: Maybe<Scalars['Float']>;
  profitAndLoss: Scalars['Float'];
  profitAndLossPerUnit: Scalars['Float'];
  qty: Scalars['Int'];
  qtyForSale: Scalars['Int'];
  region: Scalars['String'];
  rotationNumber: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  stockId: Scalars['String'];
  totalCost: Scalars['Float'];
  totalCostWithMgmtFee: Scalars['Float'];
  totalMgmtFee: Scalars['Float'];
  totalValue: Scalars['Float'];
  unit: Scalars['String'];
  unitCount: Scalars['Int'];
  valuePerBottle: Scalars['Float'];
  valuePerUnit: Scalars['Float'];
  vintage?: Maybe<Scalars['Int']>;
  wineName: Scalars['String'];
};

export type PortalPerformanceHistoricItem = {
  __typename?: 'PortalPerformanceHistoricItem';
  currentHoldings: Scalars['Float'];
  date: Scalars['String'];
  netContributions: Scalars['Float'];
};

export type PortalPortfolioAnnualisedReturn = {
  __typename?: 'PortalPortfolioAnnualisedReturn';
  monthly?: Maybe<Array<PortalAnnualisedReturnItem>>;
  years?: Maybe<Array<PortalAnnualisedReturnItem>>;
};

export type PortalPortfolioCurrentAllocationItem = {
  __typename?: 'PortalPortfolioCurrentAllocationItem';
  StrategicAllocation: Scalars['Float'];
  currentAllocation: Scalars['Float'];
  regionName: Scalars['String'];
  tacticalAllocation: Scalars['Float'];
};

export type PortalPortfolioCurrentAllocationResponse = {
  __typename?: 'PortalPortfolioCurrentAllocationResponse';
  portalPortfolioCurrentAllocation?: Maybe<Array<Maybe<PortalPortfolioCurrentAllocationItem>>>;
  portalRegionPerformances: Array<PortalRegionPerformanceItem>;
};

export type PortalPortfolioPerformanceItem = {
  __typename?: 'PortalPortfolioPerformanceItem';
  balance: Scalars['Float'];
  balancePending: Scalars['Float'];
  capitalInvested: Scalars['Float'];
  currentFeeModel: Scalars['Boolean'];
  currentHoldings: Scalars['Float'];
  netContributions: Scalars['Float'];
  netPosition: Scalars['Float'];
  netPositionPct: Scalars['Float'];
  netProceedsFromSales: Scalars['Float'];
  portfolioId?: Maybe<Scalars['Int']>;
  portfolioName: Scalars['String'];
  profitAndLoss: Scalars['Float'];
  profitAndLossPct: Scalars['Float'];
  totalMgmtFee: Scalars['Float'];
  totalRefunds: Scalars['Float'];
};

export type PortalProcessWineResponse = {
  __typename?: 'PortalProcessWineResponse';
  errorMessage?: Maybe<Scalars['String']>;
  isSuccess?: Maybe<Scalars['Boolean']>;
};

export type PortalRegionPerformanceItem = {
  __typename?: 'PortalRegionPerformanceItem';
  currentHoldings: Scalars['Float'];
  netPosition: Scalars['Float'];
  netPositionPct: Scalars['Float'];
  regionName: Scalars['String'];
  totalPurchasePrice: Scalars['Float'];
};

export type PortalSellWineRequestInput = {
  holdingId: Scalars['String'];
  marketPrice: Scalars['Float'];
  qty: Scalars['Int'];
  reasonForSale: Scalars['String'];
  reservePrice: Scalars['Float'];
};

export type PortalSoldHoldingItem = {
  __typename?: 'PortalSoldHoldingItem';
  changedPct: Scalars['Float'];
  costPerUnit: Scalars['Float'];
  costWithMgmtFeePerUnit: Scalars['Float'];
  cultWinesAllocationRegion: Scalars['String'];
  dealDate: Scalars['String'];
  dealRef: Scalars['String'];
  imageFileName?: Maybe<Scalars['String']>;
  lwin11: Scalars['String'];
  lwin18: Scalars['String'];
  mgmtFeePerUnit: Scalars['Float'];
  netPosition: Scalars['Float'];
  netPositionPerUnit: Scalars['Float'];
  profitAndLoss: Scalars['Float'];
  profitAndLossPerUnit: Scalars['Float'];
  qtySold: Scalars['Int'];
  region: Scalars['String'];
  soldDate: Scalars['String'];
  soldPricePerUnit: Scalars['Float'];
  status: Scalars['String'];
  totalCost: Scalars['Float'];
  totalCostWithMgmtFee: Scalars['Float'];
  totalMgmtFee: Scalars['Float'];
  totalValue: Scalars['Float'];
  unit: Scalars['String'];
  unitCount: Scalars['Int'];
  vintage?: Maybe<Scalars['Int']>;
  wineName: Scalars['String'];
};

export type Producer = {
  __typename?: 'Producer';
  id: Scalars['Int'];
  name: Scalars['String'];
  title?: Maybe<Scalars['String']>;
};

export type ProfitAndLossHistory_Gql = {
  __typename?: 'ProfitAndLossHistory_GQL';
  date: Scalars['String'];
  profitAndLoss: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  authUser: AuthUser;
  authUserJwt: AuthUserJwtResponse;
  /**
   * Returns user's available balance against which he can make bids
   *
   * Equivalent to GET /api/AvailableBalance/AvailableBalance
   */
  availableBalance: Scalars['Float'];
  availableWithdrawalAmount?: Maybe<FinancialAvailableWithdrawalAmount>;
  calculatedMarketData: CalculatedMarketData;
  customerCards?: Maybe<Array<StripeCardItem>>;
  externalPortfolioUserAssetInstances: Array<ExternalPortfolioInstance>;
  externalPortfolioUserAssets: Array<ExternalPortfolioAsset>;
  externalPortfolioUserHasAsset: Scalars['Boolean'];
  financeCurrentBalance?: Maybe<FinancialOperationCurrentBalance>;
  financeGetMonthlyWiseFlowByMonthRange?: Maybe<FinancialOperationMonthWiseFlow>;
  financeGetRecent: Array<FinancialRecentOperation>;
  financeTotalCapitalInvested?: Maybe<FinancialOperationCapitalInvestment>;
  gainAndLoses: Scalars['Float'];
  /** Get HubSpot Customer */
  getCustomer: HubSpotCustomer;
  /** Get Prismic RM */
  getCustomerRM: RelationshipManager;
  /** Get Prismic Document by id */
  getDocumentById: DetailResult;
  /** Get Prismic Documents by type and status */
  getDocuments: DocumentsResponse;
  getUser?: Maybe<User>;
  hello: Scalars['String'];
  historicalMarketValue: Array<HistoricalMarketData>;
  historicalMarketValueChange: Array<HistoricalMarketDataChange>;
  holdingGetUserHoldingsMarketPrice: Scalars['Float'];
  holdingsCurrent: Array<UserHolding>;
  imsRegionSummary: Array<ImsRegionSummary>;
  inventoriesByDatetimeRange: Scalars['JSON'];
  isAssetExistInAnyHoldings: Scalars['Boolean'];
  isUserHoldingHasAsset: Scalars['Boolean'];
  login?: Maybe<LoginResult>;
  /** Get market depending on the parameters */
  marketData: MarketData;
  miscellaneous?: Maybe<MiscellaneousType>;
  /**
   * Returns a list of all the trades for a specific asset
   *
   * Equivalent to GET /api/OrderBooking/AllTradesByAsset
   */
  omsAllTradesByAsset: Array<Trade>;
  /**
   * Returns a list of users orders
   * Equivalent to GET /api/OrderBooking/MyOrders
   */
  omsGetMyOrders: Array<BookedOrder>;
  /**
   * Returns a list of users trades
   * Equivalent to GET /api/OrderBooking/MyTrades
   */
  omsGetMyTrades: Array<MyTrades>;
  /** Returns highest bid and lowest offer for given asset id */
  omsSpreadByAssetId: OrderSpread;
  /**
   * Returns a list of all the booked orders for a specific Id
   *
   * Equivalent to GET /api/OrderBooking/AllOrdersByAssetId
   */
  openOrders: Array<BookedOrder>;
  paymentGetCardDetails?: Maybe<Array<CardDetailResponse>>;
  paymentReferenceNumber?: Maybe<Scalars['String']>;
  /** Portal client cash balance */
  portalCashBalance: PortaBalanceAndInvestmentValues;
  portalClientPreferences?: Maybe<PortalClientPreferencesResponse>;
  /** Portal portfolio current holdings */
  portalCurrentHoldings: Array<PortalCurrentHoldingItem>;
  /** Portal portfolio external holdings */
  portalExternalHoldings?: Maybe<Array<PortalExternalHoldingItem>>;
  /** Portal portfolio holding details */
  portalHoldingDetails?: Maybe<PortalHoldingDetails>;
  /** Get Customer Management Fees */
  portalManagementFees: Array<Maybe<PortalManagementFeeResponse>>;
  /** Portal my cellar */
  portalMyCellar?: Maybe<Array<PortalMyCellarItem>>;
  /** Portal my cellar wine detail */
  portalMyCellarWineDetails?: Maybe<PortalMyCellarWineDetailsItem>;
  /** Portal client annualised returns */
  portalPortfolioAnnualisedReturn?: Maybe<PortalPortfolioAnnualisedReturn>;
  /** Portal client's PortfolioBalance */
  portalPortfolioBalance?: Maybe<Array<PortalPortfolioPerformanceItem>>;
  /** Portal portfolio current allocation */
  portalPortfolioCurrentAllocation: PortalPortfolioCurrentAllocationResponse;
  /** Portal portfolio performance over time */
  portalPortfolioPerformanceOverTime: Array<PortalPerformanceHistoricItem>;
  /** Portal portfolio sold holdings */
  portalSoldHoldings?: Maybe<Array<PortalSoldHoldingItem>>;
  /**
   * Get a asset by its Id
   *
   * Equivalent to GET /Product/Asset/:id
   */
  productAsset?: Maybe<Asset>;
  /** Get asset instances by assetId */
  productAssetInstances: Array<AssetInstance>;
  /**
   * Get assets by query parameters
   *
   * Equivalent to GET /Product/Assets
   */
  productAssets: Array<Asset>;
  /**
   * Get wine
   *
   * Equivalent to GET /Product/Wines/:id
   */
  productWine: Wine;
  /**
   * Get wine vintage by wineVintageId
   *
   * Equivalent to GET /Product/WineVintages/:id
   */
  productWineVintage?: Maybe<WineVintage>;
  /**
   * Get wine vintage by query parameters
   *
   * Equivalent to GET /Product/WineVintages
   */
  productWineVintages: Array<WineVintage>;
  /**
   * Get wines
   *
   * Equivalent to GET /Product/Wines
   */
  productWines: Array<Wine>;
  realisedGains: Scalars['Float'];
  recurringPaymentPrices?: Maybe<Array<RecurringPaymentPriceItem>>;
  recurringPayments?: Maybe<Array<RecurringPaymentResponse>>;
  resetPassword?: Maybe<BaseResultType>;
  searchActiveMarkets: ActiveMarketResult;
  /**
   * Suggest wine vintages from Elastic Search
   *
   * Equivalent to GET /Search/SuggestWineVintages with indexName 'wine-vintage'
   */
  suggestWineVintages: SuggestWineVintagesResult;
  /**
   * Suggest wines from Elastic Search
   *
   * Equivalent to GET /Search/SuggestWines with indexName 'wine'
   */
  suggestWines: SuggestWinesResult;
  unrealisedGains: Scalars['Float'];
  userExternalPortfolioTotalValue: Scalars['Float'];
  userHasExternalPortfolio: Scalars['Boolean'];
  /**
   * Get if user has a watchList
   *
   * Equivalent to GET /ZellarWatchList/IsUserHasWatchList
   */
  userHasWatchList: Scalars['Boolean'];
  /**
   * Get notifications settings of a user
   *
   * Equivalent to GET /UserNotificationSettings
   */
  userNotificationSettings: NotificationSettingsResponse;
  /**
   * Get notifications of user
   *
   * Equivalent to GET /UserNotifications
   */
  userNotifications: NotificationResponse;
  userSettings?: Maybe<UserSettings>;
  validateEmail?: Maybe<BaseResultType>;
  validatePortalEmail: PortalEmailValidationResponse;
  /**
   * Get watchList of user
   *
   * Equivalent to GET /ZellarWatchList/GetUserWatchList
   */
  watchListItems: Array<WatchListItem>;
  wineIndex?: Maybe<LivexIndexHistory>;
  wineIndices: Array<LivexIndexHistory>;
  zellarClientAddresses: Array<Address>;
  zellarClientGetClient?: Maybe<Client>;
};


export type QueryCalculatedMarketDataArgs = {
  assetId: Scalars['Int'];
};


export type QueryCustomerCardsArgs = {
  currency: Scalars['String'];
};


export type QueryExternalPortfolioUserAssetInstancesArgs = {
  assetId: Scalars['Int'];
};


export type QueryExternalPortfolioUserHasAssetArgs = {
  assetId: Scalars['Int'];
};


export type QueryFinanceGetMonthlyWiseFlowByMonthRangeArgs = {
  monthRange: Scalars['Int'];
};


export type QueryGetCustomerArgs = {
  email: Scalars['String'];
};


export type QueryGetDocumentByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetDocumentsArgs = {
  input: DocumentQueryInput;
};


export type QueryGetUserArgs = {
  email: Scalars['String'];
};


export type QueryHistoricalMarketValueArgs = {
  assetIds: Array<Scalars['Int']>;
  dateFrom: Scalars['String'];
  dateTo: Scalars['String'];
};


export type QueryHistoricalMarketValueChangeArgs = {
  assetIds: Array<Scalars['Int']>;
  dateFrom: Scalars['String'];
  dateTo: Scalars['String'];
};


export type QueryInventoriesByDatetimeRangeArgs = {
  dateFrom?: InputMaybe<Scalars['String']>;
  dateTo?: InputMaybe<Scalars['String']>;
};


export type QueryIsAssetExistInAnyHoldingsArgs = {
  assetId: Scalars['Int'];
};


export type QueryIsUserHoldingHasAssetArgs = {
  assetId: Scalars['Int'];
};


export type QueryLoginArgs = {
  userCredentials: LoginInput;
};


export type QueryMarketDataArgs = {
  assetId: Scalars['Int'];
  dateFrom?: InputMaybe<Scalars['String']>;
  dateTo?: InputMaybe<Scalars['String']>;
};


export type QueryOmsAllTradesByAssetArgs = {
  assetId: Scalars['Int'];
};


export type QueryOmsSpreadByAssetIdArgs = {
  assetId: Scalars['Int'];
};


export type QueryOpenOrdersArgs = {
  assetId: Scalars['Int'];
};


export type QueryPortalHoldingDetailsArgs = {
  id: Scalars['String'];
};


export type QueryPortalMyCellarWineDetailsArgs = {
  stockId: Scalars['String'];
};


export type QueryPortalPortfolioAnnualisedReturnArgs = {
  portfolioId?: InputMaybe<Scalars['Int']>;
};


export type QueryPortalPortfolioPerformanceOverTimeArgs = {
  portfolioId?: InputMaybe<Scalars['Int']>;
};


export type QueryProductAssetArgs = {
  assetId: Scalars['Int'];
};


export type QueryProductAssetInstancesArgs = {
  assetId: Scalars['Int'];
};


export type QueryProductAssetsArgs = {
  assetIds?: InputMaybe<Array<Scalars['Int']>>;
  lwin18S?: InputMaybe<Array<Scalars['String']>>;
  wineVintageId?: InputMaybe<Scalars['Int']>;
};


export type QueryProductWineArgs = {
  wineId: Scalars['Int'];
};


export type QueryProductWineVintageArgs = {
  wineVintageId: Scalars['Int'];
};


export type QueryProductWineVintagesArgs = {
  lwin11S?: InputMaybe<Array<Scalars['String']>>;
  wineId?: InputMaybe<Scalars['Int']>;
  wineVintageIds?: InputMaybe<Array<Scalars['Int']>>;
};


export type QueryProductWinesArgs = {
  lwin7?: InputMaybe<Scalars['String']>;
  wineIds?: InputMaybe<Array<Scalars['Int']>>;
};


export type QueryRecurringPaymentPricesArgs = {
  currency: Scalars['String'];
};


export type QueryResetPasswordArgs = {
  clientId: Scalars['String'];
  email: Scalars['String'];
};


export type QuerySearchActiveMarketsArgs = {
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
  sortFilter?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['String']>;
  wineName?: InputMaybe<Scalars['String']>;
};


export type QuerySuggestWineVintagesArgs = {
  queryString: Scalars['String'];
};


export type QuerySuggestWinesArgs = {
  queryString: Scalars['String'];
};


export type QueryUserNotificationsArgs = {
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
};


export type QueryValidateEmailArgs = {
  email: Scalars['String'];
};


export type QueryValidatePortalEmailArgs = {
  emailAddress: Scalars['String'];
};


export type QueryWineIndexArgs = {
  id: Scalars['Int'];
};


export type QueryWineIndicesArgs = {
  names?: InputMaybe<Array<Scalars['String']>>;
};

export type QuickInvestOrder = {
  __typename?: 'QuickInvestOrder';
  asset: Asset;
  direction: Scalars['Int'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
};

export type RecurringPaymentPriceItem = {
  __typename?: 'RecurringPaymentPriceItem';
  currency: Scalars['String'];
  id: Scalars['String'];
  nickName?: Maybe<Scalars['String']>;
  product: Scalars['String'];
  recurringInterval: Scalars['String'];
  recurringIntervalCount: Scalars['Int'];
  unitAmount: Scalars['Float'];
};

export type RecurringPaymentResponse = {
  __typename?: 'RecurringPaymentResponse';
  amount?: Maybe<Scalars['Float']>;
  currency: Scalars['String'];
  frequency?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  paymentMethodId?: Maybe<Scalars['String']>;
  portfolioId: Scalars['Int'];
  portfolioName?: Maybe<Scalars['String']>;
  priceId: Scalars['String'];
  status: Scalars['String'];
};

export type Region = {
  __typename?: 'Region';
  anglophoneCountryName?: Maybe<Scalars['String']>;
  countryIsoCode: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  regionName?: Maybe<Scalars['String']>;
  subRegion?: Maybe<Scalars['String']>;
};

export type RegisterInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  password2: Scalars['String'];
  pic?: InputMaybe<Scalars['String']>;
  pushToken?: InputMaybe<Scalars['String']>;
  shopRef?: InputMaybe<Scalars['String']>;
  social?: InputMaybe<Scalars['String']>;
  socialDetails?: InputMaybe<Scalars['String']>;
};

export type RegistrationResponse = {
  __typename?: 'RegistrationResponse';
  email: Scalars['String'];
  familyName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isError: Scalars['Boolean'];
  isShopAdmin?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  userToken: Scalars['String'];
};

export type RelationshipManager = {
  __typename?: 'RelationshipManager';
  id: Scalars['String'];
  name: Scalars['String'];
  photo: Scalars['String'];
};

export type SearchBidsFacets = {
  __typename?: 'SearchBidsFacets';
  BidStatus: Scalars['JSON'];
  MyBid: Scalars['JSON'];
  Region: Scalars['JSON'];
  UnitCount: Scalars['JSON'];
  UnitSize: Scalars['JSON'];
  Vintage: Scalars['JSON'];
  WineName: Scalars['JSON'];
};

export type SearchBidsResult = {
  __typename?: 'SearchBidsResult';
  facets: SearchBidsFacets;
  results: Array<BidsResult>;
  total: Scalars['Int'];
};

export type SearchHoldingFacets = {
  __typename?: 'SearchHoldingFacets';
  MarketValue: Scalars['JSON'];
  PercentageDifference: Scalars['JSON'];
  Region: Scalars['JSON'];
  Score: Scalars['JSON'];
  TotalPurchasedPrice: Scalars['JSON'];
  UnitCount: Scalars['JSON'];
  UnitSize: Scalars['JSON'];
  Vintage: Scalars['JSON'];
  WineName: Scalars['JSON'];
};

export type SearchHoldingResult = {
  __typename?: 'SearchHoldingResult';
  facets: SearchHoldingFacets;
  results: Array<HoldingResult>;
  total: Scalars['Int'];
};

export type SearchOffersFacets = {
  __typename?: 'SearchOffersFacets';
  MyOffer: Scalars['JSON'];
  OfferStatus: Scalars['JSON'];
  Region: Scalars['JSON'];
  UnitCount: Scalars['JSON'];
  UnitSize: Scalars['JSON'];
  Vintage: Scalars['JSON'];
  WineName: Scalars['JSON'];
};

export type SearchOffersResult = {
  __typename?: 'SearchOffersResult';
  facets: SearchOffersFacets;
  results: Array<OffersResult>;
  total: Scalars['Int'];
};

export type SearchWatchlistFacets = {
  __typename?: 'SearchWatchlistFacets';
  MarketValue: Scalars['JSON'];
  PercentageDifference: Scalars['JSON'];
  Region: Scalars['JSON'];
  Score: Scalars['JSON'];
  UnitCount: Scalars['JSON'];
  UnitSize: Scalars['JSON'];
  Vintage: Scalars['JSON'];
  WineName: Scalars['JSON'];
};

export type SearchWatchlistResult = {
  __typename?: 'SearchWatchlistResult';
  facets: SearchWatchlistFacets;
  results: Array<WatchlistResult>;
  total: Scalars['Int'];
};

export type SearchWineVintagesFacets = {
  __typename?: 'SearchWineVintagesFacets';
  Appellation: Scalars['JSON'];
  Classification: Scalars['JSON'];
  LiquidityRank?: Maybe<Scalars['JSON']>;
  MarketValue: Scalars['JSON'];
  PercentageDifference: Scalars['JSON'];
  Producer: Scalars['JSON'];
  Region: Scalars['JSON'];
  Score: Scalars['JSON'];
  Vintage: Scalars['JSON'];
  WineName: Scalars['JSON'];
};

export type SearchWineVintagesResult = {
  __typename?: 'SearchWineVintagesResult';
  facets: SearchWineVintagesFacets;
  results: Array<WineVintageResult>;
  total: Scalars['Int'];
};

export type SpreadOrder = {
  __typename?: 'SpreadOrder';
  assetId?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Float']>;
  quantity: Scalars['Int'];
  unitCount?: Maybe<Scalars['Int']>;
  unitSize?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
};

export type StripeAddress = {
  __typename?: 'StripeAddress';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type StripeCardItem = {
  __typename?: 'StripeCardItem';
  billingAddress: StripeAddress;
  brand: Scalars['String'];
  country: Scalars['String'];
  expMonth: Scalars['Int'];
  expYear: Scalars['Int'];
  funding: Scalars['String'];
  id: Scalars['String'];
  last4: Scalars['String'];
};

export type StripePaymentInput = {
  amount: Scalars['Float'];
  portfolioId: Scalars['Int'];
};

export type StripePaymentResponse = {
  __typename?: 'StripePaymentResponse';
  clientSecret: Scalars['String'];
  id: Scalars['String'];
  paymentIntentId: Scalars['String'];
};

export type StripeRecurringPaymentInput = {
  amount: Scalars['Float'];
  currency: Scalars['String'];
  defaultPaymentMethod?: InputMaybe<Scalars['String']>;
  frequency: Scalars['String'];
  portfolioId: Scalars['Int'];
  priceId: Scalars['String'];
};

export type StripeRecurringPaymentResponse = {
  __typename?: 'StripeRecurringPaymentResponse';
  clientSecret: Scalars['String'];
  id: Scalars['String'];
  subId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  getActiveMarket: LiveActiveMarketResult;
  getMyOrder: Order;
  getMyTrades: TradeSubscription;
  getMyTransferOutRequest: TransferOutRequest;
  getOrderBooksByAssetId: OrderBook;
  getOrderByAssetId: Order;
};


export type SubscriptionGetActiveMarketArgs = {
  wineName?: InputMaybe<Scalars['String']>;
};


export type SubscriptionGetOrderBooksByAssetIdArgs = {
  assetId: Scalars['Int'];
};


export type SubscriptionGetOrderByAssetIdArgs = {
  assetId: Scalars['Int'];
};

export type SuggestWineVintagesResult = {
  __typename?: 'SuggestWineVintagesResult';
  suggestedAppellation: Array<SuggestedAppellation>;
  suggestedProducer: Array<SuggestedProducer>;
  suggestedRegion: Array<SuggestedRegion>;
  suggests: Array<WineVintageSuggestion>;
};

export type SuggestWinesResult = {
  __typename?: 'SuggestWinesResult';
  suggests: Array<WineSuggestion>;
};

export type SuggestedAppellation = {
  __typename?: 'SuggestedAppellation';
  appellation: Scalars['String'];
};

export type SuggestedProducer = {
  __typename?: 'SuggestedProducer';
  producer: Scalars['String'];
};

export type SuggestedRegion = {
  __typename?: 'SuggestedRegion';
  region: Scalars['String'];
};

export enum TaskStateEnumType {
  Bid = 'Bid',
  Offer = 'Offer'
}

export type Trade = {
  __typename?: 'Trade';
  assetId: Scalars['Int'];
  bid: IFilledOrder;
  id: Scalars['ID'];
  offer: IFilledOrder;
  price: Scalars['Float'];
  size: Scalars['Int'];
};

export type TradeSubscription = {
  __typename?: 'TradeSubscription';
  assetId: Scalars['Int'];
  assetUnitIds: Array<Scalars['String']>;
  bid: BidOfferModel;
  id: Scalars['ID'];
  offer: BidOfferModel;
  tradeDateTime: Scalars['String'];
};

export type TradingInfo = {
  __typename?: 'TradingInfo';
  lastTraded?: Maybe<Scalars['String']>;
  lastTradedValue?: Maybe<Scalars['Float']>;
  tradesMTD: Scalars['Float'];
  tradesYTD: Scalars['Float'];
};

export type TransferOutRequest = {
  __typename?: 'TransferOutRequest';
  assetUnitIds: Array<Scalars['String']>;
  isSuccess: Scalars['Boolean'];
  userId: Scalars['String'];
};

export type UnitSizeDto = {
  __typename?: 'UnitSizeDto';
  buyingTransactionId?: Maybe<Array<Maybe<Scalars['Int']>>>;
  unitSizeId?: Maybe<Scalars['Int']>;
};

export type UpdateDefaultMitCardResponse = {
  __typename?: 'UpdateDefaultMitCardResponse';
  errorMessage?: Maybe<Scalars['String']>;
  status: Scalars['Boolean'];
};

export type UpdateMitConsentInput = {
  consentFlag: Scalars['Boolean'];
  instrumentId: Scalars['String'];
};

export type UpdateMitConsentResponse = {
  __typename?: 'UpdateMitConsentResponse';
  errorMessage?: Maybe<Scalars['String']>;
  status: Scalars['Boolean'];
};

export type UpdatePreferencesInput = {
  currency?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
};

export type UpdateStripeRecurringPaymentInput = {
  amount: Scalars['Float'];
  currency: Scalars['String'];
  defaultPaymentMethod?: InputMaybe<Scalars['String']>;
  frequency: Scalars['String'];
  priceId: Scalars['String'];
  subscriptionId: Scalars['String'];
};

export type UpdateStripeRecurringPaymentResponse = {
  __typename?: 'UpdateStripeRecurringPaymentResponse';
  hasUpdated: Scalars['Boolean'];
  subscriptionId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdDate?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  familyName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isPasswordChangeRequired?: Maybe<Scalars['Boolean']>;
  isShopAdmin?: Maybe<Scalars['Boolean']>;
  isStaff?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  pushToken?: Maybe<Scalars['String']>;
  shopId?: Maybe<Scalars['String']>;
  social?: Maybe<Scalars['String']>;
  socials?: Maybe<Scalars['String']>;
  useSocialPic?: Maybe<Scalars['Boolean']>;
};

export type UserDeviceToken = {
  __typename?: 'UserDeviceToken';
  deviceId: Scalars['String'];
  id: Scalars['String'];
  platform: Scalars['Int'];
};

export type UserHolding = {
  __typename?: 'UserHolding';
  activeOfferQuantity: Scalars['Int'];
  asset: Asset;
  calculatedMarketData: CalculatedMarketData;
  totalMarketValuation: Scalars['Float'];
  totalPurchasePrice: Scalars['Float'];
  totalQuantityOwned: Scalars['Int'];
};

export type UserSettings = {
  __typename?: 'UserSettings';
  currency: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  language: Scalars['String'];
  useLoginEmail: Scalars['Boolean'];
};

export type WatchListHolding = {
  __typename?: 'WatchListHolding';
  performance: HoldingPerformanceResponse;
  score: Scalars['Int'];
};

export type WatchListItem = {
  __typename?: 'WatchListItem';
  addedToWatchListDate: Scalars['String'];
  asset: Asset;
  calculatedMarketData: CalculatedMarketData;
};

export type WatchlistResult = {
  __typename?: 'WatchlistResult';
  appellation?: Maybe<Scalars['String']>;
  assetId: Scalars['Int'];
  calculatedMarketData: CalculatedMarketData;
  docId: Scalars['String'];
  marketValue: Scalars['Float'];
  region: Scalars['String'];
  score: Scalars['String'];
  spread?: Maybe<OrderSpread>;
  unitCount: Scalars['Int'];
  unitSize: Scalars['String'];
  vintage: Scalars['Int'];
  watchlistItemId: Scalars['Int'];
  wineName: Scalars['String'];
};

export type Wine = {
  __typename?: 'Wine';
  appellation?: Maybe<Appellation>;
  appellationId?: Maybe<Scalars['Int']>;
  classification?: Maybe<Scalars['String']>;
  composition?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  firstVintage?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  isSingleVintage: Scalars['Boolean'];
  lastVintage?: Maybe<Scalars['Int']>;
  lwin7?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  producer?: Maybe<Producer>;
  producerId?: Maybe<Scalars['Int']>;
  region: Region;
  regionId?: Maybe<Scalars['Int']>;
  regionalisedWineColour?: Maybe<Scalars['String']>;
  sequentialVintages?: Maybe<Scalars['Boolean']>;
  sparkling?: Maybe<Scalars['Boolean']>;
  storingPosition?: Maybe<Scalars['String']>;
  sweetness?: Maybe<Scalars['String']>;
  vintages: Array<WineVintage>;
  wineColourCode?: Maybe<Scalars['String']>;
  wineScores: Array<WineScore>;
};

export type WineScore = {
  __typename?: 'WineScore';
  score?: Maybe<Scalars['Float']>;
  scoreDate?: Maybe<Scalars['String']>;
  sourceName?: Maybe<Scalars['String']>;
  tastingNotes?: Maybe<Scalars['String']>;
};

export type WineSearcherOffer = {
  __typename?: 'WineSearcherOffer';
  lwin18: Scalars['String'];
  price: Scalars['Float'];
};

export type WineSuggestion = {
  __typename?: 'WineSuggestion';
  wineId: Scalars['Int'];
  wineName: Scalars['String'];
};

export type WineVintage = {
  __typename?: 'WineVintage';
  alcoholPct?: Maybe<Scalars['Float']>;
  assets: Array<Asset>;
  calculatedMarketData: CalculatedMarketData;
  closureType?: Maybe<Scalars['String']>;
  drinkingWindow: WineVintageDrinkingWindow;
  id: Scalars['Int'];
  imageFileName?: Maybe<Scalars['String']>;
  lwin11?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  vintage: Scalars['Int'];
  wine: Wine;
  wineId: Scalars['Int'];
  wineScores: Array<WineScore>;
};

export type WineVintageDrinkingWindow = {
  __typename?: 'WineVintageDrinkingWindow';
  advice: Scalars['String'];
  dateFrom: Scalars['String'];
  dateTo: Scalars['String'];
};

export type WineVintageResult = {
  __typename?: 'WineVintageResult';
  appellation?: Maybe<Scalars['String']>;
  calculatedMarketData: CalculatedMarketData;
  classification?: Maybe<Scalars['String']>;
  defaultAsset: Asset;
  defaultAssetId: Scalars['Int'];
  drinkingWindow: WineVintageDrinkingWindow;
  lastTradeDate?: Maybe<Scalars['String']>;
  lastTradePrice?: Maybe<Scalars['Float']>;
  lwin7: Scalars['String'];
  lwin11: Scalars['String'];
  marketData: MarketData;
  marketValue: Scalars['Float'];
  percentageDifference?: Maybe<Scalars['String']>;
  producer?: Maybe<Scalars['String']>;
  region: Scalars['String'];
  score?: Maybe<Scalars['String']>;
  spread?: Maybe<OrderSpread>;
  unitCount: Scalars['Int'];
  unitSize: Scalars['String'];
  vintage: Scalars['Int'];
  wineColour?: Maybe<Scalars['String']>;
  wineId: Scalars['Int'];
  wineName: Scalars['String'];
  wineVintageId: Scalars['Int'];
};


export type WineVintageResultMarketDataArgs = {
  dateFrom?: InputMaybe<Scalars['String']>;
  dateTo?: InputMaybe<Scalars['String']>;
};

export type WineVintageSuggestion = {
  __typename?: 'WineVintageSuggestion';
  appellation: Scalars['String'];
  defaultAssetId: Scalars['Int'];
  lwin11: Scalars['String'];
  producer: Scalars['String'];
  region: Scalars['String'];
  vintage: Scalars['Int'];
  wineId: Scalars['Int'];
  wineName: Scalars['String'];
  wineVintageId: Scalars['Int'];
};

export type WithdrawConfirmationInput = {
  accountName: Scalars['String'];
  accountNumber?: InputMaybe<Scalars['String']>;
  amount: Scalars['Float'];
  bic?: InputMaybe<Scalars['String']>;
  iban?: InputMaybe<Scalars['String']>;
  sortCode?: InputMaybe<Scalars['String']>;
};

export type WithdrawConfirmationResponse = {
  __typename?: 'WithdrawConfirmationResponse';
  accountName: Scalars['String'];
  accountNumber?: Maybe<Scalars['String']>;
  amount: Scalars['Float'];
  bic?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
  iban?: Maybe<Scalars['String']>;
  sortCode?: Maybe<Scalars['String']>;
  status: Scalars['String'];
};

export type GetMiscellaneousQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMiscellaneousQuery = { __typename?: 'Query', miscellaneous?: { __typename?: 'MiscellaneousType', languages?: Array<{ __typename?: 'MiscellaneousItem', id: string, value?: string | null, symbol?: string | null, text: string } | null> | null, currencies?: Array<{ __typename?: 'MiscellaneousItem', id: string, value?: string | null, text: string, symbol?: string | null } | null> | null, paymentFrequencies?: Array<{ __typename?: 'MiscellaneousItem', id: string, value?: string | null, text: string } | null> | null } | null };

export type PortalDeliverWineMutationVariables = Exact<{
  portalDeliverWineRequest: PortalDeliverWineRequestInput;
}>;


export type PortalDeliverWineMutation = { __typename?: 'Mutation', portalDeliverWine: { __typename?: 'PortalProcessWineResponse', isSuccess?: boolean | null, errorMessage?: string | null } };

export type PortalBuyWineMutationVariables = Exact<{
  portalBuyWineRequest: PortalBuyWineRequestInput;
}>;


export type PortalBuyWineMutation = { __typename?: 'Mutation', portalBuyWine: { __typename?: 'PortalProcessWineResponse', isSuccess?: boolean | null, errorMessage?: string | null } };

export type PortalSellWineMutationVariables = Exact<{
  portalSellWineRequest: PortalSellWineRequestInput;
}>;


export type PortalSellWineMutation = { __typename?: 'Mutation', portalSellWine: { __typename?: 'PortalProcessWineResponse', isSuccess?: boolean | null, errorMessage?: string | null } };

export type CancelStripeRecurringPaymentMutationVariables = Exact<{
  recurringPaymentId: Scalars['String'];
}>;


export type CancelStripeRecurringPaymentMutation = { __typename?: 'Mutation', cancelStripeRecurringPayment: { __typename?: 'CancelStripeRecurringPaymentResponse', subscriptionId: string, hasCancelled: boolean } };

export type AuthChangePasswordMutationVariables = Exact<{
  changePasswordInput: AuthChangePasswordInput;
}>;


export type AuthChangePasswordMutation = { __typename?: 'Mutation', authChangePassword: { __typename?: 'AuthChangePasswordResponse', wasPasswordChanged: boolean } };

export type PortalContactRelationshipMangerMutationVariables = Exact<{
  request: ContactRmInput;
}>;


export type PortalContactRelationshipMangerMutation = { __typename?: 'Mutation', portalContactRelationshipManger: { __typename?: 'ContactRmResponse', errorMessage?: string | null, isSuccess?: boolean | null } };

export type CreateStripeRecurringPaymentMutationVariables = Exact<{
  stripeRecurringPayment: StripeRecurringPaymentInput;
}>;


export type CreateStripeRecurringPaymentMutation = { __typename?: 'Mutation', createStripeRecurringPayment: { __typename?: 'StripeRecurringPaymentResponse', id: string, subId: string, clientSecret: string } };

export type AuthUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthUserQuery = { __typename?: 'Query', authUser: { __typename?: 'AuthUser', emailAddress: string } };

export type PaymentReferenceNumberQueryVariables = Exact<{ [key: string]: never; }>;


export type PaymentReferenceNumberQuery = { __typename?: 'Query', paymentReferenceNumber?: string | null };

export type ManagementFeesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ManagementFeesQueryQuery = { __typename?: 'Query', portalManagementFees: Array<{ __typename?: 'PortalManagementFeeResponse', id: string, accountHolderName: string, vintradeAccountHolderId: number, clientName: string, vintradeClientId: string, valuationDate: string, feeType: string, portfolioValue?: number | null, offsetValue?: number | null, feeAmount: number, appliedPct: number, invoiceNumber?: number | null, invoiceDate?: string | null, status: string } | null> };

export type GetPaymentCardsQueryVariables = Exact<{
  currency: Scalars['String'];
}>;


export type GetPaymentCardsQuery = { __typename?: 'Query', customerCards?: Array<{ __typename?: 'StripeCardItem', id: string, brand: string, country: string, expMonth: number, expYear: number, last4: string, funding: string, billingAddress: { __typename?: 'StripeAddress', city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postalCode?: string | null, state?: string | null } }> | null };

export type GetPaymentSubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentSubscriptionsQuery = { __typename?: 'Query', recurringPayments?: Array<{ __typename?: 'RecurringPaymentResponse', id: string, currency: string, amount?: number | null, status: string, portfolioId: number, portfolioName?: string | null, frequency?: string | null, priceId: string, paymentMethodId?: string | null }> | null };

export type GetRmDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRmDocumentQuery = { __typename?: 'Query', getCustomerRM: { __typename?: 'RelationshipManager', id: string, name: string, photo: string } };

export type RecurringPaymentPricesQueryVariables = Exact<{
  currency: Scalars['String'];
}>;


export type RecurringPaymentPricesQuery = { __typename?: 'Query', recurringPaymentPrices?: Array<{ __typename?: 'RecurringPaymentPriceItem', id: string, nickName?: string | null, product: string, currency: string, unitAmount: number, recurringInterval: string, recurringIntervalCount: number }> | null };

export type GetUserPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserPreferencesQuery = { __typename?: 'Query', portalClientPreferences?: { __typename?: 'PortalClientPreferencesResponse', currency: string, language: string } | null };

export type HubSpotQueryQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type HubSpotQueryQuery = { __typename?: 'Query', getCustomer: { __typename?: 'HubSpotCustomer', id: string, firstName?: string | null, lastName?: string | null, email?: string | null, dateOfBirth?: string | null, city?: string | null, country?: string | null, state?: string | null, postCode?: string | null, addressline1?: string | null, addressline2?: string | null, addressline3?: string | null } };

export type CreateStripePaymentMutationVariables = Exact<{
  stripePayment: StripePaymentInput;
}>;


export type CreateStripePaymentMutation = { __typename?: 'Mutation', createStripePayment: { __typename?: 'StripePaymentResponse', id: string, paymentIntentId: string, clientSecret: string } };

export type UpdateStripeRecurringPaymentMutationVariables = Exact<{
  request: UpdateStripeRecurringPaymentInput;
}>;


export type UpdateStripeRecurringPaymentMutation = { __typename?: 'Mutation', updateStripeRecurringPayment: { __typename?: 'UpdateStripeRecurringPaymentResponse', subscriptionId: string, hasUpdated: boolean } };

export type PortalUpdatePreferencesMutationVariables = Exact<{
  request: UpdatePreferencesInput;
}>;


export type PortalUpdatePreferencesMutation = { __typename?: 'Mutation', portalUpdatePreferences: { __typename?: 'PortalClientPreferencesResponse', currency: string, language: string } };

export type LoginQueryVariables = Exact<{
  userCredentials: LoginInput;
}>;


export type LoginQuery = { __typename?: 'Query', login?: { __typename?: 'LoginResult', isSuccess: boolean, message?: string | null, userToken?: string | null } | null };

export type GetUserQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', email: string, createdDate?: string | null, id?: string | null, name?: string | null } | null };

export type SubmitOneTimePasscodeMutationVariables = Exact<{
  args: AuthMfaOobCodeVerifyRequestInput;
}>;


export type SubmitOneTimePasscodeMutation = { __typename?: 'Mutation', portalAuthMfaVerify: { __typename?: 'AuthMfaOobCodeVerifyResponse', accessToken: string, idToken: string, userToken: string, refreshToken: string, error?: string | null, errorDescription?: string | null } };

export type RefreshAccessTokenMutationVariables = Exact<{
  input: AuthRefreshAccessTokenRequestInput;
}>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', authRefreshAccessToken: { __typename?: 'AuthRefreshAccessTokenResponse', accessToken: string, refreshToken: string, userToken: string } };

export type RegisterUserMutationVariables = Exact<{
  userCredentials: RegisterInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser?: { __typename?: 'BaseResultType', isSuccess: boolean, message?: string | null, messageType?: string | null } | null };

export type ResetPasswordQueryQueryVariables = Exact<{
  email: Scalars['String'];
  clientId: Scalars['String'];
}>;


export type ResetPasswordQueryQuery = { __typename?: 'Query', resetPassword?: { __typename?: 'BaseResultType', isSuccess: boolean, message?: string | null } | null };

export type ValidateEmailQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type ValidateEmailQuery = { __typename?: 'Query', validateEmail?: { __typename?: 'BaseResultType', isSuccess: boolean, messageType?: string | null, message?: string | null } | null };

export type GetEventByIdQueryVariables = Exact<{
  eventId: Scalars['String'];
}>;


export type GetEventByIdQuery = { __typename?: 'Query', getDocumentById: { __typename?: 'EventDetail', id: string, type: string, title: string, price: number, country: string, priceCurrency: string, dateTime: string, locationShort: string, mainImage: string, locationFullAddress: string, content: string, eventbriteId: string, eventbriteShow: boolean } | { __typename?: 'InvestOfferDetail' } | { __typename?: 'LearningHubDetail' } };

export type GetEventDocumentsQueryVariables = Exact<{
  eventInput: DocumentQueryInput;
}>;


export type GetEventDocumentsQuery = { __typename?: 'Query', getDocuments: { __typename?: 'DocumentsResponse', page: number, resultPerPage: number, resultSize: number, totalResultsSize: number, totalPages: number, results?: Array<{ __typename?: 'Event', id: string, title: string, country: string, priceCurrency: string, price: number, dateTime: string, type: string, mainImage: string, locationShort: string } | { __typename?: 'InvestOffer' } | { __typename?: 'LearningHub' }> | null } };

export type GetLearningHubDocumentQueryVariables = Exact<{
  learningInput: DocumentQueryInput;
}>;


export type GetLearningHubDocumentQuery = { __typename?: 'Query', getDocuments: { __typename?: 'DocumentsResponse', page: number, resultPerPage: number, resultSize: number, totalResultsSize: number, totalPages: number, results?: Array<{ __typename?: 'Event' } | { __typename?: 'InvestOffer' } | { __typename?: 'LearningHub', id: string, title: string, contentType: ContentType, publishDate: string, contentShort: string, mainImage: string }> | null } };

export type GetLearningHubByIdQueryVariables = Exact<{
  learningId: Scalars['String'];
}>;


export type GetLearningHubByIdQuery = { __typename?: 'Query', getDocumentById: { __typename?: 'EventDetail' } | { __typename?: 'InvestOfferDetail' } | { __typename?: 'LearningHubDetail', id: string, title: string, contentType: ContentType, publishDate: string, contentShort: string, contentLong: string, mainImage: string, videoUrl?: string | null } };

export type GetInvestOffersQueryVariables = Exact<{
  offerInput: DocumentQueryInput;
}>;


export type GetInvestOffersQuery = { __typename?: 'Query', getDocuments: { __typename?: 'DocumentsResponse', page: number, resultPerPage: number, resultSize: number, totalResultsSize: number, totalPages: number, results?: Array<{ __typename?: 'Event' } | { __typename?: 'InvestOffer', id: string, name: string, subtitle: string, priceGbp: number, unitSize: string, region: string, type: string, expiryDate: string, mainImage: string } | { __typename?: 'LearningHub' }> | null } };

export type GetInvestOfferDetailsQueryVariables = Exact<{
  offerId: Scalars['String'];
}>;


export type GetInvestOfferDetailsQuery = { __typename?: 'Query', getDocumentById: { __typename?: 'EventDetail' } | { __typename?: 'InvestOfferDetail', id: string, name: string, subtitle: string, priceGbp: number, unitSize: string, region: string, type: string, expiryDate: string, mainImage: string, disclaimer?: string | null, sections?: Array<{ __typename?: 'OfferSection', title: string, content: string }> | null } | { __typename?: 'LearningHubDetail' } };

export type PortalInvestNowMutationVariables = Exact<{
  portalInvestNowRequest: PortalInvestNowRequestInput;
}>;


export type PortalInvestNowMutation = { __typename?: 'Mutation', portalInvestNow: { __typename?: 'PortalProcessWineResponse', isSuccess?: boolean | null, errorMessage?: string | null } };

export type GetMyCellarQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCellarQuery = { __typename?: 'Query', portalMyCellar?: Array<{ __typename?: 'PortalMyCellarItem', rotationNumber?: string | null, stockId?: string | null, holdingId: string, portfolioId: number, lwin18: string, wineName: string, vintage?: number | null, region: string, imageFileName?: string | null, cultWinesAllocationRegion: string, dealDate: string, dealRef: string, dealCCY?: string | null, unit: string, unitCount: number, qty: number, status?: string | null, location?: string | null }> | null };

export type GetmyCelllarWineDetailsQueryVariables = Exact<{
  stockId: Scalars['String'];
}>;


export type GetmyCelllarWineDetailsQuery = { __typename?: 'Query', portalMyCellarWineDetails?: { __typename?: 'PortalMyCellarWineDetailsItem', id: string, portfolioId: number, lwin18: string, wineName: string, vintage?: number | null, region: string, cultWinesAllocationRegion: string, dealDate: string, dealRef: string, dealCCY?: string | null, unit: string, imageFileName?: string | null, unitCount: number, qty: number, qtyForSale: number, priceForSale?: number | null, costPerUnit: number, totalCost: number, valuePerUnit: number, valuePerBottle: number, totalValue: number, changedPct: number, netPosition: number, netPositionPerUnit: number, profitAndLoss: number, profitAndLossPerUnit: number, mgmtFeePerUnit: number, totalMgmtFee: number, costWithMgmtFeePerUnit: number, totalCostWithMgmtFee: number, rotationNumber: string, status?: string | null, location?: string | null, historicMarketPrices?: Array<{ __typename?: 'HistoricMarketPriceItem', date: string, marketPrice: number } | null> | null } | null };

export type UserNotificationsQueryVariables = Exact<{
  from: Scalars['Int'];
  pageSize: Scalars['Int'];
}>;


export type UserNotificationsQuery = { __typename?: 'Query', userNotifications: { __typename?: 'NotificationResponse', total: number, pageSize: number, from: number, totalPages: number, unreadCount: number, results: Array<{ __typename?: 'Notification', id: string, category: string, type: string, summary: string, description?: string | null, isRead: boolean, createdDateTime: string, updatedDateTime?: string | null }> } };

export type MarkNotificationsReadMutationVariables = Exact<{
  request: MarkNotificationsReadRequest;
}>;


export type MarkNotificationsReadMutation = { __typename?: 'Mutation', markNotificationsRead: boolean };

export type PortalPortfolioAnnualisedReturnQueryVariables = Exact<{
  portfolioId?: InputMaybe<Scalars['Int']>;
}>;


export type PortalPortfolioAnnualisedReturnQuery = { __typename?: 'Query', portalPortfolioAnnualisedReturn?: { __typename?: 'PortalPortfolioAnnualisedReturn', years?: Array<{ __typename?: 'PortalAnnualisedReturnItem', date: string, value: number }> | null, monthly?: Array<{ __typename?: 'PortalAnnualisedReturnItem', date: string, value: number }> | null } | null };

export type GetPortfolioExternalStockQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPortfolioExternalStockQuery = { __typename?: 'Query', portalExternalHoldings?: Array<{ __typename?: 'PortalExternalHoldingItem', lwin18: string, wineName: string, vintage?: number | null, region: string, cultWinesAllocationRegion: string, unit: string, unitCount: number, qty: number, costPerUnit?: number | null, totalCost?: number | null, valuePerUnit: number, totalValue: number, changedPct?: number | null, netPosition?: number | null, location?: string | null, cashOffer: number, createdDate: string }> | null };

export type GetProductDetailsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetProductDetailsQuery = { __typename?: 'Query', portalHoldingDetails?: { __typename?: 'PortalHoldingDetails', id: string, portfolioId: number, lwin18: string, wineName: string, vintage?: number | null, region: string, cultWinesAllocationRegion: string, dealDate: string, dealRef: string, dealCCY?: string | null, unit: string, unitCount: number, qty: number, qtyForSale: number, priceForSale?: number | null, costPerUnit: number, totalCost: number, valuePerUnit: number, valuePerBottle: number, totalValue: number, changedPct: number, netPosition: number, netPositionPerUnit: number, profitAndLoss: number, profitAndLossPerUnit: number, imageFileName?: string | null, mgmtFeePerUnit: number, totalMgmtFee: number, costWithMgmtFeePerUnit: number, totalCostWithMgmtFee: number, holdingStocks?: Array<{ __typename?: 'PortalHoldingStockItem', rotationNumber: string, status?: string | null, location?: string | null } | null> | null, historicMarketPrices?: Array<{ __typename?: 'HistoricMarketPriceItem', date: string, marketPrice: number } | null> | null } | null };

export type GetSoldStocksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSoldStocksQuery = { __typename?: 'Query', portalSoldHoldings?: Array<{ __typename?: 'PortalSoldHoldingItem', lwin18: string, wineName: string, vintage?: number | null, region: string, cultWinesAllocationRegion: string, dealDate: string, dealRef: string, unit: string, unitCount: number, qtySold: number, status: string, soldDate: string, costPerUnit: number, totalCost: number, soldPricePerUnit: number, totalValue: number, changedPct: number, netPosition: number, netPositionPerUnit: number, profitAndLoss: number, profitAndLossPerUnit: number, mgmtFeePerUnit: number, totalMgmtFee: number, costWithMgmtFeePerUnit: number, totalCostWithMgmtFee: number }> | null };

export type GetPortfolioCurrentHoldingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPortfolioCurrentHoldingsQuery = { __typename?: 'Query', portalCurrentHoldings: Array<{ __typename?: 'PortalCurrentHoldingItem', id: string, portfolioId: number, lwin18: string, wineName: string, vintage?: number | null, region: string, cultWinesAllocationRegion: string, dealDate: string, dealRef: string, dealCCY?: string | null, unit: string, unitCount: number, imageFileName?: string | null, qty: number, qtyForSale: number, priceForSale?: number | null, costPerUnit: number, totalCost: number, valuePerUnit: number, valuePerBottle: number, totalValue: number, changedPct: number, netPosition: number, netPositionPerUnit: number, profitAndLoss: number, profitAndLossPerUnit: number, mgmtFeePerUnit: number, totalMgmtFee: number, costWithMgmtFeePerUnit: number, totalCostWithMgmtFee: number, historicMarketPrices?: Array<{ __typename?: 'HistoricMarketPriceItem', date: string, marketPrice: number } | null> | null }> };

export type GetPortfolioBalancesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPortfolioBalancesQuery = { __typename?: 'Query', portalPortfolioBalance?: Array<{ __typename?: 'PortalPortfolioPerformanceItem', balance: number, portfolioName: string, portfolioId?: number | null, currentHoldings: number, capitalInvested: number, totalMgmtFee: number, netProceedsFromSales: number, netPosition: number, netPositionPct: number, profitAndLoss: number, profitAndLossPct: number, balancePending: number, totalRefunds: number, netContributions: number, currentFeeModel: boolean }> | null };

export type PortalPortfolioPerformanceOverTimeQueryVariables = Exact<{
  portfolioId?: InputMaybe<Scalars['Int']>;
}>;


export type PortalPortfolioPerformanceOverTimeQuery = { __typename?: 'Query', portalPortfolioPerformanceOverTime: Array<{ __typename?: 'PortalPerformanceHistoricItem', date: string, currentHoldings: number, netContributions: number }> };

export type GetPortalAllocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPortalAllocationsQuery = { __typename?: 'Query', portalPortfolioCurrentAllocation: { __typename?: 'PortalPortfolioCurrentAllocationResponse', portalRegionPerformances: Array<{ __typename?: 'PortalRegionPerformanceItem', regionName: string, currentHoldings: number, totalPurchasePrice: number, netPosition: number, netPositionPct: number }>, portalPortfolioCurrentAllocation?: Array<{ __typename?: 'PortalPortfolioCurrentAllocationItem', tacticalAllocation: number, regionName: string, currentAllocation: number, StrategicAllocation: number } | null> | null } };

export type GetCashBalanceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCashBalanceQuery = { __typename?: 'Query', portalCashBalance: { __typename?: 'PortaBalanceAndInvestmentValues', todayInvestment: number, balances?: Array<{ __typename?: 'PortalCashBalanceItem', portfolioName: string, portfolioId?: number | null, balance: number } | null> | null } };


export const GetMiscellaneousDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMiscellaneous"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"miscellaneous"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]} as unknown as DocumentNode<GetMiscellaneousQuery, GetMiscellaneousQueryVariables>;
export const PortalDeliverWineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PortalDeliverWine"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"portalDeliverWineRequest"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PortalDeliverWineRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalDeliverWine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"portalDeliverWineRequest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"portalDeliverWineRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]} as unknown as DocumentNode<PortalDeliverWineMutation, PortalDeliverWineMutationVariables>;
export const PortalBuyWineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PortalBuyWine"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"portalBuyWineRequest"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PortalBuyWineRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalBuyWine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"portalBuyWineRequest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"portalBuyWineRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]} as unknown as DocumentNode<PortalBuyWineMutation, PortalBuyWineMutationVariables>;
export const PortalSellWineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PortalSellWine"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"portalSellWineRequest"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PortalSellWineRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalSellWine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"portalSellWineRequest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"portalSellWineRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]} as unknown as DocumentNode<PortalSellWineMutation, PortalSellWineMutationVariables>;
export const CancelStripeRecurringPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelStripeRecurringPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recurringPaymentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelStripeRecurringPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recurringPaymentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recurringPaymentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"hasCancelled"}}]}}]}}]} as unknown as DocumentNode<CancelStripeRecurringPaymentMutation, CancelStripeRecurringPaymentMutationVariables>;
export const AuthChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AuthChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changePasswordInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthChangePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authChangePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"changePasswordInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changePasswordInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wasPasswordChanged"}}]}}]}}]} as unknown as DocumentNode<AuthChangePasswordMutation, AuthChangePasswordMutationVariables>;
export const PortalContactRelationshipMangerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PortalContactRelationshipManger"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactRmInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalContactRelationshipManger"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}}]}}]}}]} as unknown as DocumentNode<PortalContactRelationshipMangerMutation, PortalContactRelationshipMangerMutationVariables>;
export const CreateStripeRecurringPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStripeRecurringPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripeRecurringPayment"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StripeRecurringPaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStripeRecurringPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripeRecurringPayment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripeRecurringPayment"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subId"}},{"kind":"Field","name":{"kind":"Name","value":"clientSecret"}}]}}]}}]} as unknown as DocumentNode<CreateStripeRecurringPaymentMutation, CreateStripeRecurringPaymentMutationVariables>;
export const AuthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}}]}}]}}]} as unknown as DocumentNode<AuthUserQuery, AuthUserQueryVariables>;
export const PaymentReferenceNumberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"paymentReferenceNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentReferenceNumber"}}]}}]} as unknown as DocumentNode<PaymentReferenceNumberQuery, PaymentReferenceNumberQueryVariables>;
export const ManagementFeesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ManagementFeesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalManagementFees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"vintradeAccountHolderId"}},{"kind":"Field","name":{"kind":"Name","value":"clientName"}},{"kind":"Field","name":{"kind":"Name","value":"vintradeClientId"}},{"kind":"Field","name":{"kind":"Name","value":"valuationDate"}},{"kind":"Field","name":{"kind":"Name","value":"feeType"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioValue"}},{"kind":"Field","name":{"kind":"Name","value":"offsetValue"}},{"kind":"Field","name":{"kind":"Name","value":"feeAmount"}},{"kind":"Field","name":{"kind":"Name","value":"appliedPct"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ManagementFeesQueryQuery, ManagementFeesQueryQueryVariables>;
export const GetPaymentCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"expMonth"}},{"kind":"Field","name":{"kind":"Name","value":"expYear"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}},{"kind":"Field","name":{"kind":"Name","value":"funding"}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"line1"}},{"kind":"Field","name":{"kind":"Name","value":"line2"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}}]} as unknown as DocumentNode<GetPaymentCardsQuery, GetPaymentCardsQueryVariables>;
export const GetPaymentSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentSubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringPayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioName"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"priceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethodId"}}]}}]}}]} as unknown as DocumentNode<GetPaymentSubscriptionsQuery, GetPaymentSubscriptionsQueryVariables>;
export const GetRmDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRMDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCustomerRM"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]} as unknown as DocumentNode<GetRmDocumentQuery, GetRmDocumentQueryVariables>;
export const RecurringPaymentPricesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecurringPaymentPrices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringPaymentPrices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"unitAmount"}},{"kind":"Field","name":{"kind":"Name","value":"recurringInterval"}},{"kind":"Field","name":{"kind":"Name","value":"recurringIntervalCount"}}]}}]}}]} as unknown as DocumentNode<RecurringPaymentPricesQuery, RecurringPaymentPricesQueryVariables>;
export const GetUserPreferencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalClientPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<GetUserPreferencesQuery, GetUserPreferencesQueryVariables>;
export const HubSpotQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HubSpotQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"addressline1"}},{"kind":"Field","name":{"kind":"Name","value":"addressline2"}},{"kind":"Field","name":{"kind":"Name","value":"addressline3"}}]}}]}}]} as unknown as DocumentNode<HubSpotQueryQuery, HubSpotQueryQueryVariables>;
export const CreateStripePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStripePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripePayment"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StripePaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStripePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stripePayment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripePayment"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentIntentId"}},{"kind":"Field","name":{"kind":"Name","value":"clientSecret"}}]}}]}}]} as unknown as DocumentNode<CreateStripePaymentMutation, CreateStripePaymentMutationVariables>;
export const UpdateStripeRecurringPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStripeRecurringPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStripeRecurringPaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStripeRecurringPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"hasUpdated"}}]}}]}}]} as unknown as DocumentNode<UpdateStripeRecurringPaymentMutation, UpdateStripeRecurringPaymentMutationVariables>;
export const PortalUpdatePreferencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PortalUpdatePreferences"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePreferencesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalUpdatePreferences"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<PortalUpdatePreferencesMutation, PortalUpdatePreferencesMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userCredentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userCredentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userCredentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"userToken"}}]}}]}}]} as unknown as DocumentNode<LoginQuery, LoginQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const SubmitOneTimePasscodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitOneTimePasscode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthMfaOobCodeVerifyRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalAuthMfaVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mfaOobCodeVerifyRequestInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"userToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"errorDescription"}}]}}]}}]} as unknown as DocumentNode<SubmitOneTimePasscodeMutation, SubmitOneTimePasscodeMutationVariables>;
export const RefreshAccessTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAccessToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthRefreshAccessTokenRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authRefreshAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshAccessTokenRequestInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"userToken"}}]}}]}}]} as unknown as DocumentNode<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userCredentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userCredentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userCredentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"messageType"}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const ResetPasswordQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResetPasswordQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ResetPasswordQueryQuery, ResetPasswordQueryQueryVariables>;
export const ValidateEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ValidateEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}},{"kind":"Field","name":{"kind":"Name","value":"messageType"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ValidateEmailQuery, ValidateEmailQueryVariables>;
export const GetEventByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocumentById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventDetail"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"priceCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"locationShort"}},{"kind":"Field","name":{"kind":"Name","value":"mainImage"}},{"kind":"Field","name":{"kind":"Name","value":"locationFullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"eventbriteId"}},{"kind":"Field","name":{"kind":"Name","value":"eventbriteShow"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventByIdQuery, GetEventByIdQueryVariables>;
export const GetEventDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocuments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"resultPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"resultSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalResultsSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"priceCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"mainImage"}},{"kind":"Field","name":{"kind":"Name","value":"locationShort"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetEventDocumentsQuery, GetEventDocumentsQueryVariables>;
export const GetLearningHubDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLearningHubDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"learningInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocuments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"learningInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"resultPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"resultSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalResultsSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LearningHub"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"publishDate"}},{"kind":"Field","name":{"kind":"Name","value":"contentShort"}},{"kind":"Field","name":{"kind":"Name","value":"mainImage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetLearningHubDocumentQuery, GetLearningHubDocumentQueryVariables>;
export const GetLearningHubByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLearningHubById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"learningId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocumentById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"learningId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LearningHubDetail"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"publishDate"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"contentShort"}},{"kind":"Field","name":{"kind":"Name","value":"contentLong"}},{"kind":"Field","name":{"kind":"Name","value":"mainImage"}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetLearningHubByIdQuery, GetLearningHubByIdQueryVariables>;
export const GetInvestOffersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvestOffers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offerInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocuments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offerInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"resultPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"resultSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalResultsSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvestOffer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"priceGbp"}},{"kind":"Field","name":{"kind":"Name","value":"unitSize"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"mainImage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetInvestOffersQuery, GetInvestOffersQueryVariables>;
export const GetInvestOfferDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvestOfferDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDocumentById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvestOfferDetail"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"priceGbp"}},{"kind":"Field","name":{"kind":"Name","value":"unitSize"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"mainImage"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disclaimer"}}]}}]}}]}}]} as unknown as DocumentNode<GetInvestOfferDetailsQuery, GetInvestOfferDetailsQueryVariables>;
export const PortalInvestNowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PortalInvestNow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"portalInvestNowRequest"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PortalInvestNowRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalInvestNow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"portalInvestNowRequest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"portalInvestNowRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccess"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]} as unknown as DocumentNode<PortalInvestNowMutation, PortalInvestNowMutationVariables>;
export const GetMyCellarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyCellar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalMyCellar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rotationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"stockId"}},{"kind":"Field","name":{"kind":"Name","value":"holdingId"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"lwin18"}},{"kind":"Field","name":{"kind":"Name","value":"wineName"}},{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"imageFileName"}},{"kind":"Field","name":{"kind":"Name","value":"cultWinesAllocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"dealDate"}},{"kind":"Field","name":{"kind":"Name","value":"dealRef"}},{"kind":"Field","name":{"kind":"Name","value":"dealCCY"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitCount"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<GetMyCellarQuery, GetMyCellarQueryVariables>;
export const GetmyCelllarWineDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetmyCelllarWineDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalMyCellarWineDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stockId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stockId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"lwin18"}},{"kind":"Field","name":{"kind":"Name","value":"wineName"}},{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"cultWinesAllocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"dealDate"}},{"kind":"Field","name":{"kind":"Name","value":"dealRef"}},{"kind":"Field","name":{"kind":"Name","value":"dealCCY"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"imageFileName"}},{"kind":"Field","name":{"kind":"Name","value":"unitCount"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"qtyForSale"}},{"kind":"Field","name":{"kind":"Name","value":"priceForSale"}},{"kind":"Field","name":{"kind":"Name","value":"costPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"valuePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"valuePerBottle"}},{"kind":"Field","name":{"kind":"Name","value":"totalValue"}},{"kind":"Field","name":{"kind":"Name","value":"changedPct"}},{"kind":"Field","name":{"kind":"Name","value":"netPosition"}},{"kind":"Field","name":{"kind":"Name","value":"netPositionPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLoss"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLossPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"mgmtFeePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalMgmtFee"}},{"kind":"Field","name":{"kind":"Name","value":"costWithMgmtFeePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostWithMgmtFee"}},{"kind":"Field","name":{"kind":"Name","value":"rotationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"historicMarketPrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"marketPrice"}}]}}]}}]}}]} as unknown as DocumentNode<GetmyCelllarWineDetailsQuery, GetmyCelllarWineDetailsQueryVariables>;
export const UserNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"createdDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDateTime"}}]}}]}}]}}]} as unknown as DocumentNode<UserNotificationsQuery, UserNotificationsQueryVariables>;
export const MarkNotificationsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkNotificationsRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkNotificationsReadRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markNotificationsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}]}]}}]} as unknown as DocumentNode<MarkNotificationsReadMutation, MarkNotificationsReadMutationVariables>;
export const PortalPortfolioAnnualisedReturnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PortalPortfolioAnnualisedReturn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"portfolioId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalPortfolioAnnualisedReturn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"portfolioId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"portfolioId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"years"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<PortalPortfolioAnnualisedReturnQuery, PortalPortfolioAnnualisedReturnQueryVariables>;
export const GetPortfolioExternalStockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPortfolioExternalStock"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalExternalHoldings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lwin18"}},{"kind":"Field","name":{"kind":"Name","value":"wineName"}},{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"cultWinesAllocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitCount"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"costPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"valuePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalValue"}},{"kind":"Field","name":{"kind":"Name","value":"changedPct"}},{"kind":"Field","name":{"kind":"Name","value":"netPosition"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"cashOffer"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}}]}}]}}]} as unknown as DocumentNode<GetPortfolioExternalStockQuery, GetPortfolioExternalStockQueryVariables>;
export const GetProductDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalHoldingDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"lwin18"}},{"kind":"Field","name":{"kind":"Name","value":"wineName"}},{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"cultWinesAllocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"dealDate"}},{"kind":"Field","name":{"kind":"Name","value":"dealRef"}},{"kind":"Field","name":{"kind":"Name","value":"dealCCY"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitCount"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"qtyForSale"}},{"kind":"Field","name":{"kind":"Name","value":"priceForSale"}},{"kind":"Field","name":{"kind":"Name","value":"costPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"valuePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"valuePerBottle"}},{"kind":"Field","name":{"kind":"Name","value":"totalValue"}},{"kind":"Field","name":{"kind":"Name","value":"changedPct"}},{"kind":"Field","name":{"kind":"Name","value":"netPosition"}},{"kind":"Field","name":{"kind":"Name","value":"netPositionPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLoss"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLossPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"imageFileName"}},{"kind":"Field","name":{"kind":"Name","value":"mgmtFeePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalMgmtFee"}},{"kind":"Field","name":{"kind":"Name","value":"costWithMgmtFeePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostWithMgmtFee"}},{"kind":"Field","name":{"kind":"Name","value":"holdingStocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rotationNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historicMarketPrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"marketPrice"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductDetailsQuery, GetProductDetailsQueryVariables>;
export const GetSoldStocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSoldStocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalSoldHoldings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lwin18"}},{"kind":"Field","name":{"kind":"Name","value":"wineName"}},{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"cultWinesAllocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"dealDate"}},{"kind":"Field","name":{"kind":"Name","value":"dealRef"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitCount"}},{"kind":"Field","name":{"kind":"Name","value":"qtySold"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"soldDate"}},{"kind":"Field","name":{"kind":"Name","value":"costPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"soldPricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalValue"}},{"kind":"Field","name":{"kind":"Name","value":"changedPct"}},{"kind":"Field","name":{"kind":"Name","value":"netPosition"}},{"kind":"Field","name":{"kind":"Name","value":"netPositionPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLoss"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLossPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"mgmtFeePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalMgmtFee"}},{"kind":"Field","name":{"kind":"Name","value":"costWithMgmtFeePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostWithMgmtFee"}}]}}]}}]} as unknown as DocumentNode<GetSoldStocksQuery, GetSoldStocksQueryVariables>;
export const GetPortfolioCurrentHoldingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPortfolioCurrentHoldings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalCurrentHoldings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"lwin18"}},{"kind":"Field","name":{"kind":"Name","value":"wineName"}},{"kind":"Field","name":{"kind":"Name","value":"vintage"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"cultWinesAllocationRegion"}},{"kind":"Field","name":{"kind":"Name","value":"dealDate"}},{"kind":"Field","name":{"kind":"Name","value":"dealRef"}},{"kind":"Field","name":{"kind":"Name","value":"dealCCY"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"unitCount"}},{"kind":"Field","name":{"kind":"Name","value":"imageFileName"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"qtyForSale"}},{"kind":"Field","name":{"kind":"Name","value":"priceForSale"}},{"kind":"Field","name":{"kind":"Name","value":"costPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"valuePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"valuePerBottle"}},{"kind":"Field","name":{"kind":"Name","value":"totalValue"}},{"kind":"Field","name":{"kind":"Name","value":"changedPct"}},{"kind":"Field","name":{"kind":"Name","value":"netPosition"}},{"kind":"Field","name":{"kind":"Name","value":"netPositionPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLoss"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLossPerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"mgmtFeePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalMgmtFee"}},{"kind":"Field","name":{"kind":"Name","value":"costWithMgmtFeePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostWithMgmtFee"}},{"kind":"Field","name":{"kind":"Name","value":"historicMarketPrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"marketPrice"}}]}}]}}]}}]} as unknown as DocumentNode<GetPortfolioCurrentHoldingsQuery, GetPortfolioCurrentHoldingsQueryVariables>;
export const GetPortfolioBalancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPortfolioBalances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalPortfolioBalance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioName"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"currentHoldings"}},{"kind":"Field","name":{"kind":"Name","value":"capitalInvested"}},{"kind":"Field","name":{"kind":"Name","value":"totalMgmtFee"}},{"kind":"Field","name":{"kind":"Name","value":"netProceedsFromSales"}},{"kind":"Field","name":{"kind":"Name","value":"netPosition"}},{"kind":"Field","name":{"kind":"Name","value":"netPositionPct"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLoss"}},{"kind":"Field","name":{"kind":"Name","value":"profitAndLossPct"}},{"kind":"Field","name":{"kind":"Name","value":"balancePending"}},{"kind":"Field","name":{"kind":"Name","value":"totalRefunds"}},{"kind":"Field","name":{"kind":"Name","value":"netContributions"}},{"kind":"Field","name":{"kind":"Name","value":"currentFeeModel"}}]}}]}}]} as unknown as DocumentNode<GetPortfolioBalancesQuery, GetPortfolioBalancesQueryVariables>;
export const PortalPortfolioPerformanceOverTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PortalPortfolioPerformanceOverTime"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"portfolioId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalPortfolioPerformanceOverTime"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"portfolioId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"portfolioId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"currentHoldings"}},{"kind":"Field","name":{"kind":"Name","value":"netContributions"}}]}}]}}]} as unknown as DocumentNode<PortalPortfolioPerformanceOverTimeQuery, PortalPortfolioPerformanceOverTimeQueryVariables>;
export const GetPortalAllocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPortalAllocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalPortfolioCurrentAllocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalRegionPerformances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"regionName"}},{"kind":"Field","name":{"kind":"Name","value":"currentHoldings"}},{"kind":"Field","name":{"kind":"Name","value":"totalPurchasePrice"}},{"kind":"Field","name":{"kind":"Name","value":"netPosition"}},{"kind":"Field","name":{"kind":"Name","value":"netPositionPct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"portalPortfolioCurrentAllocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tacticalAllocation"}},{"kind":"Field","name":{"kind":"Name","value":"regionName"}},{"kind":"Field","name":{"kind":"Name","value":"currentAllocation"}},{"kind":"Field","name":{"kind":"Name","value":"StrategicAllocation"}}]}}]}}]}}]} as unknown as DocumentNode<GetPortalAllocationsQuery, GetPortalAllocationsQueryVariables>;
export const GetCashBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCashBalance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portalCashBalance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"todayInvestment"}},{"kind":"Field","name":{"kind":"Name","value":"balances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portfolioName"}},{"kind":"Field","name":{"kind":"Name","value":"portfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]}}]} as unknown as DocumentNode<GetCashBalanceQuery, GetCashBalanceQueryVariables>;