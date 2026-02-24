<script setup lang="ts">
  import UiContainer from "~/components/ui/UiContainer.vue";
</script>

<template>
  <UiContainer>
    <div class="mt-2 mb-4 w-full flex justify-between items-center sm:mt-3 sm:mb-5">
      <slot name="header" />
    </div>

    <slot name="content" />
  </UiContainer>
</template>
