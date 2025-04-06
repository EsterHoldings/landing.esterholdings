<template>
  <div class="page__wrapper">
    <TheCabinetSideBar/>
    <transition name="fade" mode="out-in">
      <div class="page" :key="$route.fullPath">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import TheCabinetSideBar from "~/components/block/TheCabinetSideBar.vue";
</script>

<style lang="scss" scoped>
.page__wrapper {
  background-color: var(--color-ui-background);
}

.page {
  width: 100%;
  height: 100vh;
  color: white;
  padding: 40px 40px 40px 240px;
  overflow-y: scroll;
  overflow-x: hidden;
}

/* Коли з'являється нова сторінка (enter) – плавне підвищення непрозорості */
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.5s ease; /* або інший час/тип анімації */
}
.fade-enter-to {
  opacity: 1;
}

/* Коли йде стара сторінка (leave) – немає анімації, зникає миттєво */
.fade-leave, .fade-leave-active, .fade-leave-to {
  opacity: 1;
  transition: none;
}
</style>