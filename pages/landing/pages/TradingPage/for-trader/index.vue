<template>
  <LandingStaticPage
    :title="t('landing.pages.trading.for_trader_title')"
    :content="content" />
</template>

<script setup lang="ts">
  import { definePageMeta } from '~/.nuxt/imports';
  import { useI18n } from 'vue-i18n';
  import { computed } from "vue";
  import LandingStaticPage from "~/components/block/pages/LandingStaticPage.vue";
  import { getStaticPageContent } from "~/components/block/pages/staticPageContent";

  definePageMeta({
    layout: 'main',
    alias: '/for-trader',
  });

  const { t, locale } = useI18n();
  const content = computed(() => getStaticPageContent("forTrader", locale.value));
</script>
