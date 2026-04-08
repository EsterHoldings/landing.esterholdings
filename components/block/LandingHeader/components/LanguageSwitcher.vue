<template>
  <div
    class="language-wrapper"
    ref="wrapperRef">
    <UiIconGlobe
      class="icon"
      @click="toggleDropdown" />

    <transition name="fade">
      <ul
        v-if="isOpen"
        class="dropdown"
        :class="{ top: props.isSidebar }">
        <li
          v-for="(label, code) in languages"
          :key="code"
          @click="switchLanguage(code)"
          :class="{ active: locale === code }">
          <span
            class="flag"
            :class="{ 'flag--monochrome': code === 'ru' }"
            >{{ getFlag(code) }}</span
          >
          <span class="label">{{ label.toUpperCase() }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useI18n } from "vue-i18n";
  import UiIconGlobe from "~/components/ui/UiIconGlobe.vue";

  const props = defineProps({
    isInvert: Boolean,
    isSidebar: Boolean,
  });

  const { locale, setLocale } = useI18n();

  const isOpen = ref(false);
  const wrapperRef = ref(null);

  const languages = {
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

  const getFlag = code => {
    switch (code) {
      case "en":
        return "🇬🇧";
      case "ru":
        return "🇷🇺";
      case "de":
        return "🇩🇪";
      case "es":
        return "🇪🇸";
      case "fr":
        return "🇫🇷";
      case "it":
        return "🇮🇹";
      case "pt":
        return "🇵🇹";
      case "tr":
        return "🇹🇷";
      case "uk":
        return "🇺🇦";
      case "he":
        return "🇮🇱";
      case "hi":
        return "🇮🇳";
      case "ja":
        return "🇯🇵";
      case "ko":
        return "🇰🇷";
      case "zh":
        return "🇨🇳";
      default:
        return "🌐";
    }
  };

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const switchLanguage = async code => {
    await setLocale(code);
    isOpen.value = false;
  };

  const handleClickOutside = event => {
    if (!wrapperRef.value?.contains(event.target)) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>

<style scoped lang="scss">
  .language-wrapper {
    position: relative;
    color: inherit;

    .icon {
      cursor: pointer;
      font-size: 20px;
      color: inherit;
      display: inline-flex;
      transition: color 0.2s ease;
    }

    .dropdown {
      scrollbar-width: none;
      position: absolute;
      top: 40px;
      right: 0;
      width: fit-content;
      background-color: var(--landing-surface-elevated);
      border-radius: 8px;
      box-shadow: var(--landing-shadow-soft);
      padding: 10px;
      z-index: 11;
      max-height: 400px;
      overflow-y: scroll;

      &.top {
        height: max-content;
        top: 30px;
        bottom: 0;
        right: 0;
      }

      .flag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        font-size: 16px;
        padding: 0 10px 0 0;
        color: var(--landing-text-primary);
      }

      .flag--monochrome {
        filter: grayscale(1) saturate(0) brightness(1.05);
      }

      .label {
        font-weight: 500;
        color: var(--landing-text-primary);
        padding: 0 10px;
      }

      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        font-size: 13px;
        cursor: pointer;
        background-color: var(--landing-surface-muted);
        margin-bottom: 5px;
        border-radius: 8px;
        padding: 10px 20px;

        &:hover {
          background-color: var(--landing-surface-muted);
          color: var(--landing-accent-secondary);
          opacity: 0.7;
        }

        &.active {
          background-color: var(--landing-surface-glass-strong);
          font-weight: 700;

          .label {
            color: var(--landing-accent-secondary) !important;
          }

          &:hover {
            opacity: 0.7;
            color: var(--landing-accent-secondary);
          }
        }
      }
    }
  }
</style>
