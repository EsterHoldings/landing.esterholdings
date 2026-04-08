<template>
  <UiContainer :class="{ 'menu-wrapper-mobile': props.isMobile }">
    <div
      class="menu-wrapper"
      :class="{ 'menu-wrapper-mobile': props.isMobile }">
      <div
        class="menu-grid"
        :class="{ 'menu-mobile': props.isMobile }">
        <HeaderMenuItem
          v-for="(section, index) in headerItems"
          :key="section.section"
          :titles="buildTitle(index)"
          :items="buildItems(section, index)"
          :isMobile="props.isMobile" />
      </div>
    </div>
  </UiContainer>
</template>

<script setup>
  import { useI18n } from "vue-i18n";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import HeaderMenuItem from "~/components/block/LandingHeader/components/HeaderMenuItem.vue";
  import { partnershipMenuRoutes as routes } from "../composables/partnershipMenuRoutes";

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

  function buildTitle(sectionIndex) {
    const title = t(`landing.header.megaMenu.${props.activeLink}[${sectionIndex}].section`);
    return {
      name: title,
      path: menuRoutes[title]?.path ?? "#",
    };
  }

  function buildItems(sections, sectionIndex) {
    const titleList = t(`landing.header.megaMenu.${props.activeLink}[${sectionIndex}].section`);

    return sections.items.map((_, itemIndex) => ({
      name: t(`landing.header.megaMenu.${props.activeLink}[${sectionIndex}].items[${itemIndex}]`),
      path: menuRoutes[titleList]?.list?.[itemIndex] ?? "#",
    }));
  }
</script>

<style lang="scss" scoped>
  .menu-wrapper {
    width: 225px;
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
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: auto;
    gap: 40px 32px;
    position: relative;
    align-items: baseline;
  }

  .menu-mobile {
    display: flex;
    flex-direction: column;
  }
</style>
