export interface ShippingZone {
  site_id: string;
  zone: string;
  cities: string[];
}

export interface ShippingZoneTariff {
  id: string;
  zone: string;
  zone_id: string;
  main_type: string;
  type: string;
  size: string | null;
  weight: string | null;
  price: string;
}

export interface ZoneGroup {
  zone_id: string;
  zone_name: string;
  parts: ShippingZoneTariff[];
}

export interface ParcelZoneGroup {
  zone_id: string;
  zone_name: string;
  documents: ShippingZoneTariff[];
  parcels: ShippingZoneTariff[];
}
