<template>
  <div class="page-wrapper">
    <div class="page-content">
      <LandingHeaderV2 class="header" />

      <transition
        name="fade"
        mode="out-in">
        <div class="page page--inner"><slot /></div>
      </transition>

      <LandingFooterV2 class="footer" />
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

  .footer {
    position: relative;
    z-index: 1;
  }

  .page {
    //min-height: 100vh;
    flex: 1 0 auto;
    overflow: unset;
    position: relative;
    z-index: 1;

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

  .page--inner {
    min-height: 0;
    padding-top: 120px;
    padding-bottom: 56px;
    background: transparent;
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
