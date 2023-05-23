import moment from 'moment';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadIcon } from '../../../../assets/icons';
import ExportCSV from '../../../../components/ExportToCsv';
import Loading from '../../../../components/Loading/loading';
import { logError } from '../../../../components/LogError';
import Table, { TableRow } from '../../../../components/Table';
import { onExportToXlsx } from '../../../../helpers';
import { SortDirection } from '../../../../types/DomainTypes';
import { buildDisplayText, formatter, sortItems, sumBy, toInternalId } from '../../../../utils';
import { useExecuteQuery } from '../../../hooks/useExecuteQuery';
import { buildTableRow } from '../../../Portfolio/helpers';
import { GET_MGMT_FEES } from '../../graphql/getManagementFees';
import { AccountViewType, OpenSlideoutFnType, SlideOutPanelViews } from '../../types';
import ManagementFeesTemplate from '../slideoutTemplates/ManagementFeesTemplate';
import { initialiseManageFeesTab } from './helpers';
import { MgmtFeesExplainedType } from './types';

const getFeesExplained = (feeType: string) => {
  switch (feeType) {
    case 'annualmgmtfee':
      return MgmtFeesExplainedType.ANNUAL_FEES;

    case 'latepaidstockfee':
      return MgmtFeesExplainedType.LATE_PAID_STOCK_FEES;

    case 'cancelleddealrebate':
      return MgmtFeesExplainedType.CANCELLED_DEAL_REBATE;
    default:
      break;
  }
};

export interface ManagementFeeType {
  id: string;
  accountHolderName: string;
  vintradeAccountHolderId: number;
  clientName: string;
  vintradeClientId: string;
  valuationDate: string;
  feeType: string;
  portfolioValue: number;
  offsetValue: number;
  feeAmount: number;
  appliedPct: number;
  invoiceNumber: string;
  invoiceDate: string;
  status: string;
}

enum MgmtFiltersType {
  ALL = 'all',
  OUTSTANDING = 'outstanding',
  PAID = 'paid',
}

enum DisplayTextKeys {
  TOTAL_MGMT_FEES = 'total_mgmt_fees',
  TOTAL_OUTSTANDING_FEES = 'total_outstanding_fees',
  TOTAL_PAID_FEES = 'total_paid_fees',

  FILTER_ALL_TEXT = 'filter_all_text',
  FILTER_OUTSTANDING_TEXT = 'filter_outstanding_text',
  FILTER_PAID_TEXT = 'filter_paid_text',
  EXPORT_FILE_NAME = 'export_filename',
  SIDEOUT_TITLE = 'sildeout_title',
}

