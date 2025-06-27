export interface ShippingZone {
  site_id: string;
  zone: string;
  cities: string[];
}

export interface ShippingZoneTariff {
  id: string;
  zone: string;
  main_type: string;
  type: string;
  size: string | null;
  weight: string | null;
  price: string;
}
