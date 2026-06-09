<template>
  <CompanyNewsPage
    article-type="trader_blog"
    title-key="landing.pages.trading.traders_blog_title"
    title-fallback="Trader Blog"
    subtitle-key="landing.pages.trading.traders_blog_subtitle"
    subtitle-fallback="Practical market insights, trading education and platform materials for traders."
    empty-key="landing.pages.trading.traders_blog_empty"
    empty-fallback="No trader blog posts published yet."
    detail-base-path="/trader-blog"
    async-key="trader-blog-page" />
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import CompanyNewsPage from "~/components/block/pages/CompanyNewsPage.vue";

  definePageMeta({
    layout: "main",
    alias: ["/trader's-blog", "/trader-blog"],
  });
</script>
