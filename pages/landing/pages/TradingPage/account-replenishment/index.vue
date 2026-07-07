<template>
  <AccountReplenishmentPage />
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import AccountReplenishmentPage from "~/components/block/pages/AccountReplenishmentPage.vue";

  definePageMeta({
    layout: "main",
    alias: "/account-replenishment",
  });
</script>
