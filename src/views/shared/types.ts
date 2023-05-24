import { ReactNode } from 'react';
import { NavigationPath } from '../../types/DomainTypes';

export interface SideBarItemType {
  title: string;
  icon?: ReactNode;
  value: NavigationPath;
  onClick?: () => void;
}

export interface SideBarProps {
  value: NavigationPath;
  onClose?: () => void;
  onClick: (item: SideBarItemType) => void;
  isSmallScreen: boolean;
}

export interface BalanceSummary {
  portfolioName: number;
  portfolioId: string;
  balance: number;
}
export interface CashBalanceResponse {
  todayInvestment: number;
  balances: BalanceSummary[];
}
