export interface Columns {
  order_id: string;
  date: string;
  sender_name: string;
  recipient_name: string;
  start_city: string;
  end_city: string;
  order_price: string;
  status: string;
  print: string;
}

export interface OrderListPayload {
  'user-id': string;
  'start-date'?: string;
  'end-date'?: string;
  'start-city'?: string;
  'end-city'?: string;
  'elements-on-page'?: string;
  'page-num'?: string;
  'sort-field'?: string;
  'sort-direction'?: string;
}

export interface OrderListResponse {
  rows: string;
  orders: Order[];
}

export interface Order {
  date: string;
  end_city: string;
  end_city_id: string;
  order_id: string;
  order_price: string;
  recipient_name: string;
  sender_name: string;
  start_city: string;
  start_city_id: string;
  status: string;
}

export interface OrderDetails {
  order: OrderInfo;
  carrier_info: CarrierInfo;
}

export interface OrderInfo {
  order_id: number;
  site_id: string;
  site_name: string;
  order_date: DateTime;
  sender_name: string;
  sender_phone: string;
  sender_company: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_company: string;
  cargo_type_ext: string;
  cargo_description: string;
  cargo_count: number;
  order_price_raw: string;
  services_price: string;
  services_list: string;
  order_price: string;
  city_from: string;
  city_to: string;
  order_name: string;
  order_status: string;
  order_status_charcode: string;
  cargo_type: string;
  payment_type: string;
  payer: string;
  sending_date: string; // ISO datetime string
  order_note_raw: string;
  manager: string;
  dimensions_raw?: Dimension[] | null;
  dimensions: Dimension;
  order_note: string;
}

export interface DateTime {
  time: string;
  date: string;
}

export interface Dimension {
  count: string;
  width: string;
  height: string;
  length: string;
  weight: string;
}

export interface CarrierInfo {
  carrier_id: number;
  carrier_name: string;
  carrier_payment_id: number;
  carrier_payment_name: string;
  bus_id: number;
  bus_name: string;
  time_departure: DateTime;
  time_arrival: DateTime;
  carrier_price: string;
  latitude: number;
  longitude: number;
  bus_info: string;
}

export interface CancelOrderPayload {
  'user-id': string;
  'order-id': string;
}

export type CancelOrderResponse = Record<string, string>;
