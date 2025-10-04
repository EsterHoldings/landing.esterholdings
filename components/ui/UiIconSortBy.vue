<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  orderDirectionEnabled: { type: Boolean, default: false },
  orderDirection: { type: String, default: 'desc' },
});

const isAsc  = computed(() => props.orderDirectionEnabled && props.orderDirection === 'asc');
const isDesc = computed(() => props.orderDirectionEnabled && props.orderDirection === 'desc');
</script>

<template>
  <svg
      :class="{ asc: isAsc, desc: isDesc }"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.033 16.8035V5.45537" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17.4308 13.3901L14.0327 16.804L10.6345 13.3901" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5.75903 3.19406V14.5422" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M2.36108 6.60749L5.75923 3.1936L9.15738 6.60749" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

svg.desc path:nth-child(1),
svg.desc path:nth-child(2) { stroke: var(--ui-primary-main); }

svg.asc path:nth-child(3),
svg.asc path:nth-child(4) { stroke: var(--ui-primary-main); }
</style>
