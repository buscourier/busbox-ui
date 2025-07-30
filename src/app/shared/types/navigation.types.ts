export type BadgeColor = 'yellow' | 'green' | 'blue' | 'red' | 'orange';

export interface NavigationBadge {
  text: string;
  color?: BadgeColor;
}

export interface NavigationItem {
  link: string;
  name: string;
  description?: string | string[];
  keywords?: string;
  dropdown?: NavigationItem[];
  onlyMobile?: boolean;
  icon?: string;
  badge?: NavigationBadge;
  hidden?: boolean;
}
