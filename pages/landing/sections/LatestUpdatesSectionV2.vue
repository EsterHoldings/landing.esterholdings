<template>
  <section
    v-if="newsItems.length"
    class="updates-v2">
    <UiContainer>
      <h2>{{ t("landing.sections.latest_updates__title") }}</h2>
      <div class="cards">
        <NuxtLink
          class="card"
          v-for="(item, index) in newsItems"
          :key="item.slug || index"
          :to="localizedPath(`/news/${item.slug}`)">
          <img
            :src="item.src"
            alt="" />
          <div class="body">
            <h3>{{ item.title }}</h3>
            <p>{{ item.subTitle }}</p>
            <time>{{ item.time }}</time>
          </div>
        </NuxtLink>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";
  import { useAsyncData } from "#app";
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import useAppCore from "~/composables/useAppCore";
  import type { NewsItem } from "~/composables/core/modules/news/news.types";

  const { t, locale } = useI18n();
  const appCore = useAppCore();

  const { data: latestNews, refresh } = await useAsyncData("landing-latest-news", async () => {
    const response = await appCore.news.getLatest({ limit: 3, locale: locale.value });
    return response.data.data;
  });

  const mapToCard = (item: NewsItem) => ({
    slug: item.slug,
    src: item.image,
    title: item.title,
    subTitle: item.subtitle,
    time: item.publishedAt,
  });

  const newsItems = computed(() => (latestNews.value || []).map(mapToCard));

  function localizedPath(path: string): string {
    return locale.value ? `/${locale.value}${path}` : path;
  }

  watch(locale, () => {
    void refresh();
  });
</script>

<style lang="scss" scoped>
  .updates-v2 {
    margin-top: 160px;

    h2 {
      margin: 0;
      color: var(--landing-text-primary);
      font-size: 42px;
      line-height: 1.302;
      font-weight: 500;
    }

    .cards {
      margin-top: 34px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }

    .card {
      border: 6px solid var(--landing-border-strong);
      border-radius: 20px;
      overflow: hidden;
      background: linear-gradient(-32deg, var(--landing-surface) 12%, var(--landing-surface-muted) 89%);
      display: flex;
      flex-direction: column;
      color: inherit;
      text-decoration: none;

      img {
        width: 100%;
        height: 242px;
        object-fit: cover;
        display: block;
      }

      .body {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      h3 {
        margin: 0;
        color: var(--landing-text-primary);
        font-size: 22px;
        line-height: 1.302;
        font-weight: 700;
      }

      p {
        margin: 10px 0 0;
        color: var(--landing-text-secondary);
        font-size: 14px;
        line-height: 1.302;
        font-weight: 500;
      }

      time {
        margin-top: 30px;
        display: block;
        color: var(--landing-text-secondary);
        font-size: 14px;
        line-height: 1.302;
        font-weight: 700;
      }
    }
  }

  @media (max-width: 991px) {
    .updates-v2 {
      margin-top: 56px;

      h2 {
        font-size: 34px;
      }

      .cards {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
