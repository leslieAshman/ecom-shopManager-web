/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetMiscellaneous {\n    miscellaneous @client {\n      languages {\n        id\n        value\n        symbol\n        text\n      }\n      currencies {\n        id\n        value\n        text\n        symbol\n      }\n      paymentFrequencies {\n        id\n        value\n        text\n      }\n    }\n  }\n": types.GetMiscellaneousDocument,
    "\n  mutation PortalDeliverWine($portalDeliverWineRequest: PortalDeliverWineRequestInput!) {\n    portalDeliverWine(portalDeliverWineRequest: $portalDeliverWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n": types.PortalDeliverWineDocument,
    "\n  mutation PortalBuyWine($portalBuyWineRequest: PortalBuyWineRequestInput!) {\n    portalBuyWine(portalBuyWineRequest: $portalBuyWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n": types.PortalBuyWineDocument,
    "\n  mutation PortalSellWine($portalSellWineRequest: PortalSellWineRequestInput!) {\n    portalSellWine(portalSellWineRequest: $portalSellWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n": types.PortalSellWineDocument,
    "\n  mutation CancelStripeRecurringPayment($recurringPaymentId: String!) {\n    cancelStripeRecurringPayment(recurringPaymentId: $recurringPaymentId) {\n      subscriptionId\n      hasCancelled\n    }\n  }\n": types.CancelStripeRecurringPaymentDocument,
    "\n  mutation AuthChangePassword($changePasswordInput: AuthChangePasswordInput!) {\n    authChangePassword(changePasswordInput: $changePasswordInput) {\n      wasPasswordChanged\n    }\n  }\n": types.AuthChangePasswordDocument,
    "\n  mutation PortalContactRelationshipManger($request: ContactRmInput!) {\n    portalContactRelationshipManger(request: $request) {\n      errorMessage\n      isSuccess\n    }\n  }\n": types.PortalContactRelationshipMangerDocument,
    "\n  mutation CreateStripeRecurringPayment($stripeRecurringPayment: StripeRecurringPaymentInput!) {\n    createStripeRecurringPayment(stripeRecurringPayment: $stripeRecurringPayment) {\n      id\n      subId\n      clientSecret\n    }\n  }\n": types.CreateStripeRecurringPaymentDocument,
    "\n  query AuthUser {\n    authUser {\n      emailAddress\n    }\n  }\n": types.AuthUserDocument,
    "\n  query paymentReferenceNumber {\n    paymentReferenceNumber\n  }\n": types.PaymentReferenceNumberDocument,
    "\n  query ManagementFeesQuery {\n    portalManagementFees {\n      id\n      accountHolderName\n      vintradeAccountHolderId\n      clientName\n      vintradeClientId\n      valuationDate\n      feeType\n      portfolioValue\n      offsetValue\n      feeAmount\n      appliedPct\n      invoiceNumber\n      invoiceDate\n      status\n    }\n  }\n": types.ManagementFeesQueryDocument,
    "\n  query GetPaymentCards($currency: String!) {\n    customerCards(currency: $currency) {\n      id\n      brand\n      country\n      expMonth\n      expYear\n      last4\n      funding\n      billingAddress {\n        city\n        country\n        line1\n        line2\n        postalCode\n        state\n      }\n    }\n  }\n": types.GetPaymentCardsDocument,
    "\n  query GetPaymentSubscriptions {\n    recurringPayments {\n      id\n      currency\n      amount\n      status\n      portfolioId\n      portfolioName\n      frequency\n      priceId\n      paymentMethodId\n    }\n  }\n": types.GetPaymentSubscriptionsDocument,
    "\n  query GetRMDocument {\n    getCustomerRM {\n      id\n      name\n      photo\n    }\n  }\n": types.GetRmDocumentDocument,
    "\n  query RecurringPaymentPrices($currency: String!) {\n    recurringPaymentPrices(currency: $currency) {\n      id\n      nickName\n      product\n      currency\n      unitAmount\n      recurringInterval\n      recurringIntervalCount\n    }\n  }\n": types.RecurringPaymentPricesDocument,
    "\n  query GetUserPreferences {\n    portalClientPreferences {\n      currency\n      language\n    }\n  }\n": types.GetUserPreferencesDocument,
    "\n  query HubSpotQuery($email: String!) {\n    getCustomer(email: $email) {\n      id\n      firstName\n      lastName\n      email\n      dateOfBirth\n      city\n      country\n      state\n      postCode\n      addressline1\n      addressline2\n      addressline3\n    }\n  }\n": types.HubSpotQueryDocument,
    "\n  mutation CreateStripePayment($stripePayment: StripePaymentInput!) {\n    createStripePayment(stripePayment: $stripePayment) {\n      id\n      paymentIntentId\n      clientSecret\n    }\n  }\n": types.CreateStripePaymentDocument,
    "\n  mutation UpdateStripeRecurringPayment($request: UpdateStripeRecurringPaymentInput!) {\n    updateStripeRecurringPayment(request: $request) {\n      subscriptionId\n      hasUpdated\n    }\n  }\n": types.UpdateStripeRecurringPaymentDocument,
    "\n  mutation PortalUpdatePreferences($request: UpdatePreferencesInput!) {\n    portalUpdatePreferences(request: $request) {\n      currency\n      language\n    }\n  }\n": types.PortalUpdatePreferencesDocument,
    "\n  query Login($userCredentials: LoginInput!) {\n    login(userCredentials: $userCredentials) {\n      isSuccess\n      message\n      userToken\n    }\n  }\n": types.LoginDocument,
    "\n  query GetUser($email: String!) {\n    getUser(email: $email) {\n      email\n      createdDate\n      id\n      name\n      createdDate\n    }\n  }\n": types.GetUserDocument,
    "\n  mutation SubmitOneTimePasscode($args: AuthMfaOobCodeVerifyRequestInput!) {\n    portalAuthMfaVerify(mfaOobCodeVerifyRequestInput: $args) {\n      accessToken\n      idToken\n      userToken\n      refreshToken\n      error\n      errorDescription\n    }\n  }\n": types.SubmitOneTimePasscodeDocument,
    "\n  mutation RefreshAccessToken($input: AuthRefreshAccessTokenRequestInput!) {\n    authRefreshAccessToken(refreshAccessTokenRequestInput: $input) {\n      accessToken\n      refreshToken\n      userToken\n    }\n  }\n": types.RefreshAccessTokenDocument,
    "\n  mutation RegisterUser($userCredentials: RegisterInput!) {\n    registerUser(userCredentials: $userCredentials) {\n      isSuccess\n      message\n      messageType\n    }\n  }\n": types.RegisterUserDocument,
    "\n  query ResetPasswordQuery($email: String!, $clientId: String!) {\n    resetPassword(email: $email, clientId: $clientId) {\n      isSuccess\n      message\n    }\n  }\n": types.ResetPasswordQueryDocument,
    "\n  query ValidateEmail($email: String!) {\n    validateEmail(email: $email) {\n      isSuccess\n      messageType\n      message\n    }\n  }\n": types.ValidateEmailDocument,
    "\n  query GetEventById($eventId: String!) {\n    getDocumentById(id: $eventId) {\n      ... on EventDetail {\n        id\n        type\n        title\n        price\n        country\n        priceCurrency\n        dateTime\n        locationShort\n        mainImage\n        locationFullAddress\n        content\n        eventbriteId\n        eventbriteShow\n      }\n    }\n  }\n": types.GetEventByIdDocument,
    "\n  query GetEventDocuments($eventInput: DocumentQueryInput!) {\n    getDocuments(input: $eventInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on Event {\n          id\n          title\n          country\n          priceCurrency\n          price\n          dateTime\n          type\n          mainImage\n          locationShort\n        }\n      }\n    }\n  }\n": types.GetEventDocumentsDocument,
    "\n  query GetLearningHubDocument($learningInput: DocumentQueryInput!) {\n    getDocuments(input: $learningInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on LearningHub {\n          id\n          title\n          contentType\n          publishDate\n          contentShort\n          mainImage\n        }\n      }\n    }\n  }\n": types.GetLearningHubDocumentDocument,
    "\n  query GetLearningHubById($learningId: String!) {\n    getDocumentById(id: $learningId) {\n      ... on LearningHubDetail {\n        id\n        title\n        contentType\n        publishDate\n        contentType\n        contentShort\n        contentLong\n        mainImage\n        videoUrl\n      }\n    }\n  }\n": types.GetLearningHubByIdDocument,
    "\n  query GetInvestOffers($offerInput: DocumentQueryInput!) {\n    getDocuments(input: $offerInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on InvestOffer {\n          id\n          name\n          subtitle\n          priceGbp\n          unitSize\n          region\n          type\n          expiryDate\n          mainImage\n        }\n      }\n    }\n  }\n": types.GetInvestOffersDocument,
    "\n  query GetInvestOfferDetails($offerId: String!) {\n    getDocumentById(id: $offerId) {\n      ... on InvestOfferDetail {\n        id\n        name\n        subtitle\n        priceGbp\n        unitSize\n        region\n        type\n        expiryDate\n        mainImage\n        sections {\n          title\n          content\n        }\n        disclaimer\n      }\n    }\n  }\n": types.GetInvestOfferDetailsDocument,
    "\n  mutation PortalInvestNow($portalInvestNowRequest: PortalInvestNowRequestInput!) {\n    portalInvestNow(portalInvestNowRequest: $portalInvestNowRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n": types.PortalInvestNowDocument,
    "\n  query GetMyCellar {\n    portalMyCellar {\n      rotationNumber\n      stockId\n      holdingId\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      imageFileName\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      qty\n      status\n      location\n    }\n  }\n": types.GetMyCellarDocument,
    "\n  query GetmyCelllarWineDetails($stockId: String!) {\n    portalMyCellarWineDetails(stockId: $stockId) {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      imageFileName\n      unitCount\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      rotationNumber\n      status\n      location\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n": types.GetmyCelllarWineDetailsDocument,
    "\n  query UserNotifications($from: Int!, $pageSize: Int!) {\n    userNotifications(from: $from, pageSize: $pageSize) {\n      total\n      pageSize\n      from\n      totalPages\n      unreadCount\n      results {\n        id\n        category\n        type\n        summary\n        description\n        isRead\n        createdDateTime\n        updatedDateTime\n      }\n    }\n  }\n": types.UserNotificationsDocument,
    "\n  mutation MarkNotificationsRead($request: MarkNotificationsReadRequest!) {\n    markNotificationsRead(request: $request)\n  }\n": types.MarkNotificationsReadDocument,
    "\n  query PortalPortfolioAnnualisedReturn($portfolioId: Int) {\n    portalPortfolioAnnualisedReturn(portfolioId: $portfolioId) {\n      years {\n        date\n        value\n      }\n      monthly {\n        date\n        value\n      }\n    }\n  }\n": types.PortalPortfolioAnnualisedReturnDocument,
    "\n  query GetPortfolioExternalStock {\n    portalExternalHoldings {\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      unit\n      unitCount\n      qty\n      costPerUnit\n      totalCost\n      valuePerUnit\n      totalValue\n      changedPct\n      netPosition\n      location\n      cashOffer\n      createdDate\n    }\n  }\n": types.GetPortfolioExternalStockDocument,
    "\n  query GetProductDetails($id: String!) {\n    portalHoldingDetails(id: $id) {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      imageFileName\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      holdingStocks {\n        rotationNumber\n        status\n        location\n      }\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n": types.GetProductDetailsDocument,
    "\n  query GetSoldStocks {\n    portalSoldHoldings {\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      unit\n      unitCount\n      qtySold\n      status\n      soldDate\n      costPerUnit\n      totalCost\n      soldPricePerUnit\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n    }\n  }\n": types.GetSoldStocksDocument,
    "\n  query GetPortfolioCurrentHoldings {\n    portalCurrentHoldings {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      imageFileName\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n": types.GetPortfolioCurrentHoldingsDocument,
    "\n  query GetPortfolioBalances {\n    portalPortfolioBalance {\n      balance\n      portfolioName\n      portfolioId\n      currentHoldings\n      capitalInvested\n      totalMgmtFee\n      netProceedsFromSales\n      netPosition\n      netPositionPct\n      profitAndLoss\n      profitAndLossPct\n      balancePending\n      totalRefunds\n      netContributions\n      currentFeeModel\n    }\n  }\n": types.GetPortfolioBalancesDocument,
    "\n  query PortalPortfolioPerformanceOverTime($portfolioId: Int) {\n    portalPortfolioPerformanceOverTime(portfolioId: $portfolioId) {\n      date\n      currentHoldings\n      netContributions\n    }\n  }\n": types.PortalPortfolioPerformanceOverTimeDocument,
    "\n  query GetPortalAllocations {\n    portalPortfolioCurrentAllocation {\n      portalRegionPerformances {\n        regionName\n        currentHoldings\n        totalPurchasePrice\n        netPosition\n        netPositionPct\n      }\n      portalPortfolioCurrentAllocation {\n        tacticalAllocation\n        regionName\n        currentAllocation\n        StrategicAllocation\n      }\n    }\n  }\n": types.GetPortalAllocationsDocument,
    "\n  query GetCashBalance {\n    portalCashBalance {\n      todayInvestment\n      balances {\n        portfolioName\n        portfolioId\n        balance\n      }\n    }\n  }\n": types.GetCashBalanceDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMiscellaneous {\n    miscellaneous @client {\n      languages {\n        id\n        value\n        symbol\n        text\n      }\n      currencies {\n        id\n        value\n        text\n        symbol\n      }\n      paymentFrequencies {\n        id\n        value\n        text\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMiscellaneous {\n    miscellaneous @client {\n      languages {\n        id\n        value\n        symbol\n        text\n      }\n      currencies {\n        id\n        value\n        text\n        symbol\n      }\n      paymentFrequencies {\n        id\n        value\n        text\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PortalDeliverWine($portalDeliverWineRequest: PortalDeliverWineRequestInput!) {\n    portalDeliverWine(portalDeliverWineRequest: $portalDeliverWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n"): (typeof documents)["\n  mutation PortalDeliverWine($portalDeliverWineRequest: PortalDeliverWineRequestInput!) {\n    portalDeliverWine(portalDeliverWineRequest: $portalDeliverWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PortalBuyWine($portalBuyWineRequest: PortalBuyWineRequestInput!) {\n    portalBuyWine(portalBuyWineRequest: $portalBuyWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n"): (typeof documents)["\n  mutation PortalBuyWine($portalBuyWineRequest: PortalBuyWineRequestInput!) {\n    portalBuyWine(portalBuyWineRequest: $portalBuyWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PortalSellWine($portalSellWineRequest: PortalSellWineRequestInput!) {\n    portalSellWine(portalSellWineRequest: $portalSellWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n"): (typeof documents)["\n  mutation PortalSellWine($portalSellWineRequest: PortalSellWineRequestInput!) {\n    portalSellWine(portalSellWineRequest: $portalSellWineRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CancelStripeRecurringPayment($recurringPaymentId: String!) {\n    cancelStripeRecurringPayment(recurringPaymentId: $recurringPaymentId) {\n      subscriptionId\n      hasCancelled\n    }\n  }\n"): (typeof documents)["\n  mutation CancelStripeRecurringPayment($recurringPaymentId: String!) {\n    cancelStripeRecurringPayment(recurringPaymentId: $recurringPaymentId) {\n      subscriptionId\n      hasCancelled\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AuthChangePassword($changePasswordInput: AuthChangePasswordInput!) {\n    authChangePassword(changePasswordInput: $changePasswordInput) {\n      wasPasswordChanged\n    }\n  }\n"): (typeof documents)["\n  mutation AuthChangePassword($changePasswordInput: AuthChangePasswordInput!) {\n    authChangePassword(changePasswordInput: $changePasswordInput) {\n      wasPasswordChanged\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PortalContactRelationshipManger($request: ContactRmInput!) {\n    portalContactRelationshipManger(request: $request) {\n      errorMessage\n      isSuccess\n    }\n  }\n"): (typeof documents)["\n  mutation PortalContactRelationshipManger($request: ContactRmInput!) {\n    portalContactRelationshipManger(request: $request) {\n      errorMessage\n      isSuccess\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateStripeRecurringPayment($stripeRecurringPayment: StripeRecurringPaymentInput!) {\n    createStripeRecurringPayment(stripeRecurringPayment: $stripeRecurringPayment) {\n      id\n      subId\n      clientSecret\n    }\n  }\n"): (typeof documents)["\n  mutation CreateStripeRecurringPayment($stripeRecurringPayment: StripeRecurringPaymentInput!) {\n    createStripeRecurringPayment(stripeRecurringPayment: $stripeRecurringPayment) {\n      id\n      subId\n      clientSecret\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AuthUser {\n    authUser {\n      emailAddress\n    }\n  }\n"): (typeof documents)["\n  query AuthUser {\n    authUser {\n      emailAddress\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query paymentReferenceNumber {\n    paymentReferenceNumber\n  }\n"): (typeof documents)["\n  query paymentReferenceNumber {\n    paymentReferenceNumber\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ManagementFeesQuery {\n    portalManagementFees {\n      id\n      accountHolderName\n      vintradeAccountHolderId\n      clientName\n      vintradeClientId\n      valuationDate\n      feeType\n      portfolioValue\n      offsetValue\n      feeAmount\n      appliedPct\n      invoiceNumber\n      invoiceDate\n      status\n    }\n  }\n"): (typeof documents)["\n  query ManagementFeesQuery {\n    portalManagementFees {\n      id\n      accountHolderName\n      vintradeAccountHolderId\n      clientName\n      vintradeClientId\n      valuationDate\n      feeType\n      portfolioValue\n      offsetValue\n      feeAmount\n      appliedPct\n      invoiceNumber\n      invoiceDate\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPaymentCards($currency: String!) {\n    customerCards(currency: $currency) {\n      id\n      brand\n      country\n      expMonth\n      expYear\n      last4\n      funding\n      billingAddress {\n        city\n        country\n        line1\n        line2\n        postalCode\n        state\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPaymentCards($currency: String!) {\n    customerCards(currency: $currency) {\n      id\n      brand\n      country\n      expMonth\n      expYear\n      last4\n      funding\n      billingAddress {\n        city\n        country\n        line1\n        line2\n        postalCode\n        state\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPaymentSubscriptions {\n    recurringPayments {\n      id\n      currency\n      amount\n      status\n      portfolioId\n      portfolioName\n      frequency\n      priceId\n      paymentMethodId\n    }\n  }\n"): (typeof documents)["\n  query GetPaymentSubscriptions {\n    recurringPayments {\n      id\n      currency\n      amount\n      status\n      portfolioId\n      portfolioName\n      frequency\n      priceId\n      paymentMethodId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRMDocument {\n    getCustomerRM {\n      id\n      name\n      photo\n    }\n  }\n"): (typeof documents)["\n  query GetRMDocument {\n    getCustomerRM {\n      id\n      name\n      photo\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query RecurringPaymentPrices($currency: String!) {\n    recurringPaymentPrices(currency: $currency) {\n      id\n      nickName\n      product\n      currency\n      unitAmount\n      recurringInterval\n      recurringIntervalCount\n    }\n  }\n"): (typeof documents)["\n  query RecurringPaymentPrices($currency: String!) {\n    recurringPaymentPrices(currency: $currency) {\n      id\n      nickName\n      product\n      currency\n      unitAmount\n      recurringInterval\n      recurringIntervalCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserPreferences {\n    portalClientPreferences {\n      currency\n      language\n    }\n  }\n"): (typeof documents)["\n  query GetUserPreferences {\n    portalClientPreferences {\n      currency\n      language\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HubSpotQuery($email: String!) {\n    getCustomer(email: $email) {\n      id\n      firstName\n      lastName\n      email\n      dateOfBirth\n      city\n      country\n      state\n      postCode\n      addressline1\n      addressline2\n      addressline3\n    }\n  }\n"): (typeof documents)["\n  query HubSpotQuery($email: String!) {\n    getCustomer(email: $email) {\n      id\n      firstName\n      lastName\n      email\n      dateOfBirth\n      city\n      country\n      state\n      postCode\n      addressline1\n      addressline2\n      addressline3\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateStripePayment($stripePayment: StripePaymentInput!) {\n    createStripePayment(stripePayment: $stripePayment) {\n      id\n      paymentIntentId\n      clientSecret\n    }\n  }\n"): (typeof documents)["\n  mutation CreateStripePayment($stripePayment: StripePaymentInput!) {\n    createStripePayment(stripePayment: $stripePayment) {\n      id\n      paymentIntentId\n      clientSecret\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateStripeRecurringPayment($request: UpdateStripeRecurringPaymentInput!) {\n    updateStripeRecurringPayment(request: $request) {\n      subscriptionId\n      hasUpdated\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateStripeRecurringPayment($request: UpdateStripeRecurringPaymentInput!) {\n    updateStripeRecurringPayment(request: $request) {\n      subscriptionId\n      hasUpdated\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PortalUpdatePreferences($request: UpdatePreferencesInput!) {\n    portalUpdatePreferences(request: $request) {\n      currency\n      language\n    }\n  }\n"): (typeof documents)["\n  mutation PortalUpdatePreferences($request: UpdatePreferencesInput!) {\n    portalUpdatePreferences(request: $request) {\n      currency\n      language\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Login($userCredentials: LoginInput!) {\n    login(userCredentials: $userCredentials) {\n      isSuccess\n      message\n      userToken\n    }\n  }\n"): (typeof documents)["\n  query Login($userCredentials: LoginInput!) {\n    login(userCredentials: $userCredentials) {\n      isSuccess\n      message\n      userToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUser($email: String!) {\n    getUser(email: $email) {\n      email\n      createdDate\n      id\n      name\n      createdDate\n    }\n  }\n"): (typeof documents)["\n  query GetUser($email: String!) {\n    getUser(email: $email) {\n      email\n      createdDate\n      id\n      name\n      createdDate\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SubmitOneTimePasscode($args: AuthMfaOobCodeVerifyRequestInput!) {\n    portalAuthMfaVerify(mfaOobCodeVerifyRequestInput: $args) {\n      accessToken\n      idToken\n      userToken\n      refreshToken\n      error\n      errorDescription\n    }\n  }\n"): (typeof documents)["\n  mutation SubmitOneTimePasscode($args: AuthMfaOobCodeVerifyRequestInput!) {\n    portalAuthMfaVerify(mfaOobCodeVerifyRequestInput: $args) {\n      accessToken\n      idToken\n      userToken\n      refreshToken\n      error\n      errorDescription\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RefreshAccessToken($input: AuthRefreshAccessTokenRequestInput!) {\n    authRefreshAccessToken(refreshAccessTokenRequestInput: $input) {\n      accessToken\n      refreshToken\n      userToken\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshAccessToken($input: AuthRefreshAccessTokenRequestInput!) {\n    authRefreshAccessToken(refreshAccessTokenRequestInput: $input) {\n      accessToken\n      refreshToken\n      userToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RegisterUser($userCredentials: RegisterInput!) {\n    registerUser(userCredentials: $userCredentials) {\n      isSuccess\n      message\n      messageType\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterUser($userCredentials: RegisterInput!) {\n    registerUser(userCredentials: $userCredentials) {\n      isSuccess\n      message\n      messageType\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ResetPasswordQuery($email: String!, $clientId: String!) {\n    resetPassword(email: $email, clientId: $clientId) {\n      isSuccess\n      message\n    }\n  }\n"): (typeof documents)["\n  query ResetPasswordQuery($email: String!, $clientId: String!) {\n    resetPassword(email: $email, clientId: $clientId) {\n      isSuccess\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ValidateEmail($email: String!) {\n    validateEmail(email: $email) {\n      isSuccess\n      messageType\n      message\n    }\n  }\n"): (typeof documents)["\n  query ValidateEmail($email: String!) {\n    validateEmail(email: $email) {\n      isSuccess\n      messageType\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEventById($eventId: String!) {\n    getDocumentById(id: $eventId) {\n      ... on EventDetail {\n        id\n        type\n        title\n        price\n        country\n        priceCurrency\n        dateTime\n        locationShort\n        mainImage\n        locationFullAddress\n        content\n        eventbriteId\n        eventbriteShow\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEventById($eventId: String!) {\n    getDocumentById(id: $eventId) {\n      ... on EventDetail {\n        id\n        type\n        title\n        price\n        country\n        priceCurrency\n        dateTime\n        locationShort\n        mainImage\n        locationFullAddress\n        content\n        eventbriteId\n        eventbriteShow\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEventDocuments($eventInput: DocumentQueryInput!) {\n    getDocuments(input: $eventInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on Event {\n          id\n          title\n          country\n          priceCurrency\n          price\n          dateTime\n          type\n          mainImage\n          locationShort\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEventDocuments($eventInput: DocumentQueryInput!) {\n    getDocuments(input: $eventInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on Event {\n          id\n          title\n          country\n          priceCurrency\n          price\n          dateTime\n          type\n          mainImage\n          locationShort\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLearningHubDocument($learningInput: DocumentQueryInput!) {\n    getDocuments(input: $learningInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on LearningHub {\n          id\n          title\n          contentType\n          publishDate\n          contentShort\n          mainImage\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetLearningHubDocument($learningInput: DocumentQueryInput!) {\n    getDocuments(input: $learningInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on LearningHub {\n          id\n          title\n          contentType\n          publishDate\n          contentShort\n          mainImage\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLearningHubById($learningId: String!) {\n    getDocumentById(id: $learningId) {\n      ... on LearningHubDetail {\n        id\n        title\n        contentType\n        publishDate\n        contentType\n        contentShort\n        contentLong\n        mainImage\n        videoUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetLearningHubById($learningId: String!) {\n    getDocumentById(id: $learningId) {\n      ... on LearningHubDetail {\n        id\n        title\n        contentType\n        publishDate\n        contentType\n        contentShort\n        contentLong\n        mainImage\n        videoUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetInvestOffers($offerInput: DocumentQueryInput!) {\n    getDocuments(input: $offerInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on InvestOffer {\n          id\n          name\n          subtitle\n          priceGbp\n          unitSize\n          region\n          type\n          expiryDate\n          mainImage\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetInvestOffers($offerInput: DocumentQueryInput!) {\n    getDocuments(input: $offerInput) {\n      page\n      resultPerPage\n      resultSize\n      totalResultsSize\n      totalPages\n      results {\n        ... on InvestOffer {\n          id\n          name\n          subtitle\n          priceGbp\n          unitSize\n          region\n          type\n          expiryDate\n          mainImage\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetInvestOfferDetails($offerId: String!) {\n    getDocumentById(id: $offerId) {\n      ... on InvestOfferDetail {\n        id\n        name\n        subtitle\n        priceGbp\n        unitSize\n        region\n        type\n        expiryDate\n        mainImage\n        sections {\n          title\n          content\n        }\n        disclaimer\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetInvestOfferDetails($offerId: String!) {\n    getDocumentById(id: $offerId) {\n      ... on InvestOfferDetail {\n        id\n        name\n        subtitle\n        priceGbp\n        unitSize\n        region\n        type\n        expiryDate\n        mainImage\n        sections {\n          title\n          content\n        }\n        disclaimer\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PortalInvestNow($portalInvestNowRequest: PortalInvestNowRequestInput!) {\n    portalInvestNow(portalInvestNowRequest: $portalInvestNowRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n"): (typeof documents)["\n  mutation PortalInvestNow($portalInvestNowRequest: PortalInvestNowRequestInput!) {\n    portalInvestNow(portalInvestNowRequest: $portalInvestNowRequest) {\n      isSuccess\n      errorMessage\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyCellar {\n    portalMyCellar {\n      rotationNumber\n      stockId\n      holdingId\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      imageFileName\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      qty\n      status\n      location\n    }\n  }\n"): (typeof documents)["\n  query GetMyCellar {\n    portalMyCellar {\n      rotationNumber\n      stockId\n      holdingId\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      imageFileName\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      qty\n      status\n      location\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetmyCelllarWineDetails($stockId: String!) {\n    portalMyCellarWineDetails(stockId: $stockId) {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      imageFileName\n      unitCount\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      rotationNumber\n      status\n      location\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetmyCelllarWineDetails($stockId: String!) {\n    portalMyCellarWineDetails(stockId: $stockId) {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      imageFileName\n      unitCount\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      rotationNumber\n      status\n      location\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UserNotifications($from: Int!, $pageSize: Int!) {\n    userNotifications(from: $from, pageSize: $pageSize) {\n      total\n      pageSize\n      from\n      totalPages\n      unreadCount\n      results {\n        id\n        category\n        type\n        summary\n        description\n        isRead\n        createdDateTime\n        updatedDateTime\n      }\n    }\n  }\n"): (typeof documents)["\n  query UserNotifications($from: Int!, $pageSize: Int!) {\n    userNotifications(from: $from, pageSize: $pageSize) {\n      total\n      pageSize\n      from\n      totalPages\n      unreadCount\n      results {\n        id\n        category\n        type\n        summary\n        description\n        isRead\n        createdDateTime\n        updatedDateTime\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MarkNotificationsRead($request: MarkNotificationsReadRequest!) {\n    markNotificationsRead(request: $request)\n  }\n"): (typeof documents)["\n  mutation MarkNotificationsRead($request: MarkNotificationsReadRequest!) {\n    markNotificationsRead(request: $request)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PortalPortfolioAnnualisedReturn($portfolioId: Int) {\n    portalPortfolioAnnualisedReturn(portfolioId: $portfolioId) {\n      years {\n        date\n        value\n      }\n      monthly {\n        date\n        value\n      }\n    }\n  }\n"): (typeof documents)["\n  query PortalPortfolioAnnualisedReturn($portfolioId: Int) {\n    portalPortfolioAnnualisedReturn(portfolioId: $portfolioId) {\n      years {\n        date\n        value\n      }\n      monthly {\n        date\n        value\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPortfolioExternalStock {\n    portalExternalHoldings {\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      unit\n      unitCount\n      qty\n      costPerUnit\n      totalCost\n      valuePerUnit\n      totalValue\n      changedPct\n      netPosition\n      location\n      cashOffer\n      createdDate\n    }\n  }\n"): (typeof documents)["\n  query GetPortfolioExternalStock {\n    portalExternalHoldings {\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      unit\n      unitCount\n      qty\n      costPerUnit\n      totalCost\n      valuePerUnit\n      totalValue\n      changedPct\n      netPosition\n      location\n      cashOffer\n      createdDate\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProductDetails($id: String!) {\n    portalHoldingDetails(id: $id) {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      imageFileName\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      holdingStocks {\n        rotationNumber\n        status\n        location\n      }\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProductDetails($id: String!) {\n    portalHoldingDetails(id: $id) {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      imageFileName\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      holdingStocks {\n        rotationNumber\n        status\n        location\n      }\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSoldStocks {\n    portalSoldHoldings {\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      unit\n      unitCount\n      qtySold\n      status\n      soldDate\n      costPerUnit\n      totalCost\n      soldPricePerUnit\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n    }\n  }\n"): (typeof documents)["\n  query GetSoldStocks {\n    portalSoldHoldings {\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      unit\n      unitCount\n      qtySold\n      status\n      soldDate\n      costPerUnit\n      totalCost\n      soldPricePerUnit\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPortfolioCurrentHoldings {\n    portalCurrentHoldings {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      imageFileName\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPortfolioCurrentHoldings {\n    portalCurrentHoldings {\n      id\n      portfolioId\n      lwin18\n      wineName\n      vintage\n      region\n      cultWinesAllocationRegion\n      dealDate\n      dealRef\n      dealCCY\n      unit\n      unitCount\n      imageFileName\n      qty\n      qtyForSale\n      priceForSale\n      costPerUnit\n      totalCost\n      valuePerUnit\n      valuePerBottle\n      totalValue\n      changedPct\n      netPosition\n      netPositionPerUnit\n      profitAndLoss\n      profitAndLossPerUnit\n      mgmtFeePerUnit\n      totalMgmtFee\n      costWithMgmtFeePerUnit\n      totalCostWithMgmtFee\n      historicMarketPrices {\n        date\n        marketPrice\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPortfolioBalances {\n    portalPortfolioBalance {\n      balance\n      portfolioName\n      portfolioId\n      currentHoldings\n      capitalInvested\n      totalMgmtFee\n      netProceedsFromSales\n      netPosition\n      netPositionPct\n      profitAndLoss\n      profitAndLossPct\n      balancePending\n      totalRefunds\n      netContributions\n      currentFeeModel\n    }\n  }\n"): (typeof documents)["\n  query GetPortfolioBalances {\n    portalPortfolioBalance {\n      balance\n      portfolioName\n      portfolioId\n      currentHoldings\n      capitalInvested\n      totalMgmtFee\n      netProceedsFromSales\n      netPosition\n      netPositionPct\n      profitAndLoss\n      profitAndLossPct\n      balancePending\n      totalRefunds\n      netContributions\n      currentFeeModel\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PortalPortfolioPerformanceOverTime($portfolioId: Int) {\n    portalPortfolioPerformanceOverTime(portfolioId: $portfolioId) {\n      date\n      currentHoldings\n      netContributions\n    }\n  }\n"): (typeof documents)["\n  query PortalPortfolioPerformanceOverTime($portfolioId: Int) {\n    portalPortfolioPerformanceOverTime(portfolioId: $portfolioId) {\n      date\n      currentHoldings\n      netContributions\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPortalAllocations {\n    portalPortfolioCurrentAllocation {\n      portalRegionPerformances {\n        regionName\n        currentHoldings\n        totalPurchasePrice\n        netPosition\n        netPositionPct\n      }\n      portalPortfolioCurrentAllocation {\n        tacticalAllocation\n        regionName\n        currentAllocation\n        StrategicAllocation\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPortalAllocations {\n    portalPortfolioCurrentAllocation {\n      portalRegionPerformances {\n        regionName\n        currentHoldings\n        totalPurchasePrice\n        netPosition\n        netPositionPct\n      }\n      portalPortfolioCurrentAllocation {\n        tacticalAllocation\n        regionName\n        currentAllocation\n        StrategicAllocation\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetCashBalance {\n    portalCashBalance {\n      todayInvestment\n      balances {\n        portfolioName\n        portfolioId\n        balance\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCashBalance {\n    portalCashBalance {\n      todayInvestment\n      balances {\n        portfolioName\n        portfolioId\n        balance\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;