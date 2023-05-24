import { FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components';
import Accordion from '../../../components/Accordion';
import { ProductImage } from '../../../components/ProductTemplates';
import { getRegions } from '../../../helpers';

import { buildDisplayText, toInternalId } from '../../../utils';
import InvestMoreTemplate from '../../../components/ProductTemplates/components/InvestMoreTemplate';
import {
  BuySellHoldingModel,
  PricingType,
  ProductEventType,
  ViewStateType,
} from '../../../components/ProductTemplates/types';
import { MessageProductTemplateProp } from '../../../components/ProductTemplates/components/MessageTemplate';
import FeedbackTemplate from '../../shared/FeedbackTemplate';

import Loading from '../../../components/Loading/loading';
import { useInvestDetails } from '../hooks/useInvestDetails';
import { InvestOffer, TabTypes } from '../types';
import { INVEST_NOW_MUTATION } from '../graphql/investMutation';
import { useExecuteMutation } from '../../hooks/useExecuteMutation';
import { AppContext } from '../../../context/ContextProvider';
import useExecutor from '../../hooks/useExecutor';
import Spacer from '../../../components/Spacer';

export enum DisplayTextKeys {
  INVEST_NOW_TEXT = 'invest_now_text',
  NOTIFY_WHEN_AVAILABLE = 'notify_when_available_text',
  TITLE = 'title',
  PRICE = 'price',
}

interface InvestNowRequest {
  dealRef?: string;
  qty: number;
  purchasePrice?: number;
  requestPrice?: number;
}

type MessageType = Pick<MessageProductTemplateProp, 'title' | 'subTitle' | 'onClick' | 'buttonText'>;
interface InvestSlideoutProps {
  offer: InvestOffer;
  timestamp?: number;
  onClose?: () => void;

  requestTab: TabTypes;
}

const InvestSlideout: FC<InvestSlideoutProps> = ({ onClose, requestTab, offer }) => {
  const { t } = useTranslation();
  const regions = useMemo(() => getRegions(t), [t]);
  const { formatter } = useContext(AppContext);
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'invest:slideout', t), [t]);
  const [viewState, setViewState] = useState(ViewStateType.DEFAULT);
  const [feedbackState, setFeedbackState] = useState(ViewStateType.DEFAULT);

  const { sections, loading } = useInvestDetails(offer.id);

  const [buySellModel, setBuySellModel] = useState<BuySellHoldingModel>({
    price: 0,
    units: 0,
    reason: '',
    pricingType: PricingType.MARKET,
  });

  const [feedbackTemplateConfig, setFeedbackTemplateConfig] = useState<MessageType>({
    title: () => null,
    subTitle: () => null,
    onClick: () => null,
  });

  const onExecutorStatusChange = (vState: ViewStateType, feedbackConfig?: MessageType) => {
    if (feedbackConfig) setFeedbackTemplateConfig(feedbackConfig);
    setFeedbackState(vState);
  };

  const executor = useExecutor({
    mutation: useExecuteMutation(INVEST_NOW_MUTATION),
    viewRef: ViewStateType.INVEST_MORE,
    onStatusChange: onExecutorStatusChange,
    onClose: onClose || (() => null),
  });

  const accordionItems = useMemo(() => {
    return [
      ...(sections || []).map((section, i) => ({
        id: `${i}`,
        title: `${section.title}`,
        titleContainerClassName: 'text-base p-5',
        content: () => <div className="text-14 p-3" dangerouslySetInnerHTML={{ __html: section.content }} />,
      })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const processInvestMore = <T,>(eventType: ProductEventType, eventData: T) => {
    const { qty } = eventData as InvestNowRequest;
    const { name: title, subtitle: subTitle, priceGbp: price, expiryDate } = offer;

    const investRequest = {
      portalInvestNowRequest: {
        offerTitle: title,
        offerSubTitle: subTitle,
        offerPrice: price,
        numberOfUnits: qty,
        totalPrice: Number(price) * qty,
        offerExpiryDate: expiryDate,
      },
    };

    executor(investRequest);
  };

  const onRequest = () => {
    if (requestTab === TabTypes.CURRENT) {
      setViewState(ViewStateType.INVEST_MORE);
    } else
      processInvestMore(ProductEventType.EXECUTE_BUY_PRODUCT_REQUEST, {
        qty: 0,
      });
  };
  const { name: title, subtitle: subTitle, priceGbp: price, expiryDate, region, unitSize, mainImage } = offer;
  const selectedRegion = regions.find((x) => x.id === toInternalId(region.toLowerCase()));
  const regionColor = selectedRegion?.color || '#FFFFFF';
  const textColor = `text-${selectedRegion?.textColor || 'black'}`;
  const buttonText =
    displayText[
      requestTab === TabTypes.CURRENT ? DisplayTextKeys.INVEST_NOW_TEXT : DisplayTextKeys.NOTIFY_WHEN_AVAILABLE
    ];

  const buttonStyle = requestTab === TabTypes.CURRENT ? 'bg-orange' : 'border border-gray-900';

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-vine to-gray-500  pb-5 px-3 w-screen relative overflow-x-hidden sm:w-[390px]">
      <div className="w-full h-full rounded-md  overflow-y-auto flex flex-col">
        <FeedbackTemplate
          onClose={onClose}
          templateConfig={feedbackTemplateConfig}
          viewState={feedbackState}
          onCTA={(vState) => setFeedbackState(vState)}
        >
          <>
            <ProductImage
              imageUrl={mainImage}
              imageContainer="!h-[250px] !w-[50%]"
              bgColor={regionColor}
              region={region}
              textColor={textColor}
            />
            <div className="flex flex-col bg-white flex-1 h-100">
              <div className="flex-col p-3 pb-5">
                <span className="text-20 mr-5">{`${title}`}</span>
                {subTitle && <p className="text-14">{subTitle}</p>}
              </div>
              <div className="flex justify-between items-center px-3 pb-1">
                <div className="text-right text-20">{formatter.format(Number(price), true)}</div>
              </div>
              <div className="flex justify-between items-center text-14 px-3 ">
                <span>{`${expiryDate}`}</span>
                <span>{`${unitSize}`}</span>
              </div>

              {viewState === ViewStateType.INVEST_MORE && (
                <InvestMoreTemplate
                  formatter={{ format: (val: number) => formatter.format(val, true) }}
                  canCustomPrice={false}
                  onCTA={processInvestMore}
                  marketPrice={Number(price)}
                  model={buySellModel}
                  qtyOwned={0}
                  setModel={(modelIn) => setBuySellModel(modelIn)}
                />
              )}
              {viewState === ViewStateType.DEFAULT && (
                <>
                  <Button
                    className={`  mx-3 my-5 text-14 font-normal rounded-full btn flex justify-center items-center py-3  text-black ${buttonStyle}`.trim()}
                    onClick={onRequest}
                    props={{
                      name: requestTab,
                    }}
                  >
                    {buttonText}
                  </Button>
                  {loading ? (
                    <div className="h-full w-full flex-1 justify-center p-5">
                      <Loading />
                    </div>
                  ) : (
                    <>
                      <Accordion className=" divide-y divide-gray-300" items={accordionItems} />
                      <Spacer h="100px" />
                    </>
                  )}
                </>
              )}
            </div>
          </>
        </FeedbackTemplate>
      </div>
    </div>
  );
};

export default InvestSlideout;
