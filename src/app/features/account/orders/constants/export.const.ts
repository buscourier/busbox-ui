import type { Order } from '../types';

export const EXPORT_COLUMNS: { key: keyof Order; header: string; width: number }[] = [
  { key: 'order_id', header: 'ID заказа', width: 15 },
  { key: 'date', header: 'Дата', width: 12 },
  { key: 'sender_name', header: 'Отправитель', width: 20 },
  { key: 'recipient_name', header: 'Получатель', width: 20 },
  { key: 'start_city', header: 'Город отправления', width: 18 },
  { key: 'end_city', header: 'Город получения', width: 18 },
  { key: 'order_price', header: 'Стоимость', width: 12 },
  { key: 'status', header: 'Статус', width: 15 },
];
