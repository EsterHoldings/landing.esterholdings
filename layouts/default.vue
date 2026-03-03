<template>
  <div class="default-layout">
    <slot />
  </div>
</template>

<style scoped>
  .default-layout {
    min-height: 100dvh;
    background: var(--ui-background);
  }
</style>
