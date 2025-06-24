export interface BalanceSummary {
  period: string;
  debet: number;
  orderSum: number;
  serviceSum: number;
  total: number;
}

export interface BalanceApiResponse {
  company_id: string;
  INN: string;
  first_period_date: string;
  last_period_date: string;
  order_sum: string;
  service_sum: string;
  sender_order_sum: string;
  recipient_order_sum: string;
  sender_service_sum: string;
  recipient_service_sum: string;
  debet: number;
  total: number;
  odin_s: {
    ИНН: string;
    СуммаОстатков: number;
    Счета: unknown[];
  };
}
