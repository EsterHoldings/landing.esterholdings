<template>
  <div>Dashboard</div>
</template>

<script lang="ts" setup>
import {definePageMeta} from "~/.nuxt/imports";

definePageMeta({ layout: "cabinet", middleware: ["auth-client"] });
</script>

<style lang="scss" scoped>

</style>