<template>
  <div class="panel-default">
    <div
      v-if="title.length > 0"
      class="panel-default__title">
      <div class="flex items-center justify-between w-full">
        <span>{{ props.title }}</span>
        <div>
          <slot name="title-extra"></slot>
        </div>
      </div>
    </div>
    <div class="panel-default__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    title: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
  });
</script>

<style scoped lang="scss">
  .panel-default {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    color: var(--landing-text-primary);
  }

  .panel-default__title {
    min-height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    font-weight: 700;
    color: var(--landing-text-primary);
    border-bottom: 0;
  }

  .panel-default__content {
    width: 100%;
    height: auto;
  }
</style>
