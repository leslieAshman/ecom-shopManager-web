import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '../../../components';
import { buildDisplayText } from '../../../utils';
import { AccountViewType, SlideOutPanelViews } from '../types';
import ManagementFees from './ManagementFees';
enum TabTypes {
  MGMT_FEES = 'mgmt_fees',
}

enum DisplayTextKeys {
  MGMT_FEES_TAB_TITLE = 'managementFees.tab_title',
}

interface AccountReportProps {
  openSlideout: (view: SlideOutPanelViews) => void;
  onClose: (nextView?: AccountViewType) => void;
}
const AccountReport: FC<AccountReportProps> = ({ openSlideout, onClose }) => {
  const { t } = useTranslation();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:overviewReport', t), [t]);
  const [selectedTab] = useState(TabTypes.MGMT_FEES);
  const tabs = useMemo(
    () => [
      {
        id: TabTypes.MGMT_FEES,
        value: TabTypes.MGMT_FEES,
        title: <span className="text-14">{displayText[DisplayTextKeys.MGMT_FEES_TAB_TITLE]}</span>,
        content: () => (
          <div>
            {' '}
            <ManagementFees openSlideout={openSlideout} onClose={onClose} />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayText],
  );

  const onTabSelect = () => null;

  return (
    <div>
      <Tabs className="pb-5" items={tabs} onItemSelect={onTabSelect} value={selectedTab}></Tabs>
    </div>
  );
};

export default AccountReport;
