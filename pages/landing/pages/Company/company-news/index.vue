<template>
  <UiContainer>
    <div class="company-news">
      <UiTextH3 class="company-news_title">{{ t('landing.pages.company.news.title') }}</UiTextH3>

      <div class="company-news_wrapper">
        <NewsCard
          v-for="(card, index) in newsItems"
          :key="index"
          :image="card.src"
          :title="card.title"
          :message="card.subTitle"
          :date="card.time"
          :button-text="card.buttonText"
          :link="card.link" />
      </div>
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { definePageMeta } from '~/.nuxt/imports';
  import { useI18n } from 'vue-i18n';
  import UiContainer from '~/components/ui/UiContainer.vue';
  import UiTextH3 from '~/components/ui/UiTextH3.vue';
  import NewsCard from './components/NewsCard.vue';
  import useAppCore from '~/composables/useAppCore';
  import type { NewsItem } from '~/composables/core/modules/news/news.types';

  definePageMeta({
    layout: 'main',
    alias: '/company-news',
  });

  const { t } = useI18n();
  const appCore = useAppCore();
  const buttonText = t('landing.pages.company.news.button');

  const newsItems = ref<
    {
      src: string;
      title: string;
      subTitle: string;
      time: string;
      buttonText: string;
      link: string;
    }[]
  >([]);

  const mapToCard = (item: NewsItem) => ({
    src: item.image,
    title: item.title,
    subTitle: item.subtitle,
    time: item.publishedAt,
    buttonText,
    link: `/news/${item.slug}`,
  });

  const loadNews = async () => {
    const response = await appCore.news.getList({ page: 1, perPage: 10 });
    newsItems.value = response.data.data.map(mapToCard);
  };

  onMounted(() => {
    loadNews();
  });
</script>

<style lang="scss" scoped>
  .company-news {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &_title {
      color: var(--ui-text-main);
      text-align: center;
    }

    &_wrapper {
      display: flex;
      flex-direction: column;
      align-items: baseline;
      gap: 20px;
    }
  }
</style>
