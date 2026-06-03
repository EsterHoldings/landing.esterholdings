import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";

const CHECK_INTERVAL_MS = 10_000;
const LAST_BUILD_KEY = "ester:last-build-id";
const RELOADED_BUILD_KEY = "ester:reloaded-build-id";

const toText = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  return String(value).trim();
};

const extractBuildId = (html: string): string => {
  const match = html.match(/buildId\s*[:=]\s*["']([^"']+)["']/);

  return match?.[1] || "";
};

const clearClientCaches = async () => {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));
  }

  if ("caches" in window) {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map(cacheName => window.caches.delete(cacheName)));
  }
};

const fetchLatestBuildId = async (): Promise<string> => {
  const response = await fetch(window.location.href, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-store",
    },
  });

  if (!response.ok) return "";

  return extractBuildId(await response.text());
};

export default defineNuxtPlugin(() => {
  if (typeof window === "undefined") return;

  const runtimeConfig = useRuntimeConfig();
  const currentBuildId = toText(runtimeConfig.app?.buildId) || toText((window as any).__NUXT__?.config?.app?.buildId);

  if (!currentBuildId) return;

  const previousBuildId = localStorage.getItem(LAST_BUILD_KEY);
  localStorage.setItem(LAST_BUILD_KEY, currentBuildId);

  if (previousBuildId && previousBuildId !== currentBuildId) {
    void clearClientCaches();
  }

  const checkForBuildUpdate = async () => {
    try {
      const latestBuildId = await fetchLatestBuildId();
      if (!latestBuildId || latestBuildId === currentBuildId) return;
      if (sessionStorage.getItem(RELOADED_BUILD_KEY) === latestBuildId) return;

      sessionStorage.setItem(RELOADED_BUILD_KEY, latestBuildId);
      await clearClientCaches();
      window.location.reload();
    } catch {
      // Ignore transient network errors. The next interval will retry.
    }
  };

  window.setInterval(() => {
    void checkForBuildUpdate();
  }, CHECK_INTERVAL_MS);
});
