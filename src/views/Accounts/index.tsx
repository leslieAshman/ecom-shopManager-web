import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SlideOutPanel from '../../components/SlideOutPanel';
import { NavigationPath } from '../../types/DomainTypes';
import { buildDisplayText } from '../../utils';
import SharedLayout from '../shared/SharedLayout';
import AccSideMenu from './components/AccSideMenu';
import ContactUs from './components/ContactUs';
import HelpCenter from './components/HelpCenter';
import Overview from './components/Overview';
import RecurringPayments from './components/RecurringPayments';
import Profile from './components/Profile';
import Settings from './components/Settings';
import TopupSlideout, { TopupSlideoutRefType } from './components/TopupSlideout';
import {
  AccountViewType,
  OpenSlideoutFnType,
  SlideOutPanelViews,
  SubjectOptionKeys,
  TopupSlideoutViewState,
} from './types';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/ContextProvider';
import { AppEventTypes } from '../../types/AppType';

enum DisplayTextKeys {
  TOPUP_SLIDEOUT_TITLE = 'account:slideout.topup.title',
  TOPUP_TEXT = 'account:text.topup',
}

const defaultSlideouState = {
  showBackButton: false,
  open: false,
  view: SlideOutPanelViews.TOP_UP,
  title: '',
  timestamp: Date.now(),
  initialModel: undefined,
  initialView: undefined,
  customTemplate: () => null,
};

const Accounts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = t('common:accounts');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pathname, state: locationParam } = useLocation();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account', t), [t]);
  const [slideOutPanelConfig, setSlideOutPanelConfig] = useState({ ...defaultSlideouState });
  const { dispatch } = useContext(AppContext);
  const topUpSlideoutRef = useRef();
  const [selectedView, setSelectedView] = useState(locationParam?.accuntVievType || AccountViewType.OVERVIEW);

  const openSlideout: OpenSlideoutFnType = (view, config) => {
    setSlideOutPanelConfig({
      showBackButton: false,
      open: true,
      title: displayText[DisplayTextKeys.TOPUP_SLIDEOUT_TITLE],
      view,
      timestamp: Date.now(),
      initialModel: undefined,
      initialView: undefined,
      customTemplate: () => null,
      ...(config || {}),
    });
  };

  const onChangeRequest = (subject: SubjectOptionKeys) => {
    //tedView(AccountViewType.CONTACT_US);
    navigate(NavigationPath.ACCOUNTS, {
      state: { accountViewType: AccountViewType.CONTACT_US, subject },
    });
  };

  const onBack = () => {
    (topUpSlideoutRef?.current as unknown as TopupSlideoutRefType).onBack();
  };

  const onClose = (nextView?: AccountViewType) => {
    if (nextView) setSelectedView(nextView as AccountViewType);
    setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false });
  };

  const onTopupSlideoutStateChange = (state: TopupSlideoutViewState) => {
    setSlideOutPanelConfig({ ...slideOutPanelConfig, showBackButton: state.showBackButton });
  };

  useEffect(() => {
    if (locationParam && locationParam.accountViewType && selectedView !== locationParam.accountViewType) {
      setSelectedView(locationParam.accountViewType);
    }

    if (pathname === `${NavigationPath.ACCOUNTS}${NavigationPath.PAYMENT_CONFIRMATION}`) {
      dispatch({
        type: AppEventTypes.UPDATE_STATE,
        payload: {
          isConfirmPayment: true,
        },
      });
      openSlideout(SlideOutPanelViews.TOP_UP);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locationParam]);

  return (
    <SharedLayout
      view={selectedView === AccountViewType.CONTACT_US ? NavigationPath.CONTACT_US : NavigationPath.ACCOUNTS}
      title={title}
      onBack={onBack}
    >
      <>
        <div className="flex  w-full h-full">
          <AccSideMenu setSelectedView={setSelectedView} selectedView={selectedView} />
          <div className="flex  w-full h-full overflow-y-auto">
            {selectedView === AccountViewType.OVERVIEW && <Overview openSlideout={openSlideout} onClose={onClose} />}
            {selectedView === AccountViewType.PROFILE && (
              <Profile onChangeRequest={() => onChangeRequest(SubjectOptionKeys.UPDATE_DETAILS)} />
            )}
            {selectedView === AccountViewType.SETTINGS && <Settings openSlideout={openSlideout} onClose={onClose} />}
            {selectedView === AccountViewType.HELP_CENTER && (
              <HelpCenter onChangeRequest={() => onChangeRequest(SubjectOptionKeys.GENERAL)} />
            )}
            {selectedView === AccountViewType.CONTACT_US && <ContactUs />}
            {selectedView === AccountViewType.PAYMENTS && <RecurringPayments openSlideout={openSlideout} />}
          </div>
        </div>
        <SlideOutPanel
          showBackButton={slideOutPanelConfig.showBackButton}
          headClassName="bg-gray-100 text-black"
          title={slideOutPanelConfig.title}
          isOpen={slideOutPanelConfig.open}
          onBack={onBack}
          onClose={() => setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false })}
        >
          {slideOutPanelConfig.open && slideOutPanelConfig.view === SlideOutPanelViews.TOP_UP && (
            <TopupSlideout
              initialModel={slideOutPanelConfig.initialModel}
              initialView={slideOutPanelConfig.initialView}
              ref={topUpSlideoutRef}
              onClose={onClose}
              onStateChange={onTopupSlideoutStateChange}
            />
          )}
          {slideOutPanelConfig.open &&
            slideOutPanelConfig.view === SlideOutPanelViews.CUSTOM &&
            slideOutPanelConfig.customTemplate &&
            slideOutPanelConfig.customTemplate()}
        </SlideOutPanel>
      </>
    </SharedLayout>
  );
};

export default Accounts;
