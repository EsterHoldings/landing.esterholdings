<template>
  <div class="faq-accordion">
    <div
      v-for="(item, index) in faqItems"
      :key="index"
      class="faq-item">
      <div
        class="faq-question"
        @click="toggleItem(index)">
        <h3 class="faq-title">{{ item.title }}</h3>
        <UiIconArrowDown :rotate180="item.isActive" />
      </div>

      <div
        class="faq-answer-collapse"
        :class="{ 'faq-answer-collapse--active': item.isActive }"
        :aria-hidden="!item.isActive">
        <div class="faq-answer">
          <p>{{ item.description }}</p>
        </div>
      </div>

      <div class="faq-divider"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType, ref, watch } from "vue";
  import UiIconArrowDown from "~/components/ui/UiIconArrowDown.vue";

  interface IFaqItem {
    title: string;
    description: string;
    isActive: boolean;
  }

  const props = defineProps({
    items: {
      type: Array as PropType<IFaqItem[]>,
      required: true,
    },
  });

  const faqItems = ref<IFaqItem[]>(props.items);

  watch(
    () => props.items,
    items => {
      faqItems.value = items;
    },
    { deep: true }
  );

  const toggleItem = (index: number) => {
    faqItems.value = faqItems.value.map((item, i) => ({
      ...item,
      isActive: i === index ? !item.isActive : false,
    }));
  };
</script>

<style lang="scss" scoped>
  .faq-accordion {
    display: flex;
    flex-direction: column;
    gap: 0;
    overflow-anchor: none;
  }

  .faq-item {
    width: 100%;
    max-width: 450px;

    @media (max-width: 991px) {
      max-width: none;
    }
  }

  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 12px 0;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  .faq-title {
    color: var(--ui-text-main);
    font-family: Muli, sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    flex: 1;
  }

  .faq-answer-collapse {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    overflow: hidden;
    visibility: hidden;
    transition:
      grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.28s ease,
      visibility 0s linear 0.45s;

    &--active {
      grid-template-rows: 1fr;
      opacity: 1;
      visibility: visible;
      transition:
        grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.28s ease,
        visibility 0s linear;
    }
  }

  .faq-answer {
    min-height: 0;
    overflow: hidden;

    p {
      padding: 0 0 16px;
      color: var(--ui-text-secondary);
      font-family: Muli, sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.4;
      margin: 0;
    }
  }

  .faq-divider {
    height: 1px;
    width: 100%;
    background: var(--color-stroke-ui-dark);
    margin: 12px 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .faq-answer-collapse,
    .faq-answer-collapse--active {
      transition-duration: 0.01ms;
    }
  }
</style>
