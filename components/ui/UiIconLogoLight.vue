<template>
  <svg
    class="logo-flat"
    width="90"
    height="40"
    viewBox="0 0 90 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Ester">
    <image
      :href="logoMark"
      width="49.4811"
      height="40"
      preserveAspectRatio="none" />
    <image
      :href="logoName"
      x="41.1501"
      y="21.8987"
      width="48.8499"
      height="15.443"
      preserveAspectRatio="none" />
  </svg>
</template>

<script setup lang="ts">
  import logoMark from "~/assets/landing/banner-v2/logo-mark.png";
  import logoName from "~/assets/landing/banner-v2/logo-name.png";
</script>

<style lang="scss" scoped>
  .logo-flat {
    display: block;
    width: 90px;
    height: 40px;
  }
</style>
