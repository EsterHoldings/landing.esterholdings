<template>
  <CompanyNewsPage
    :locale-override="legacyLocale"
    :initial-page="legacyPage" />
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
