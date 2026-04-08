<template>
  <div class="menu-category">
    <UiTextH6
      class="menu-category_title"
      :class="{ 'menu-category_title_mobile': props.isMobile }"
      @click="handleLinkClick">
      <NuxtLink :to="props.titles.path">
        {{ props.titles.name }}
      </NuxtLink>
      <div
        class="menu-category_line"
        :class="{ 'menu-category_line_mobile': props.isMobile }"></div>
    </UiTextH6>

    <UiTextH5
      class="menu-category_link"
      :class="{ 'menu-category_link_mobile': props.isMobile }"
      v-for="link in props.items"
      :key="link.name">
      <NuxtLink
        :to="link.path"
        @click="handleLinkClick">
        {{ link.name }}
      </NuxtLink>
    </UiTextH5>
  </div>
</template>

<script setup>
  import { inject } from "vue";
  import UiTextH6 from "~/components/ui/UiTextH6.vue";
  import UiTextH5 from "~/components/ui/UiTextH5.vue";

  const props = defineProps({
    titles: Object,
    items: Array,
    isMobile: {
      type: Boolean,
      default: false,
    },
  });

  const activeLink = inject("stateLink");
  const closeMobileMenu = inject("closeMobileMenu", () => {});

  const handleLinkClick = () => {
    activeLink.value = "";
    if (props.isMobile) {
      closeMobileMenu();
    }
  };
</script>

<style lang="scss" scoped>
  .menu-category {
    &_mobile {
      width: 100%;
    }

    &_title {
      color: var(--landing-text-secondary);

      a {
        color: inherit;
      }

      &_mobile {
        color: var(--landing-accent-secondary);
        width: 100%;
        padding-top: 18px;
        padding-bottom: 12px;
      }
    }

    &_line {
      margin-top: 10px;
      margin-bottom: 14px;
      width: 180px;
      height: 1px;
      background: var(--landing-line);

      &_mobile {
        display: none;
      }
    }

    &_link {
      color: var(--landing-text-primary);
      margin-bottom: 8px;

      a {
        color: inherit;
      }

      &:hover {
        transition: all 0.2s ease;
        color: var(--landing-accent-secondary);
      }

      &_mobile {
        padding-left: 23px;
      }
    }
  }
</style>
