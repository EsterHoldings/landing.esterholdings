<template>
  <img
    class="logo-flat"
    :src="logoFlat"
    alt="Ester" />
</template>

<script setup lang="ts">
  import logoFlat from "~/assets/brand/ester-logo-flat.png";
</script>

<style lang="scss" scoped>
  .logo-flat {
    display: block;
    width: 118px;
    height: auto;
    max-width: 100%;
    object-fit: contain;
  }
</style>
