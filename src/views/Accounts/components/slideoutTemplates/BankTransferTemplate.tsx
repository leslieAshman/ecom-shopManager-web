import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleSolidInfoIcon, CopyIcon } from '../../../../assets/icons';
import { buildDisplayText } from '../../../../utils';
import { useExecuteQuery } from '../../../hooks/useExecuteQuery';
import { GET_BANK_TRANSFER_REF } from '../../graphql/getBankTransferRef';

const bankTransferInfo = [
  { type: 'company', title: 'Company', value: 'Cult Wines Ltd' },
  { type: 'sortCode', title: 'Sort Code', value: '40-03-21' },
  { type: 'accNumber', title: 'Account No.', value: '02276453' },
  { type: 'iban', title: 'IBAN', value: 'GB49HBUK40032102276453' },
  { type: 'bic', title: 'BIC/Swift', value: 'HBUKGB4B' },
  { type: 'bankName', title: 'Bank', value: 'HSBC' },
  { type: 'bankAddress', title: 'Branch address', value: '21 Kings Mall, King Street, London, W6 0QF' },
  { type: 'reference', title: 'Reference', value: '' },
];

enum DisplayTextKeys {
  TITLE_TEXT = 'title',
  SUBTITLE_TEXT = 'subTitle',
  COPIED_TEXT = 'copied_text',
  DISCLAIMER = 'disclaimer',
}

const BankTransferTemplate = () => {
  const { t } = useTranslation();
  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'account:slideout.topup.bankTransfer', t),
    [t],
  );
  const [copied, setCopied] = useState<string[]>([]);
  const { results: paymentRef } = useExecuteQuery('paymentReferenceNumber', GET_BANK_TRANSFER_REF);
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
    <div className="flex flex-col p-5">
      <p className="text-base font-medium">{displayText[DisplayTextKeys.TITLE_TEXT]}</p>
      <p className="text-14 font-normal mt-5">{displayText[DisplayTextKeys.SUBTITLE_TEXT]}</p>

      <div className=" flex flex-col gap-5 py-5">
        {bankTransferInfo.map((info) => {
          const { type, title, value } = info;
          const isCopied = copied.includes(type);
          const val = type === 'reference' ? paymentRef : value;
          return (
            <div key={`${type}`} className="flex w-full items-center">
              <div className="w-[120px] text-sm">{`${title} :`}</div>
              <div className="flex-1 text-sm">{`${val}`}</div>
              {isCopied && <div className="text-xs"> {displayText[DisplayTextKeys.COPIED_TEXT]} </div>}
              {!isCopied && (
                <div
                  className="px-1 cursor-pointer"
                  onClick={() => {
                    setCopied([...copied, type]);
                    navigator.clipboard.writeText(value);
                  }}
                >
                  <CopyIcon />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center w-full mt-8 mb-4">
          <div className="mr-5 ">{t`account:slideout.topup.recurring_payment_info_title`}</div>
          <CircleSolidInfoIcon />
        </div>
        <p className="text-sm w-full">{displayText[DisplayTextKeys.DISCLAIMER]}</p>
      </div>
    </div>
  );
};

export default BankTransferTemplate;
