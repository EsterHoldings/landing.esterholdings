import type { Ref } from "vue";
import { useState } from "#app";
import type { NewsArticleType, NewsItem } from "~/composables/core/modules/news/news.types";

const NEWS_NAVIGATION_STORAGE_KEY = "ester:news-navigation-cache";

export interface NewsNavigationCacheEntry {
  key: string;
  article: NewsItem;
}

export function createNewsNavigationCacheKey(articleType: NewsArticleType, locale: string, slug: string): string {
  return `${articleType}:${locale}:${slug}`;
}

export function useNewsNavigationCache(): Ref<NewsNavigationCacheEntry | null> {
  const cache = useState<NewsNavigationCacheEntry | null>("news-navigation-cache", () => null);

  if (import.meta.client && !cache.value) {
    try {
      const storedEntry = sessionStorage.getItem(NEWS_NAVIGATION_STORAGE_KEY);
      cache.value = storedEntry ? (JSON.parse(storedEntry) as NewsNavigationCacheEntry) : null;
    } catch {
      sessionStorage.removeItem(NEWS_NAVIGATION_STORAGE_KEY);
    }
  }

  return cache;
}

export function setNewsNavigationCache(
  cache: Ref<NewsNavigationCacheEntry | null>,
  entry: NewsNavigationCacheEntry
): void {
  cache.value = entry;

  if (import.meta.client) {
    try {
      sessionStorage.setItem(NEWS_NAVIGATION_STORAGE_KEY, JSON.stringify(entry));
    } catch {
      // The in-memory cache still covers normal client-side navigation.
    }
  }
}
