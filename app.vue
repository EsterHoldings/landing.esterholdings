<template>
  <NuxtLayout>
    <NuxtPage/>

    <ModalRightSideDefault ref="modalRef">
      <component :is="modalContent" v-bind="modalProps" :key="modalKey"/>
    </ModalRightSideDefault>

  </NuxtLayout>
</template>

<script lang="ts" setup>
import {useNuxtApp} from "nuxt/app";
import {ref, provide} from "vue";
import {onMounted, onUnmounted} from "vue";

import ModalRightSideDefault from "./components/block/modals/ModalRightSideDefault.vue";

const { $eventBus } = useNuxtApp();

const modalRef = ref();
const modalContent = ref(null);
const modalProps = ref({});
const modalKey = ref(0);

const openModal = (component: any, props = {}) => {
  modalContent.value = component;
  modalProps.value = props;
  modalKey.value++;
  modalRef.value?.openCloseModal();
};

const closeModal = () => modalRef.value?.closeModal()

provide("modalControl", {openModal, closeModal});

const handleGlobalClick = (event: MouseEvent) => {
  // console.log('START', event);
  // $eventBus.emit('qwerty', event)
  // console.log('END');
}

// onMounted(() => document.addEventListener("click", handleGlobalClick))
// onUnmounted(() => document.removeEventListener("click", handleGlobalClick))
</script>

<style lang="scss" scoped></style>
