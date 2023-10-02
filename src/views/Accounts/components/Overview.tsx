import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InfoIcon } from '../../../assets/icons';
import { Button, Dropdown } from '../../../components';
import { DropdownItem } from '../../../components/Dropdown';
import Loading from '../../../components/Loading/loading';
import ToolTip from '../../../components/Tooltip';
import { getPortfolioDropdownOptions, getPortfolioInfo } from '../../../helpers';
import { Alignment, NavigationPath, PortfolioBalanceInfo } from '../../../types/DomainTypes';
import { buildDisplayText, formatter } from '../../../utils';
import { usePortfolioBalances } from '../../Portfolio/components/Summary/hooks/usePortfolioBalances';
import { AccountViewType, SlideOutPanelViews, SubjectOptionKeys } from '../types';
import AccountReport from './AccountReport';
import { PortfolioType } from 'views/Portfolio/types';

enum DisplayTextKeysEnum {
  TOPUP_SLIDEOUT_TITLE = 'account:slideout.topup.title',
  TOPUP_TEXT = 'account:text.topup',
  WITHDRAW_FUNDS_TEXT = 'account:text.withdraw_funds',
  PENDING_BALANCE_TOOLTIP = 'pending_balance_tooltip',
  PENDING_BALANCE_TEXT = 'pending_balance_text',
  ACCOUNT_BALANCE_TEXT = 'account_balance_text',
}

const DisplayTextKeys = {
  ...DisplayTextKeysEnum,
  ...PortfolioBalanceInfo,
};

interface OverviewProps {
  openSlideout: (view: SlideOutPanelViews) => void;
  onClose: (nextView?: AccountViewType) => void;
}

const portfolioBalances = [
  {
    shopId: '1',
  },
] as PortfolioType[];

const Overview: FC<OverviewProps> = ({ openSlideout, onClose }) => {
  const { t } = useTranslation();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:overviewReport', t), [t]);
  const navigate = useNavigate();
  const { portfolioBalances: kkk, loading: loadingBalances } = usePortfolioBalances();

  const portfolioDropdownOptions = useMemo(() => getPortfolioDropdownOptions(portfolioBalances), []);
  const [selectedPortfolioBalance, setSelectedPortfolioBalance] = useState('');
  const onPortfolioChange = (item: DropdownItem) => {
    setSelectedPortfolioBalance(item.value);
  };

  const balanceDetails = useMemo(() => {
    const balanceInfo = portfolioBalances.find((x) => x.shopId === selectedPortfolioBalance);

    return {
      pendingBalance: 0,
      accountBalance: 0,
    };
  }, [selectedPortfolioBalance]);

  const selectedPortfolioInfo = useMemo(() => {
    const portfolios = getPortfolioInfo(portfolioBalances, displayText, selectedPortfolioBalance);

    return {
      ...portfolios,
      // info: portfolios.info.filter((x) =>
      //   [
      //     displayText[PortfolioBalanceInfo.PORTFOLIO_VALUATION_TEXT],
      //     displayText[PortfolioBalanceInfo.NET_PROCEEDS_FROM_SALES_TEXT],
      //     displayText[PortfolioBalanceInfo.NET_CONTRIBUTIONS_TEXT],
      //     displayText[PortfolioBalanceInfo.NET_POSITION_TEXT],
      //   ].includes(x.title),
      // ),
      info: [displayText[PortfolioBalanceInfo.PORTFOLIO_VALUATION_TEXT]],
    };
  }, [selectedPortfolioBalance, displayText]);

  return (
    <div className="flex flex-col flex-1 p-5 w-full h-full">
      <Dropdown
        placeholder={'Select'}
        value={selectedPortfolioBalance}
        valueTemplate={<div>{selectedPortfolioInfo.selectedText}</div>}
        onItemSelect={onPortfolioChange}
        items={portfolioDropdownOptions}
        className="flex-1 py-5"
        itemClassName="w-[300px]"
      />
      <div className="bg-[#F0EBE6]  p-1 sm:p-5 mt-5 rounded-lg mb-10 flex  flex-wrap">
        {loadingBalances && (
          <div className="flex-1 flex justify-center items-center">
            <Loading />
          </div>
        )}
        {!loadingBalances && (
          <div className="flex w-full flex-wrap gap-5">
            {/* <div className="bg-accent_stone min-w-[360px]  w-full flex-1 grid grid-cols-2 gap-2 p-3 rounded-md ">
              {selectedPortfolioInfo.info &&
                selectedPortfolioInfo.info.length > 0 &&
                selectedPortfolioInfo.info.map((pBal, index) => {
                  return (
                    <div key={`portfolio-balance-${index}`} className="w-full overflow-hidden rounded-lg">
                      <div className="flex flex-col  sm:px-2 ">
                        <span className="text-14">{pBal.title}</span>
                        {pBal.body('text-md')}
                      </div>
                    </div>
                  );
                })}
            </div> */}
            <div className="flex items-center justify-center flex-1 ">
              <div className=" w-full p-5 divide-x  divide-x-gray-900 flex flex-nowrap items-center rounded-lg">
                <div className="flex flex-col px-3  pr-10 flex-1 items-end justify-center">
                  <>
                    <span className="text-14">{displayText[DisplayTextKeys.ACCOUNT_BALANCE_TEXT]}</span>
                    <div className="text-md flex-nowrap whitespace-nowrap">
                      {formatter.format(balanceDetails.accountBalance)}
                    </div>
                  </>

                  <Button
                    className={`btn text-14 align-bottom font-normal mt-3 whitespace-nowrap  rounded-full w-fit px-5 border border-black  text-black`}
                    // onClick={() =>
                    //   onClose(AccountViewType.CONTACT_US)}

                    onClick={() => {
                      navigate(NavigationPath.ACCOUNTS, {
                        state: {
                          accountViewType: AccountViewType.CONTACT_US,
                          subject: SubjectOptionKeys.FINANCIAL,
                        },
                      });
                    }}
                    props={{
                      name: 'acc_withdrwal',
                    }}
                  >
                    {displayText[DisplayTextKeys.WITHDRAW_FUNDS_TEXT]}
                  </Button>
                </div>
                <div className="flex flex-col px-3 pl-10 flex-1 items-start justify-center">
                  <div className="flex gap-2 items-center justify-center">
                    <span className="text-14 ">{displayText[DisplayTextKeys.PENDING_BALANCE_TEXT]}</span>
                    <ToolTip
                      align={Alignment.RIGHT}
                      tooltip={
                        <div className="bg-white border border-gray-300 w-[200px] text-sm p-2">
                          {displayText[DisplayTextKeys.PENDING_BALANCE_TOOLTIP]}
                        </div>
                      }
                    >
                      <InfoIcon className="cursor-pointer w-5" />
                    </ToolTip>
                  </div>
                  <div className="text-md flex-nowrap whitespace-nowrap">
                    {formatter.format(balanceDetails.pendingBalance)}
                  </div>
                  <Button
                    className={`btn text-14 align-bottom whitespace-nowrap font-normal bg-orange rounded-full mt-3  w-fit px-5  text-black`}
                    onClick={() => openSlideout(SlideOutPanelViews.TOP_UP)}
                    props={{
                      name: 'acc_topup',
                    }}
                  >
                    {displayText[DisplayTextKeys.TOPUP_TEXT]}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AccountReport openSlideout={openSlideout} onClose={onClose} />
    </div>
  );
};

export default Overview;
