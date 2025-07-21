export interface NewsItemResponse {
  news_id: string;
  on_top: string;
  title: string;
  image: string;
}

export interface NewsDetailsResponse extends NewsItemResponse {
  text: string;
}
