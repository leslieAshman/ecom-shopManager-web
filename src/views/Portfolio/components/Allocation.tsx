import { FC, useMemo, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { InfoIcon } from '../../../assets/icons';
import { Dropdown } from '../../../components';
import { DropdownItem } from '../../../components/Dropdown';
import Table, { CellTypeEnum, TableCell, TableColumnType } from '../../../components/Table';
import ToolTip from '../../../components/Tooltip';
import { getRegions } from '../../../helpers';
import { Alignment } from '../../../types/DomainTypes';
import { buildDisplayText, formatter, roundNumber, sortItems, toInternalId } from '../../../utils';
import { buildTableRow, buildAllocationsDisplaySource } from '../helpers';
import { CurrentAllocation, RegionPerformance } from '../types';
import { Region } from '../../../types/productType';
enum DisplayTextKeys {
  TITLE = 'portfolio:summary.texts.currentAllocation',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
enum ALLOCATION_TABLE_PROPERTIES {
  HEADING_REGION = 'Regions',
  HEADING_CURRENT = 'Current Allocation',
  HEADING_STRATEGIC = 'Strategic Allocation',
  HEADING_TACTICAL = 'Tactical Allocation',
}

type SelectedRegionType = {
  id: string;
  text: string;
  holdings: number;
  position: number;
  netPercent: number;
};

const cellClassName = 'text-center text-14 text-black';
const cellContentTemplate = (cell: TableCell) => <span>{`${roundNumber(Number(cell.text))}%`}</span>;
const getColumnDefinition = (translationFunction: TFunction, regions: Region[]): TableColumnType[] => [
  {
    dataRef: 'regionName',
    text: translationFunction(
      `portfolio:summary.allocation-table.${toInternalId(ALLOCATION_TABLE_PROPERTIES.HEADING_REGION)}`,
    ),
    cellType: CellTypeEnum.TH,
    className: 'pl-3',
    cellClassName: 'text-14 font-normal text-black whitespace-nowrap flex-1',
    cellContentTemplate: (cell: TableCell, translation: TFunction) => (
      <div className="flex items-center ">
        <div
          style={{ backgroundColor: regions.find((x) => x.text === cell.text)?.color }}
          className={`w-[8px] h-[36px] mr-3`}
        />
        <span>{translation(`common:regions.${cell.text.toLowerCase()}`)}</span>
      </div>
    ),
  },
  {
    dataRef: 'currentAllocation',
    className: 'text-center',
    text: translationFunction(
      `portfolio:summary.allocation-table.${toInternalId(ALLOCATION_TABLE_PROPERTIES.HEADING_CURRENT)}`,
    ),
    cellClassName,
    cellContentTemplate,
  },
  {
    dataRef: 'tacticalAllocation',
    className: 'text-center',
    text: translationFunction(
      `portfolio:summary.allocation-table.${toInternalId(ALLOCATION_TABLE_PROPERTIES.HEADING_TACTICAL)}`,
    ),
    contentTemplate: (col: TableColumnType, t: TFunction) => (
      <div className="flex items-center justify-center  ">
        <span className="mr-2 ">{col.text}</span>
        <ToolTip
          align={Alignment.RIGHT}
          tooltip={
            <div className="bg-white border border-gray-300 w-[200px] font-normal text-sm p-2">{`${t(
              'portfolio:summary.allocation-table.tacticalAllocationInfo',
            )}`}</div>
          }
        >
          <InfoIcon className="cursor-pointer w-5" />
        </ToolTip>
      </div>
    ),
    cellClassName,
    cellContentTemplate,
  },
  {
    dataRef: 'StrategicAllocation',
    className: 'text-center',
    text: translationFunction(
      `portfolio:summary.allocation-table.${toInternalId(ALLOCATION_TABLE_PROPERTIES.HEADING_STRATEGIC)}`,
    ),
    cellClassName,
    cellContentTemplate,
    contentTemplate: (col: TableColumnType, t: TFunction) => (
      <div className="flex items-center justify-center ">
        <span className="mr-2 ">{col.text}</span>
        <ToolTip
          align={Alignment.RIGHT}
          tooltip={
            <div className="bg-white border border-gray-300 font-normal w-[200px] text-sm p-2">{`${t(
              'portfolio:summary.allocation-table.strategicAllocationInfo',
            )}`}</div>
          }
        >
          <InfoIcon className="cursor-pointer w-5" />
        </ToolTip>
      </div>
    ),
  },
];

const getRegionInfo = (x: RegionPerformance, t: TFunction) => {
  const { currentHoldings: holdings, netPosition: position, netPositionPct: netPercent } = x;
  const text = t(`common:regions.${toInternalId(x.regionName)}`);
  return {
    id: toInternalId(x.regionName),
    holdings,
    position,
    netPercent,
    ddInfo: {
      id: toInternalId(x.regionName),
      value: toInternalId(x.regionName),
      text,
      content: <span className="cursor-pointer">{text}</span>,
    },
  };
};
interface AllocationProp {
  regionPerformances: RegionPerformance[];
  allocations: CurrentAllocation[];
  className?: string;
}

const Allocation: FC<AllocationProp> = ({ regionPerformances, allocations }) => {
  const { t } = useTranslation();

  const regionColors = useMemo(() => getRegions(t), [t]);
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegionType>({
    id: '',
    text: '',
    holdings: 0,
    position: 0,
    netPercent: 0,
  });

  const columns = useMemo(() => {
    return getColumnDefinition(t, regionColors);
  }, [t, regionColors]);

  const regions = useMemo(() => {
    let regionInfos = regionPerformances.map((x) => getRegionInfo(x, t));
    if (regionInfos.length === 0)
      regionInfos = [
        getRegionInfo(
          {
            regionName: '',
            currentHoldings: 0,
            totalPurchasePrice: 0,
            netPosition: 0,
            netPositionPct: 0,
          },
          t,
        ),
      ];
    setSelectedRegion({
      id: regionInfos[0].ddInfo.id,
      text: regionInfos[0].ddInfo.text,
      holdings: regionInfos[0].holdings,
      position: regionInfos[0].position,
      netPercent: regionInfos[0].netPercent,
    });
    return regionInfos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionPerformances]);

  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'portfolio:summary.allocation', t),
    [t],
  );

  const rows = useMemo(() => {
    const filteredAllocations =
      selectedRegion.id === regions[0].ddInfo.id
        ? allocations
        : allocations.filter((x) => toInternalId(x.regionName) === selectedRegion.id);
    const allRows = filteredAllocations.map((alloc) => buildTableRow({ ...alloc }, columns));
    return [...allRows];
  }, [allocations, selectedRegion, regions, columns]);

  const allocationDatasource = useMemo(() => buildAllocationsDisplaySource(allocations), [allocations]);
  const ddRegionOptions = useMemo(() => {
    const allRegions = sortItems(
      regions.map((x) => x.ddInfo),
      true,
      'id',
    );
    return [
      ...allRegions.filter((x) => x.id !== toInternalId('other')),
      ...allRegions.filter((x) => x.id === toInternalId('other')),
    ];
  }, [regions]);
  const onRegionChange = (item: DropdownItem) => {
    if (item.id !== selectedRegion.id) {
      const {
        ddInfo: { id, text },
        holdings,
        position,
        netPercent,
      } = regions.find((x) => x.ddInfo.id === item.id)!;
      setSelectedRegion({
        id,
        text,
        holdings,
        position,
        netPercent,
      });
    }
  };

  return (
    <>
      <span> {displayText[DisplayTextKeys.TITLE]}</span>
      <div className="flex rounded-full overflow-hidden flex-nowrap mt-5 mb-3">
        {allocationDatasource.map((allocation, index) => {
          return (
            <div
              style={{ width: `${allocation.current}%`, background: `${allocation.color}` }}
              key={`allocation-${index}`}
              className="p-3"
            ></div>
          );
        })}
      </div>
      <div className="bg-white p-[16px] pb-[24px] my-[16px] flex flex-col border border-gray-100 rounded-md shadow-md">
        <Dropdown
          value={selectedRegion.id}
          valueText={selectedRegion.text}
          onItemSelect={onRegionChange}
          items={ddRegionOptions}
          iconClassName="text-white"
          itemsWrapperClassName="h-[300px] overflow-y-auto"
          itemClassName="py-5 text-base w-[302px] cursor-pointer"
          style={{ fill: 'white' }}
          className="flex-1 px-3 bg-vine rounded-full text-14 py-3 flex justify-between text-white w-fit mb-5 mt-3"
        />
        <span className="text-lg">{formatter.format(selectedRegion.holdings)}</span>
        <span className={`text-20 ${selectedRegion.position < 0 ? 'text-trenddown' : 'text-trendup'}`}>{`${
          selectedRegion.position < 0 ? '' : '+'
        } ${formatter.format(selectedRegion.position)} (${roundNumber(selectedRegion.netPercent)}%)`}</span>
      </div>

      <Table columns={columns} rows={rows} containerClassNames="shadow-md" />
    </>
  );
};

export default Allocation;
