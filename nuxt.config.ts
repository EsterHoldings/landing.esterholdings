// @ts-ignore
import { resolve } from "path";

export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: true,
  css: ["~/assets/styles/main.scss"],
  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],
  plugins: ["~/plugins/eventBus.ts"],
  imports: {
    dirs: ["stores"],
  },

  i18n: {
    lazy: true,
    langDir: resolve("./locales"),

    strategy: "prefix",
    locales: [
      {
        code: "en-US",
        iso: "en-US",
        name: "English",
        file: "en-US.json",
      },

      {
        code: "ru-RU",
        iso: "ru-RU",
        name: "Russian",
        file: "ru-RU.json",
      },
    ],

    defaultLocale: "en-US",
    experimental: {
      jsTsFormatResource: true,
    },
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
