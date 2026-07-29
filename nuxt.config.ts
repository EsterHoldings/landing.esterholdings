// @ts-ignore
import { defineNuxtConfig } from "nuxt/config";
// @ts-ignore
import * as process from "node:process";
import "dotenv/config";

// @ts-ignore
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  // Додаємо явні налаштування дев-сервера
  devServer: {
    host: process.env.NUXT_DEV_HOST || "localhost",
    port: Number(process.env.NUXT_DEV_PORT || process.env.PORT || 3000),
  },

  ssr: true,
  routeRules: {
    "/**": { ssr: true } as any,
  },
  css: ["~/assets/styles/main.scss"],
  modules: ["@pinia/nuxt", "@nuxtjs/i18n", "@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
  plugins: ["~/plugins/eventBus.ts", "~/plugins/client-build-refresh.client.ts"],
  imports: {
    dirs: ["stores"],
  },
  // @ts-ignore
  i18n: {
    lazy: true,
    langDir: "locales",

    strategy: "prefix",
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json",
      },
      {
        code: "ru",
        iso: "ru-RU",
        name: "Russian",
        file: "ru.json",
      },
      {
        code: "de",
        iso: "de-DE",
        name: "Deutsch",
        file: "de.json",
      },
      {
        code: "es",
        iso: "es-ES",
        name: "Español",
        file: "es.json",
      },
      {
        code: "fr",
        iso: "fr-FR",
        name: "Français",
        file: "fr.json",
      },
      {
        code: "it",
        iso: "it-IT",
        name: "Italiano",
        file: "it.json",
      },
      {
        code: "pt",
        iso: "pt-PT",
        name: "Português",
        file: "pt.json",
      },
      {
        code: "tr",
        iso: "tr-TR",
        name: "Türkçe",
        file: "tr.json",
      },
      {
        code: "uk",
        iso: "uk-UA",
        name: "Українська",
        file: "uk.json",
      },
      {
        code: "ua",
        iso: "uk-UA",
        name: "Українська",
        file: "uk.json",
      },
      {
        code: "he",
        iso: "he-IL",
        name: "עברית",
        file: "he.json",
      },
      {
        code: "hi",
        iso: "hi-IN",
        name: "हिन्दी",
        file: "hi.json",
      },
      {
        code: "ja",
        iso: "ja-JP",
        name: "日本語",
        file: "ja.json",
      },
      {
        code: "ko",
        iso: "ko-KR",
        name: "한국어",
        file: "ko.json",
      },
      {
        code: "zh",
        iso: "zh-CN",
        name: "中文",
        file: "zh.json",
      },
    ],
    fallbackLocale: "en",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "no prefix",
      alwaysRedirect: false,
      fallbackLocale: "en",
    },
    experimental: {
      // @ts-ignore
      jsTsFormatResource: false,
    },
    escapeParameterHtml: false,
    runtimeOnly: false,
    compositionOnly: true,
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "My App",
      short_name: "MyApp",
      id: "/",
      start_url: "/",
      scope: "/",
      display: "standalone",
      theme_color: "#0f172a",
      background_color: "#0b1220",
      icons: [
        { src: "/favicon/favicon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/favicon/favicon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/favicon/maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        {
          src: "/favicon/maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      navigateFallback: "/",
    },
    devOptions: { enabled: false },
    // ✳️ Головне: примусово знищує старий SW у деві/локалі, щоб він не ламав HMR
    selfDestroying: true,
  },

  vite: {
    server: {
      proxy: {
        "/api/": {
          target: "http://127.0.0.1:8000/",
          changeOrigin: true,
          secure: false,
        },
      },

      // ✳️ Стабілізація HMR
      hmr: {
        host: process.env.NUXT_DEV_HMR_HOST || process.env.NUXT_DEV_HOST || "localhost",
        // якщо дев по HTTPS (через проксі) — встанови NUXT_DEV_HTTPS=1
        protocol: process.env.NUXT_DEV_HTTPS === "1" || process.env.HTTPS === "1" ? "wss" : "ws",
        // порт WS-сервера (як правило дорівнює devServer.port)
        port: Number(process.env.NUXT_DEV_HMR_PORT || process.env.NUXT_DEV_PORT || process.env.PORT || 3000),
        // порт, який бачить БРАУЗЕР (через проксі/домен)
        clientPort: Number(process.env.NUXT_DEV_CLIENT_PORT || process.env.NUXT_DEV_PORT || process.env.PORT || 3000),
        timeout: 30000,
        overlay: true,
      },

      // ✳️ Вотчер менш нервовий і ігнорує службові папки
      watch: {
        usePolling: true,
        interval: 100,
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 100,
        },
        ignored: [
          "**/.nuxt/**",
          "**/.output/**",
          "**/node_modules/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**/pwa-*",
          "**/public/**/sw.js",
        ],
      },
    },
  },

  runtimeConfig: {
    public: {
      hostBase: process.env.NUXT_PUBLIC_HOST_BASE || "https://server.esterholdings.com",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://server.esterholdings.com/api",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://esterholdings.space",

      reverbKey: process.env.NUXT_PUBLIC_REVERB_KEY || process.env.VITE_REVERB_APP_KEY || "prod-key",
      reverbHost: process.env.NUXT_PUBLIC_REVERB_HOST || process.env.VITE_REVERB_HOST || "server.esterholdings.com",
      reverbPort: process.env.NUXT_PUBLIC_REVERB_PORT || process.env.VITE_REVERB_PORT || "443",
      reverbScheme: process.env.NUXT_PUBLIC_REVERB_SCHEME || process.env.VITE_REVERB_SCHEME || "https",
      reverbCluster: process.env.NUXT_PUBLIC_REVERB_CLUSTER || process.env.VITE_REVERB_APP_CLUSTER || "mt1",

      baseApi: process.env.NUXT_PUBLIC_BASE_API || "https://server.esterholdings.com/api/",
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "https://server.esterholdings.com/",
      cabinetUrl: process.env.NUXT_PUBLIC_CABINET_URL || "https://my.esterholdings.space",
      showLandingNewsTicker:
        process.env.NUXT_PUBLIC_SHOW_LANDING_NEWS_TICKER || (process.env.NODE_ENV === "production" ? "false" : "true"),
      mt4QuotesSymbols:
        process.env.NUXT_PUBLIC_MT4_QUOTES_SYMBOLS ||
        "EURUSD,USDCHF,GBPUSD,USDJPY,USDCAD,AUDUSD,NZDUSD,EURGBP,EURJPY,EURCHF,EURAUD,EURCAD,EURNZD,GBPJPY,GBPCHF,GBPAUD,GBPCAD,GBPNZD,AUDJPY,AUDCHF,AUDCAD,AUDNZD,NZDJPY,NZDCHF,NZDCAD,CADJPY,CADCHF,CHFJPY,XAUUSD,XAGUSD",
      mt4QuotesLatestUrl: process.env.NUXT_PUBLIC_MT4_QUOTES_LATEST_URL || "",
      mt4QuotesFallbackIntervalMs: process.env.NUXT_PUBLIC_MT4_QUOTES_FALLBACK_INTERVAL_MS || "10000",
    },
  },

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon/favicon-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon/favicon-512x512.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" },
      ],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
        },
      ],
    },
  },

  nitro: {
    devProxy: {
      "/api/": {
        target: "http://127.0.0.1:8000/",
        changeOrigin: true,
        prependPath: true,
        secure: false,
      },
    },
  },
});
