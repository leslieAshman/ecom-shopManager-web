/* eslint-disable @typescript-eslint/naming-convention */
import moment from 'moment';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildDisplayText, capitalizeFirstLetter, roundNumber, toInternalId } from '../../../utils';
import { Product } from '../../../types/productType';
import { buildTableRow } from '../../../views/Portfolio/helpers';
import Button from '../../Button';
import Table, { CellTypeEnum, TableColumnType } from '../../Table';
import LiveExPerformanceChart from './LiveExPerformanceChart';
import cutlWinesLoversImage from '../../../assets/images/cult_wines_lovers_image.png';
import {
  ArrangeDeliveryRequest,
  BuySellHoldingModel,
  DisplayTextKeys,
  PricingType,
  ProductEventType,
  ViewStateType,
} from '../types';
import SellHoldingTemplate from './SellHoldingTemplate';
import InvestMoreTemplate from './InvestMoreTemplate';
import ArrangeDeliveryTemplate, { blankAddessModel } from './ArrangeDelivery';
import CheckBox from '../../CheckBox';
import { SortAndFilterLayoutContext } from '../../Layout/SortAndFilterLayout';
import { AppContext } from '../../../context/ContextProvider';
import { useLazyExecuteQuery } from '../../../views/hooks/useLazyExecuteQuery';
import { GET_PRODUCT_DETAILS } from '../../../views/Portfolio/components/Details/graphql/getProductDetails';

interface SellOrInvestProductTemplateProps {
  product: Product;
  timestamp?: number;
  onCTA?: <T>(event: ProductEventType, data: T) => void;
  isDetailsFetched?: boolean;
}

enum StockStatusEnum {
  IN_TRANSIT = 'intransit',
}
const notApplicable = 'n/a';

enum InfoColors {
  NONE = 'transparent',
  MARKET = '#1D4854',
  P_AND_L = '#FF906D',
  COST = '#55A2A7',
  FEES = '#B1DED8',
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum DATA_VALUATIONS_TABLE_HEADINGS {
  DATE = 'date',
  CASE = 'case',
  REF_NUM = 'reference_number',
  ROTATION_NUM = 'rotation_number',
  STATUS = 'status',
  LOCATION = 'location',
}

const cellClassName = 'text-xs text-black whitespace-nowrap flex-1 divide-gray-100';
const defaultModel = {
  price: 0,
  units: 0,
  reason: '',
  pricingType: PricingType.MARKET,
};
interface MarketInfoGraphProps {
  includeFees: boolean;
  data: {
    marketValue: number;
    pNl: number;
    fees: number;
    pNlIncludeFees: number;
  };
}

const MarketInfoGraph: FC<MarketInfoGraphProps> = ({ includeFees, data }) => {
  const plValue = Math.ceil(((includeFees ? data.pNlIncludeFees : data.pNl) / data.marketValue) * 100);
  const fees = Math.ceil((data.fees / data.marketValue) * 100);
  const feesWidth = `${fees}%`;
  const plWidth = `${plValue}%`;
  const costWidth = `${100 - ((includeFees ? fees : 0) + plValue)}%`;
  if (!data.marketValue) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full h-[16px]" style={{ background: InfoColors.MARKET }}></div>
      <div className="w-full flex">
        <div className={` h-[16px] `} style={{ background: InfoColors.P_AND_L, width: plWidth }}></div>
        {includeFees && <div className={`h-[16px] `} style={{ background: InfoColors.FEES, width: feesWidth }}></div>}
        <div className={` h-[16px] `} style={{ background: InfoColors.COST, width: costWidth }}></div>
      </div>
    </div>
  );
};

