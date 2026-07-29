<template>
  <main class="landing-v2">
    <div ref="welcomeRef">
      <WelcomeSectionV2 />
    </div>
    <TickerSectionV2 />
    <AdvantagesSectionV2 />
    <TradingPlatformSectionV2 />
    <AccountTypesSectionV2 />
    <NewsRowSectionV2 v-if="showNewsRowSection" />
    <FeaturesSectionV2 />
    <WideRangeSectionV2 />
    <FourStepsSectionV2 />
    <BannerSectionV2 />
    <LatestUpdatesSectionV2 />
    <FAQsSectionV2 />
    <CookieModal />
  </main>
</template>

<script lang="ts" setup>
  import { definePageMeta } from "~/.nuxt/imports";
  import { computed, onMounted, onUnmounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useUiStore } from "~/stores/uiStore";
  import WelcomeSectionV2 from "~/pages/landing/sections/WelcomeSectionV2.vue";
  import TickerSectionV2 from "~/pages/landing/sections/TickerSectionV2.vue";
  import AdvantagesSectionV2 from "~/pages/landing/sections/AdvantagesSectionV2.vue";
  import TradingPlatformSectionV2 from "~/pages/landing/sections/TradingPlatformSectionV2.vue";
  import AccountTypesSectionV2 from "~/pages/landing/sections/AccountTypesSectionV2.vue";
  import NewsRowSectionV2 from "~/pages/landing/sections/NewsRowSectionV2.vue";
  import FeaturesSectionV2 from "~/pages/landing/sections/FeaturesSectionV2.vue";
  import WideRangeSectionV2 from "~/pages/landing/sections/WideRangeSectionV2.vue";
  import FourStepsSectionV2 from "~/pages/landing/sections/FourStepsSectionV2.vue";
  import BannerSectionV2 from "~/pages/landing/sections/BannerSectionV2.vue";
  import LatestUpdatesSectionV2 from "~/pages/landing/sections/LatestUpdatesSectionV2.vue";
  import FAQsSectionV2 from "~/pages/landing/sections/FAQsSectionV2.vue";
  import CookieModal from "~/components/block/modals/CookieModal.vue";

  definePageMeta({
    layout: "main-v2",
  });

  const route = useRoute();
  const uiStore = useUiStore();
  const welcomeRef = ref<HTMLElement | null>(null);
  const showNewsRowSection = computed(() => {
    const queryValue = route.query.newstline;

    return Array.isArray(queryValue) ? queryValue.includes("1") : queryValue === "1";
  });

  const clearLegacyScrollLock = () => {
    const elements = [document.documentElement, document.body];
    elements.forEach(element => {
      element.classList.remove("scroll-unlocked", "overflow-hidden", "fixed", "landing-scroll-locked");
      element.style.overflow = "";
      element.style.overflowY = "";
      element.style.position = "";
      element.style.width = "";
      element.style.top = "";
      element.style.left = "";
      element.style.right = "";
    });
  };

  const handleScroll = () => {
    if (!welcomeRef.value) return;

    const rect = welcomeRef.value.getBoundingClientRect();
    uiStore.headerScrolled = rect.bottom <= 210;
  };

  onMounted(() => {
    clearLegacyScrollLock();
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
</script>

<style lang="scss" scoped>
  .landing-v2 {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--landing-bg);
    overflow-x: hidden;
    overflow-y: visible;
  }

  @supports (overflow: clip) {
    .landing-v2 {
      overflow-x: clip;
    }
  }

  @media (max-width: 991px) {
    .landing-v2 {
      overflow: visible;
    }
  }
</style>
