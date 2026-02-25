<template>
  <ul class="breadcrumb">
    <li
      v-for="(item, index) in list"
      :key="item.name + index"
      class="breadcrumb__item">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="breadcrumb__link"
        :aria-label="item.name">
        <component
          v-if="item.icon"
          :is="item.icon"
          class="breadcrumb__icon" />
        <span
          v-else
          class="breadcrumb__text"
          >{{ item.name }}</span
        >
      </NuxtLink>
      <span
        v-else
        class="breadcrumb__link"
        :aria-label="item.name">
        <component
          v-if="item.icon"
          :is="item.icon"
          class="breadcrumb__icon" />
        <span
          v-else
          class="breadcrumb__text"
          >{{ item.name }}</span
        >
      </span>
      <UiIconArrowRightShort
        v-if="index + 1 !== list.length"
        class="breadcrumb__sep" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import UiIconArrowRightShort from "~/components/ui/UiIconArrowRightShort.vue";

  type BreadcrumbItem = {
    name: string;
    to?: string;
    icon?: any;
  };

  defineProps<{
    list: BreadcrumbItem[];
  }>();
</script>

<style lang="scss" scoped>
  .breadcrumb {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    margin: 0;
    min-width: 0;
    max-width: 100%;
    color: var(--ui-text-secondary);
    font-size: 13px;

    &__item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      min-width: 0;
      max-width: 100%;
    }

    &__link {
      color: inherit;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      min-width: 0;
      max-width: 100%;
    }

    &__link:hover {
      color: var(--ui-text-main);
    }

    &__sep {
      color: var(--ui-text-secondary);
    }

    &__icon {
      width: 16px;
      height: 16px;
      display: inline-flex;
    }

    &__text {
      display: block;
      min-width: 0;
      max-width: 100%;
    }
  }

  @media (max-width: 767px) {
    .breadcrumb {
      overflow: hidden;
    }

    .breadcrumb__item:last-child {
      flex: 1 1 auto;
      min-width: 0;
    }

    .breadcrumb__item:last-child .breadcrumb__link {
      width: 100%;
      min-width: 0;
    }

    .breadcrumb__item:last-child .breadcrumb__text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
