export interface NavigationItem {
  link: string;
  name: string;
  description?: string | string[];
  keywords?: string;
  dropdown?: NavigationItem[];
  onlyMobile?: boolean;
  icon?: string;
  hidden?: boolean;
}
