<template>
  <LandingMt4Page mode="mobile" />
</template>

<script setup lang="ts">
  import { definePageMeta } from "~/.nuxt/imports";
  import LandingMt4Page from "~/components/block/pages/LandingMt4Page.vue";

  definePageMeta({
    layout: "main",
    alias: "/mt-4-mobile",
  });
</script>
