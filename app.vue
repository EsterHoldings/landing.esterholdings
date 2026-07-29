<template>
  <NuxtLayout>
    <ModalRightSideDefault ref="modalRef">
      <component
        :is="modalContent"
        v-bind="modalProps"
        :key="modalKey" />
    </ModalRightSideDefault>

    <VitePwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
  import { ref, provide, computed } from "vue";
  import { useHead } from "#imports";

  import ModalRightSideDefault from "./components/block/modals/ModalRightSideDefault.vue";
  import useLandingSeo from "./composables/useLandingSeo";
  import {
    buildThemeInitScript,
    DARK_BROWSER_THEME_COLOR,
    LIGHT_BROWSER_THEME_COLOR,
  } from "./composables/theme/theme.shared";
  import { useThemeStore } from "./stores/themeStore";

  import "vue-draggable-resizable/style.css";

  const modalRef = ref();
  const modalContent = ref(null);
  const modalProps = ref({});
  const modalKey = ref(0);
  const themeStore = useThemeStore();
  const browserThemeColor = computed(() =>
    themeStore.currentTheme === "dark" ? DARK_BROWSER_THEME_COLOR : LIGHT_BROWSER_THEME_COLOR
  );
  const themeInitScript = buildThemeInitScript();

  await useLandingSeo();

  const openModal = (component: any, props = {}) => {
    modalContent.value = component;
    modalProps.value = props;
    modalKey.value++;
    modalRef.value?.openModal();
  };

  const closeModal = () => modalRef.value?.closeModal();

  provide("modalControl", { openModal, closeModal });

  useHead(() => ({
    htmlAttrs: {
      "data-theme": themeStore.currentTheme,
      style: `color-scheme: ${themeStore.currentTheme};`,
    },
    meta: [
      { name: "theme-color", content: browserThemeColor.value },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: themeStore.currentTheme === "dark" ? "black" : "default",
      },
    ],
    script: [
      {
        key: "theme-init",
        tagPosition: "head",
        children: themeInitScript,
      },
    ],
  }));
</script>

<style lang="scss" scoped></style>

<style lang="scss"></style>
