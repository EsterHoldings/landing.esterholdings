import { useNuxtApp } from "#app";
import type { NewsArticleResponse, NewsItem, NewsLatestResponse, NewsListResponse, NewsSeo } from "./news.types";

interface ApiEnvelope<T> {
  data?: T;
}

interface ApiNewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  locale?: string | null;
  cover_image_url?: string | null;
  gallery_images?: string[] | null;
  video_links?: string[] | null;
  published_at?: string | null;
  seo?: NewsSeo | null;
  updated_at?: string | null;
}

interface ApiNewsListPayload {
  data?: ApiNewsArticle[];
  meta?: NewsListResponse["meta"];
}

interface ApiNewsLatestPayload {
  data?: ApiNewsArticle[];
}

const fallbackImage = "/static/newsBg.jpg";

export class NewsService {
  async list(
    params: { page?: number; perPage?: number; locale?: string | null } = {}
  ): Promise<{ data: NewsListResponse }> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 9;
    const response = await this.api<ApiEnvelope<ApiNewsListPayload>>("/news", {
      query: this.cleanQuery({ page, perPage, locale: params.locale }),
    });
    const payload = response.data || {};

    return {
      data: {
        data: this.normalizeArticles(payload.data),
        meta: {
          page: payload.meta?.page ?? page,
          perPage: payload.meta?.perPage ?? perPage,
          total: payload.meta?.total ?? 0,
          lastPage: payload.meta?.lastPage ?? 1,
          locale: payload.meta?.locale ?? params.locale ?? null,
        },
      },
    };
  }

  async latest(params: { limit?: number; locale?: string | null } = {}): Promise<{ data: NewsLatestResponse }> {
    const limit = params.limit ?? 3;
    const response = await this.api<ApiEnvelope<ApiNewsLatestPayload>>("/news/latest", {
      query: this.cleanQuery({ limit, locale: params.locale }),
    });

    return {
      data: {
        data: this.normalizeArticles(response.data?.data),
      },
    };
  }

  async getBySlug(slug: string, params: { locale?: string | null } = {}): Promise<{ data: NewsArticleResponse }> {
    const response = await this.api<ApiEnvelope<ApiNewsArticle>>(`/news/${encodeURIComponent(slug)}`, {
      query: this.cleanQuery({ locale: params.locale }),
    });

    return {
      data: {
        data: response.data ? this.normalizeArticle(response.data) : null,
      },
    };
  }

  private api<T>(url: string, options: Record<string, any> = {}): Promise<T> {
    const nuxtApp = useNuxtApp() as unknown as {
      $api: (request: string, opts?: Record<string, any>) => Promise<T>;
    };
    return (nuxtApp.$api as (request: string, opts?: Record<string, any>) => Promise<T>)(url, options);
  }

  private cleanQuery(query: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
  }

  private normalizeArticles(items: ApiNewsArticle[] | null | undefined): NewsItem[] {
    return Array.isArray(items) ? items.map(item => this.normalizeArticle(item)) : [];
  }

  private normalizeArticle(item: ApiNewsArticle): NewsItem {
    const publishedAtIso = item.published_at || item.updated_at || null;
    const excerpt = item.excerpt || null;

    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt,
      subtitle: excerpt || "",
      content: item.content || null,
      locale: item.locale || "en",
      publishedAt: this.formatDate(publishedAtIso),
      publishedAtIso,
      image: item.cover_image_url || fallbackImage,
      galleryImages: Array.isArray(item.gallery_images) ? item.gallery_images.filter(Boolean) : [],
      videoLinks: Array.isArray(item.video_links) ? item.video_links.filter(Boolean) : [],
      seo: item.seo || {},
      updatedAt: item.updated_at || null,
    };
  }

  private formatDate(value: string | null): string {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }
}

export default NewsService;
