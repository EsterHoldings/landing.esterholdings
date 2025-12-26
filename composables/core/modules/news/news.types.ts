export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  image: string;
}

export interface NewsListResponse {
  data: NewsItem[];
  meta: {
    page: number;
    perPage: number;
    total: number;
  };
}

export interface NewsLatestResponse {
  data: NewsItem[];
}
