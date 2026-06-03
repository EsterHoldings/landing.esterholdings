import { defineNuxtPlugin, useCookie, useNuxtApp, useRuntimeConfig } from "nuxt/app";
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const resolveLocale = () => {
    const localeCookie = useCookie<string>("locale");
    const i18nRedirected = useCookie<string>("i18n_redirected");
    const nuxtApp = useNuxtApp();
    const i18n = (nuxtApp?.$i18n ?? null) as { locale?: string | { value: string } } | null;
    const i18nLocale = typeof i18n?.locale === "string" ? i18n.locale : i18n?.locale?.value;
    const resolved = i18nLocale || localeCookie.value || i18nRedirected.value;

    if (resolved && localeCookie.value !== resolved) {
      localeCookie.value = resolved;
    }

    return resolved;
  };

  const api = $fetch.create({
    // @ts-ignore
    baseURL: config.public.apiBase,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    onRequest({ options }) {
      const locale = resolveLocale();
      const headers = new Headers(options.headers as HeadersInit);

      headers.set("Accept", "application/json");
      headers.set("X-Requested-With", "XMLHttpRequest");

      if (locale) {
        headers.set("X-Locale", locale);
        headers.set("Accept-Language", locale);
      }

      options.headers = headers;
    },
  });
  return { provide: { api } };
});
