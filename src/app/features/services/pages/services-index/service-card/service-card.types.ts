export type ServiceType = 'guard' | 'task' | 'courier';

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  type: ServiceType;
  link: string;
}
