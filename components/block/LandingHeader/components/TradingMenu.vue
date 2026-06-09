<template>
  <UiContainer :class="{ 'menu-wrapper-mobile': props.isMobile }">
    <div
      class="menu-wrapper"
      :class="{ 'menu-wrapper-mobile': props.isMobile }">
      <div
        class="menu-grid"
        :class="{ 'menu-mobile': props.isMobile }">
        <HeaderMenuItem
          v-for="section in visibleHeaderItems"
          :key="section.section"
          :titles="buildTitle(section.index)"
          :items="buildItems(section, section.index)"
          :isMobile="props.isMobile" />
      </div>
    </div>
  </UiContainer>
</template>

<script setup>
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import HeaderMenuItem from "~/components/block/LandingHeader/components/HeaderMenuItem.vue";
  import { tradingMenuRoutes as routes } from "../composables/tradingMenuRoutes";

  const props = defineProps({
    isMobile: {
      type: Boolean,
      default: false,
    },

    activeLink: {
      type: String,
    },
  });

  const { t, tm } = useI18n();

  const headerItems = tm(`landing.header.megaMenu.${props.activeLink}`);
  const menuRoutes = routes(props.activeLink, t);
  const hiddenSectionIndexes = new Set([1, 5]);
  const visibleHeaderItems = headerItems
    .map((section, index) => ({ ...section, index }))
    .filter(section => !hiddenSectionIndexes.has(section.index));

  function buildTitle(sectionIndex) {
    const title = t(`landing.header.megaMenu.${props.activeLink}[${sectionIndex}].section`);
    return {
      name: title,
      path: menuRoutes[title]?.path ?? "#",
    };
  }

  function buildItems(sections, sectionIndex) {
    const titleList = t(`landing.header.megaMenu.${props.activeLink}[${sectionIndex}].section`);

    if (sectionIndex === 0) {
      return [0, 1].map((accountIndex, itemIndex) => ({
        name: t(`landing.sections.accounts__options[${accountIndex}].title`),
        path: menuRoutes[titleList]?.list?.[itemIndex] ?? "#",
      }));
    }

    return sections.items.map((_, itemIndex) => ({
      name: t(`landing.header.megaMenu.${props.activeLink}[${sectionIndex}].items[${itemIndex}]`),
      path: menuRoutes[titleList]?.list?.[itemIndex] ?? "#",
    }));
  }
</script>

<style lang="scss" scoped>
  .menu-wrapper {
    padding: 30px;
    background: var(--landing-surface-glass);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--landing-border-strong);
    border-radius: 16px;
    box-shadow: var(--landing-shadow-glass-raised);

    &-mobile {
      padding: 0;
      background: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      border: none;
      box-shadow: none;
    }
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    grid-auto-rows: auto;
    gap: 40px 42px;
    position: relative;
    align-items: baseline;
  }

  .menu-mobile {
    display: flex;
    flex-direction: column;
  }
</style>
