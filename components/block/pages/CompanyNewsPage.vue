<template>
  <UiContainer>
    <div class="company-news">
      <div class="company-news__head">
        <UiTextH3 class="company-news_title">{{ pageTitle }}</UiTextH3>
        <p class="company-news__lead">
          {{ pageSubtitle }}
        </p>
      </div>

      <div
        v-if="newsItems.length"
        class="company-news_wrapper">
        <NewsCard
          v-for="card in newsItems"
          :key="card.id"
          :image="card.image"
          :title="card.title"
          :message="card.subtitle"
          :date="card.publishedAt"
          :button-text="buttonText"
          :link="articlePath(card)" />
      </div>

      <div
        v-else
        class="company-news__empty">
        {{ emptyText }}
      </div>

      <button
        v-if="hasMore"
        type="button"
        class="company-news__load-more"
        :disabled="isLoadingMore"
        @click="loadMore">
        {{
          isLoadingMore
            ? loadingText
            : loadMoreText
        }}
      </button>
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useAsyncData } from "#app";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import UiTextH3 from "~/components/ui/UiTextH3.vue";
  import NewsCard from "~/pages/landing/pages/Company/company-news/components/NewsCard.vue";
  import useAppCore from "~/composables/useAppCore";
  import type { NewsArticleType, NewsItem, NewsListResponse } from "~/composables/core/modules/news/news.types";

  const PAGE_SIZE = 9;

  const props = withDefaults(
    defineProps<{
      articleType?: NewsArticleType;
      titleKey?: string;
      titleFallback?: string;
      subtitleKey?: string;
      subtitleFallback?: string;
      emptyKey?: string;
      emptyFallback?: string;
      detailBasePath?: string;
      asyncKey?: string;
      localeOverride?: string | null;
      initialPage?: number;
    }>(),
    {
      articleType: "news",
      titleKey: "landing.pages.company.news.title",
      titleFallback: "Company news",
      subtitleKey: "landing.pages.company.news.subtitle",
      subtitleFallback: "Company updates, platform news and important announcements.",
      emptyKey: "landing.pages.company.news.empty",
      emptyFallback: "No company news published yet.",
      detailBasePath: "/news",
      asyncKey: "company-news-page",
      localeOverride: null,
      initialPage: 1,
    }
  );

  const { t, locale } = useI18n();
  const appCore = useAppCore();
  const buttonText = computed(() => t("landing.pages.company.news.button"));
  const pageTitle = computed(() => t(props.titleKey, props.titleFallback));
  const pageSubtitle = computed(() => t(props.subtitleKey, props.subtitleFallback));
  const emptyText = computed(() => t(props.emptyKey, props.emptyFallback));
  const loadingText = computed(() => t("landing.pages.company.news.loading", "Loading..."));
  const loadMoreText = computed(() => t("landing.pages.company.news.load_more", "Загрузить еще"));
  const detailBasePath = computed(() => props.detailBasePath.replace(/\/$/, ""));
  const effectiveLocale = computed(() => props.localeOverride || locale.value);
  const effectiveInitialPage = computed(() => Math.max(1, Number(props.initialPage) || 1));
  const currentPage = ref(effectiveInitialPage.value);
  const isLoadingMore = ref(false);
  const newsItems = ref<NewsItem[]>([]);
  const meta = ref<NewsListResponse["meta"]>({
    page: 1,
    perPage: PAGE_SIZE,
    total: 0,
    lastPage: 1,
  });

  const { data: initialPayload, refresh } = await useAsyncData(`${props.asyncKey}-${effectiveLocale.value}-${effectiveInitialPage.value}`, async () => {
    const response = await appCore.news.getList({
      page: effectiveInitialPage.value,
      perPage: PAGE_SIZE,
      locale: effectiveLocale.value,
      articleType: props.articleType,
    });
    return response.data;
  });

  const hasMore = computed(() => newsItems.value.length < meta.value.total);

  function localizedPath(path: string): string {
    return effectiveLocale.value ? `/${effectiveLocale.value}${path}` : path;
  }

  function articlePath(article: NewsItem): string {
    return article.urlPath || localizedPath(`${detailBasePath.value}/${article.slug}`);
  }

  async function loadMore(): Promise<void> {
    if (isLoadingMore.value || !hasMore.value) return;

    isLoadingMore.value = true;
    try {
      const nextPage = currentPage.value + 1;
      const response = await appCore.news.getList({
        page: nextPage,
        perPage: PAGE_SIZE,
        locale: effectiveLocale.value,
        articleType: props.articleType,
      });
      newsItems.value = [...newsItems.value, ...response.data.data];
      meta.value = response.data.meta;
      currentPage.value = nextPage;
    } finally {
      isLoadingMore.value = false;
    }
  }

  watch(
    initialPayload,
    value => {
      newsItems.value = value?.data || [];
      meta.value = value?.meta || meta.value;
      currentPage.value = effectiveInitialPage.value;
    },
    { immediate: true }
  );

  watch([effectiveLocale, effectiveInitialPage], async () => {
    currentPage.value = effectiveInitialPage.value;
    await refresh();
  });
</script>

<style lang="scss" scoped>
  .company-news {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 42px 0 72px;

    &__head {
      max-width: 760px;
      margin: 0 auto;
      text-align: center;
    }

    &_title {
      color: var(--landing-text-primary);
      margin: 0;
    }

    &__lead {
      margin: 12px 0 0;
      color: var(--landing-text-secondary);
      font-size: 16px;
      line-height: 1.55;
    }

    &_wrapper {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      align-items: stretch;
    }

    &__empty {
      min-height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--landing-border-strong);
      border-radius: 8px;
      color: var(--landing-text-secondary);
      background: var(--landing-surface-glass);
    }

    &__load-more {
      align-self: center;
      min-width: 190px;
      height: 48px;
      padding: 0 24px;
      border: 0;
      border-radius: 8px;
      color: var(--landing-on-accent);
      background: var(--landing-accent);
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      transition:
        opacity 0.2s ease,
        transform 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      &:disabled {
        cursor: default;
        opacity: 0.65;
      }
    }
  }

  @media (max-width: 991px) {
    .company-news {
      padding: 28px 0 52px;

      &_wrapper {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  }

  @media (max-width: 640px) {
    .company-news {
      &_wrapper {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
