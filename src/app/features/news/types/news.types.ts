export interface NewsItem {
  id: string;
  title: string;
  image: string;
}

export interface NewsDetails extends NewsItem {
  text: string;
}
