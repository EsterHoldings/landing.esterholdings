<template>
  <LandingStaticPage
    :title="t('landing.pages.trading.trading_conditions_title')"
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
    alias: '/trading-conditions',
  });

  const { t, locale } = useI18n();
  const content = computed(() => getStaticPageContent("tradingConditions", locale.value));
</script>
