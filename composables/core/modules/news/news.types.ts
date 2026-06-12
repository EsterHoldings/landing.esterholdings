export type NewsArticleType = "news" | "trader_blog";

export interface NewsItem {
  id: string;
  articleType: NewsArticleType;
  slug: string;
  urlPath: string | null;
  title: string;
  excerpt: string | null;
  subtitle: string;
  content: string | null;
  locale: string;
  publishedAt: string;
  publishedAtIso: string | null;
  image: string;
  galleryImages: string[];
  videoLinks: string[];
  seo: NewsSeo;
  updatedAt: string | null;
}

export interface NewsSeo {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[];
  canonical_url?: string | null;
  robots?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image_url?: string | null;
  schema_type?: string | null;
}

export interface NewsListResponse {
  data: NewsItem[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
    locale?: string | null;
  };
}

export interface NewsLatestResponse {
  data: NewsItem[];
}

export interface NewsArticleResponse {
  data: NewsItem | null;
}
