import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../types/productType';
import { capitalizeFirstLetter, toInternalId } from '../../../utils';
import ProductImage from './ProductImage';
import SellOrInvestProductTemplate from './SellOrInvestProductTemplate';
import { WarningIcon } from '../../../assets/icons';
import { getImageUrl, getRegions } from '../../../helpers';
import { ExecuteResponse, ProductEventType, ViewStateType } from '../types';
import { ApolloError } from '@apollo/client';
import { logError } from '../../LogError';
import FeedbackTemplate from '../../../views/shared/FeedbackTemplate';
import { MessageProductTemplateProp } from './MessageTemplate';
import useExecutor from '../../../views/hooks/useExecutor';
import { useExecuteMutation } from '../../../views/hooks/useExecuteMutation';
import { SELL_PRODUCT_MUTATION } from '../graphql/sellMutation';
import { BUY_PRODUCT_MUTATION } from '../graphql/buyMutation';
import { ARRANGE_DELIVERY_MUTATION } from '../graphql/arrangeDeliveryMutation';

type MessageType = Pick<MessageProductTemplateProp, 'title' | 'subTitle' | 'onClick' | 'buttonText'>;

interface ProcessorType {
  id: ViewStateType;
  error: ApolloError | undefined;
  loading: boolean;
  data: unknown;
  isFlush: boolean;
  onSuccess: (response: unknown) => void;
  onError: (error: ApolloError | undefined) => void;
  onFlush?: () => void;
}
interface ProductSlideoutProps {
  product?: Product;
  timestamp?: number;
  onClose?: () => void;
  setTitle?: (title: string) => void;
  isDetailsFetched?: boolean;
}

const ProductSlideout: FC<ProductSlideoutProps> = ({ product, timestamp, onClose, setTitle, isDetailsFetched }) => {
  const { t } = useTranslation();
  const regions = useMemo(() => getRegions(t), [t]);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | undefined>(timestamp);
  const regionColor = useMemo(() => {
    return regions.find(
      (x) =>
        x.id ===
        toInternalId(
          (product && !!product.cultWinesAllocationRegion
            ? product
            : { cultWinesAllocationRegion: '' }
          ).cultWinesAllocationRegion!.toLowerCase(),
        ),
    )?.color;
  }, [product, regions]);
  const [feedbackState, setFeedbackState] = useState(ViewStateType.DEFAULT);
  const [feedbackTemplateConfig, setFeedbackTemplateConfig] = useState<MessageType>({
    title: () => null,
    subTitle: () => null,
    onClick: () => null,
  });

  const investMoreExecutor = useExecutor({
    mutation: useExecuteMutation(BUY_PRODUCT_MUTATION),
    viewRef: ViewStateType.INVEST_MORE,
    onStatusChange: (vState: ViewStateType, feedbackConfig?: MessageType) => {
      if (feedbackConfig) setFeedbackTemplateConfig(feedbackConfig);
      setFeedbackState(vState);
    },
    onClose: onClose || (() => null),
  });

  const sellHoldingExecutor = useExecutor({
    mutation: useExecuteMutation(SELL_PRODUCT_MUTATION),
    viewRef: ViewStateType.SELL_HOLDINGS,
    onStatusChange: (vState: ViewStateType, feedbackConfig?: MessageType) => {
      if (feedbackConfig) setFeedbackTemplateConfig(feedbackConfig);
      setFeedbackState(vState);
    },
    onClose: onClose || (() => null),
  });

  const arrangeDeliveryExecutor = useExecutor({
    mutation: useExecuteMutation(ARRANGE_DELIVERY_MUTATION),
    viewRef: ViewStateType.SELL_HOLDINGS,
    onStatusChange: (vState: ViewStateType, feedbackConfig?: MessageType) => {
      if (feedbackConfig) setFeedbackTemplateConfig(feedbackConfig);
      setFeedbackState(vState);
    },
    onClose: onClose || (() => null),
    processorConfig: {
      onSuccess: (response: unknown, request: unknown) => {
        const result = (response as ExecuteResponse).portalDeliverWine;
        if (result?.isSuccess) setFeedbackState(ViewStateType.THANK_YOU);
        else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          handleFailRequest(result, 'arrangeDelivery', request);
        }
      },
    },
  });

  const [processor, setProcessor] = useState<ProcessorType | null>(null);

  const handleFailRequest = (
    result: { isSuccess: boolean; errorMessage: string } | undefined,
    translationKey: string,
    request?: unknown,
  ) => {
    if (!result) {
      setFeedbackState(ViewStateType.SOMETHING_WENT_WRONG);
    } else {
      setFeedbackTemplateConfig({
        title: () => (
          <div className="flex items-center gap-3">
            <WarningIcon />
            <span className="text-20 font-medium ">{t('common:somethingWentWrong.title')}</span>
          </div>
        ),
        subTitle: () => (
          <div className="text-14 mt-2">{t`product:wineDetails.${translationKey}.fail_send-request`}</div>
        ),
        onClick: () => {
          if (onClose) onClose();
        },
        buttonText: capitalizeFirstLetter(t`common:done`),
      });
      setFeedbackState(ViewStateType.MESSAGE);
    }

    logError({ result, request });
  };

  const onCTA = <T,>(eventType: ProductEventType, eventData?: T) => {
    switch (eventType) {
      case ProductEventType.EXECUTE_SELL_PRODUCT_REQUEST:
        sellHoldingExecutor({ portalSellWineRequest: { ...eventData } });
        break;

      case ProductEventType.EXECUTE_BUY_PRODUCT_REQUEST:
        investMoreExecutor({ portalBuyWineRequest: { ...eventData } });
        break;

      case ProductEventType.ARRANGE_DELIVERY:
        arrangeDeliveryExecutor({ portalDeliverWineRequest: { ...eventData } });
        break;
      case ProductEventType.SET_TITLE:
        if (setTitle) setTitle(eventData as string);

        break;

      default:
        setFeedbackState(ViewStateType.DEFAULT);
        break;
    }
  };

  useEffect(() => {
    if (timestamp !== currentTimestamp) {
      setCurrentTimestamp(timestamp);
      setFeedbackState(ViewStateType.DEFAULT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp]);

  const flushProcessor = () => {
    const { loading, error, onError, onSuccess, data } = processor!;
    if (loading) return;
    if (error) onError(error);
    else {
      onSuccess(data);
    }
    setProcessor(null);
  };

  useEffect(() => {
    if (processor?.isFlush) {
      flushProcessor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processor]);

  useEffect(() => {
    if (timestamp !== currentTimestamp) {
      setCurrentTimestamp(timestamp);
      setFeedbackState(ViewStateType.DEFAULT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp]);

  if (!product) return null;
  const productImage = getImageUrl(product.imageFileName || '', { height: 200 });
  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-vine to-gray-500  pb-5 px-3 w-screen relative overflow-x-hidden sm:w-[390px] ">
      <FeedbackTemplate
        onClose={onClose}
        templateConfig={feedbackTemplateConfig}
        viewState={feedbackState}
        onCTA={() => onCTA(ProductEventType.DEFAULT)}
      >
        <div className="w-full h-full rounded-md  overflow-y-auto">
          <>
            <ProductImage
              imageUrl={productImage}
              bgColor={regionColor}
              region={product.region}
              imageContainer="!h-[230px]"
            />
            <SellOrInvestProductTemplate
              isDetailsFetched={isDetailsFetched}
              product={product}
              timestamp={timestamp}
              onCTA={onCTA}
            />
          </>
        </div>
      </FeedbackTemplate>
    </div>
  );
};

export default ProductSlideout;
