export type ThemeName = "light" | "dark";

export const DEFAULT_THEME: ThemeName = "light";
export const THEME_STORAGE_KEY = "theme";
export const THEME_COOKIE_KEY = "theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LIGHT_BROWSER_THEME_COLOR = "#f6f6f6";
export const DARK_BROWSER_THEME_COLOR = "#07111d";

export const THEME_COOKIE_OPTIONS = {
  sameSite: "lax" as const,
  path: "/",
  maxAge: THEME_COOKIE_MAX_AGE,
};

export const isThemeName = (value: string | null | undefined): value is ThemeName => value === "light" || value === "dark";

export const resolveThemeName = (...values: Array<string | null | undefined>): ThemeName => {
  for (const value of values) {
    if (isThemeName(value)) return value;
  }

  return DEFAULT_THEME;
};

export const buildThemeInitScript = () => `
(() => {
  try {
    const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
    const cookieKey = ${JSON.stringify(THEME_COOKIE_KEY)};
    const getCookie = key => {
      const match = document.cookie.match(new RegExp("(?:^|; )" + key + "=([^;]*)"));
      return match ? decodeURIComponent(match[1]) : null;
    };

    const savedTheme = localStorage.getItem(storageKey);
    const cookieTheme = getCookie(cookieKey);
    const theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : cookieTheme === "light" || cookieTheme === "dark"
          ? cookieTheme
          : ${JSON.stringify(DEFAULT_THEME)};

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {}
})();
`.trim();
