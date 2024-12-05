// @ts-ignore
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: true,
  css: [
    "~/assets/styles/main.scss",
  ],
  modules: [
    "@pinia/nuxt",
  ],
  imports: {
    dirs: ["stores"],
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});