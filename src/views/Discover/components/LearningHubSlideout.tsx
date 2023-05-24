import { FC, useMemo, useState } from 'react';
import { ProductImage } from '../../../components/ProductTemplates';
import { ViewStateType } from '../../../components/ProductTemplates/types';
import { MessageProductTemplateProp } from '../../../components/ProductTemplates/components/MessageTemplate';
import FeedbackTemplate from '../../shared/FeedbackTemplate';

import moment from 'moment';
import { LearningHubType } from '../type';
import { GET_LEARNING_HUB_DETAILS } from '../graphql/getLearningHubDetails';
import { useDocumentById } from '../hooks/useGetDocumentById';
import Loading from '../../../components/Loading/loading';
import { logError } from '../../../components/LogError';

export enum DisplayTextKeys {
  RESERVE_NOW = 'reserve-now',
}
const dateFormat = 'DD MMM YYYY';

enum ContentTypeEnum {
  VIDEO = 'video',
  ARTICLE = 'article',
}
type MessageType = Pick<MessageProductTemplateProp, 'title' | 'subTitle' | 'onClick' | 'buttonText'>;
interface LearningHubSlideoutProps {
  product: LearningHubType;
  timestamp?: number;
  onClose?: () => void;
}

const LearningHubSlideout: FC<LearningHubSlideoutProps> = ({ product, onClose }) => {
  const [feedbackState, setFeedbackState] = useState(ViewStateType.DEFAULT);
  const [feedbackTemplateConfig] = useState<MessageType>({
    title: () => null,
    subTitle: () => null,
    onClick: () => null,
  });
  const { result, loading } = useDocumentById({ learningId: product.id }, GET_LEARNING_HUB_DETAILS);
  const { title, publishDate: date, mainImage, contentType } = product;
  const { contentLong, videoUrl } = (result || {}) as LearningHubType;
  const details = useMemo(
    () => <div className="text-14 p-3" dangerouslySetInnerHTML={{ __html: contentLong || '' }} />,
    [contentLong],
  );

  logError(contentType);

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-gray-100 to-gray-500  pb-5 px-3 w-screen relative overflow-x-hidden sm:w-[390px]">
      <div className="w-full h-full rounded-md  overflow-y-auto flex flex-col">
        <FeedbackTemplate
          onClose={onClose}
          templateConfig={feedbackTemplateConfig}
          viewState={feedbackState}
          onCTA={(vState) => setFeedbackState(vState)}
        >
          <>
            <ProductImage imageUrl={mainImage || ''}>
              {contentType.toLowerCase() === ContentTypeEnum.VIDEO && (
                <iframe width={'100%'} height={264} title={title} src={videoUrl} />
              )}
            </ProductImage>

            <div className="flex flex-col bg-white flex-1 h-full w-full overflow-x-hidden overflow-y-auto">
              <div className="flex-col p-3 pb-5 flex gap-2">
                {date && <span className="text-sm">{moment(date).format(dateFormat)}</span>}
                <span className="text-20 mr-5">{`${title}`}</span>
              </div>
              <div className="flex-1">
                {loading && (
                  <div className="h-full w-full">
                    <Loading />
                  </div>
                )}
                {!loading && (
                  <div className="flex-1 overflow-x-hidden overflow-y-hidden text-14 h-full w-full prismic-content">
                    {details}
                  </div>
                )}
              </div>
            </div>
          </>
        </FeedbackTemplate>
      </div>
    </div>
  );
};

export default LearningHubSlideout;
