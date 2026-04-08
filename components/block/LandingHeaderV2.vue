<template>
  <div class="header-v2">
    <div
      v-if="isMobileMenuOpen"
      class="overlay"
      @click="closeMobileMenu"></div>
    <div class="header-v2__fixed">
      <UiContainer class="!p-0">
        <header
          class="header-v2__bar"
          :class="{ 'header-v2__bar--menu-open': isMobileMenuOpen }">
          <NuxtLink
            to="/"
            class="logo">
            <UiIconLogoLight v-if="themeStore.currentTheme === 'light'" />
            <UiIconLogo v-else />
          </NuxtLink>

          <nav class="desktop-nav">
            <HeaderLink
              v-for="link in linksList"
              :key="link.key"
              :name="link.name"
              :activeLink="activeLink"
              :isInvertColor="useDarkHeaderIcons"
              @click.stop="handleClick(link.key, $event)" />
          </nav>

          <div class="actions">
            <LanguageSwitcher />
            <button
              class="theme-btn"
              type="button"
              @click="themeStore.toggleTheme()">
              <UiIconMoon
                v-if="themeStore.currentTheme === 'light'"
                :class="{ 'svg-invert': useDarkHeaderIcons }" />
              <UiIconSun
                v-else
                :class="{ 'svg-invert': useDarkHeaderIcons }" />
            </button>
            <a
              href="https://my.esterholdings.website"
              class="auth-link auth-link--login">
              {{ t("landing.header.auth.login") }}
            </a>
            <NuxtLink to="/auth/registration">
              <UiButtonDefault
                state="primary"
                class="auth-register">
                {{ t("landing.header.auth.register") }}
              </UiButtonDefault>
            </NuxtLink>
          </div>

          <button
            class="burger"
            :class="{ 'burger--open': isMobileMenuOpen }"
            type="button"
            @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </header>
      </UiContainer>
    </div>

    <div
      v-if="!isMobileMenuOpen && activeLink"
      class="desktop-menu">
      <div
        ref="menuRef"
        class="desktop-menu__content"
        :style="menuContentStyle">
        <TradingMenu
          v-if="activeLink === 'Trading'"
          :activeLink="activeLink" />
        <PartnershipMenu
          v-else-if="activeLink === 'Partnership'"
          :activeLink="activeLink" />
        <CompanyMenu
          v-else-if="activeLink === 'Company'"
          :activeLink="activeLink" />
      </div>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="mobile-menu">
      <div class="mobile-menu__panel">
        <div class="mobile-menu__items">
          <HeaderMobileLink
            v-for="link in linksList"
            :key="`${link.key}-${activeLink}`"
            :name="link.name"
            :linkKey="link.key"
            :headerItems="headerItems"
            :activeLink="activeLink"
            @click="handleClick(link.key)" />
        </div>
        <div class="mobile-menu__footer">
          <div class="mobile-menu__line mobile-menu__line--lang">
            <LanguageSwitcher />
            <span>{{ currentLocaleLabel }}</span>
          </div>
          <button
            class="theme-inline mobile-menu__line"
            type="button"
            @click="themeStore.toggleTheme()">
            <UiIconMoon v-if="themeStore.currentTheme === 'light'" />
            <UiIconSun v-else />
            <span>{{ themeStore.currentTheme === "light" ? "Night Mode" : "Day Mode" }}</span>
          </button>
          <NuxtLink
            to="/auth/login"
            class="auth-link auth-link--mobile mobile-menu__line">
            <UiIconLogout class="login-icon" />
            {{ t("landing.header.auth.login") }}
          </NuxtLink>
          <NuxtLink
            to="/auth/registration"
            class="mobile-register">
            <UiButtonDefault
              state="primary"
              class="auth-register auth-register--mobile">
              {{ t("landing.header.auth.register") }}
            </UiButtonDefault>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useI18n } from "vue-i18n";
  import { ref, computed, onMounted, onBeforeUnmount, watch, provide } from "vue";
  import { useRoute, onBeforeRouteLeave } from "vue-router";
  import { useUiStore } from "~/stores/uiStore";
  import { useThemeStore } from "~/stores/themeStore.js";
  import useTrackScroll, { isSlideWithoutPicture } from "./LandingHeader/composables/trackScroll";
  import UiIconLogo from "~/components/ui/UiIconLogo.vue";
  import UiIconLogoLight from "~/components/ui/UiIconLogoLight.vue";
  import UiIconMoon from "~/components/ui/UiIconMoon.vue";
  import UiIconSun from "~/components/ui/UiIconSun.vue";
  import UiIconLogout from "~/components/ui/UiIconLogout.vue";
  import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
  import HeaderLink from "./LandingHeader/components/HeaderLink.vue";
  import HeaderMobileLink from "./LandingHeader/components/HeaderMobileLink.vue";
  import UiContainer from "~/components/ui/UiContainer.vue";
  import TradingMenu from "./LandingHeader/components/TradingMenu.vue";
  import PartnershipMenu from "./LandingHeader/components/PartnershipMenu.vue";
  import CompanyMenu from "./LandingHeader/components/CompanyMenu.vue";
  import LanguageSwitcher from "./LandingHeader/components/LanguageSwitcher.vue";

  const themeStore = useThemeStore();
  const uiStore = useUiStore();
  const route = useRoute();
  const { isBlurred } = useTrackScroll();
  const { t, locale } = useI18n();

  const activeLink = ref("");
  const headerItems = ref();
  const isMobileMenuOpen = ref(false);
  const menuRef = ref(null);
  const windowWidth = ref(0);
  const menuOffsetLeft = ref(0);

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  };

  provide("stateLink", activeLink);
  provide("closeMobileMenu", closeMobileMenu);

  const linksList = computed(() => [
    { key: "Trading", name: t("landing.header.nav.trading") },
    { key: "Partnership", name: t("landing.header.nav.partnership") },
    { key: "Company", name: t("landing.header.nav.company") },
  ]);

  const currentLocaleLabel = computed(() => {
    const labels = {
      en: "English",
      uk: "Українська",
      de: "Deutsch",
      es: "Español",
      fr: "Français",
      it: "Italiano",
      pt: "Português",
      ru: "Русский",
      tr: "Türkçe",
      he: "עברית",
      hi: "हिन्दी",
      ja: "日本語",
      ko: "한국어",
      zh: "中文",
    };
    return labels[locale.value] || "English";
  });

  const isThemeLight = computed(() => {
    return (
      (uiStore.headerScrolled && themeStore.currentTheme !== "dark") ||
      (themeStore.currentTheme !== "dark" && isMobileMenuOpen.value) ||
      isBlurred.value
    );
  });

  const isWithPicture = computed(() => {
    if (themeStore.currentTheme === "dark") return false;
    return isSlideWithoutPicture.value;
  });

  const forceSvgInvert = computed(() => {
    const baseRouteName = route.name?.toString().split("___")[0];
    return themeStore.currentTheme === "light" && baseRouteName !== "index-v2";
  });

  const useDarkHeaderIcons = computed(() => isThemeLight.value || isWithPicture.value || forceSvgInvert.value);

  const updateWindowWidth = () => {
    if (process.client) windowWidth.value = window.innerWidth;
  };

  const menuContentStyle = computed(() => {
    if (activeLink.value === "Trading") return { left: "50%", transform: "translateX(-50%)" };
    return { left: `${menuOffsetLeft.value}px` };
  });

  const handleClick = (name, event) => {
    if (activeLink.value !== name) {
      activeLink.value = name;
      uiStore.showMenu = true;
      if (event?.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        menuOffsetLeft.value = rect.left;
      }
    } else {
      activeLink.value = "";
      uiStore.showMenu = false;
    }
  };

  const handleClickOutside = event => {
    const menuEl = menuRef.value;
    if (!menuEl || !activeLink.value) return;
    if (!menuEl.contains(event.target)) {
      activeLink.value = "";
      uiStore.showMenu = false;
    }
  };

  const toggleMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    uiStore.showMenu = false;
    activeLink.value = "";

    if (isMobileMenuOpen.value) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      closeMobileMenu();
    }
  };

  onMounted(() => {
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    document.addEventListener("click", handleClickOutside);
    closeMobileMenu();
    activeLink.value = "";
    uiStore.showMenu = false;
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateWindowWidth);
    document.removeEventListener("click", handleClickOutside);
    closeMobileMenu();
  });

  onBeforeRouteLeave(() => {
    activeLink.value = "";
    uiStore.showMenu = false;
    closeMobileMenu();
  });

  watch(windowWidth, width => {
    if (width > 991 && isMobileMenuOpen.value) closeMobileMenu();
    if (width <= 991 && activeLink.value) {
      activeLink.value = "";
      uiStore.showMenu = false;
    }
  });
