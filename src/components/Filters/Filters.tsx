/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from '../../components';
import CheckBox from '../../components/CheckBox';
import { DropdownItem } from '../../components/Dropdown';
import { buildDisplayText, capitalizeFirstLetter, sortItems, toInternalId, uniqueItems } from '../../utils';
import { getRegions } from '../../helpers';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import './filterDatePicker.css';
import { DATA_REFS, Product } from '../../types/productType';
import DateFilter, { DateFilters, DateType } from './dateFilter';

export interface FilterDDType {
  selectedText: string;
  selectedIds: string[];
  allIds?: string[];
}

export type DDConfig = Record<string, unknown> & {
  open: boolean;
  control: string;
};

interface CustomFilter {
  source: string[];
  filterFn: (data: Product[], ids: string[]) => Product[];
}

const buildSelectText = (ddFilters: DDFilterItem[], type: string, selectedIds: string[], allItemId: string) => {
  const ddFilter = ddFilters.find((x) => x.type === type);

  if (!!ddFilter?.ignoreAll && ddFilter?.ignoreAll && selectedIds.includes(allItemId))
    selectedIds = selectedIds.filter((x) => x !== allItemId);

  if (selectedIds.length === 0) return ddFilter!.defaulText;
  if (selectedIds.includes(allItemId) && ddFilter!.items.length > 1)
    return ddFilter!.items.find((x) => x.id === allItemId)!.text;
  const selectedTexts = selectedIds.map((id) => {
    return ddFilter!.items.find((x) => x.id === id)!.text;
  });
  return selectedTexts.join(';');
};

const filterByDate = <T,>(data: T[], prop: keyof T, dateFilters: DateFilters) => {
  if (dateFilters[DateType.START])
    return data.filter(
      (x) =>
        moment(`${x[prop]}`).isBetween(moment(dateFilters[DateType.START]), moment(dateFilters[DateType.END])) ||
        moment(`${x[prop]}`).isSame(moment(dateFilters[DateType.START])) ||
        moment(`${x[prop]}`).isSame(moment(dateFilters[DateType.END])),
    );
  return data;
};

export const onCheckItemChange = (
  ddFilters: DDFilterItem[],
  dropdownConfig: DDConfig,
  key: string,
  id: string,
  allItemId = 'allitems',
  value?: boolean,
) => {
  const dataAttr = dropdownConfig[key] as FilterDDType;
  const idsSelected = dataAttr.selectedIds as string[];
  const isChecked = value ? value : !idsSelected.includes(id);
  if ((isChecked && idsSelected.includes(id)) || (!isChecked && !idsSelected.includes(id))) return;
  let results = idsSelected.filter((x) => x !== id && x !== allItemId);

  if (id === allItemId) {
    results = isChecked ? [...dataAttr.allIds!] : [];
  }
  if (isChecked) results = [...results, id];
  const ddFilterRef = ddFilters.find((x) => x.type === key);
  const sortingArr = [...ddFilterRef!.items.map((z) => z.id)];

  results = results.sort((a, b) => sortingArr!.indexOf(a) - sortingArr!.indexOf(b));
  if (isChecked) {
    const isAllItemSecondaryCheck = results.filter((x) => x !== allItemId)!.join(',') === dataAttr.allIds!.join(',');
    if (isAllItemSecondaryCheck) results = [...dataAttr.allIds!, allItemId];
  }
  if (ddFilterRef!.items.length === 1 && results.includes(allItemId)) results = results.filter((x) => x !== allItems);

  return {
    selectedIds: results,
    selectedText: buildSelectText(ddFilters, key, results, allItemId),
  };
};

enum DisplayTextKeys {
  TITLE = 'title',
  CLEAR_FILTERS = 'clearFilters',
  APPLY_BUTTON_TEXT = 'applyButtonText',
  ALL = 'all',
  VINTAGES = 'vintages',
  REGIONS = 'regions',
  STATUSES = 'statuses',
  SELECT = 'select',
  FOR_SALE = 'forSale',
  NOT_FOR_SALE = 'notForSale',
  DEAL_DATE = 'dealDate',
  SOLD_DATE = 'soldDate',
  FROM = 'from',
  TO = 'to',
  DATE_PLACEHOLDER_TEXT = 'datePlaceholderText',
  PROFIT = 'profit',
  LOSS = 'loss',
  WINE_NAMES = 'wineNames',
}
export enum FilterTypes {
  REGIONS = 'regions',
  STATUES = 'statuses',
  VINTAGES = 'vintages',
  P_AND_L = 'profitAndLoss',
  WINE_NAMES = 'wineNames',
}

