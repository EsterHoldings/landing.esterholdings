<template>
  <div class="page-wrapper">
    <div class="page-content">
      <LandingHeaderV2 class="header" />

      <transition
        name="fade"
        mode="out-in">
        <div class="page page--inner"><slot /></div>
      </transition>

      <LandingFooterV2 />
    </div>
  </div>
</template>

<script setup lang="ts">
  import LandingHeaderV2 from "~/components/block/LandingHeaderV2.vue";
  import LandingFooterV2 from "~/components/block/LandingFooterV2.vue";
</script>

<style lang="scss" scoped>
  .header {
    z-index: 9999;
  }

  .page {
    //min-height: 100vh;
    flex: 1 0 auto;
    overflow: unset;

    &-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100svh;
      overflow-x: hidden;
    }

    &-content {
      width: 100%;
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      background-color: var(--landing-bg);
      position: relative;
    }
  }

  .page--inner {
    min-height: 0;
    padding-top: 120px;
    padding-bottom: 56px;
    background: var(--landing-bg);
  }

  @media (max-width: 991px) {
    .page--inner {
      padding-top: 108px;
      padding-bottom: 40px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
