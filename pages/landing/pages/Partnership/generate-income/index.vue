<template>
  <PartnershipMaintenancePage />
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import PartnershipMaintenancePage from "~/components/block/pages/PartnershipMaintenancePage.vue";

  definePageMeta({
    layout: "main",
    alias: "/generate-income",
  });
</script>
