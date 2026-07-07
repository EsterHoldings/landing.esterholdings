<template>
  <WithdrawalOfFundsPage />
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import WithdrawalOfFundsPage from "~/components/block/pages/WithdrawalOfFundsPage.vue";

  definePageMeta({
    layout: "main",
    alias: "/withdrawal-of-funds",
  });
</script>