const SellOrInvestProductTemplate: FC<SellOrInvestProductTemplateProps> = ({
  product,
  timestamp,
  onCTA,
  isDetailsFetched = false,
}) => {
  const { t } = useTranslation();
  const {
    formatter: currencyFormatter,
    state: {
      settings: { currency },
    },
  } = useContext(AppContext);

  const formatter = useMemo(
    () => ({ format: (value: number) => currencyFormatter.format(value, true) }),
    [currencyFormatter],
  );
  const [currentTimestamp, setCurrentTimestamp] = useState<number | undefined>(timestamp);
  const [productDetails, setProductDetails] = useState(product);
  const { executor: fetchProductDetails } = useLazyExecuteQuery(GET_PRODUCT_DETAILS);
  const [includeFees, setIncludeFees] = useState(false);

  const slideoutContext = useContext(SortAndFilterLayoutContext);
  const colHeaderClassname = 'text-center text-sm bg-vine text-white flex-1';
  const columns: TableColumnType[] = [
    {
      dataRef: 'rotationNumber',
      className: colHeaderClassname,
      text: capitalizeFirstLetter(
        t(`product:dataValuations.tableHeadings.${DATA_VALUATIONS_TABLE_HEADINGS.ROTATION_NUM}`),
      ),
      cellType: CellTypeEnum.TH,
      cellClassName,
    },
    {
      dataRef: 'location',
      className: colHeaderClassname,
      text: capitalizeFirstLetter(t(`product:dataValuations.tableHeadings.${DATA_VALUATIONS_TABLE_HEADINGS.LOCATION}`)),
      cellType: CellTypeEnum.TH,
      cellClassName: `${cellClassName} text-center`,
    },
    {
      dataRef: 'status',
      className: colHeaderClassname,
      text: capitalizeFirstLetter(t(`product:dataValuations.tableHeadings.${DATA_VALUATIONS_TABLE_HEADINGS.STATUS}`)),
      cellType: CellTypeEnum.TH,
      cellClassName: `${cellClassName} text-center`,
      cellContentTemplate: (cell) => {
        return (
          <div className=" flex justify-center">
            <div className="flex w-fit  justify-center items-center px-3 rounded-full text-xs bg-[#FEF4EE] h-[20px]">
              <div className="w-[4px] h-[4px] rounded-full bg-[#F09555] mr-2"></div>
              {cell.text && toInternalId(cell.text) === toInternalId(StockStatusEnum.IN_TRANSIT)
                ? notApplicable
                : cell.text}
            </div>
          </div>
        );
      },
    },
  ];

  // const getProductDetails = async () => {
  //   const { data, error } = await fetchProductDetails({ variables: { id: product.id } });
  //   if (error instanceof Error) {
  //     logError((error as Error).message);
  //   }
  //   return (data as any)?.portalHoldingDetails as Product;
  // };

  const rows = useMemo(() => {
    const allRows = (
      productDetails?.holdingStocks || [
        {
          rotationNumber: productDetails.rotationNumber,
          status: productDetails.status,
          location: productDetails.location,
        },
      ]
    ).map((valuation) => buildTableRow({ ...valuation }, columns));
    return [...allRows];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetails]);

  const [buySellModel, setBuySellModel] = useState<BuySellHoldingModel>({ ...defaultModel });

  const [arrangeDeliveryModel, setArrangeDeliveryModel] = useState<ArrangeDeliveryRequest>({
    holdingId: product.id,
    qty: 0,
    ...blankAddessModel,
  });

  const [viewState, setViewState] = useState(ViewStateType.DEFAULT);
  const {
    wineName,
    totalValue: price,
    unit: unitSize,
    qty,
    changedPct,
    profitAndLoss: valuePnL,
    valuePerUnit: unitPrice,
    qtyForSale,
    costPerUnit,
    dealDate: expiry,
    vintage,
  } = product;
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'product:wineDetails', t), [t]);
  const pAndL = `${valuePnL > 0 ? '+' : ''}${formatter.format(valuePnL || 0)} (${
    changedPct > 0 ? '+' : ''
  }${roundNumber(changedPct)}%)`;

  const marketInfos = useMemo(() => {
    const perUnitText = displayText[DisplayTextKeys.PER_UNIT].toLowerCase();
    let bottom = [
      {
        title: displayText[DisplayTextKeys.TOTAL_PURCHASE_PRICE],
        value: productDetails?.totalCost || 0,
        unitPrice: productDetails?.costPerUnit || 0,
        unitPriceSuffix: perUnitText,
        color: InfoColors.COST,
      },
    ];
    if (includeFees) {
      bottom = [
        ...bottom,
        {
          title: displayText[DisplayTextKeys.TOTAL_UPFRONT_FEES],
          value: productDetails?.totalMgmtFee || 0,
          unitPrice: productDetails?.mgmtFeePerUnit || 0,
          unitPriceSuffix: perUnitText,
          color: InfoColors.FEES,
        },
        {
          title: displayText[DisplayTextKeys.TOTAL_COST],
          value: productDetails?.totalCostWithMgmtFee || 0,
          unitPrice: productDetails?.costWithMgmtFeePerUnit || 0,
          unitPriceSuffix: perUnitText,
          color: InfoColors.NONE,
        },
      ];
    }

    return {
      top: [
        {
          title: displayText[DisplayTextKeys.MARKET_PRICE],
          value: productDetails?.totalValue || 0,
          unitPrice: productDetails?.valuePerUnit || 0,
          unitPriceSuffix: perUnitText,
          color: InfoColors.MARKET,
        },
        {
          title: (includeFees
            ? displayText[DisplayTextKeys.PROFIT_LOSS_INC_FEES]
            : displayText[DisplayTextKeys.PROFIT_LOSS]
          ).trim(),
          value: includeFees ? productDetails?.profitAndLoss || 0 : productDetails?.netPosition || 0,
          unitPrice: includeFees ? productDetails?.profitAndLossPerUnit || 0 : productDetails?.netPositionPerUnit || 0,
          unitPriceSuffix: perUnitText,
          color: InfoColors.P_AND_L,
        },
      ],
      bottom,
      graphInfo: {
        marketValue: productDetails?.totalCost,
        pNlIncludeFees: productDetails?.profitAndLoss || 0,
        pNl: productDetails?.netPosition || 0,
        fees: productDetails?.totalMgmtFee,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeFees, productDetails]);

  useEffect(() => {
    if (timestamp !== currentTimestamp) {
      setCurrentTimestamp(timestamp);
      setViewState(ViewStateType.DEFAULT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp]);

  const onBack = () => {
    slideoutContext?.updateSlideoutConfig({ showBackButton: false });
    setBuySellModel({ ...defaultModel });
    if (onCTA) onCTA(ProductEventType.SET_TITLE, t`portfolio:wineDetails.title`);
    setViewState(ViewStateType.DEFAULT);
  };

  useEffect(() => {
    if (viewState !== ViewStateType.DEFAULT) slideoutContext?.updateSlideoutConfig({ showBackButton: true, onBack });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewState]);

  useEffect(() => {
    if (!isDetailsFetched) {
      fetchProductDetails({ id: product.id }).then(({ data }) => {
        setProductDetails({ ...(data as { portalHoldingDetails: Product })?.portalHoldingDetails });
      });
    } else if (productDetails.id !== product.id) {
      setProductDetails({ ...product });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, currency]);

  return (
    <>
      <div className="flex flex-col bg-white  divide-y divide-gray-200 ">
        <div className="flex justify-between p-3 pb-5">
          <span className="text-20 mr-5">{`${vintage} ${wineName}`}</span>
        </div>
        {viewState !== ViewStateType.ARRANGE_DELIVERY && (
          <div className="flex flex-col">
            <div className="flex justify-center flex-col items-center p-5 pb-0">
              <span className="text-sm">{displayText[DisplayTextKeys.TOTAL_VALUE]}</span>
              <div className="flex">
                <div className="text-20 mr-2">{formatter.format(price)}</div>
                <span className={`${valuePnL > 0 ? 'text-trendup' : 'text-trenddown'} text-14`}>{pAndL}</span>
              </div>
            </div>
            <div className="my-5 flex justify-center">
              <div className="flex flex-col items-center flex-1 ">
                <div className="flex flex-col items-center border-r pb-3 border-r-gray-200 w-full">
                  <span className="text-xs"> {displayText[DisplayTextKeys.UINTS_OWNED]}</span>
                  <span className="text-14">{`${qty}x (${unitSize})`}</span>
                </div>
                {viewState === ViewStateType.DEFAULT && qtyForSale > 0 && (
                  <div className="bg-accent_orange w-full h-10 border-r pr-3 border-gray-200 flex justify-end items-center ">
                    <div className="text-14 mr-1">
                      {`${qtyForSale}x ${t('product:wineDetails.forSale').toLowerCase()}`}
                    </div>
                  </div>
                )}
                {viewState === ViewStateType.DEFAULT && (
                  <div className="px-3">
                    <Button
                      onClick={() => {
                        if (onCTA)
                          onCTA(ProductEventType.SET_TITLE, displayText[DisplayTextKeys.SELL_HOLDINGS_TITLE_TEXT]);
                        setViewState(ViewStateType.SELL_HOLDINGS);
                      }}
                      className="btn mt-5  rounded-full text-black outline "
                    >
                      {displayText[DisplayTextKeys.SELL_HOLDINGS_BUTTON_TEXT]}
                    </Button>
                  </div>
                )}
              </div>
              <div></div>
              <div className="flex flex-col items-center flex-1 w-full">
                <div className="flex flex-col items-center border-l pb-3 border-l-gray-200 w-full">
                  <span className="text-xs">{displayText[DisplayTextKeys.VALUE_PER_UNIT]}</span>
                  <span className="text-14">{formatter.format(unitPrice)}</span>
                </div>
                {viewState === ViewStateType.DEFAULT && qtyForSale > 0 && (
                  <div className="bg-accent_orange w-full h-10 border-l pl-3 border-gray-200 flex items-center ">
                    <div className="text-14 ">{`${formatter.format(costPerUnit)}/${t(
                      'product:wineDetails.unit',
                    ).toLowerCase()}`}</div>
                  </div>
                )}
                {viewState === ViewStateType.DEFAULT && (
                  <div className="px-3">
                    <Button
                      onClick={() => {
                        if (onCTA)
                          onCTA(ProductEventType.SET_TITLE, displayText[DisplayTextKeys.INVEST_MORE_TITLE_TEXT]);
                        setViewState(ViewStateType.INVEST_MORE);
                      }}
                      className="btn bg-orange mt-5  rounded-full text-black "
                    >
                      {displayText[DisplayTextKeys.INVEST_MORE_BUTTON_TEXT]}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {viewState === ViewStateType.DEFAULT && (
          <>
            <div className="py-5 px-3 flex flex-col gap-[10px]">
              <span className="text-14 font-medium py-1">{displayText[DisplayTextKeys.DATA_AND_VALUATION]}</span>
              <div>
                <div className="text-sm py-3">
                  {`${t('product:wineDetails.valuations.dealDate')} ${moment(expiry).format('DD MMM YYYY')}`}
                </div>
                <Table columns={columns} rows={rows} className="border border-gray-100" />
              </div>

              <div className="flex flex-col">
                <div className=" flex w-full h-auto overflow-hidden  items-center py-5 gap-[8px]">
                  {marketInfos.top.map((item, index) => {
                    const unitdetails = `${formatter.format(item.unitPrice)} ${item.unitPriceSuffix}`;
                    return (
                      <div key={`${item.title}-${index}`} className="flex ">
                        <div
                          className={`w-[4px] h-[56px] self-stretch mr-[8px]`}
                          style={{ background: item.color }}
                        ></div>
                        <div className="flex flex-col ">
                          <span className="text-xs whitespace-nowrap">{item.title}</span>
                          <span className="text-14 ">{formatter.format(item.value)}</span>
                          <span className="text-sm whitespace-nowrap">{unitdetails}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <MarketInfoGraph includeFees={includeFees} data={marketInfos.graphInfo} />
                <div className=" flex w-full h-auto overflow-hidden  items-center py-5 gap-[8px]">
                  {marketInfos.bottom.map((item, index) => {
                    const unitdetails = `${formatter.format(item.unitPrice)} ${item.unitPriceSuffix}`;
                    return (
                      <div key={`${item.title}-${index}`} className="flex ">
                        <div
                          className={`w-[4px] h-[56px] self-stretch mr-[8px]`}
                          style={{ background: item.color }}
                        ></div>
                        <div className="flex flex-col ">
                          <span className="text-xs whitespace-nowrap">{item.title}</span>
                          <span className="text-14 ">{formatter.format(item.value)}</span>
                          <span className="text-sm whitespace-nowrap">{unitdetails}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="py-3 flex-1">
                <CheckBox
                  isChecked={includeFees}
                  id={DisplayTextKeys.INCLUDE_FEES}
                  className=" flex-1 w-full"
                  onChange={(id, value) => setIncludeFees(value)}
                >
                  <span className="ml-3 text-black text-14">{displayText[DisplayTextKeys.INCLUDE_FEES]}</span>
                </CheckBox>
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="px-5 py-5 text-14 font-medium">{displayText[DisplayTextKeys.LIVE_EX_CHART_TITLE]}</div>
              <div>
                <LiveExPerformanceChart chartData={productDetails?.historicMarketPrices || []} />
                <div className="p-5 text-14">{displayText[DisplayTextKeys.LIVE_EX_PERFORMANCE_CHART_DESCRIPTION]}</div>
              </div>
            </div>
            <div className="w-full p-3 overflow-hidden relative pb-5  border-none">
              <div className="w-full bg-gray-100  text-left rounded-md p-5 gap-2 ">
                <img
                  src={cutlWinesLoversImage}
                  className="absolute left-[172px] bg-transparent  w-[175px] object-cover"
                  alt="wine lovers"
                />
                <div className="text-base font-medium ">{displayText[DisplayTextKeys.ARRANGE_DELIVERY_TITLE]}</div>
                <div className="text-sm w-[233px]">{displayText[DisplayTextKeys.ARRANGE_DELIVERY_SUBTITLE]}</div>
                <Button
                  className={`btn text-14 font-normal bg-orange rounded-full mt-3  text-black`}
                  onClick={() => {
                    if (onCTA) onCTA(ProductEventType.SET_TITLE, displayText[DisplayTextKeys.ARRANGE_DELIVERY_TITLE]);
                    setViewState(ViewStateType.ARRANGE_DELIVERY);
                  }}
                  props={{
                    name: DisplayTextKeys.ARRANGE_DELIVERY_BUTTON_TEXT,
                  }}
                >
                  {displayText[DisplayTextKeys.ARRANGE_DELIVERY_BUTTON_TEXT]}
                </Button>
              </div>
            </div>
          </>
        )}

        {viewState === ViewStateType.INVEST_MORE && (
          <InvestMoreTemplate
            formatter={formatter}
            onCTA={onCTA}
            productId={product.id}
            marketPrice={product.valuePerUnit}
            model={buySellModel}
            qtyOwned={product.qty || 0}
            setModel={(modelIn) => setBuySellModel(modelIn)}
          />
        )}

        {viewState === ViewStateType.SELL_HOLDINGS && (
          <SellHoldingTemplate
            formatter={formatter}
            onCTA={onCTA}
            productId={product.id}
            marketPrice={product.valuePerUnit}
            model={buySellModel}
            qtyOwned={product.qty || 0}
            setModel={(modelIn) => setBuySellModel(modelIn)}
          />
        )}

        {viewState === ViewStateType.ARRANGE_DELIVERY && (
          <ArrangeDeliveryTemplate
            qtyOwned={product.qty || 0}
            onCTA={onCTA}
            model={arrangeDeliveryModel}
            setModel={(modelIn) => setArrangeDeliveryModel(modelIn)}
          />
        )}
      </div>
    </>
  );
};

export default SellOrInvestProductTemplate;