export interface DDFilterItem {
  type: FilterTypes | string;
  items: DropdownItem[];
  defaulText: string;
  dataRef: DATA_REFS | string;
  ignoreAll?: boolean;
}

interface DropdownConfig {
  open: boolean;
  control: FilterTypes;
  [FilterTypes.REGIONS]: FilterDDType;
  [FilterTypes.STATUES]: FilterDDType;
  [FilterTypes.VINTAGES]: FilterDDType;
  [FilterTypes.P_AND_L]: FilterDDType;
  [FilterTypes.WINE_NAMES]: FilterDDType;
}

export type Filters = DateFilters & DropdownConfig & { soldDate: DateFilters };

interface PDFiltersProp {
  datasource: Product[];
  filters?: Filters;
  onApplyFilter: (filterResults: Product[], filters?: Filters) => void;
  onClearFilter?: () => void;
  timestamp: number;
  filterConfigure?: (filters: DDFilterItem[]) => DDFilterItem[];
  overrides?: Partial<Record<FilterTypes, unknown>>;
  parentCompId?: string;
}
const allItems = 'allitems';

const PDFilters: FC<PDFiltersProp> = ({
  datasource,
  onApplyFilter,
  filters,
  timestamp,
  filterConfigure,
  overrides,
  parentCompId,
}) => {
  const { t } = useTranslation();
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(timestamp);
  const regions = useMemo(
    () =>
      getRegions(t).map((x) => {
        const result = { ...x };
        if (x.id === 'allregion') return { ...result, id: allItems };
        return result;
      }),
    [t],
  );

  const displayText = useMemo(() => {
    const localeResults = buildDisplayText(Object.values(DisplayTextKeys), 'portfolio:filters', t);
    const {
      regions: regionText,
      all,
      select,
      vintages,
      statuses,
      forSale,
      notForSale,
      clearFilters,
      dealDate,
      soldDate,
      profit,
      loss,
      wineNames,
    } = localeResults;
    return {
      ...localeResults,
      CLEAR_FILTERS: capitalizeFirstLetter(`${clearFilters}`),
      [`${FilterTypes.REGIONS}_TEXT`]: capitalizeFirstLetter(`${regionText}`),
      [`${FilterTypes.VINTAGES}_TEXT`]: capitalizeFirstLetter(`${vintages}`),
      [`${FilterTypes.STATUES}_TEXT`]: capitalizeFirstLetter(`${statuses}`),
      [`${FilterTypes.P_AND_L}_TEXT`]: capitalizeFirstLetter(`${profit}/${loss}`),
      [`${FilterTypes.WINE_NAMES}_TEXT`]: capitalizeFirstLetter(`${wineNames}`),
      FOR_SALE: capitalizeFirstLetter(`${forSale}`),
      NOT_FOR_SALE: capitalizeFirstLetter(`${notForSale}`),
      ALL_REGIONS_TEXT: capitalizeFirstLetter(`${all} ${regionText}`),
      ALL_VINTAGES_TEXT: capitalizeFirstLetter(`${all} ${vintages}`),
      ALL_STATUSES_TEXT: capitalizeFirstLetter(`${all} ${statuses}`),
      ALL_WINE_NAME_TEXT: capitalizeFirstLetter(`${all} ${wineNames}`),
      SELECT_REGIONS_TEXT: capitalizeFirstLetter(`${select} ${regionText}`),
      SELECT_VINTAGES_TEXT: capitalizeFirstLetter(`${select} ${vintages}`),
      SELECT_STATUSES_TEXT: capitalizeFirstLetter(`${select} ${statuses}`),
      SELECT_P_AND_L_TEXT: capitalizeFirstLetter(`${select} ${profit}/${loss}`),
      SELECT_WINE_NAMES_TEXT: capitalizeFirstLetter(`${select} ${wineNames}`),
      DEAL_DATE_TEXT: capitalizeFirstLetter(`${dealDate}`),
      SOLD_DATE_TEXT: capitalizeFirstLetter(`${soldDate}`),
      PROFIT: capitalizeFirstLetter(`${profit}`),
      LOSS: capitalizeFirstLetter(`${loss}`),
      WINE_NAME: capitalizeFirstLetter(`${wineNames}`),
    } as Record<string, string>;
  }, [t]);
  const [dateFilters, setDateFilters] = useState<DateFilters>({
    [DateType.START]: null,
    [DateType.END]: null,
  });

  const [soldDateFilters, setSoldDateFilters] = useState<DateFilters>({
    [DateType.START]: null,
    [DateType.END]: null,
  });
  const onApply = () => {
    if (onApplyFilter) {
      const hasFilters = ddFilters.find(
        (x) =>
          dropdownConfig[x.type as FilterTypes].selectedIds.length > 0 ||
          dateFilters[DateType.START] ||
          soldDateFilters[DateType.END],
      );
      onApplyFilter(
        filteredData,
        hasFilters ? { ...dateFilters, ...dropdownConfig, soldDate: soldDateFilters } : undefined,
      );
    }
  };

  const defaultConfig = useMemo(
    () => ({
      open: false,
      control: FilterTypes.REGIONS,
      [FilterTypes.REGIONS]: {
        selectedText: displayText.SELECT_REGIONS_TEXT,
        selectedIds: [],
        allIds: [],
      },
      [FilterTypes.STATUES]: {
        selectedText: displayText.SELECT_STATUSES_TEXT,
        selectedIds: [],
        allIds: [],
      },
      [FilterTypes.VINTAGES]: {
        selectedText: displayText.SELECT_VINTAGES_TEXT,
        selectedIds: [],
        allIds: [],
      },
      [FilterTypes.P_AND_L]: {
        selectedText: displayText.SELECT_P_AND_L_TEXT,
        selectedIds: [],
        allIds: [],
      },
      [FilterTypes.WINE_NAMES]: {
        selectedText: displayText.SELECT_WINE_NAMES_TEXT,
        selectedIds: [],
        allIds: [],
      },
    }),
    [displayText],
  );
  const [dropdownConfig, setDropDownConfig] = useState<DropdownConfig>(defaultConfig);

  const [filteredData, setFilteredData] = useState<Product[]>([...datasource]);

  const updateFilterConfig = (key: FilterTypes, updates: Record<string, unknown>) => {
    setDropDownConfig({
      ...dropdownConfig,
      [key]: { ...dropdownConfig[key], ...updates },
    });
  };

  const regionFilters = useMemo(
    () =>
      regions.map((region) => ({
        id: region.id,
        value: region.value,
        text: region.text,
        content: (
          <CheckBox
            isChecked={(dropdownConfig.regions.selectedIds as string[]).includes(region.id)}
            id={region.id}
            className=" flex-1 sm:w-[300px]"
          >
            <span className="ml-3 text-black text-14">{region.text}</span>
          </CheckBox>
        ),
      })),
    [dropdownConfig[FilterTypes.REGIONS].selectedIds, regions],
  );

  const vintageFilters = useMemo(() => {
    const source = uniqueItems([...datasource.map((x) => x.vintage)])
      .filter((v, i, a) => a.indexOf(v) === i)
      .filter((x) => Number(x) !== 0)
      .sort((a: string, b: string) => (Number(a) < Number(b) ? 1 : -1));

    return (source.length > 1 ? [allItems, ...source] : source).map((item) => {
      const text = item === allItems ? displayText.ALL_VINTAGES_TEXT : item;
      return {
        id: item,
        value: item,
        text,
        content: (
          <CheckBox
            isChecked={(dropdownConfig.vintages.selectedIds as string[]).includes(item)}
            id={item}
            className=" flex-1 sm:w-[300px]"
          >
            <span className="ml-3 text-black text-14">{text}</span>
          </CheckBox>
        ),
      };
    });
  }, [dropdownConfig[FilterTypes.VINTAGES].selectedIds, datasource]);

  const customFilters = useMemo(() => {
    return {
      [FilterTypes.STATUES]: {
        source: [displayText.FOR_SALE, displayText.NOT_FOR_SALE],
        filterFn: (data: Product[], ids: string[]) => {
          let statusesFilterResult: Product[] = [];
          if (ids.includes(toInternalId(displayText.FOR_SALE))) {
            statusesFilterResult = [...statusesFilterResult, ...data.filter((x) => x.qtyForSale > 0)];
          }
          if (ids.includes(toInternalId(displayText.NOT_FOR_SALE))) {
            statusesFilterResult = [...statusesFilterResult, ...data.filter((x) => x.qtyForSale === 0)];
          }
          return statusesFilterResult;
        },
      },
      ...overrides,
    };
  }, [overrides]);

  const statusesFilters = useMemo(() => {
    let statuses: string[] = [];
    if (customFilters[FilterTypes.STATUES]) {
      statuses = (customFilters[FilterTypes.STATUES] as CustomFilter).source;
    }

    return [allItems, ...statuses].map((item) => {
      const text = item === allItems ? displayText.ALL_STATUSES_TEXT : item;
      return {
        id: item,
        value: item,
        text,
        content: (
          <CheckBox
            isChecked={(dropdownConfig.statuses.selectedIds as string[]).includes(item)}
            id={item}
            className=" flex-1 sm:w-[300px]"
          >
            <span className="ml-3 text-black text-14">{text}</span>
          </CheckBox>
        ),
      };
    });
  }, [dropdownConfig[FilterTypes.STATUES].selectedIds, datasource]);

  const plFilters = useMemo(
    () =>
      [displayText.PROFIT, displayText.LOSS].map((item) => {
        const text = item;
        return {
          id: item,
          value: item,
          text,
          content: (
            <CheckBox
              isChecked={(dropdownConfig.profitAndLoss.selectedIds as string[]).includes(item)}
              id={item}
              className=" flex-1 sm:w-[300px]"
            >
              <span className="ml-3 text-black text-14">{text}</span>
            </CheckBox>
          ),
        };
      }),
    [dropdownConfig[FilterTypes.P_AND_L].selectedIds, datasource],
  );

  const wineNameOptions = useMemo(() => {
    const source = [...sortItems([...datasource], true, DATA_REFS.NAME).map((x) => x[DATA_REFS.NAME])].filter(
      (v, i, a) => a.indexOf(v) === i,
    );
    return (source.length > 1 ? [allItems, ...source] : source).map((item) => {
      const text = item === allItems ? displayText.ALL_WINE_NAME_TEXT : item;
      const identifier = toInternalId(item);
      const isItemSelected = (dropdownConfig.wineNames.selectedIds as string[]).includes(identifier);

      return {
        id: identifier,
        value: identifier,
        text,
        content: (
          <CheckBox isChecked={isItemSelected} id={identifier} className=" flex-1 sm:w-[300px]">
            <span className="ml-3 text-black text-14">{text}</span>
          </CheckBox>
        ),
      };
    });
  }, [dropdownConfig[FilterTypes.WINE_NAMES].selectedIds, datasource]);

  const ddFilters = useMemo(() => {
    const sourceFilters = [
      {
        type: FilterTypes.REGIONS,
        items: regionFilters,
        defaulText: displayText.SELECT_REGIONS_TEXT,
        dataRef: DATA_REFS.REGION,
      },
      {
        type: FilterTypes.VINTAGES,
        items: vintageFilters,
        defaulText: displayText.SELECT_VINTAGES_TEXT,
        dataRef: DATA_REFS.VINTAGE,
      },
      {
        type: FilterTypes.WINE_NAMES,
        items: wineNameOptions,
        defaulText: displayText.SELECT_WINE_NAMES_TEXT,
        dataRef: DATA_REFS.NAME,
      },
      {
        type: FilterTypes.STATUES,
        items: statusesFilters,
        defaulText: displayText.SELECT_STATUSES_TEXT,
        dataRef: DATA_REFS.STATUS,
      },
      {
        type: FilterTypes.P_AND_L,
        items: plFilters,
        defaulText: displayText.SELECT_P_AND_L_TEXT,
        dataRef: DATA_REFS.PROFIT_LOSS,
        ignoreAll: true,
      },
    ] as DDFilterItem[];
    if (filterConfigure) return filterConfigure(sourceFilters);
    return sourceFilters;
  }, [regionFilters, vintageFilters, statusesFilters, plFilters, wineNameOptions]);

  const onClear = () => {
    refreshFilterPanel();
  };

  const updateFilteredDatasource = () => {
    let data: Product[] = [...datasource];

    const selectedRegions = dropdownConfig[FilterTypes.REGIONS].selectedIds;
    if (selectedRegions.length > 0) {
      data = data.filter((x) => selectedRegions.includes(x.region.toLowerCase()));
    }

    const selectedVintages = dropdownConfig[FilterTypes.VINTAGES].selectedIds;
    if (selectedVintages.length > 0) {
      data = data.filter((x) => selectedVintages.includes(x.vintage));
    }

    const selectedWineNames = dropdownConfig[FilterTypes.WINE_NAMES].selectedIds;
    if (selectedWineNames.length > 0) {
      data = data.filter((x) => selectedWineNames.includes(toInternalId(x.wineName)));
    }

    Object.keys(customFilters).forEach((key) => {
      const config = dropdownConfig[key as FilterTypes];
      if (config) {
        const selectedIds = config.selectedIds || [];
        if (selectedIds.length > 0) {
          data = [
            ...(customFilters[key as FilterTypes] as CustomFilter).filterFn(
              [...data],
              selectedIds.map((x) => toInternalId(x).toLowerCase()),
            ),
          ];
        }
      }
    });

    const selectedProfitLoss = dropdownConfig[FilterTypes.P_AND_L].selectedIds;
    if (selectedProfitLoss.length > 0) {
      const plDatasource = [...data];
      let profitLossFilterResult: Product[] = [];
      const ids = selectedProfitLoss.map((x) => toInternalId(x).toLowerCase());
      if (ids.includes(toInternalId(displayText.PROFIT))) {
        profitLossFilterResult = [...profitLossFilterResult, ...plDatasource.filter((x) => x.profitAndLoss >= 0)];
      }
      if (ids.includes(toInternalId(displayText.LOSS))) {
        profitLossFilterResult = [...profitLossFilterResult, ...plDatasource.filter((x) => x.profitAndLoss < 0)];
      }
      data = [...profitLossFilterResult];
    }

    if (dateFilters[DateType.START])
      data = data.filter(
        (x) =>
          moment(x.dealDate).isBetween(moment(dateFilters[DateType.START]), moment(dateFilters[DateType.END])) ||
          moment(x.dealDate).isSame(moment(dateFilters[DateType.START])) ||
          moment(x.dealDate).isSame(moment(dateFilters[DateType.END])),
      );

    if (parentCompId === 'sold') {
      data = filterByDate(data, 'soldDate', soldDateFilters);
    }

    setFilteredData(data);
  };

  const onFilterItemSelect = (key: FilterTypes, item: DropdownItem) => {
    updateFilterConfig(key, {
      ...onCheckItemChange(ddFilters, dropdownConfig as unknown as DDConfig, key, item.id),
    });
  };

  const refreshFilterPanel = (savedFilters?: Filters) => {
    const updates = ddFilters.reduce((result, filter) => {
      return {
        ...result,
        [filter.type]: {
          ...dropdownConfig[filter.type as FilterTypes],
          allIds: filter.items.filter((z) => z.id !== allItems).map((x) => x.id),
          selectedText: filter.defaulText,
          selectedIds: [],
        },
      };
    }, {});

    const {
      start: startDate,
      end: endDate,
      soldDate,
      ...otherProps
    } = savedFilters || {
      [DateType.START]: null,
      [DateType.END]: null,
      soldDate: { [DateType.START]: null, [DateType.END]: null },
    };
    setDropDownConfig({
      ...dropdownConfig,
      ...updates,
      ...(otherProps || {}),
      open: false,
    });

    setDateFilters({
      [DateType.START]: startDate || null,
      [DateType.END]: endDate || null,
    });

    setSoldDateFilters({
      [DateType.START]: soldDate?.[DateType.START] || null,
      [DateType.END]: soldDate?.[DateType.END] || null,
    });
    setFilteredData([...datasource]);
  };

  useEffect(() => {
    updateFilteredDatasource();
  }, [dropdownConfig, dateFilters[DateType.END], soldDateFilters[DateType.END]]);

  useEffect(() => {
    refreshFilterPanel(filters);
  }, [filters]);

  useEffect(() => {
    if (timestamp !== currentTimestamp) {
      setCurrentTimestamp(timestamp);
      refreshFilterPanel(filters);
    }
  }, [timestamp]);

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-vine to-gray-500  pb-5 px-3 w-screen relative overflow-x-hidden sm:w-[390px]">
      <div className=" flex flex-1 flex-col space-y-10  bg-white rounded-t-md   py-5">
        {ddFilters.map((filter) => {
          return (
            <div className="flex flex-col px-3" key={`filter-${filter.type}`}>
              <span className="text-sm text-gray-700 mb-1">{displayText[`${filter.type}_TEXT`]}</span>
              <Dropdown
                autoClose={false}
                open={dropdownConfig.open && dropdownConfig.control === filter.type}
                onOpen={() =>
                  setDropDownConfig({
                    ...dropdownConfig,
                    open: filter.type === dropdownConfig.control ? !dropdownConfig.open : true,
                    control: filter.type as FilterTypes,
                  })
                }
                valueTemplate={
                  <div className="flex w-[95%]">
                    <span className="truncate block">{dropdownConfig[filter.type as FilterTypes].selectedText}</span>
                  </div>
                }
                onItemSelect={(item) => onFilterItemSelect(filter.type as FilterTypes, item)}
                items={filter.items}
                itemWrapperStyle={{ width: '100%' }}
                itemsContainerClassName="h-[300px] overflow-y-auto "
                itemClassName="py-5 text-base flex"
                className="flex-1 text-sm sm:text-14 text-black whitespace-nowrap p-0 justify-start border-b border-b-gray-400"
                header={
                  <div className="p-5 pt-5 flex justify-end ">
                    <span className="flex-1 text-gray-700 text-sm">{displayText[`${filter.type}_TEXT`]}</span>
                  </div>
                }
              />
            </div>
          );
        })}
        <DateFilter
          options={{
            title: `${displayText.DEAL_DATE_TEXT}`,
            startTitle: displayText[DisplayTextKeys.FROM],
            endTitle: displayText[DisplayTextKeys.TO],
            datePlaceHolderText: displayText[DisplayTextKeys.DATE_PLACEHOLDER_TEXT],
          }}
          model={dateFilters}
          onModelUpdate={setDateFilters}
        />
        {parentCompId === 'sold' && (
          <DateFilter
            options={{
              title: `${displayText.SOLD_DATE_TEXT}`,
              startTitle: displayText[DisplayTextKeys.FROM],
              endTitle: displayText[DisplayTextKeys.TO],
              datePlaceHolderText: displayText[DisplayTextKeys.DATE_PLACEHOLDER_TEXT],
            }}
            model={soldDateFilters}
            onModelUpdate={setSoldDateFilters}
          />
        )}
      </div>

      <div className="p-5  border-t border-t-100 flex justify-between w-full bg-white rounded-b-md">
        <Button
          isLink={true}
          className={`text-14 text-gray-500`}
          onClick={() => onClear()}
          props={{
            name: 'clearFilter',
          }}
        >
          {displayText.CLEAR_FILTERS}
        </Button>
        <Button
          className={`btn text-14 w-fit font-normal bg-orange rounded-full  `}
          onClick={() => onApply()}
          props={{
            name: 'applyFilters',
          }}
        >
          {displayText[DisplayTextKeys.APPLY_BUTTON_TEXT].replace(/\{\{.*\}\}/g, `${filteredData.length}`)}
        </Button>
      </div>
    </div>
  );
};

export default PDFilters;
