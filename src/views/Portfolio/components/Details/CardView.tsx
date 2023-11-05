/* eslint-disable @typescript-eslint/naming-convention */
import moment from 'moment';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LossIcon, ProfitIcon, TagIcon } from '../../../../assets/icons';
import Loading from '../../../../components/Loading/loading';

import { TableCell, TableRow } from '../../../../components/Table';
import { getRegions } from '../../../../helpers';
import { DATA_REFS } from '../../../../types/productType';
import { formatter, sortItems, toInternalId } from '../../../../utils';
import useFadeInOnScroll from '../../../hooks/useFadeInOnScroll';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import MarketDataChart from './MarketDataChart';

interface DetailCardProps<T> {
  tableRows: TableRow[];
  dateFormat: string;
  filteredItems: T[];
  isCompact: boolean;
  onItemClick?: (row: TableRow) => void;
}

interface HistoricMarketPrices {
  date: string;
  marketPrice: number;
}

const extractCardDetails = (cells: TableCell[]) => {
  let result = {};
  for (const key in DATA_REFS) {
    const dataRef = DATA_REFS[key as keyof typeof DATA_REFS];
    if (dataRef === DATA_REFS.ASSETID) continue;
    result = {
      ...result,
      [dataRef]: (cells.find((x) => x.dataRef === dataRef) || { text: '' }).text,
    };
  }
  return result as Record<string, string>;
};

const DetailCard = <T extends { id?: string; unit?: number }>({
  tableRows,
  dateFormat,
  filteredItems,
  isCompact,
  onItemClick,
}: DetailCardProps<T>) => {
  const { t } = useTranslation();
  const { isLoading, results, lastItemRef } = useInfiniteScroll(tableRows);
  const regionColors = useMemo(() => getRegions(t), [t]);
  const processIntersectionObserverEntry = useCallback((entry: IntersectionObserverEntry) => {
    entry.target.classList.toggle('flex', entry.isIntersecting);
    (entry.target.firstChild as HTMLElement).classList.toggle('flex', entry.isIntersecting);
    (entry.target.firstChild as HTMLElement).classList.toggle('hidden', !entry.isIntersecting);
  }, []);

  const { isItemVisible, fadeOnScrollClassName } = useFadeInOnScroll({ isLoading, processIntersectionObserverEntry });

  return (
    <div className="flex-col w-full">
      <div className="flex flex-wrap  gap-3 p-3 bg-white justify-center">
        {results &&
          results.length > 0 &&
          results.map((row, index) => {
            let lastElemRefOption = { ref: isItemVisible };
            if (results.length === index + 1) {
              lastElemRefOption = { ref: lastItemRef };
            }
            const data = extractCardDetails(row.cells);
            const rawData = filteredItems.find((x) => `${x.id}` === `${row.id}`)!;
            const pl = Number(data[DATA_REFS.PROFIT_LOSS]);
            const trending = pl === 0 ? '' : pl > 0 ? 'trendup' : 'trenddown';
            const historicMarketPrices = sortItems(
              ((row.rowData?.historicMarketPrices || []) as HistoricMarketPrices[]).map((x: HistoricMarketPrices) => ({
                date: moment(x.date).toDate().getTime(),
                price: x.marketPrice,
              })),
              true,
              'date',
            ).map((x) => x.price);

            return (
              <div
                id={`id-${index}`}
                {...lastElemRefOption}
                onClick={() => onItemClick && onItemClick(row)}
                key={`row-${index}`}
                className={`flex ${fadeOnScrollClassName}   border rounded-lg w-[390px]  border-gray-200 p-5 cursor-pointer detail-card`}
              >
                <div className="flex-col space-y-2 w-full">
                  <div className="flex justify-between text-base text-left">
                    <span className="font-semibold pr-5"> {`${data[DATA_REFS.VINTAGE]} ${data[DATA_REFS.NAME]}`}</span>
                    <span>{formatter.format(Number(data[DATA_REFS.TOTAL_VALUE]))}</span>
                  </div>
                  <div className="flex justify-between text-14">
                    <div className="flex">
                      <span
                        style={{
                          backgroundColor: regionColors.find((x) => x.text.toLowerCase() === 'bordeaux')?.color,
                        }}
                        className="rounded-full px-5 py-1 items-center justify-center text-sm mr-3 font-semibold text-white"
                      >
                        {t(`common:regions.${toInternalId('bordeaux')}`)}
                      </span>
                      <span className="text-14">{rawData.unit}</span>
                    </div>

                    <div className="flex  gap-2 items-center justify-end">
                      <span className={`text-${trending}`}>{`${formatter.format(pl)}`}</span>
                      <div className="w-[12px]">
                        {pl > 0 && <ProfitIcon />}
                        {pl < 0 && <LossIcon />}
                      </div>
                    </div>
                  </div>
                  {!isCompact && (
                    <div className="flex justify-end ">
                      <div className="w-[70px] h-[50px] ">
                        <MarketDataChart data={historicMarketPrices || []} />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between ">
                    <span className="text-12">
                      {' '}
                      {`Deal date: ${moment(data[DATA_REFS.DEAL_DATE]).format(dateFormat)}`}
                    </span>
                    {/* {rawData.qtyForSale > 0 && (
                      <div className="bg-accent_orange rounded-full px-3 py-1 flex items-center  text-xs">
                        <TagIcon className="mr-2" />
                        <span> {`${rawData.qtyForSale}x ${t('portfolio:forSale')}`}</span>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {isLoading && <Loading containerClassName="p-3 bg-white" />}
    </div>
  );
};

export default DetailCard;
