import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

//https://github.com/wizardrylabs/react-eventbrite-popup-checkout/blob/master/src/useEventbrite.js
//https://www.npmjs.com/package/react-eventbrite-popup-checkout

const TAG_ID = `EB_SCRIPT_${uuid()}`;
const SCRIPT_URL = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';

const useEventbrite = ({ eventId, modal, onOrderComplete, iFrameHeight, iFrameAutoAdapt, promoCode }) => {
  const id = `EB_${uuid()}`;
  const [isLoaded, setLoaded] = React.useState(false);
  const onLoad = React.useCallback(() => setLoaded(true), [setLoaded]);
  const onErr = React.useCallback(
    (e) => {
      console.error(`Failed to load Eventbrite script from ${SCRIPT_URL}`);
      console.error(e);

      setLoaded(false);
    },
    [setLoaded],
  );

  React.useEffect(() => {
    if (window?.EBWidgets) {
      setLoaded(true);
      return;
    }

    const existing = document.getElementById(TAG_ID);

    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = TAG_ID;
    script.async = true;
    script.src = SCRIPT_URL;
    script.addEventListener('load', onLoad);
    script.addEventListener('error', onErr);
    script.addEventListener('abort', onErr);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onErr);
      script.removeEventListener('abort', onErr);
      script.remove();
      setLoaded(false);
    };
  }, [setLoaded, onLoad, onErr]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const config = {
      widgetType: 'checkout',
      eventId,
      onOrderComplete,
      modal,
    };

    if (modal) {
      config.modalTriggerElementId = id;
    } else {
      config.iframeContainerId = id;
      config.iframeContainerHeight = iFrameHeight || 425;
      config.iframeAutoAdapt = iFrameAutoAdapt || 100;
    }

    if (promoCode) {
      config.promoCode = promoCode;
    }

    window.EBWidgets.createWidget(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return isLoaded ? { id } : null;
};

export default useEventbrite;