interface ManagementFeesProps {
  openSlideout: OpenSlideoutFnType;
  onClose: (nextView?: AccountViewType) => void;
}
const ManagementFees: FC<ManagementFeesProps> = ({ openSlideout }) => {
  const { t } = useTranslation();
  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'account:overviewReport.managementFees', t),
    [t],
  );
  const [filteredData, setfilteredData] = useState<ManagementFeeType[]>([]);
  const [currentFilter, seCurrentFilter] = useState(MgmtFiltersType.ALL as string);
  const { results: datasource, loading, error } = useExecuteQuery('portalManagementFees', GET_MGMT_FEES);
  const { columns, defaultSortBy } = useMemo(() => initialiseManageFeesTab(t), [t]);

  const headings = useMemo(
    () => {
      if (!datasource) return [];

      const source = datasource as ManagementFeeType[];
      const totalOutstandingFees = sumBy(
        source.filter((x) => x.status.toLowerCase() === MgmtFiltersType.OUTSTANDING),
        'feeAmount',
      );
      const totalPaid = sumBy(
        source.filter((x) => x.status.toLowerCase() === MgmtFiltersType.PAID),
        'feeAmount',
      );
      const totalFees = sumBy(source, 'feeAmount');
      return [
        {
          title: displayText[DisplayTextKeys.TOTAL_MGMT_FEES],
          text: formatter.format(totalFees),
          additionalText: '',
          color: '',
        },
        {
          title: displayText[DisplayTextKeys.TOTAL_OUTSTANDING_FEES],
          text: formatter.format(totalOutstandingFees),
          additionalText: '',
          color: '',
        },
        {
          title: displayText[DisplayTextKeys.TOTAL_PAID_FEES],
          text: formatter.format(totalPaid),
          additionalText: '',
          color: '',
        },
      ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datasource],
  );

  const buildTableRows = (dataSet: ManagementFeeType[]) => {
    return (dataSet || []).map((report) => {
      return {
        ...buildTableRow({ ...report }, columns || [], `${report.id}`, 'divide-x-0'),
      };
    });
  };

  const onTableRowClick = (row: TableRow) => {
    const source = datasource as ManagementFeeType[];
    const item = (source || []).find((x) => `${x.id}` === row.id);
    const feeExplained = toInternalId(item!.feeType);

    if (openSlideout)
      openSlideout(SlideOutPanelViews.CUSTOM, {
        title: displayText[DisplayTextKeys.SIDEOUT_TITLE],
        customTemplate: () => (
          <ManagementFeesTemplate explained={getFeesExplained(feeExplained)} item={item!} openSlideout={openSlideout} />
        ),
      });
  };

  const filters = useMemo(() => {
    return Object.values(MgmtFiltersType).map((x) => {
      return {
        id: x,
        text: t(`account:overviewReport.managementFees.filter_${x}_text` as const),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => {
    if (!datasource) return [];
    const source = datasource as ManagementFeeType[];
    if (!source) return [];
    let filteredDatasource: ManagementFeeType[] = [];
    switch (currentFilter) {
      case MgmtFiltersType.ALL:
        filteredDatasource = [...source];
        break;

      default:
        filteredDatasource = source.filter((x) => x.status.toLowerCase() === currentFilter);

        break;
    }

    const sortedMgmtFeesData = sortItems<ManagementFeeType>(
      filteredDatasource,
      defaultSortBy.direction === SortDirection.ASCENDING,
      defaultSortBy.id as keyof ManagementFeeType,
    );

    setfilteredData(sortedMgmtFeesData);
    return buildTableRows(sortedMgmtFeesData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasource, currentFilter]);

  if (error) {
    logError(error);
  }

  return (
    <div className="flex flex-1 sm:p-5 bg-white w-full h-full flex-col">
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="grid grid-cols-3 rounded-t-md pb-5  gap-3 ">
            {headings.map((heading, index) => {
              return (
                <div className="flex flex-col bg-gray-100 p-3 rounded-md" key={`${heading.title}-${index}`}>
                  <span className="text-sm  mb-[4px]">{heading.title}</span>
                  <span
                    className="text-base flex items-end "
                    style={{ color: heading.color ? heading.color : 'black' }}
                  >
                    {`${heading.text}`}{' '}
                    <span className="text-14 ml-1">{`${
                      heading.additionalText ? `${heading.additionalText}` : ''
                    }`}</span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center">
            <div className="flex flex-wrap flex-1  bg-white rounded-t-md py-5  gap-3 ">
              {filters.map((filter, index) => {
                return (
                  <div
                    onClick={() => seCurrentFilter(filter.id)}
                    className={`flex border border-gray-900 item-center cursor-pointer justify-center flex-col  rounded-full px-3 py-1 ${
                      filter.id === currentFilter ? 'bg-vine text-white' : ''
                    }`.trim()}
                    key={`${filter.id}-${index}`}
                  >
                    <span className="text-sm">{`${filter.text}`}</span>
                  </div>
                );
              })}
            </div>
            <ExportCSV
              csvData={filteredData}
              fileName={`${displayText[DisplayTextKeys.EXPORT_FILE_NAME]}-${moment().format('YYYY-MM-DD HH:mm')}`}
              onPrepareData={(data: ManagementFeeType[]) => onExportToXlsx(data, columns)}
            >
              <div
                className={`pl-8 flex items-center ${
                  filteredData.length > 0 ? 'cursor-pointer opacity-100' : 'pointer-events-none opacity-50'
                }`}
              >
                <DownloadIcon />
              </div>
            </ExportCSV>
          </div>

          <div className="justify-center items-center bg-white rounded-b-md flex-1 h-full min-h-[200px]">
            <Table columns={columns || []} rows={rows || []} onTableEvent={(row) => onTableRowClick(row as TableRow)} />
          </div>
        </>
      )}
    </div>
  );
};

export default ManagementFees;
