import { defineNuxtPlugin, useCookie } from "nuxt/app";
import {
  resolveThemeName,
  THEME_COOKIE_KEY,
  THEME_COOKIE_OPTIONS,
  THEME_STORAGE_KEY,
} from "~/composables/theme/theme.shared";

export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<string | null>(THEME_COOKIE_KEY, THEME_COOKIE_OPTIONS);
  const theme = resolveThemeName(localStorage.getItem(THEME_STORAGE_KEY), document.documentElement.dataset.theme, themeCookie.value);

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  themeCookie.value = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
});
