import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "nuxt/app";

const DEFAULT_CABINET_URL = "https://my.esterholdings.space";
const LOCALE_RE = /^[a-z]{2}$/i;
const CABINET_SEGMENTS = new Set([
  "auth",
  "dashboard",
  "accounts",
  "payments",
  "profile",
  "support",
  "referrals",
  "settings",
  "ui",
]);

const normalizeBaseUrl = (value: unknown): string => {
  const candidate = String(value || "").trim();
  return (candidate || DEFAULT_CABINET_URL).replace(/\/+$/, "");
};

const splitPath = (path: string): { locale: string; rest: string[] } => {
  const segments = String(path || "/")
    .split("/")
    .filter(Boolean);
  const first = segments[0] || "";

  if (LOCALE_RE.test(first)) {
    return {
      locale: first.toLowerCase(),
      rest: segments.slice(1),
    };
  }

  return {
    locale: "",
    rest: segments,
  };
};

const normalizeCabinetPath = (segments: string[]): string => {
  if (segments.length === 0 || segments[0] === "dashboard") {
    return "/";
  }

  return `/${segments.join("/")}`;
};

export default defineNuxtRouteMiddleware((to) => {
  const { locale, rest } = splitPath(to.path);
  const firstSegment = rest[0] || "";

  if (!CABINET_SEGMENTS.has(firstSegment)) {
    return;
  }

  const config = useRuntimeConfig();
  const baseUrl = normalizeBaseUrl(config.public?.cabinetUrl);
  const localePrefix = locale ? `/${locale}` : "";
  const targetPath = normalizeCabinetPath(rest);
  const target = `${baseUrl}${localePrefix}${targetPath === "/" ? "" : targetPath}${to.fullPath.includes("?") ? `?${to.fullPath.split("?")[1]}` : ""}`;

  return navigateTo(target, {
    external: true,
    redirectCode: 302,
  });
});
