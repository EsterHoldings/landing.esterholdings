<template>
  <CompanyNewsPage />
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import CompanyNewsPage from "~/components/block/pages/CompanyNewsPage.vue";

  definePageMeta({
    layout: "main",
  });
</script>
