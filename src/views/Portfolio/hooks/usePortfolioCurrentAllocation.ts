import { useMemo } from 'react';
import { logError } from '../../../components/LogError';
import { randomNumberBetween } from '../../../utils';
import { useExecuteQuery } from '../../hooks/useExecuteQuery';
import { PORTFOLIO_CURRENT_ALLOCATION } from '../graphql/getAllocations';
import { CurrentAllocation, PortalAllocations, RegionPerformance } from '../types';

interface AllocationHookResponse {
  portalCashBalance: number;
  regionPerformances: RegionPerformance[];
  allocations: CurrentAllocation[];
  loading: boolean;
}

const numbersWithSum = (n: number, k: number): number[] => {
  if (n === 1) return [k];
  const num = randomNumberBetween(1, k);
  return [num, ...numbersWithSum(n - 1, k - num)];
};

const shuffled = () =>
  numbersWithSum(7, 100)
    .map((x) => (x < 0 ? 0 : x))
    .sort(function () {
      return 0.5 - Math.random();
    });

const randomElement = (array: number[]) => {
  const elem = array[Math.floor(Math.random() * array.length)];
  const index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
  return elem;
};

const current = shuffled();
const tactics = shuffled();
const strategic = shuffled();

const allRegion = 'All regions';
const regions = ['Bordeaux', 'Burgundy', 'Champagne', 'Italy', 'Rhone', 'USA', 'Other'];
export const mockResponse = {
  data: {
    portalPortfolioCurrentAllocation: {
      portalRegionPerformances: [allRegion, ...regions].map((x) => ({
        regionName: x,
        currentHolling: randomNumberBetween(100, 500000),
        netPosition: randomNumberBetween(100, 300000),
        netPositionPct: randomNumberBetween(100, 900),
      })),

      portalPortfolioCurrentAllocation: regions.map((x) => {
        return {
          regionName: x,
          currentAllocation: randomElement(current),
          tacticalAllocation: randomElement(tactics),
          StrategicAllocation: randomElement(strategic),
        };
      }),
    },
  },
};

export const usePortfolioCurrentAllocation = (): AllocationHookResponse => {
  const { loading, error, data } = useExecuteQuery('portalPortfolioCurrentAllocation', PORTFOLIO_CURRENT_ALLOCATION);

  const {
    portalCashBalance,
    portalPortfolioCurrentAllocation: {
      portalRegionPerformances: regionPerformances,
      portalPortfolioCurrentAllocation: allocations,
    },
  } = useMemo(() => {
    if (!data)
      return {
        portalCashBalance: 0,
        portalPortfolioCurrentAllocation: {
          portalRegionPerformances: [] as RegionPerformance[],
          portalPortfolioCurrentAllocation: [] as CurrentAllocation[],
        },
      };
    return data as PortalAllocations;
  }, [data]);

  if (error instanceof Error) {
    logError(error);
  }
  return {
    portalCashBalance,
    regionPerformances,
    allocations,
    loading,
  };
};
