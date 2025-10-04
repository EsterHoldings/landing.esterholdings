<script setup lang="ts">
const props = defineProps({
  heightNone: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
<div class="w-full flex items-center justify-center h-[40px]" :class="{'h-[4px]': heightNone}">
  <div class="bg-[var(--color-stroke-ui-light)] h-[1px] w-full"></div>
</div>
</template>

<style scoped lang="scss">
</style>