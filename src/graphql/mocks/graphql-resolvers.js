import moment from 'moment';
import { getRegions } from '../../helpers';
import { getRange, pickRandom, randomDate, randomNumberBetween } from '../../utils';

export const mockProductDealRef = '4234561';
export const mockProduct = {
  id: '232',
  portfolioId: 1,
  assetId: 12,
  lwin18: '1',

  // location?: string;
  // status?: string;

  // rotationNumber: string;
  // sanitized_wine_name: "string",

  wineName: 'Unico, Vega Sicilia',
  vintage: '2004',
  region: 'Bordeaux',
  cultWinesAllocationRegion: 'Bordeaux',
  dealDate: '2023-09-23',
  dealRef: '2234561',
  dealCCY: 'GBP',
  unit: '6x75cl',
  unitCount: 6,
  qty: 2,
  qtyForSale: 2,
  priceForSale: 1100.0,
  costPerUnit: 1092.5,
  totalCost: 2185.0,
  valuePerUnit: 1577,
  valuePerBottle: 263.66,
  totalValue: 3164.0,
  changedPct: 44.81,
  mgmtFeePerUnit: 10.0,
  totalMgmtFee: 20.0,
  costWithMgmtFeePerUnit: 20.0,
  totalCostWithMgmtFee: 20.0,
  netPosition: 979.0,
  netPositionPerUnit: 489.5,
  profitAndLoss: 969.0,
  profitAndLostPerUnit: 484.5,
};

const regions = getRegions();

export const GetMockEventsAndExperiences = (numItems) =>
  getRange(numItems).map((x, i) => ({
    id: '457098141847',
    title: `Dinner with Clos Apalta ${i} `,
    price: randomNumberBetween(50, 1000),
    date: '2022-10-12',
    time: '10:34',
    location: 'London',
    imageUrl: '',
  }));

export const getStockMocks = (numItems) =>
  getRange(numItems).map((x, i) => ({
    ...mockProduct,
    portfolioId: randomNumberBetween(100, 1000),
    lwin18: `${i + 1}`,
    wineName: `Wine name ${i} `,
    region: regions[randomNumberBetween(0, regions.length - 1)].text,
    profitAndLossHistory: [],
    imageUrl: '',
  }));

export const getInvestOffers = (numItems, startDate, endDate) => {
  const subTitles = ['Best price in the market', 'High growth potential', 'New Release', '28% discount to market'];
  return getStockMocks(numItems).map((x, index) => ({
    id: `offer-${index}`,
    unitSize: x.unit,
    title: `${x.wineName} package`,
    subtitle: subTitles[randomNumberBetween(0, subTitles.length - 1)],
    price: x.totalValue,
    expiryDate: randomDate(startDate, endDate),
    region: x.region,
    priceGbp: x.totalValue,
  }));
};

export const getMockLearningHub = (numItems) =>
  getRange(numItems).map((x, i) => ({
    id: `${i + 1}`,
    title: `Introduction to Fine Wine Investment ${i} `,
    description:
      'Cult Wines Vice President Austin Walsh and Jonathan Stevenson host a webinar on investing in Fine Wine with Cult Wines. Cult Wines host a webinar showcasing',
    date: '2022-10-12',
    imageUrl: '',
  }));

