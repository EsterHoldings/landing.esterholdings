import { useNuxtApp } from "#app";
import { decodeHtmlEntitiesDeep } from "~/utils/renderArticleContent";
import type {
  NewsArticleResponse,
  NewsArticleType,
  NewsItem,
  NewsLatestResponse,
  NewsListResponse,
  NewsSeo,
} from "./news.types";

interface ApiEnvelope<T> {
  data?: T;
}

interface ApiNewsArticle {
  id: string;
  article_type?: NewsArticleType | null;
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
    params: { page?: number; perPage?: number; locale?: string | null; articleType?: NewsArticleType } = {}
  ): Promise<{ data: NewsListResponse }> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 9;
    const response = await this.api<ApiEnvelope<ApiNewsListPayload>>(this.basePath(params.articleType), {
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

  async latest(
    params: { limit?: number; locale?: string | null; articleType?: NewsArticleType } = {}
  ): Promise<{ data: NewsLatestResponse }> {
    const limit = params.limit ?? 3;
    const response = await this.api<ApiEnvelope<ApiNewsLatestPayload>>(`${this.basePath(params.articleType)}/latest`, {
      query: this.cleanQuery({ limit, locale: params.locale }),
    });

    return {
      data: {
        data: this.normalizeArticles(response.data?.data),
      },
    };
  }

  async getBySlug(
    slug: string,
    params: { locale?: string | null; articleType?: NewsArticleType } = {}
  ): Promise<{ data: NewsArticleResponse }> {
    const response = await this.api<ApiEnvelope<ApiNewsArticle>>(
      `${this.basePath(params.articleType)}/${encodeURIComponent(slug)}`,
      {
        query: this.cleanQuery({ locale: params.locale }),
      }
    );

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
    const galleryImages = Array.isArray(item.gallery_images) ? item.gallery_images.filter(Boolean) : [];
    const seo = item.seo || {};

    return {
      id: item.id,
      articleType: item.article_type === "trader_blog" ? "trader_blog" : "news",
      slug: item.slug,
      urlPath: this.publicPathFromCanonical(seo.canonical_url),
      title: item.title,
      excerpt,
      subtitle: excerpt || "",
      content: item.content || null,
      locale: item.locale || "en",
      publishedAt: this.formatDate(publishedAtIso),
      publishedAtIso,
      image:
        item.cover_image_url ||
        seo.og_image_url ||
        seo.twitter_image_url ||
        galleryImages[0] ||
        this.extractFirstImage(item.content || "") ||
        fallbackImage,
      galleryImages,
      videoLinks: Array.isArray(item.video_links) ? item.video_links.filter(Boolean) : [],
      seo,
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

  private basePath(articleType: NewsArticleType = "news"): string {
    return articleType === "trader_blog" ? "/trader-blog" : "/news";
  }

  private publicPathFromCanonical(value: string | null | undefined): string | null {
    const canonical = String(value || "").trim();
    if (!canonical) return null;

    if (canonical.startsWith("/")) {
      return canonical;
    }

    try {
      const url = new URL(canonical);
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return null;
    }
  }

  private extractFirstImage(content: string): string | null {
    const decoded = decodeHtmlEntitiesDeep(content);
    const match = decoded.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
    return match?.[1] || null;
  }
}

export default NewsService;
