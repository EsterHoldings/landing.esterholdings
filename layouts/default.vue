<template>
  <div class="container-fluid">
    <div class="page-wrapper">
      <TheHeaderSideBar />
      <UiImage class="bg-image" src="/space.gif" />
      <Transition name="fade" mode="out-in">
        <div class="page-content">
          <div class="page" :key="route.fullPath">
            <slot />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
// import TheHeaderSideBar from "~/components/block/TheHeaderSideBar.vue";

import TheHeaderSideBar from "~/components/block/!!!TheHeaderSideBar.vue";

import UiImage from "~/components/ui/UiImage.vue";
import TheFooter from "@/components/block/TheFooter.vue";
import HeaderMenu from "~/components/block/LandingHeader/components/HeaderMenu.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style lang="scss" scoped>
.bg-image {
  position: fixed;
  left: 0;
  top: 0;
  opacity: 1;
  z-index: -1;
}

.page {
  height: 100vh;
  overflow-y: auto;

  &-wrapper {
    display: flex;
    background-color: var(--color-ui-background);
    color: #b0b0b0;
    overflow: hidden;
  }

  &-content {
    width: 100%;
    overflow-y: scroll;
    height: 100vh;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
</style>
