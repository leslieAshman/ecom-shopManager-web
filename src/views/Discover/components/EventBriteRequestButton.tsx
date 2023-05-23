import React, { FC } from 'react';
import { Button } from '../../../components';
import useEventbrite from './useEventBrite';

interface EventBriteRequestButtonProps {
  text: string;
  eventId: string;
}
const EventBriteRequestButton: FC<EventBriteRequestButtonProps> = ({ text, eventId }) => {
  const handleOrderCompleted = React.useCallback(() => {
    console.log('Order was completed successfully');
  }, []);
  const modalButtonCheckout = useEventbrite({
    eventId,
    modal: true,
    onOrderComplete: handleOrderCompleted,
    iFrameHeight: 500, // optional
    iFrameAutoAdapt: 100, // optional - The widget's viewport percentage (between 75-100)
    promoCode: '',
  });

  // const iframeCheckout = useEventbrite({
  //   eventId: 'YOUR-EB-EVENT-ID',
  //   modal: false,
  //   onOrderComplete: handleOrderCompleted,
  //   iFrameHeight: 500, // optional
  //   iFrameAutoAdapt: 100, // optional - The widget's viewport percentage (between 75-100)
  //   promoCode: '',
  // });

  return (
    // <div id="my-app">
    //   {/* guard for null - resolves when Eventbrite loads */}
    //   {iframeCheckout && <div id={iframeCheckout.id} />}
    // </div>

    <div>
      {/* guard for null - resolves when Eventbrite loads */}
      {modalButtonCheckout && (
        <Button
          className={`btn text-14  font-normal bg-orange rounded-full mt-3  text-black`}
          props={{
            name: text,
            id: modalButtonCheckout.id,
          }}
        >
          {text}
        </Button>
      )}
    </div>
  );
};

export default EventBriteRequestButton;
