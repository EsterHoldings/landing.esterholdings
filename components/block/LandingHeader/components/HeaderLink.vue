<template>
  <div
    class="header__link"
    :class="linkClass">
    <UiTextH5 :class="textClass">{{ props.name }}</UiTextH5>

    <UiIconChevronDown
      class="header__chevron"
      :class="iconClass" />
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import UiIconChevronDown from "~/components/ui/UiIconChevronDown.vue";
  import UiTextH5 from "~/components/ui/UiTextH5.vue";

  const props = defineProps({
    name: String,
    linkKey: String,
    activeLink: String,
    isInvertColor: Boolean,
  });

  const isActive = computed(() => props.linkKey === props.activeLink);

  const linkClass = computed(() => ({
    "active-link": isActive.value,
  }));

  const textClass = computed(() => ({
    "active-link": isActive.value,
    "is-theme-light": props.isInvertColor,
    "is-theme-default": !props.isInvertColor,
  }));

  const iconClass = computed(() => ({
    "header__chevron--active": isActive.value,
    "active-link": isActive.value,
    "svg-fill": props.isInvertColor,
  }));
</script>

<style lang="scss" scoped>
  .header__link {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--landing-text-primary);
    text-decoration: none;
    cursor: pointer;
    transition:
      color 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      color: var(--landing-accent-secondary);

      svg {
        fill: currentColor;
      }
    }
  }

  .header__chevron {
    transform: rotate(0deg);
    transition:
      transform 0.2s ease,
      color 0.2s ease,
      fill 0.2s ease;

    &--active {
      transform: rotate(180deg);
    }
  }

  .active-link {
    color: var(--landing-accent-secondary) !important;

    svg {
      fill: currentColor;
    }
  }

  .svg-fill {
    color: var(--landing-text-primary);
    fill: currentColor;
  }

  .is-theme-light {
    color: var(--landing-text-primary) !important;
  }

  .is-theme-default {
    color: var(--landing-text-primary) !important;
  }
</style>
