<template>
  <FundingConditionsPage mode="deposit" />
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import FundingConditionsPage from "~/components/block/pages/FundingConditionsPage.vue";

  definePageMeta({
    layout: "main",
    alias: "/account-replenishment",
  });
</script>
