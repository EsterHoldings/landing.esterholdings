import { defineStore } from "pinia";
import { useCookie } from "#app";
import { nextTick, ref } from "vue";
import {
  DEFAULT_THEME,
  resolveThemeName,
  THEME_COOKIE_KEY,
  THEME_COOKIE_OPTIONS,
  THEME_STORAGE_KEY,
  type ThemeName,
} from "~/composables/theme/theme.shared";

type ThemeViewTransition = {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};
type ThemeTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ThemeViewTransition;
};

const THEME_TRANSITION_MS = 200;

export const useThemeStore = defineStore("theme", () => {
  const themeCookie = useCookie<ThemeName | null>(THEME_COOKIE_KEY, THEME_COOKIE_OPTIONS);
  const currentTheme = ref<ThemeName>(resolveThemeName(themeCookie.value));
  const lightTheme = {
    "--ui-background": "#ffffff",
    "--ui-background-secondary": "#2a5bbd",
    "--ui-background-admin": "rgba(255, 255, 255, 0.95)",
    "--ui-background-card": "#f2f2f2",
    "--ui-background-panel": "#f1f1f17a",
    "--ui-background-sidebar": "#f9f9f9",
    "--ui-background-sidebar-link": "#9CA9B3",

    "--ui-primary-main": "#0391ff",
    "--ui-primary-accent": "#f75709",

    "--ui-text-invert": "#faf9f9",
    "--ui-text-main": "#151515",
    "--ui-text-secondary": "#3C3C3C",
    "--ui-control-bg": "rgba(228, 228, 231, 0.6)",
    "--ui-control-bg-disabled": "#e4e4e7",
    "--ui-date-input-icon-filter": "brightness(0) saturate(100%) invert(0%)",
    "--ui-date-input-color-scheme": "light",

    "--ui-sticker-success": "#03c11f",
    "--ui-sticker-danger": "#d93025",

    "--color-stroke-ui-dark": "#e4e4e7",
    "--color-stroke-ui-light": "#dcdce1",
    "--color-stroke-ui": "#b8b8c3",
  };

  const darkTheme = {
    "--ui-background": "#000028",
    "--ui-background-admin": "rgba(0, 0, 40, 0.95)",
    "--ui-background-card": "#021238",
    "--ui-background-panel": "rgba(1, 22, 68, 0.6)",
    "--ui-background-secondary": "#031743",
    "--ui-background-sidebar": "rgba(0, 0, 40, 0.95)",
    "--ui-background-sidebar-link": "#011644",

    "--ui-primary-main": "#0051ff",
    "--ui-primary-accent": "#f75709",

    "--ui-text-invert": "#eeeeef",
    "--ui-text-main": "#ffffff",
    "--ui-text-secondary": "#b8b8c3",
    "--ui-control-bg": "#011644",
    "--ui-control-bg-disabled": "rgba(1, 22, 68, 0.6)",
    "--ui-date-input-icon-filter": "brightness(0) saturate(100%) invert(100%)",
    "--ui-date-input-color-scheme": "dark",

    "--ui-sticker-success": "#03c11f",
    "--ui-sticker-danger": "#d93025",

    "--color-stroke-ui-dark": "#011644",
    "--color-stroke-ui-light": "#002880",
    "--color-stroke-ui": "linear-gradient(137.67deg, #1b63ff 2.397%, #011644 99.041%)",
    "--color-ui-grey": "#b8b8c3",
  };

  let transitionTimer: ReturnType<typeof setTimeout> | null = null;

  const clearTransitionTimer = () => {
    if (!transitionTimer) return;

    clearTimeout(transitionTimer);
    transitionTimer = null;
  };

  const clearThemeTransition = (root: HTMLElement) => {
    clearTransitionTimer();
    transitionTimer = setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionTimer = null;
    }, THEME_TRANSITION_MS);
  };

  const shouldReduceMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const persistTheme = (themeName: ThemeName) => {
    themeCookie.value = themeName;

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    }
  };

  function commitTheme(themeName: ThemeName) {
    const theme = themeName === "light" ? lightTheme : darkTheme;
    const root = document.documentElement;

    root.dataset.theme = themeName;
    root.style.colorScheme = themeName;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    currentTheme.value = themeName;
  }

  function applyTheme(themeName: ThemeName, withTransition = true) {
    const root = document.documentElement;

    clearTransitionTimer();
    root.classList.remove("theme-transition", "theme-view-transition");

    if (!withTransition || shouldReduceMotion()) {
      commitTheme(themeName);
      return;
    }

    const themeDocument = document as ThemeTransitionDocument;

    if (typeof themeDocument.startViewTransition === "function") {
      root.classList.add("theme-view-transition");

      try {
        const transition = themeDocument.startViewTransition(async () => {
          commitTheme(themeName);
          await nextTick();
        });

        transition.finished
          .catch(() => undefined)
          .finally(() => {
            root.classList.remove("theme-view-transition");
          });
        return;
      } catch {
        root.classList.remove("theme-view-transition");
      }
    }

    // Force the transition class to apply before CSS variables change.
    root.classList.add("theme-transition");
    void root.offsetWidth;
    commitTheme(themeName);
    clearThemeTransition(root);
  }

  function setTheme(themeName: ThemeName) {
    applyTheme(themeName, true);
    persistTheme(themeName);
  }

  function toggleTheme() {
    setTheme(currentTheme.value === "light" ? "dark" : "light");
  }

  function initTheme() {
    const savedTheme = typeof localStorage !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null;
    const themeName = resolveThemeName(savedTheme, themeCookie.value);

    applyTheme(themeName, false);
    persistTheme(themeName);
  }

  if (process.client) {
    initTheme();
  }

  return {
    currentTheme,
    toggleTheme,
    initTheme,
    setTheme,
  };
});
