import type { PublicRuntimeConfig as NuxtPublicRuntimeConfig } from "nuxt/schema";

declare module "nuxt/schema" {
  interface PublicRuntimeConfig extends NuxtPublicRuntimeConfig {
    apiBase: string;
    baseApi: string;
    baseUrl: string;
    cabinetUrl: string;
    hostBase: string;
    mt4QuotesFallbackIntervalMs: string;
    mt4QuotesLatestUrl: string;
    mt4QuotesSymbols: string;
    reverbCluster: string;
    reverbHost: string;
    reverbKey: string;
    reverbPort: string;
    reverbScheme: string;
  }
}

export {};
