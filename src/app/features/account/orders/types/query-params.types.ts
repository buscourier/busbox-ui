export interface QueryParams {
  from: string;
  to: string;
  range: string;
  page: number;
  size: number;
  sortField: string | null;
  sortDirection: string | null;
}
