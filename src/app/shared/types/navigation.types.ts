export type BadgeColor = 'yellow' | 'green' | 'blue' | 'red' | 'orange';

export interface NavigationBadge {
  text: string;
  color?: BadgeColor;
}

export interface PageContent {
  title: string;
  description?: string[];
}

// export interface SeoOpenGraph {
//   title?: string;
//   description?: string;
//   image?: string;
//   type?: 'website' | 'article' | string;
// }
//
// export interface SeoTwitter {
//   card?: 'summary' | 'summary_large_image';
//   title?: string;
//   description?: string;
//   image?: string;
// }

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  // canonical?: string;
  // og?: SeoOpenGraph;
  // twitter?: SeoTwitter;
}

export interface LayoutOptions {
  showTitle: boolean;
  showDescription: boolean;
  showBreadcrumbs: boolean;
}

export interface NavigationItem {
  link: string;
  name: string;
  dropdown?: NavigationItem[];
  icon?: string;
  badge?: NavigationBadge;
  hidden?: boolean;
  page?: PageContent;
  seo?: SeoMeta;
  layout?: LayoutOptions;
  showInHeaderMenu?: boolean;
  showInMobileMenu?: boolean;
  showInFooterMenu?: boolean;
}
