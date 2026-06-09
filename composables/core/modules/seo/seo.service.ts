import { useNuxtApp } from "#app";
import type { LandingSeoPayload } from "./seo.types";

interface ApiEnvelope<T> {
  data?: T;
}

export class SeoService {
  async getLandingSeo(): Promise<{ data: LandingSeoPayload }> {
    const response = await this.api<ApiEnvelope<LandingSeoPayload>>("/landing/seo");

    return {
      data: response.data || this.fallbackPayload(),
    };
  }

  private api<T>(url: string, options: Record<string, any> = {}): Promise<T> {
    const nuxtApp = useNuxtApp() as unknown as {
      $api: (request: string, opts?: Record<string, any>) => Promise<T>;
    };

    return (nuxtApp.$api as (request: string, opts?: Record<string, any>) => Promise<T>)(url, options);
  }

  private fallbackPayload(): LandingSeoPayload {
    return {
      site: {
        name: "Ester Holdings",
        url: "https://esterholdings.space",
        default_image_url: "/favicon/favicon-512x512.png",
      },
      locales: ["en", "ru", "uk"],
      defaults: [
        {
          locale: "en",
          path: "*",
          is_active: true,
          meta_title: "Ester Holdings | Multi-asset trading platform",
          meta_description:
            "Trade FX, crypto, metals, commodities, indices and stocks from one account with Ester Holdings.",
          robots: "index,follow",
        },
      ],
      pages: [],
      generated_at: null,
    };
  }
}

export default SeoService;
