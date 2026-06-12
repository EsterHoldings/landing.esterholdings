<template>
  <CompanyNewsPage
    article-type="trader_blog"
    :locale-override="legacyLocale"
    :initial-page="legacyPage"
    title-key="landing.pages.trading.traders_blog_title"
    title-fallback="Trader Blog"
    subtitle-key="landing.pages.trading.traders_blog_subtitle"
    subtitle-fallback="Practical market insights, trading education and platform materials for traders."
    empty-key="landing.pages.trading.traders_blog_empty"
    empty-fallback="No trader blog posts published yet."
    detail-base-path="/trader-blog"
    async-key="legacy-trader-blog-category" />
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "#app";
  import CompanyNewsPage from "~/components/block/pages/CompanyNewsPage.vue";

  const route = useRoute();
  const legacyLocale = computed(() => {
    const prefix = String(route.path.split("/").filter(Boolean)[0] || "en").toLowerCase();
    return prefix === "ua" ? "uk" : prefix;
  });
  const legacyPage = computed(() => {
    const match = route.path.match(/\/page\/(\d+)\/?$/i);
    return Math.max(1, Number(match?.[1]) || 1);
  });
</script>
