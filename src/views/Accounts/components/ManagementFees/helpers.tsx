import moment from 'moment';
import { TFunction } from 'react-i18next';
import { TableCell, TableColumnType } from '../../../../components/Table';
import { SortDirection } from '../../../../types/DomainTypes';
import { formatter } from '../../../../utils';
import { MGMT_DATA_REFS } from './types';

const cellClassName = 'text-center text-sm text-black cursor-pointer whitespace-nowrap py-5';
export const initialiseManageFeesTab = (translation: TFunction) => {
  const MGMT_TABLE_TEXTS = {
    [MGMT_DATA_REFS.NAME]: translation(`account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.NAME}`),
    [MGMT_DATA_REFS.VALUATION_DATE]: translation(
      `account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.VALUATION_DATE}`,
    ),
    [MGMT_DATA_REFS.FEE_TYPE]: translation(
      `account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.FEE_TYPE}`,
    ),
    [MGMT_DATA_REFS.PORTFOLIO_VALUE]: translation(
      `account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.PORTFOLIO_VALUE}`,
    ),
    [MGMT_DATA_REFS.OFFSET_VALUE]: translation(
      `account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.OFFSET_VALUE}`,
    ),
    [MGMT_DATA_REFS.FFE_AMOUNT]: translation(
      `account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.FFE_AMOUNT}`,
    ),
    [MGMT_DATA_REFS.APPLIED]: translation(
      `account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.APPLIED}`,
    ),
    [MGMT_DATA_REFS.INVOICE_NUMBER]: translation(
      `account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.INVOICE_NUMBER}`,
    ),
    [MGMT_DATA_REFS.INVOICE_DATE]: translation(
      `account:overviewReport.managementFees.table.headers.${MGMT_DATA_REFS.INVOICE_DATE}`,
    ),
    [MGMT_DATA_REFS.ID]: 'id',
    [MGMT_DATA_REFS.STATUS]: 'status',
  };

  const columns: TableColumnType[] = [
    {
      dataRef: MGMT_DATA_REFS.NAME,
      className: 'pr-5 ',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.NAME],
      cellClassName: 'text-sm text-black cursor-pointer whitespace-nowrap pl-2',
      cellContentTemplate: (cell: TableCell) => <span>{`${cell.text}`}</span>,
    },
    {
      dataRef: MGMT_DATA_REFS.VALUATION_DATE,
      className: 'text-center ',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.VALUATION_DATE],
      cellClassName,
      exportFn: (arg: string | number) => moment(arg).format('YYYY-MM-DD'),
      cellContentTemplate: (cell: TableCell) => <span>{moment(cell.text).format('YYYY-MM-DD')}</span>,
    },
    {
      dataRef: MGMT_DATA_REFS.FEE_TYPE,
      className: 'text-center pl-5',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.FEE_TYPE],
      cellClassName,
      cellContentTemplate: (cell: TableCell) => <span>{`${cell.text}`}</span>,
    },
    {
      dataRef: MGMT_DATA_REFS.PORTFOLIO_VALUE,
      className: 'text-center pl-5',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.PORTFOLIO_VALUE],
      cellClassName,
      exportFn: (arg: string | number) => `${arg && Number(arg) > 0 ? formatter.format(Number(arg)) : arg}`,
      cellContentTemplate: (cell: TableCell) => (
        <span>{`${cell.text && Number(cell.text) > 0 ? formatter.format(Number(cell.text)) : ''}`}</span>
      ),
    },
    {
      dataRef: MGMT_DATA_REFS.OFFSET_VALUE,
      className: 'text-center pl-5',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.OFFSET_VALUE],
      cellClassName,
      exportFn: (arg: string | number) => `${arg && Number(arg) > 0 ? formatter.format(Number(arg)) : arg}`,
      cellContentTemplate: (cell: TableCell) => (
        <span>{`${cell.text && Number(cell.text) > 0 ? formatter.format(Number(cell.text)) : ''}`}</span>
      ),
    },
    {
      dataRef: MGMT_DATA_REFS.FFE_AMOUNT,
      className: 'text-center pl-5',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.FFE_AMOUNT],
      cellClassName,
      exportFn: (arg: string | number) => `${arg && Number(arg) > 0 ? formatter.format(Number(arg)) : arg}`,
      cellContentTemplate: (cell: TableCell) => <span>{`${formatter.format(Number(cell.text))}`}</span>,
    },
    {
      dataRef: MGMT_DATA_REFS.APPLIED,
      className: 'text-center pl-5',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.APPLIED],
      cellClassName,
      exportFn: (arg: string | number) => `${arg && Number(arg) > 0 ? Number(arg).toFixed(2) : ''}%`,
      cellContentTemplate: (cell: TableCell) => (
        <span>{`${cell.text && Number(cell.text) > 0 ? Number(cell.text).toFixed(2) : ''}%`}</span>
      ),
    },
    {
      dataRef: MGMT_DATA_REFS.INVOICE_NUMBER,
      className: 'text-center pl-5',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.INVOICE_NUMBER],
      cellClassName,
      cellContentTemplate: (cell: TableCell) => <span>{`${cell.text}`}</span>,
    },
    {
      dataRef: MGMT_DATA_REFS.INVOICE_DATE,
      className: 'text-center px-5',
      text: MGMT_TABLE_TEXTS[MGMT_DATA_REFS.INVOICE_DATE],
      cellClassName,
      exportFn: (arg: string | number) => `${moment(arg).format('YYYY-MM-DD')}`,
      cellContentTemplate: (cell: TableCell) => <span>{moment(cell.text).format('YYYY-MM-DD')}</span>,
    },
    {
      dataRef: MGMT_DATA_REFS.ID,
      text: MGMT_DATA_REFS.ID,
      isVisible: false,
    },
    {
      dataRef: MGMT_DATA_REFS.STATUS,
      text: MGMT_DATA_REFS.STATUS,
      isVisible: false,
    },
  ];

  const sortByOptions = columns
    .filter((x) => x.isVisible === true || x.isVisible === undefined)
    .map((col) => ({
      id: col.dataRef,
      value: col.dataRef,
      text: col.text,
      content: <span>{col.text}</span>,
    }));

  const defaultSortBy = () => {
    const { id, text } = sortByOptions.find((x) => x.id === MGMT_DATA_REFS.VALUATION_DATE)!;
    return {
      id,
      text,
      direction: SortDirection.DESCENDING,
    };
  };

  return {
    MGMT_TABLE_TEXTS,
    columns,
    sortByOptions,
    defaultSortBy: defaultSortBy(),
  };
};
