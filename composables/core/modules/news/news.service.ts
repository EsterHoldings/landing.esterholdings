import type { NewsItem, NewsLatestResponse, NewsListResponse } from "./news.types";

const mockNewsItems: NewsItem[] = [
  {
    id: "1",
    slug: "trading-sessions-april-2023",
    title: "Trading Sessions for April 2023",
    subtitle: "Holiday hours and schedule updates for major exchanges.",
    publishedAt: "Apr 02, 2023",
    image: "/static/newsBg.jpg",
  },
  {
    id: "2",
    slug: "new-liquidity-providers",
    title: "New Liquidity Providers Connected",
    subtitle: "Tighter spreads and deeper books across key FX pairs.",
    publishedAt: "Mar 18, 2023",
    image: "/static/market-newsBg.jpg",
  },
  {
    id: "3",
    slug: "platform-update-q2",
    title: "Platform Update Q2",
    subtitle: "Performance improvements and a refreshed trading terminal.",
    publishedAt: "Mar 05, 2023",
    image: "/static/trader's-blogBg.jpg",
  },
  {
    id: "4",
    slug: "security-audit-complete",
    title: "Security Audit Completed",
    subtitle: "Independent audit confirms strengthened infrastructure.",
    publishedAt: "Feb 21, 2023",
    image: "/static/aboutCompany.jpeg",
  },
  {
    id: "5",
    slug: "new-account-types",
    title: "New Account Types Launched",
    subtitle: "Choose plans tailored for active and long-term traders.",
    publishedAt: "Feb 01, 2023",
    image: "/static/standardBgCard.jpeg",
  },
];

export class NewsService {
  async list(params: { page?: number; perPage?: number } = {}): Promise<{ data: NewsListResponse }> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? mockNewsItems.length;
    const start = (page - 1) * perPage;
    const items = mockNewsItems.slice(start, start + perPage);

    return Promise.resolve({
      data: {
        data: items,
        meta: {
          page,
          perPage,
          total: mockNewsItems.length,
        },
      },
    });
  }

  async latest(params: { limit?: number } = {}): Promise<{ data: NewsLatestResponse }> {
    const limit = params.limit ?? 3;
    return Promise.resolve({
      data: {
        data: mockNewsItems.slice(0, limit),
      },
    });
  }
}

export default NewsService;
