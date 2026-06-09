<template>
  <div class="page-wrapper">
    <div class="page-content">
      <LandingHeaderV2 class="header" />
      <LandingInnerCityBackground v-if="!isHomePage" />
      <div
        class="page"
        :class="{ 'page--inner': !isHomePage }">
        <slot />
      </div>
      <LandingFooterV2 class="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import LandingHeaderV2 from "~/components/block/LandingHeaderV2.vue";
  import LandingFooterV2 from "~/components/block/LandingFooterV2.vue";
  import LandingInnerCityBackground from "~/components/block/LandingInnerCityBackground.vue";

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

  .footer {
    position: relative;
    z-index: 1;
  }

  .page {
    flex: 1 0 auto;
    overflow: unset;
    position: relative;
    z-index: 1;

    &--inner {
      min-height: 0;
      padding-top: 120px;
      padding-bottom: 56px;
      background: transparent;
    }

    &-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100svh;
    }

    &-content {
      width: 100%;
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      background-color: var(--landing-bg);
      position: relative;
      isolation: isolate;
    }
  }

  @media (max-width: 991px) {
    .page--inner {
      padding-top: 108px;
      padding-bottom: 40px;
    }
  }
</style>
