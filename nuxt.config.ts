import { defineNuxtConfig } from "nuxt/config";

// @ts-ignore
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
    ],
    fallbackLocale: 'en',
    defaultLocale: "en",
    experimental: {
      jsTsFormatResource: false,
    },
    escapeParameterHtml: false,
    runtimeOnly: false,
    compositionOnly: true,
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  routeRules: {
    "/**": { ssr: false } as any,
    "/": { ssr: true } as any,
  },

  app: {
    head: {
      script: [
        {
          src: "https://accounts.google.com/gsi/client",
          async: true,
          defer: true,
        },
      ],
    },
  },

  nitro: {
    devProxy: {
      // будь-який запит, що починається з /api, піде не прямо в браузер,
      // а до цього проксі, яке відправить його до Laravel
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // якщо ваш бекенд живе не в /api, а десь по іншому URL — скоригуйте 'target'
      }
    }
  },

  runtimeConfig: {
    public: {
      // apiUrl: process.env.NUXT_PUBLIC_API_URL,
      apiUrl: "https://esterholdings.website/api/",
    }
  }
});
