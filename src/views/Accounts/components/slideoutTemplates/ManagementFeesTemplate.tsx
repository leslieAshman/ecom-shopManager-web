import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components';
import { buildDisplayText, formatter } from '../../../../utils';
import { OpenSlideoutFnType, SlideOutPanelViews } from '../../types';
import { ManagementFeeType } from '../ManagementFees';
import { MgmtFeesExplainedType, MGMT_DATA_REFS } from '../ManagementFees/types';

enum DisplayTextKeys {
  FEES_AMOUNT_TEXT = 'table.headers.feeAmount',
  NIL_TEXT = 'nil_text',
  FEES_DETAILS_TITLE = 'slideout.fees_details_title',
  FEES_EXPLAINED_TITLE = 'slideout.fees_explained_title',
  TOPUP_TEXT = 'account:text.topup',

  ANNUAL_FEES = 'explained.annualMgmtFees',
  LATE_PAID_STOCK_FEES = 'explained.latePaidStockFees',
  CANCELLED_DEAL_REBATE = 'explained.cancelledDealRebate',
}

interface ManagementFeesTemplateProps {
  openSlideout: OpenSlideoutFnType;
  item: ManagementFeeType;
  explained?: MgmtFeesExplainedType;
}

const ManagementFeesTemplate: FC<ManagementFeesTemplateProps> = ({ item, openSlideout, explained }) => {
  const { t } = useTranslation();
  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'account:overviewReport.managementFees', t),
    [t],
  );
  const [copied, setCopied] = useState<string[]>([]);

  const feesInfo = useMemo(() => {
    return [
      MGMT_DATA_REFS.NAME,
      MGMT_DATA_REFS.VALUATION_DATE,
      MGMT_DATA_REFS.FEE_TYPE,
      MGMT_DATA_REFS.PORTFOLIO_VALUE,
      MGMT_DATA_REFS.OFFSET_VALUE,
      MGMT_DATA_REFS.APPLIED,
    ].map((field) => ({
      type: field,
      title: t(`account:overviewReport.managementFees.table.headers.${field}`),
      value: !item[field] ? displayText[DisplayTextKeys.NIL_TEXT] : item[field],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  useEffect(() => {
    if (copied.length > 0) {
      setTimeout(() => {
        setCopied((x) => {
          const newCopied = [...x];
          newCopied.shift();
          return newCopied;
        });
      }, 1000);
    }
  }, [copied]);

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b  from-gray-100 to-gray-500  pb-5 px-3 w-screen relative overflow-x-hidden sm:w-[390px]">
      <div className="w-full h-full rounded-md  divide-y divide-gray-300 bg-white overflow-y-auto flex flex-col p-5">
        <div className="flex flex-col">
          <div className="flex flex-col w-full items-center p-5 pt-0">
            <span className="text-14 font-normal mt-5">{displayText[DisplayTextKeys.FEES_AMOUNT_TEXT]}</span>
            <span className="text-md font-normal">{formatter.format(item.feeAmount)}</span>
          </div>

          <div className=" flex flex-col gap-5 py-5">
            {[MGMT_DATA_REFS.INVOICE_NUMBER, MGMT_DATA_REFS.INVOICE_DATE].map((info) => {
              return (
                <div key={info} className="flex w-full items-center">
                  <div className="flex-1 text-sm">{`${t(
                    `account:overviewReport.managementFees.table.headers.${info}`,
                  )} :`}</div>
                  <div className="text-sm text-right">{`${item[info]}`}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className=" flex flex-col gap-5 py-5">
          <p className="font-medium text-14">{displayText[DisplayTextKeys.FEES_DETAILS_TITLE]}</p>
          {feesInfo.map((info) => {
            const { type, title, value } = info;

            return (
              <div key={`${type}`} className="flex w-full items-center">
                <div className="flex-1 text-sm">{`${title} :`}</div>
                <div className="text-sm text-right">{`${value}`}</div>
              </div>
            );
          })}
        </div>

        <div className=" flex flex-col gap-5 py-5 flex-1">
          <p className="font-medium text-14">{displayText[DisplayTextKeys.FEES_EXPLAINED_TITLE]}</p>
          <p className="text-sm">{displayText[`explained.${explained!}`]}</p>
        </div>

        <Button
          className={`btn-accent`}
          onClick={() => openSlideout(SlideOutPanelViews.TOP_UP)}
          props={{
            name: 'viewPortfolio',
          }}
        >
          {displayText[DisplayTextKeys.TOPUP_TEXT]}
        </Button>
      </div>
    </div>
  );
};

export default ManagementFeesTemplate;
