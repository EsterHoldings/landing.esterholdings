<template>
  <div
    class="inner-city-bg"
    aria-hidden="true">
    <component
      :is="cityBackgroundComponent"
      class="inner-city-bg__illustration" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useThemeStore } from "~/stores/themeStore";
  import UiCabinetCityBackground from "~/components/ui/UiCabinetCityBackground.vue";
  import UiHomeBannerV2 from "~/components/ui/UiHomeBannerV2.vue";

  const themeStore = useThemeStore();

  const cityBackgroundComponent = computed(() =>
    themeStore.currentTheme === "dark" ? UiCabinetCityBackground : UiHomeBannerV2
  );
</script>

<style scoped lang="scss">
  .inner-city-bg {
    position: fixed;
    top: calc(92px + env(safe-area-inset-top, 0px));
    right: 0;
    bottom: 0;
    z-index: 0;
    width: min(42vw, 620px);
    min-width: 280px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    opacity: 0.18;
    pointer-events: none;
    filter: drop-shadow(0 24px 60px color-mix(in srgb, var(--ui-primary-main) 16%, transparent));
    transition:
      opacity 0.2s ease,
      filter 0.2s ease;
  }

  .inner-city-bg__illustration {
    width: 100%;
    height: 100%;
    max-height: 100%;
    opacity: 0.96;
  }

  .inner-city-bg :deep(.cabinet-city-svg),
  .inner-city-bg :deep(svg) {
    width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: right bottom;
  }

  :global(:root[data-theme="dark"]) .inner-city-bg {
    opacity: 0.2;
  }

  @media (max-width: 991px) {
    .inner-city-bg {
      top: calc(78px + env(safe-area-inset-top, 0px));
      right: -64px;
      width: min(68vw, 460px);
      min-width: 300px;
      opacity: 0.13;
    }

    :global(:root[data-theme="dark"]) .inner-city-bg {
      opacity: 0.16;
    }
  }

  @media (max-width: 575px) {
    .inner-city-bg {
      right: -120px;
      width: 360px;
      min-width: 360px;
      opacity: 0.1;
    }

    :global(:root[data-theme="dark"]) .inner-city-bg {
      opacity: 0.12;
    }
  }
</style>
