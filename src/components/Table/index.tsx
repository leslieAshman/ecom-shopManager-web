import { FC, ReactNode, useCallback, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { classNames } from '../../utils';
import useFadeInOnScroll from '../../views/hooks/useFadeInOnScroll';
import useInfiniteScroll from '../../views/hooks/useInfiniteScroll';
import Loading from '../Loading/loading';
import { ObjectType } from '../../types/commonTypes';

export enum CellTypeEnum {
  TH = 'th',
  TD = 'tr',
}

export type TableColumnType = TableCell & {
  cellClassName?: string;
  cellType?: CellTypeEnum;
  contentTemplate?: (col: TableColumnType, translation: TFunction) => JSX.Element;
};
export interface TableCell {
  text: string;
  dataRef: string;
  className?: string;
  type?: CellTypeEnum;
  isVisible?: boolean;
  isExportable?: boolean;
  isSortable?: boolean;
  exportFn?: (arg: string | number, x?: ObjectType) => string;
  cellContentTemplate?: (cell: TableCell, translation: TFunction, rowData?: TableRow['rowData']) => ReactNode;
}

export interface TableRow {
  id?: string;
  onClick?: (row: TableRow) => void;
  className: string;
  cells: TableCell[];
  rowData?: Record<string, unknown>;
}
interface TableProp {
  columns: TableColumnType[];
  onTableEvent?: (event: TableRow | TableColumnType) => void;
  rows: TableRow[];
  className?: string;
  theadClassName?: string;
  containerClassNames?: string;
}

const Table: FC<TableProp> = ({ columns, rows, className, theadClassName, containerClassNames, onTableEvent }) => {
  const [selectedRow, setSelectedRow] = useState('');
  const { t } = useTranslation();
  const { isLoading, results, lastItemRef } = useInfiniteScroll(rows);

  const processIntersectionObserverEntry = useCallback((entry: IntersectionObserverEntry) => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
    entry.target.classList.toggle('collapse', !entry.isIntersecting);
  }, []);

  const { isItemVisible, fadeOnScrollClassName } = useFadeInOnScroll({ isLoading, processIntersectionObserverEntry });

  return (
    <div className={classNames('overflow-x-auto overflow-y-hidden relative', containerClassNames || '')}>
      <table className={`table-auto w-full text-sm text-left text-gray-500 ${className || ''}`.trim()}>
        <thead className={`text-sm text-black bg-gray-50  ${theadClassName || ''}`.trim()}>
          <tr className="border-b border-gray-200">
            {columns.map((col, index) => {
              const isVisible = col.isVisible !== undefined ? col.isVisible : true;
              if (!isVisible) return null;
              return (
                <th
                  key={`col-${index}`}
                  scope="col"
                  className={`${col.contentTemplate ? '' : 'py-3  whitespace-nowrap '}  ${col.className || ''}`.trim()}
                >
                  {col.contentTemplate ? col.contentTemplate(col, t) : `${col.text}`}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {results.map((row, rIndex) => {
            const rowId = row.id || `${rIndex}`;
            let lastElemRefOption = { ref: isItemVisible };
            if (results.length === rIndex + 1) {
              lastElemRefOption = { ref: lastItemRef };
            }
            return (
              <tr
                {...lastElemRefOption}
                key={`row-${rIndex}`}
                onClick={() => {
                  if (row.onClick || onTableEvent) {
                    setSelectedRow(rowId);
                    if (row.onClick) row.onClick({ ...row });
                    else onTableEvent!({ ...row } as TableRow);
                  }
                }}
                className={`${fadeOnScrollClassName} bg-white divide-x  border-b ${
                  row.onClick ? 'cursor-pointer hover:bg-gray-50' : ''
                }  ${rowId === selectedRow ? 'bg-gray-200' : ''} ${row.className || ''}`.trim()}
              >
                {row.cells.map((cell, cellIndex) => {
                  const isVisible = cell.isVisible !== undefined ? cell.isVisible : true;
                  if (!isVisible) return null;
                  return cell.type === CellTypeEnum.TH ? (
                    <th
                      key={`cell-${cellIndex}`}
                      scope="row"
                      className={`${cell.cellContentTemplate ? '' : 'py-4 px-6 whitespace-nowrap '} ${
                        cell.className || ''
                      }`.trim()}
                    >
                      {cell.cellContentTemplate ? cell.cellContentTemplate(cell, t, row.rowData) : `${cell.text}`}
                    </th>
                  ) : (
                    <td
                      key={`cell-${cellIndex}`}
                      className={`${cell.cellContentTemplate ? '' : 'py-4 px-6 whitespace-nowrap  '} ${
                        cell.className || ''
                      }`.trim()}
                    >
                      {cell.cellContentTemplate ? cell.cellContentTemplate(cell, t, row.rowData) : cell.text}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {isLoading && <Loading containerClassName="p-3 bg-white" />}
    </div>
  );
};

export default Table;
