import NewsService from "./news.service";
import type { NewsArticleResponse, NewsArticleType, NewsLatestResponse, NewsListResponse } from "./news.types";

export class NewsModule {
  private newsService: NewsService;

  constructor() {
    this.newsService = new NewsService();
  }

  async getList(
    params: { page?: number; perPage?: number; locale?: string | null; articleType?: NewsArticleType } = {}
  ): Promise<{ data: NewsListResponse }> {
    return await this.newsService.list(params);
  }

  async getLatest(
    params: { limit?: number; locale?: string | null; articleType?: NewsArticleType } = {}
  ): Promise<{ data: NewsLatestResponse }> {
    return await this.newsService.latest(params);
  }

  async getBySlug(
    slug: string,
    params: { locale?: string | null; articleType?: NewsArticleType; legacyPath?: string | null } = {}
  ): Promise<{ data: NewsArticleResponse }> {
    return await this.newsService.getBySlug(slug, params);
  }
}

export default NewsModule;
