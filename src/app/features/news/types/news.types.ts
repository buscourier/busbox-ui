export interface NewsItem {
  news_id: string;
  title: string;
  image: string;
  short: string;
}

export interface NewsDetails extends NewsItem {
  text: string;
}
