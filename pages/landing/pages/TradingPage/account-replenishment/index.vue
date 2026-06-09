<template>
  <LandingStaticPage
    :title="t('landing.pages.trading.account_replenishment_title')"
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
    alias: '/account-replenishment',
  });

  const { t, locale } = useI18n();
  const content = computed(() => getStaticPageContent("accountReplenishment", locale.value));
</script>
