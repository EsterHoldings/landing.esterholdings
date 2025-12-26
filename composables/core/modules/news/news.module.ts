import NewsService from "./news.service";
import type { NewsLatestResponse, NewsListResponse } from "./news.types";

export class NewsModule {
  private newsService: NewsService;

  constructor() {
    this.newsService = new NewsService();
  }

  async getList(params: { page?: number; perPage?: number } = {}): Promise<{ data: NewsListResponse }> {
    return await this.newsService.list(params);
  }

  async getLatest(params: { limit?: number } = {}): Promise<{ data: NewsLatestResponse }> {
    return await this.newsService.latest(params);
  }
}

export default NewsModule;
