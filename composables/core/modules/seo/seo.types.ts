export type LandingSeoSchema = Record<string, unknown> | unknown[] | null;

export interface LandingSeoEntry {
  locale: string;
  path: string;
  is_active: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  canonical_url?: string | null;
  robots?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image_url?: string | null;
  schema_json?: LandingSeoSchema;
  updated_at?: string | null;
}

export interface LandingSeoPayload {
  site: {
    name: string;
    url: string;
    default_image_url?: string | null;
  };
  locales: string[];
  defaults: LandingSeoEntry[];
  pages: LandingSeoEntry[];
  generated_at?: string | null;
}
