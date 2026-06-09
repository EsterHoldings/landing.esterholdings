<template>
  <FundingConditionsPage mode="withdrawal" />
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import FundingConditionsPage from "~/components/block/pages/FundingConditionsPage.vue";

  definePageMeta({
    layout: "main",
    alias: "/withdrawal-of-funds",
  });
</script>
