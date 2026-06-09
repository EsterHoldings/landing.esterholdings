<template>
  <div class="page-wrapper">
    <div class="page-content">
      <LandingHeaderV2 class="header" />
      <div
        class="page"
        :class="{ 'page--inner': !isHomePage }">
        <slot />
      </div>
      <LandingFooterV2 />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import LandingHeaderV2 from "~/components/block/LandingHeaderV2.vue";
  import LandingFooterV2 from "~/components/block/LandingFooterV2.vue";

  const route = useRoute();
  const isHomePage = computed(() => {
    const baseRouteName = route.name?.toString().split("___")[0];
    return baseRouteName === "index";
  });
</script>

<style lang="scss" scoped>
  .header {
    z-index: 9999;
  }

  .page {
    overflow: unset;

    &--inner {
      min-height: 100vh;
      padding-top: 120px;
      background: var(--landing-bg);
    }

    &-wrapper {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    &-content {
      width: 100%;
      background-color: var(--landing-bg);
      position: relative;
    }
  }

  @media (max-width: 991px) {
    .page--inner {
      padding-top: 108px;
    }
  }
</style>
