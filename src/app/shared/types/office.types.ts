export interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  worktime: string;
  desc: string;
  office_id: string;
  site_id: string;
  home_id: string;
  get: string;
  give: string;
  delivery: string;
  pickup: string;
  geo_x: number;
  geo_y: number;
  lat: number;
  lng: number;
  pvz: string;
  services?: string[];
  pvz_comment: string;
  video_url: string;
  cargo_restrict: string;
  cargo_restrict_info: string;
}
