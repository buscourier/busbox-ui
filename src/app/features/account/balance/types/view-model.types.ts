import type { BalanceSummary } from './balance.types';

export interface SummaryViewModel {
  isLoading: boolean;
  hasData: boolean;
  data: BalanceSummary | null;
}

export interface BalanceViewModel {
  summary: SummaryViewModel;
}
