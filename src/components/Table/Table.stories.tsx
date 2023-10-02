import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Table, { TableCell, TableColumnType } from '.';
import { buildTableRow } from 'views/Portfolio/helpers';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Table> = {
  title: 'Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const cellClassName = 'text-sm text-black py-3 cursor-pointer whitespace-nowrap pl-2';
const columns: TableColumnType[] = [
  {
    dataRef: 'name',
    className: 'pr-5 ',
    text: 'Text 123',
    cellClassName,
    cellContentTemplate: (cell: TableCell) => <span>{`${cell.text}`}</span>,
  },
  {
    dataRef: 'date',
    className: 'pr-5 ',
    text: '2023-12-12',
    cellClassName,
    cellContentTemplate: (cell: TableCell) => <span>{`${cell.text}`}</span>,
  },
];

const rows = [
  {
    id: 1,
    name: 'AAAAA',
    date: '2023-12-12',
  },

  { id: 2, name: 'BBBBB', date: '2023-12-13' },
  {
    id: 3,
    name: 'CCCCC',
    date: '2023-12-14',
  },
].map((report) => {
  return {
    ...buildTableRow({ ...report }, columns || [], `${report.id}`, 'divide-x-0'),
  };
});

// eslint-disable-next-line react-hooks/exhaustive-deps

export const Default: Story = {
  args: {
    columns,
    rows,
    className: 'border border-gray-100 w-1/2',
    // onTableEvent={(row) => (disableTableClick ? null : onTableRowClick(row as TableRow, context!.openSlideout))}
  },
};
