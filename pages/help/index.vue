<template>
  <main class="help-page">
    <FAQsSectionV2
      :limit="0"
      :show-help-link="false" />
  </main>
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import FAQsSectionV2 from "~/pages/landing/sections/FAQsSectionV2.vue";

  definePageMeta({
    layout: "main-v2",
  });
</script>

<style scoped lang="scss">
  .help-page {
    min-height: 100vh;
    background: var(--landing-bg);
    padding-top: 1px;
  }
</style>
