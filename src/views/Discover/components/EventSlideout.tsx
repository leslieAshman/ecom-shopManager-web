import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductImage } from '../../../components/ProductTemplates';
import { buildDisplayText, currencyFormatter } from '../../../utils';
import { ViewStateType } from '../../../components/ProductTemplates/types';
import { MessageProductTemplateProp } from '../../../components/ProductTemplates/components/MessageTemplate';
import FeedbackTemplate from '../../shared/FeedbackTemplate';
import { DateIcon, LocationIcon, TimeIcon } from '../../../assets/icons';
import moment from 'moment';
import EventBriteRequestButton from './EventBriteRequestButton';
import { EventAndExperienceType } from '../type';
import { useDocumentById } from '../hooks/useGetDocumentById';
import { GET_EVENT_DETAILS } from '../graphql/getEventDetails';
import Loading from '../../../components/Loading/loading';

const dateFormat = 'DD MMM YYYY';

export enum DisplayTextKeys {
  RESERVE_NOW = 'reserve-now',
  PRICE = 'discover:price',
}

type MessageType = Pick<MessageProductTemplateProp, 'title' | 'subTitle' | 'onClick' | 'buttonText'>;
interface EventSlideoutProps {
  event: EventAndExperienceType;
  timestamp?: number;
  onClose?: () => void;
}

const EventSlideout: FC<EventSlideoutProps> = ({ event, onClose }) => {
  const { t } = useTranslation();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'discover:slideout', t), [t]);
  const { result, loading } = useDocumentById({ eventId: event.id }, GET_EVENT_DETAILS);
  const [feedbackState, setFeedbackState] = useState(ViewStateType.DEFAULT);
  const [feedbackTemplateConfig] = useState<MessageType>({
    title: () => null,
    subTitle: () => null,
    onClick: () => null,
  });
  const { title, dateTime, price, mainImage, priceCurrency } = event;
  const momentDate = moment(dateTime);
  const { eventbriteId, content, locationFullAddress: location } = (result || {}) as EventAndExperienceType;
  const details = useMemo(
    () => <div className="text-14 p-3" dangerouslySetInnerHTML={{ __html: content || '' }} />,
    [content],
  );

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b  from-gray-100 to-gray-500  pb-5 px-3 w-screen relative overflow-x-hidden sm:w-[390px]">
      <div className="w-full h-full rounded-md  overflow-y-auto flex flex-col">
        <FeedbackTemplate
          onClose={onClose}
          templateConfig={feedbackTemplateConfig}
          viewState={feedbackState}
          onCTA={(vState) => setFeedbackState(vState)}
        >
          <>
            <ProductImage imageUrl={mainImage || ''} />
            <div className="flex flex-col bg-white flex-1 h-100 divide-y divide-y-gray-100 overflow-x-hidden overflow-y-auto">
              <div className="flex-col p-3 pb-5 gap-5">
                <span className="text-20 mr-5">{`${title}`}</span>
                <div className="flex flex-col mt-3 gap-2">
                  {[
                    { value: location, icon: () => <LocationIcon /> },
                    { value: momentDate.format(dateFormat), icon: () => <DateIcon /> },
                    { value: momentDate.format('hh:mm A'), icon: () => <TimeIcon /> },
                  ].map((x, index) => (
                    <div className="flex items-center text-sm" key={`info-${index}`}>
                      <div className="mr-1">{x.icon()} </div>
                      <div className="flex flex-wrap pr-5 ">{x.value} </div>
                    </div>
                  ))}
                </div>
              </div>
              {loading && (
                <div className="h-full w-full">
                  <Loading />
                </div>
              )}
              {!loading && (
                <>
                  <div className="flex-1 overflow-x-hidden text-14 h-full w-full prismic-content">{details}</div>
                  <div className="flex items-center p-5">
                    <div className="flex-1 flex-col flex">
                      <span className="text-14"> {displayText[DisplayTextKeys.PRICE]}</span>
                      <span className="text-20">{currencyFormatter('en-GB', priceCurrency).format(price)}</span>
                    </div>
                    <EventBriteRequestButton
                      text={displayText[DisplayTextKeys.RESERVE_NOW]}
                      eventId={eventbriteId || ''}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        </FeedbackTemplate>
      </div>
    </div>
  );
};

export default EventSlideout;
