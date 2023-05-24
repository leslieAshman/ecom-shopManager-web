import { useContext, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '../../components';
import SlideOutPanel from '../../components/SlideOutPanel';
import { TabType } from '../../components/Tabs';

import { NavigationPath } from '../../types/DomainTypes';

import { buildDisplayText, capitalizeFirstLetter } from '../../utils';
import SharedLayout from '../shared/SharedLayout';
import CurrentInvest from './components/CurrentInvest';
import PreviousInvest from './components/PreviousInvest';
import InvestSlideout from './components/InvestSlideout';
import { InvestOffer, TabTypes } from './types';
import { AppContext } from '../../context/ContextProvider';
import { AppEventTypes } from '../../types/AppType';

enum DisplayTextKeys {
  TITLE = 'invest:slideOutTitle',
  BUTTON_TEXT = 'buttonText',
}

enum SlideOutPanelViews {
  PRODUCT_DETAILS = 'product',
}

const Invest = () => {
  const { t } = useTranslation();
  const pageTitle = 'invest';
  const title = t(`common:${pageTitle}`);
  const {
    state: {
      app: { refresh },
    },
    dispatch,
  } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState(TabTypes.CURRENT);
  const [refetchTimestamp, setRefetchTimestamp] = useState(new Date().getTime());
  const [slideOutPanelConfig, setSlideOutPanelConfig] = useState({
    open: false,
    offer: {} as InvestOffer,
    title: '',
    view: SlideOutPanelViews.PRODUCT_DETAILS,
    timestamp: Date.now(),
  });

  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'invest:wineDetails', t), [t]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onItemSelect = (offer: InvestOffer) => {
    setSlideOutPanelConfig({
      offer: { ...offer },
      open: true,
      title: displayText[DisplayTextKeys.TITLE],
      view: SlideOutPanelViews.PRODUCT_DETAILS,
      timestamp: Date.now(),
    });
  };

  const onTabSelect = (tab: TabType) => {
    // setTabStates({ ...tabStates, [currentTabState.current?.id as TabTypes]: currentTabState.current });
    setSelectedTab(tab.value as TabTypes);
  };

  const tabs = useMemo(
    () => [
      {
        id: TabTypes.CURRENT,
        value: TabTypes.CURRENT,
        title: <span className="text-14">{capitalizeFirstLetter(t(`invest:${TabTypes.CURRENT}`))}</span>,
        content: () => <CurrentInvest onItemSelect={onItemSelect} refetchTimestamp={refetchTimestamp} />,
      },
      {
        id: TabTypes.PREVIOUS,
        value: TabTypes.PREVIOUS,
        title: <span className="text-14">{capitalizeFirstLetter(t(`invest:${TabTypes.PREVIOUS}`))}</span>,
        content: () => <PreviousInvest onItemSelect={onItemSelect} refetchTimestamp={refetchTimestamp} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, refetchTimestamp],
  );

  useLayoutEffect(() => {
    if (refresh && (refresh as string[]).length > 0 && (refresh as string[]).includes(NavigationPath.INVEST)) {
      setRefetchTimestamp(new Date().getTime());
      dispatch({
        type: AppEventTypes.UPDATE_STATE,
        payload: { refresh: (refresh as string[]).filter((x) => x !== NavigationPath.INVEST) },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <SharedLayout
      view={NavigationPath.INVEST}
      containerClassName="!overflow-hidden"
      title={title}
      onBack={() => null}
      showBackButton={false}
    >
      <>
        <Tabs items={tabs} onItemSelect={onTabSelect} value={selectedTab}></Tabs>
        <SlideOutPanel
          headClassName="bg-vine"
          title={slideOutPanelConfig.title}
          isBackgroundDark={true}
          isOpen={slideOutPanelConfig.open}
          onClose={() => setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false })}
        >
          {slideOutPanelConfig.open && (
            <InvestSlideout
              requestTab={selectedTab}
              offer={slideOutPanelConfig.offer}
              timestamp={slideOutPanelConfig.timestamp}
              onClose={() => setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false })}
            />
          )}
        </SlideOutPanel>
      </>
    </SharedLayout>
  );
};

export default Invest;