</script>

<style lang="scss" scoped>
  .header-v2 {
    &__fixed {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 10000;
      padding: 20px;
    }

    &__bar {
      box-shadow: var(--landing-shadow-glass);
      min-height: 79px;
      border-radius: 20px;
      background: var(--landing-surface-glass);
      border: 1px solid var(--landing-border-strong);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 20px;

      &--menu-open {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  .logo {
    display: inline-flex;
    align-items: center;

    :deep(svg) {
      width: 88px;
      height: 39px;
    }
  }

  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 60px;
    flex: 1;
    justify-content: center;

    :deep(.header__link) {
      gap: 4px;
      color: var(--landing-text-secondary);
    }

    :deep(.h5) {
      font-size: 16px;
      line-height: normal;
      font-weight: 700;
      color: var(--landing-text-secondary) !important;
    }

    :deep(svg) {
      width: 20px;
      height: 20px;
      color: var(--landing-text-secondary);
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 30px;

    :deep(.language-wrapper .icon) {
      display: inline-flex;
      width: 16px;
      height: 16px;
      color: var(--landing-text-secondary);
      transition: color 0.2s ease;
    }

    :deep(.language-wrapper .icon svg) {
      width: 16px;
      height: 16px;
    }

    :deep(.language-wrapper .dropdown) {
      right: -8px;
      top: 32px;
    }
  }

  .theme-btn,
  .theme-inline {
    border: 0;
    background: transparent;
    color: var(--landing-text-primary);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 0;

    :deep(svg) {
      width: 16px;
      height: 16px;
      color: var(--landing-text-secondary);
    }
  }

  .auth-link {
    color: var(--landing-text-secondary);
    text-decoration: none;
    font-size: 16px;
    line-height: normal;
    font-weight: 700;
  }

  :deep(.auth-register.btn) {
    height: auto;
    min-width: unset;
    border-radius: 12px;
    padding: 10px 16px;
    font-size: 16px;
    font-weight: 700;
    line-height: normal;
    background: var(--landing-accent) !important;
    color: var(--landing-on-accent) !important;
  }

  :deep(.auth-register.btn:hover) {
    background: var(--landing-accent-hover) !important;
  }

  .burger {
    display: none;
    width: 20px;
    height: 20px;
    border: 0;
    background: transparent;
    flex-direction: column;
    justify-content: space-between;
    padding: 2px 0;
    cursor: pointer;

    span {
      display: block;
      width: 100%;
      height: 2px;
      background: var(--landing-text-primary);
      transition: transform 0.2s ease;
    }

    &--open {
      span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
    }
  }

  .desktop-menu {
    position: fixed;
    top: 96px;
    left: 0;
    right: 0;
    z-index: 9998;
    pointer-events: none;

    &__content {
      position: absolute;
      pointer-events: auto;
      margin-top: 20px;
    }
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 9997;
    background: var(--landing-overlay);
    backdrop-filter: blur(12px);
  }

  .mobile-menu {
    position: fixed;
    inset: 96px 20px 20px 20px;
    z-index: 9999;

    &__panel {
      height: 100%;
      border-radius: 0 0 20px 20px;
      background: var(--landing-surface-glass-strong);
      backdrop-filter: blur(14px);
      border: 1px solid var(--landing-border-strong);
      box-shadow: var(--landing-shadow-glass-raised);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    &__items {
      padding: 20px 20px 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    &__footer {
      padding: 16px 22px 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 30px;
    }

    &__line {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--landing-text-tertiary);
      text-decoration: none;
      font-size: 16px;
      line-height: normal;
      font-weight: 600;

      :deep(svg) {
        width: 16px;
        height: 16px;
      }
    }

    &__line--lang {
      :deep(.language-wrapper .dropdown) {
        right: 0;
        top: -180px;
      }
    }
  }

  .auth-link--mobile {
    color: var(--landing-text-tertiary);

    .login-icon {
      transform: rotate(180deg);
      flex-shrink: 0;
    }
  }

  .mobile-register :deep(button) {
    min-width: 160px;
    height: 56px;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
    padding: 0 26px;
  }

  .mobile-register {
    align-self: flex-end;
  }

  .mobile-menu .theme-inline {
    color: var(--landing-text-tertiary);
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .svg-invert {
    filter: invert(1);
  }

  .dropdown-enter-active,
  .dropdown-leave-active {
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  @media (max-width: 991px) {
    .header-v2 {
      &__fixed {
        padding: 20px 20px 0;
      }
    }

    .desktop-nav,
    .desktop-menu,
    .actions {
      display: none;
    }

    .burger {
      display: inline-flex;
    }
  }
</style>