export const getMockPrismicContent = () => {
  return `<p class="block-img"><img src="https://images.prismic.io/cultwines/7d338e97-2de7-4e62-82ec-41ad9b6a62a3_southamerica200922_g1.png?auto=compress,format" alt="null" /></p><p>Despite their growing popularity and superior status among South American wines, Cheval des Andes, Catena Zapata and Clos Apalta remain very attractively priced compared to their Californian counterparts with similar scores. Cheval des Andes 2019 (WA: 98 points) is available at a 79% discount to Dominus 2019 while Catena Zapata 2019 (WA: 96 points) and Clos Apalta 2019 (WA: 95 points) are 63% cheaper than Realm The Tempest 2019 and Quintessa 2019, respectively.</p><p> </p><p class="block-img"><img src="https://images.prismic.io/cultwines/eddaab8d-e293-465d-b595-6c9e106a2898_southamerica200922_g2.png?auto=compress,format" alt="null" /></p><p class="block-img"><img src="https://images.prismic.io/cultwines/fc8b6a11-477a-4f03-9b5c-901113d434df_southamerica200922_g3.png?auto=compress,format" alt="null" /></p><p>Furthermore, both Catena Zapata and Clos Apalta wines exhibit strong ageing appreciation profiles. This will help the 2019 releases achieve healthy long-term performance as supplies are consumed over time.</p><p><strong>Significant discount to market</strong></p><ul><li>18% discount to market (Wine-Searcher total price £1,224)</li></ul><p><strong>High scores and praise from major critics:</strong></p><ul><li>99pts James Suckling (Clos Apalta): &quot;It&#39;s full-bodied with firm, creamy and velvety tannins. Long and polished.&quot;</li><li>98pts Luis Gutierrez, The Wine Advocate (Cheval Des Andes): &quot;The way they want to describe the wine is the Argentinean expression of Cheval Blanc. And I can only agree.&quot;</li><li>98pts James Suckling (Catena Zapata): &quot;Wow. So much going on. Layered, seamless and silky. Incredible length.&quot;</li></ul><p><strong>2019 an exceptional Argentinian vintage(2) &amp; strong Chilean vintage3 respectively.</strong></p>`;
};

export const getMockPortfolioBalance = (numItems) =>
  getRange(numItems).map((x, i) => {
    return {
      balance: randomNumberBetween(1000, 5000),
      portfolioName: `Portfolio-name-${randomNumberBetween(1000, 5000)}`,
      portfolioId: i === 0 ? '' : `${randomNumberBetween(1000, 5000)}`,
      currentHoldings: randomNumberBetween(1000, 5000),
      capitalInvested: randomNumberBetween(1000, 5000),
      totalMgmtFee: randomNumberBetween(1000, 5000),
      netProceedsFromSales: randomNumberBetween(1000, 5000),
      netPosition: randomNumberBetween(1000, 5000),
      netPositionPct: randomNumberBetween(1000, 5000),
      profitAndLoss: randomNumberBetween(1000, 5000),
      profitAndLossPct: randomNumberBetween(1000, 5000),
      balancePending: randomNumberBetween(1000, 5000),
      totalRefunds: randomNumberBetween(1000, 5000),
      netContributions: randomNumberBetween(1000, 5000),
      currentFeeModel: pickRandom([true, false]),
    };
  });

const getUserSettings = () => ({
  language: 'en-GB',
  currency: 'GBP',
  email: 'some-email@gmail.com',
  useLoginEmail: false,
});

const getMiscellaneous = () => ({
  languages: [
    {
      id: 'en-GB',
      text: 'United Kingdom',
      symbol: 'English',
      value: 'en-GB',
    },
    // {
    //   id: 'zh-CN',
    //   symbol: '简体中文',
    //   text: '中国',
    //   value: 'zh-CN',
    // },
    // {
    //   id: 'en-CA',
    //   symbol: 'English',
    //   text: 'Canada',
    //   value: 'en-CA',
    // },
    // {
    //   id: 'en-HK',
    //   symbol: 'English',
    //   text: 'Hong Kong',
    //   value: 'en-HK',
    // },
    // {
    //   id: 'en-US',
    //   symbol: 'English',
    //   text: 'United States',
    //   value: 'en-US',
    // },

    // {
    //   id: 'en-SG',
    //   symbol: 'English',
    //   text: 'Sinapore',
    //   value: 'en-SG',
    // },
    {
      id: 'ja-JP',
      symbol: '日本語',
      text: '日本',
      value: 'ja-JP',
    },
  ],

  currencies: [
    {
      id: 'CAD',
      symbol: '$',
      text: 'CAD',
      value: 'CAD',
    },
    {
      id: 'usd',
      symbol: '$',
      displayText: '$ USD',
      text: 'USD',
      value: 'USD',
    },
    {
      id: 'sgd',
      symbol: '$',
      text: 'SGD',
      value: 'SGD',
    },
    {
      id: 'hkd',
      symbol: '$',
      text: 'HKD',
      value: 'HKD',
    },
    {
      id: 'gbp',
      symbol: '£',
      text: 'GBP',
      value: 'GBP',
    },
    {
      id: 'eur',
      symbol: '€',
      text: 'EUR',
      value: 'EUR',
    },
    {
      id: 'cny',
      symbol: '¥',
      text: 'CNY',
      value: 'CNY',
    },

    {
      id: 'chf',
      symbol: '₣',
      text: 'CHF',
      value: 'CHF',
    },
  ],

  paymentFrequencies: [
    {
      id: 'weekly',
      text: 'Weekly',
      value: 'weekly',
    },
    {
      id: 'monthly',
      text: 'Monthly',
      value: 'monthly',
    },
    {
      id: 'yearly',
      text: 'Yearly',
      value: 'yearly',
    },
  ],
});

// const emailValidator = (_, { email }) => {
//   if (email.includes('invalid'))
//     return {
//       result: 'INVALID',
//       isSuccess: true,
//     };
//   if (email.includes('registered'))
//     return {
//       result: 'REGISTERED',
//       isSuccess: true,
//     };

//   return {
//     result: 'VALID',
//     isSuccess: true,
//   };
// };

const getMockManagementFees = (numItems, startDate, endDate) => ({
  totalFees: 3000,
  totalOutstandingFees: 2000,
  managementFees: getRange(numItems).map((x, i) => ({
    id: `${i}`,
    name: `Name ${i}`,
    valuationDate: randomDate(startDate, endDate),
    feeType: pickRandom(['Annual Mgmt Fee', 'Late Paid Stock Fee', 'Cancelled Deal Rebate']),
    portfolioValue: randomNumberBetween(2000, 10000),
    offsetValue: '',
    feeAmount: randomNumberBetween(50, 500),
    applied: randomNumberBetween(10, 300),
    invoiceNumber: randomNumberBetween(100000, 10000000),
    invoiceDate: randomDate(startDate, endDate),
    status: pickRandom(['PAID', 'OUTSTANDING']),
  })),
});

const getMockNotifications = (numItems, startDate, endDate) => {
  const mockNotifications = [
    {
      title: 'Payment Received',
      subTitle:
        'Cult Wines Investment has successfully received a payment from you. Your available balance has now been updated to reflect this payment.',
    },
    {
      title: 'Fees Added',
      subTitle:
        'Cult Wines Investment has posted new fees to your account. Your available balance has now been updated to reflect these fees. If you wish to top your account up, please go to the accounts page to do so.',
    },
    {
      title: 'Wine Sold',
      subTitle:
        'Cult Wines Investment has successfully sold wine on your behalf. Your available balance has now been updated to reflect the incoming payment. Please note, it may take up to 14 working days before the funds have been cleared.',
    },
    {
      title: 'New Offer Available',
      subTitle: 'Cult Wines Investment has a new offer available for you. Please go your invest page to learn more.',
    },
    {
      title: 'Unsettled Deal',
      subTitle:
        'Cult Wines Investment is awaiting payment for deal: [add the deal reference from VinTrade]. Please navigate to the accounts page to add funds to your account to complete payment for the deal.',
    },
    {
      title: 'Sold Wine Payment Received',
      subTitle:
        'Cult Wines Investment has successfully completed the sale of wine for you. Your available balance has now been updated to reflect this payment.',
    },
  ];
  return getRange(numItems).map((x, i) => {
    const notification = pickRandom(mockNotifications);
    return {
      id: `${i}`,
      subject: notification.title,
      dateTime: randomDate(startDate, endDate),
      body: notification.subTitle,
      isRead: pickRandom([true, false]),
    };
  });
};

const mockResolver = {
  Query: {
    userSettings: getUserSettings,
    miscellaneous: getMiscellaneous,
    managementFees: () => getMockManagementFees(10, '2022-05-01', '2022-12-31'),
    notifications: () => getMockNotifications(10, '2022-12-01', moment().format('YYYY-MM-DD')),
  },
};

export default mockResolver;
